// src/core/MongoRAG.js

import { MongoClient } from 'mongodb';
import debug from 'debug';
import IndexManager from './IndexManager.js';

const log = debug('mongodb-rag:core');

/**
 * MongoRAG - A Retrieval-Augmented Generation (RAG) library
 * for performing semantic search and vector-based retrieval using MongoDB.
 */
class MongoRAG {
    /**
     * Constructs a new MongoRAG instance.
     * @param {Object} config - Configuration options.
     * @param {string} config.mongoUrl - MongoDB connection URI.
     * @param {string} config.database - Default MongoDB database name.
     * @param {string} config.collection - Default MongoDB collection name.
     * @param {Object} config.embedding - Embedding configuration.
     * @param {string} config.embedding.apiKey - API key for the embedding provider.
     * @param {string} [config.embedding.provider='openai'] - Embedding provider name.
     * @param {string} [config.embedding.model='text-embedding-3-small'] - Embedding model name.
     * @param {number} [config.embedding.batchSize=100] - Batch size for embedding requests.
     * @param {number} [config.embedding.dimensions=1536] - Number of dimensions in the embedding space.
     * @param {Object} [config.search] - Search configuration.
     * @param {string} [config.search.similarityMetric='cosine'] - Similarity metric for vector search.
     * @param {number} [config.search.minScore=0.7] - Minimum score threshold for search results.
     * @param {number} [config.search.maxResults=5] - Maximum number of results returned.
     */
    constructor(config) {
        if (!config.embedding?.apiKey) {
            throw new Error('Embedding API key is required in config.embedding.apiKey');
        }

        this.config = {
            mongoUrl: config.mongoUrl,
            defaultDatabase: config.database,
            defaultCollection: config.collection,
            indexName: config.indexName || "vector_index",  // <-- Ensure we allow index configuration
            embeddingFieldPath: config.embeddingFieldPath || "embedding", // <-- Allow setting embedding field path
            embedding: {
                provider: config.embedding?.provider || 'openai',
                apiKey: config.embedding.apiKey,
                model: config.embedding?.model || 'text-embedding-3-small',
                batchSize: config.embedding?.batchSize || 100,
                dimensions: config.embedding?.dimensions || 1536
            },
            search: {
                similarityMetric: config.search?.similarityMetric || 'cosine',
                minScore: config.search?.minScore || 0.7,
                maxResults: config.search?.maxResults || 5
            }
        };


        this.client = null;
        this.indexManager = null;
    }

    /**
     * Establishes a connection to MongoDB.
     * If already connected, it does nothing.
     * @returns {Promise<void>}
     */
    async connect() {
        if (!this.client) {
            try {
                log('Initializing MongoDB client...');
                this.client = new MongoClient(this.config.mongoUrl);
            } catch (error) {
                console.error('Error initializing MongoDB client:', error);
                throw error;
            }
        }

        if (!this.client.topology || !this.client.topology.isConnected()) {
            try {
                log('Connecting to MongoDB...');
                await this.client.connect();
                log('Connected to MongoDB');
            } catch (error) {
                console.error('MongoDB Connection Error:', error);
                throw error;
            }
        }
    }


    /**
     * Retrieves a MongoDB collection reference.
     * @param {string} [database] - Database name, defaults to the configured database.
     * @param {string} [collection] - Collection name, defaults to the configured collection.
     * @returns {Promise<Object>} MongoDB collection reference.
     * @throws {Error} If database or collection is not specified.
     */
    async _getCollection(database, collection) {
        await this.connect();

        const dbName = database || this.config.defaultDatabase;
        const colName = collection || this.config.defaultCollection;

        if (!dbName || !colName) {
            throw new Error('Database and collection must be specified either in the config or as parameters.');
        }

        log(`Using database: ${dbName}, collection: ${colName}`);
        return this.client.db(dbName).collection(colName);
    }

