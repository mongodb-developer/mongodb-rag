import { MongoClient } from 'mongodb';
import debug from 'debug';
import IndexManager from './IndexManager.js';

const log = debug('mongodb-rag:core');

class MongoRAG {
    constructor(config) {
        // Validate required config
        if (!config.embedding?.apiKey) {
            throw new Error('OpenAI API key is required in config.embedding.apiKey');
        }

        this.config = {
            mongoUrl: config.mongoUrl,
            database: config.database,
            collection: config.collection,
            chunking: {
                strategy: config.chunking?.strategy || 'sliding',
                options: {
                    maxChunkSize: config.chunking?.maxChunkSize || 500,
                    overlap: config.chunking?.overlap || 50,
                    ...config.chunking?.options
                }
            },
            embedding: {
                provider: config.embedding?.provider || 'openai',
                apiKey: config.embedding.apiKey, // Explicitly copy the API key
                model: config.embedding?.model || 'text-embedding-3-small',
                batchSize: config.embedding?.batchSize || 100,
                dimensions: config.embedding?.dimensions || 1536
            },
            search: {
                similarityMetric: config.search?.similarityMetric || 'cosine',
                minScore: config.search?.minScore || 0.7,
                maxResults: config.search?.maxResults || 5,
                ...config.search?.options
            }
        };

        console.log('MongoRAG initialized with config:', {
            ...this.config,
            embedding: {
                ...this.config.embedding,
                apiKey: this.config.embedding.apiKey ? 'Present' : 'Missing'
            }
        });

        this.client = null;
        this.collection = null;
        this.indexManager = null;
        this.embeddingProvider = null;
    }

    async connect() {
        if (!this.client) {
            try {
                console.log('Connecting to MongoDB...');
                this.client = new MongoClient(this.config.mongoUrl);
                await this.client.connect();
                console.log('Successfully connected to MongoDB');

                this.collection = this.client.db(this.config.database)
                    .collection(this.config.collection);

                this.indexManager = new IndexManager(this.collection, {
                    dimensions: this.config.embedding.dimensions,
                    similarity: this.config.search.similarityMetric
                });

                await this.indexManager.ensureIndexes();
                console.log('Indexes verified');
            } catch (error) {
                console.error('Error connecting to MongoDB:', error);
                throw error;
            }
        }
    }

    async close() {
        if (this.client) {
            await this.client.close();
            this.client = null;
            this.collection = null;
            this.indexManager = null;
            log('Disconnected from MongoDB');
        }
    }

    async ingestBatch(documents, options = {}) {
        await this.connect();
        console.log(`Starting batch ingestion of ${documents.length} documents`);

        try {
            const chunks = await this._chunkDocuments(documents);
            console.log(`Created ${chunks.length} chunks`);

            const embeddedChunks = await this._embedChunks(chunks);
            console.log(`Generated embeddings for ${embeddedChunks.length} chunks`);

            await this.collection.insertMany(embeddedChunks);
            console.log(`Successfully stored documents in MongoDB`);

            return {
                processed: documents.length,
                failed: 0,
                errors: [],
                stats: {
                    chunksCreated: chunks.length,
                    embeddingsGenerated: embeddedChunks.length
                }
            };
        } catch (error) {
            console.error('Error during batch ingestion:', error);
            return {
                processed: 0,
                failed: documents.length,
                errors: [{ error: error.message }],
                stats: {
                    chunksCreated: 0,
                    embeddingsGenerated: 0
                }
            };
        }
    }

    async ingest(documents) {
        await this.connect();

        const chunks = await this._chunkDocuments(documents);
        const embeddedChunks = await this._embedChunks(chunks);

        await this.collection.insertMany(embeddedChunks);
        log(`Ingested ${documents.length} documents`);

        return embeddedChunks;
    }

    async search(query, options = {}) {
        await this.connect();

        const embedding = await this._getEmbedding(query);
        const searchOptions = { ...this.config.search, ...options };

        const aggregation = this.indexManager.buildSearchQuery(
            embedding,
            options.filter,
            {
                maxResults: searchOptions.maxResults,
                includeMetadata: options.includeMetadata
            }
        );

        const results = await this.collection.aggregate(aggregation).toArray();

        return results
            .filter(r => r.score >= searchOptions.minScore)
            .map(r => ({
                content: r.content,
                documentId: r.documentId,
                metadata: r.metadata,
                score: r.score
            }));
    }

    async _chunkDocuments(documents) {
        // Placeholder for chunking implementation
        return documents.map(doc => ({
            documentId: doc.id,
            content: doc.content,
            metadata: doc.metadata
        }));
    }

    async _embedChunks(chunks) {
        await this._initializeEmbeddingProvider();
        const texts = chunks.map(chunk => chunk.content);
        const embeddings = await this.embeddingProvider.getEmbeddings(texts);

        return chunks.map((chunk, i) => ({
            ...chunk,
            embedding: embeddings[i]
        }));
    }

    async _getEmbedding(text) {
        await this._initializeEmbeddingProvider();
        const [embedding] = await this.embeddingProvider.getEmbeddings([text]);
        return embedding;
    }

    async _initializeEmbeddingProvider() {
        if (!this.embeddingProvider) {
            const { provider, apiKey, ...options } = this.config.embedding;
    
            console.log(`Initializing embedding provider: ${provider}`);
    
            switch (provider) {
                case 'openai':
                    const OpenAIEmbeddingProvider = (await import('../providers/OpenAIEmbeddingProvider.js')).default;
                    this.embeddingProvider = new OpenAIEmbeddingProvider({ apiKey, ...options });
                    break;
                case 'anthropic':
                    const AnthropicEmbeddingProvider = (await import('../providers/AnthropicEmbeddingProvider.js')).default;
                    this.embeddingProvider = new AnthropicEmbeddingProvider({ apiKey, ...options });
                    break;
                case 'deepseek':
                    const DeepSeekEmbeddingProvider = (await import('../providers/DeepSeekEmbeddingProvider.js')).default;
                    this.embeddingProvider = new DeepSeekEmbeddingProvider({ apiKey, ...options });
                    break;
                default:
                    throw new Error(`Unknown embedding provider: ${provider}`);
            }
        }
    }
    

}

export default MongoRAG;