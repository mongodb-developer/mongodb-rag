// src/core/MongoRAG.js

import { MongoClient } from 'mongodb';
import debug from 'debug';
import IndexManager from './IndexManager.js';
import OpenAIEmbeddingProvider from '../providers/OpenAIEmbeddingProvider.js';
import OllamaEmbeddingProvider from '../providers/OllamaEmbeddingProvider.js';

const log = debug('mongodb-rag:core');

/**
 * MongoRAG - A Retrieval-Augmented Generation (RAG) library
 * for performing semantic search and vector-based retrieval using MongoDB.
 */
class MongoRAG {
    constructor(config) {
        if (!config.embedding?.apiKey && config.embedding?.provider !== 'ollama') {
            throw new Error('Embedding API key is required unless using Ollama.');
        }

        this.config = {
            mongoUrl: config.mongoUrl,
            defaultDatabase: config.database,
            defaultCollection: config.collection,
            indexName: config.indexName || "vector_index",
            embeddingFieldPath: config.embeddingFieldPath || "embedding",
            embedding: {
                provider: config.embedding?.provider || 'openai',
                apiKey: config.embedding?.apiKey,
                model: config.embedding?.model || 'text-embedding-3-small',
                baseUrl: config.embedding?.baseUrl || 'http://localhost:11434', // Default Ollama base URL
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
        this.provider = this._createEmbeddingProvider(this.config.embedding);
    }

    _createEmbeddingProvider(config) {
        const { provider, apiKey, baseUrl, ...options } = config;
        log(`Creating embedding provider: ${provider}`);

        switch (provider) {
            case 'openai':
                return new OpenAIEmbeddingProvider({ apiKey, ...options });
            case 'ollama':
                if (!baseUrl) {
                    throw new Error("Ollama base URL is missing from the config. Run 'npx mongodb-rag edit-config' to set it.");
                }
                return new OllamaEmbeddingProvider({
                    provider: 'ollama',
                    baseUrl, 
                    model: options.model
                });
            default:
                throw new Error(`Unknown embedding provider: ${provider}`);
        }
    }

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

    async search(query, options = {}) {
        try {
            console.log('[DEBUG] Starting search with query:', query);
            console.log('[DEBUG] Search options:', options);
            
            const { database, collection, maxResults = 5 } = options;
            console.log('[DEBUG] Getting collection...');
            const col = await this._getCollection(database, collection);
            
            console.log('[DEBUG] Getting embedding for query...');
            const embedding = await this.getEmbedding(query);
            
            console.log('[DEBUG] Using vector search index:', this.config.indexName);
            console.log('[DEBUG] Collection details:', {
                database: database || this.config.defaultDatabase,
                collection: collection || this.config.defaultCollection
            });

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
        } catch (error) {
            console.error('[DEBUG] Search error:', error);
            throw error;
        }
    }

    async _embedDocuments(documents) {
        await this._initializeEmbeddingProvider();
        const texts = documents.map(doc => doc.content);
        const embeddings = await this.getEmbeddings(texts);

        return documents.map((doc, i) => ({
            ...doc,
            embedding: embeddings[i]
        }));
    }

    async _initializeEmbeddingProvider() {
        if (!this.provider) {
            const { provider, apiKey, baseUrl, ...options } = this.config.embedding;
            log(`Initializing embedding provider: ${provider}`);

            switch (provider) {
                case 'openai':
                    this.provider = new OpenAIEmbeddingProvider({ apiKey, ...options });
                    break;
                case 'ollama':
                    if (!baseUrl) {
                        throw new Error("Ollama base URL is missing from the config. Run 'npx mongodb-rag edit-config' to set it.");
                    }
                    this.provider = new OllamaEmbeddingProvider({
                        provider: 'ollama',
                        baseUrl, 
                        model: options.model
                    });
                    break;
                default:
                    throw new Error(`Unknown embedding provider: ${provider}`);
            }
        }
    }

    async getEmbedding(text) {
        if (!this.provider) {
            throw new Error('Embedding provider not initialized');
        }
        return await this.provider.getEmbedding(text);
    }

    async getEmbeddings(texts) {
        if (!this.provider) {
            throw new Error('Embedding provider not initialized');
        }
        return await this.provider.getEmbeddings(texts);
    }

    async close() {
        if (this.client) {
            await this.client.close();
            log('MongoDB connection closed');
        }
    }
}

export default MongoRAG;