    /**
     * Ingests a batch of documents into MongoDB.
     * Each document will be embedded before insertion.
     * @param {Array<Object>} documents - Array of documents to be ingested.
     * @param {Object} [options] - Optional parameters.
     * @param {string} [options.database] - Database name.
     * @param {string} [options.collection] - Collection name.
     * @returns {Promise<Object>} Summary of the ingestion process.
     */
    async ingestBatch(documents, options = {}) {
        const { database, collection } = options;
        const col = await this._getCollection(database, collection);
        log(`Ingesting into ${database || this.config.defaultDatabase}.${collection || this.config.defaultCollection} - ${documents.length} documents`);

        try {
            const embeddedDocs = await this._embedDocuments(documents);
            await col.insertMany(embeddedDocs);
            log('Documents inserted successfully');
            return { processed: documents.length, failed: 0 };
        } catch (error) {
            console.error('Batch Ingestion Error:', error);
            return { processed: 0, failed: documents.length };
        }
    }

    /**
     * Performs a semantic search on the stored vector embeddings.
     * @param {string} query - The search query.
     * @param {Object} [options] - Optional parameters.
     * @param {string} [options.database] - Database name.
     * @param {string} [options.collection] - Collection name.
     * @param {number} [options.maxResults=5] - Maximum number of search results.
     * @returns {Promise<Array<Object>>} Array of search results.
     */
    async search(query, options = {}) {
        const { database, collection, maxResults = 5 } = options;
        const col = await this._getCollection(database, collection);
        const embedding = await this._getEmbedding(query);
        console.log('[DEBUG] Using vector search index:', this.config.indexName);

        const indexManager = new IndexManager(col, {
            indexName: this.config.indexName,
            embeddingFieldPath: this.config.embeddingFieldPath,
            dimensions: this.config.embedding.dimensions
        });

        const aggregation = indexManager.buildSearchQuery(embedding, {}, { maxResults });

        log(`Running vector search in ${database || this.config.defaultDatabase}.${collection || this.config.defaultCollection}`);
        const results = await col.aggregate(aggregation).toArray();

        return results.map(r => ({
            content: r.content,
            documentId: r.documentId,
            metadata: r.metadata,
            score: r.score
        }));
    }

    /**
     * Embeds documents using the configured embedding provider.
     * @param {Array<Object>} documents - Array of documents.
     * @returns {Promise<Array<Object>>} Array of embedded documents.
     */
    async _embedDocuments(documents) {
        await this._initializeEmbeddingProvider();
        const texts = documents.map(doc => doc.content);
        const embeddings = await this.embeddingProvider.getEmbeddings(texts);

        return documents.map((doc, i) => ({
            ...doc,
            embedding: embeddings[i]
        }));
    }

    /**
     * Initializes the embedding provider.
     * @returns {Promise<void>}
     * @throws {Error} If the provider is unknown.
     */
    async _initializeEmbeddingProvider() {
        if (!this.embeddingProvider) {
            const { provider, apiKey, ...options } = this.config.embedding;
            log(`Initializing embedding provider: ${provider}`);

            switch (provider) {
                case 'openai':
                    const OpenAIEmbeddingProvider = (await import('../providers/OpenAIEmbeddingProvider.js')).default;
                    this.embeddingProvider = new OpenAIEmbeddingProvider({ apiKey, ...options });
                    break;
                default:
                    throw new Error(`Unknown embedding provider: ${provider}`);
            }
        }
    }

    /**
     * Retrieves an embedding for a given text.
     * @param {string} text - The text to embed.
     * @returns {Promise<Array<number>>} The embedded text.
     */

    async _getEmbedding(text) {
        if (!this.embeddingProvider) {
            await this._initializeEmbeddingProvider();
        }
        const [embedding] = await this.embeddingProvider.getEmbeddings([text]);
        return embedding;
    }


    /**
     * Closes the MongoDB connection.
     * @returns {Promise<void>}
     */
    async close() {
        if (this.client) {
            await this.client.close();
            log('MongoDB connection closed');
        }
    }
}

export default MongoRAG;
