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
        // Validate required embedding configuration
        const apiKey = config.embedding?.apiKey || process.env.EMBEDDING_API_KEY;
        if (!apiKey && config.embedding?.provider !== 'ollama') {
            console.log("API Key failing: ", apiKey);
            throw new Error('Embedding API key is required unless using Ollama.');
        }

        // Clone config to prevent mutation
        const safeConfig = { ...config };

        // Ensure database and collection exist
        safeConfig.database = safeConfig.database || "helpdesk";  // Provide a fallback
        safeConfig.collection = safeConfig.collection || "articles";  // Provide a fallback

        // Set up internal config structure
        this.config = {
            mongoUrl: safeConfig.mongoUrl,
            database: safeConfig.database,
            collection: safeConfig.collection,
            indexName: safeConfig.indexName || "vector_index",
            embeddingFieldPath: safeConfig.embeddingFieldPath || "embedding",
            embedding: {
                provider: safeConfig.embedding.provider,
                apiKey: apiKey,  // Use the resolved apiKey
                model: safeConfig.embedding.model || 'text-embedding-3-small',
                baseUrl: safeConfig.embedding.baseUrl || 'http://localhost:11434',
                batchSize: safeConfig.embedding.batchSize || 100,
                dimensions: safeConfig.embedding.dimensions || 1536
            },
            search: {
                similarityMetric: safeConfig.search?.similarityMetric || 'cosine',
                minScore: safeConfig.search?.minScore || 0.7,
                maxResults: safeConfig.search?.maxResults || 5
            }
        };

        console.log("✅ MongoRAG Final Config:", JSON.stringify(this.config, null, 2));

        this.client = null;
        this.indexManager = null;
        this.provider = this._createEmbeddingProvider(this.config.embedding);
    }


    _createEmbeddingProvider(config) {
        const { provider, apiKey, baseUrl, ...options } = config;
        log(`Creating embedding provider: ${provider}`);

        switch (provider) {
            case 'openai':
                return new OpenAIEmbeddingProvider({ 
                    apiKey,
                    model: options.model,
                    dimensions: options.dimensions
                });
            case 'ollama':
                if (!baseUrl) {
                    throw new Error("Ollama base URL is missing from the config");
                }
                return new OllamaEmbeddingProvider({
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
    
        const dbName = database || this.config.database;  // Fixed here
        const colName = collection || this.config.collection;  // Fixed here
    
        console.log("📌 Using database:", dbName);
        console.log("📌 Using collection:", colName);
    
        if (!dbName || !colName) {
            throw new Error('Database and collection must be specified.');
        }
    
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
            
            const { database, collection, maxResults = 5, skip = 0 } = options;
            const col = await this._getCollection(database, collection);
            
            const embedding = query ? await this.getEmbedding(query) : null;
            
            const indexManager = new IndexManager(col, {
                indexName: this.config.indexName,
                embeddingFieldPath: this.config.embeddingFieldPath,
                dimensions: this.config.embedding.dimensions
            });

            const aggregation = query 
                ? indexManager.buildSearchQuery(embedding, {}, { maxResults })
                : [{ $skip: skip }, { $limit: maxResults }]; // Simple aggregation for all documents

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

    async listDocuments({ limit = 10, skip = 0, database, collection } = {}) {
        try {
            // Use an empty query or a special query to fetch all documents
            const query = ""; // or use a wildcard query if supported
            const options = { database, collection, maxResults: limit, skip };

            // Call the search method with the query
            const results = await this.search(query, options);

            // Return the results, applying skip manually if needed
            return results.slice(skip, skip + limit);
        } catch (error) {
            console.error('Error listing documents:', error);
            throw error;
        }
    }

    getClient() {
        return this.client;
    }
}

export default MongoRAG;
