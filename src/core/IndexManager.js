import debug from 'debug';

const log = debug('mongodb-rag:index');

class IndexManager {
    constructor(collection, options = {}) {
        this.collection = collection;
        this.options = {
            indexName: options.indexName || 'vector_index',
            dimensions: options.dimensions || 1536,
            similarity: options.similarity || 'cosine',
            ...options
        };
    }

    // ✅ Fix: Remove `function` keyword from method definition
    async ensureIndexes() {
        try {
            console.log('Checking existing indexes...');

            const existingIndexes = await this.collection.listIndexes().toArray();
            const hasVectorIndex = existingIndexes.some(index => index.name === this.options.indexName);

            if (!hasVectorIndex) {
                console.log('Creating missing vector search index...');
                
                const indexDefinition = {
                    name: this.options.indexName,
                    type: 'vectorSearch',
                    definition: {
                        fields: [
                            {
                                type: 'vector',
                                path: 'embedding',
                                numDimensions: this.options.dimensions,
                                similarity: this.options.similarity,
                                quantization: 'none'
                            }
                        ]
                    }
                };

                await this.collection.createSearchIndex(indexDefinition);
                console.log(`Vector search index '${this.options.indexName}' created successfully.`);
            } else {
                console.log(`Vector search index '${this.options.indexName}' already exists.`);
            }

            // Ensure supporting metadata indexes exist
            await this.createSupportingIndexes();
            
            console.log('All indexes verified.');
        } catch (error) {
            throw new Error(`Failed to ensure indexes: ${error.message}`);
        }
    }

    async createSupportingIndexes() {
        try {
            await this.collection.createIndex(
                { documentId: 1 },
                { name: 'document_lookup' }
            );

            await this.collection.createIndex(
                { 'metadata.source': 1, 'metadata.category': 1 },
                { name: 'metadata_filter', sparse: true }
            );

            log('Supporting indexes created successfully');
        } catch (error) {
            throw new Error(`Failed to create supporting indexes: ${error.message}`);
        }
    }

    buildSearchQuery(embedding, filter = {}, options = {}) {
        const vectorSearchQuery = {
            index: this.options.indexName, // ✅ Fix: Correct property reference
            path: "embedding", // ✅ Fix: Use correct path
            queryVector: embedding,
            limit: options.maxResults || 10,
            exact: options.exact || false
        };

        if (!vectorSearchQuery.exact) {
            vectorSearchQuery.numCandidates = options.numCandidates || 100;
        }

        const pipeline = [
            { $vectorSearch: vectorSearchQuery },
            {
                $project: {
                    documentId: 1,
                    content: 1,
                    metadata: 1,
                    score: { $meta: "vectorSearchScore" }  // Ensure score is always included
                }
            }
        ];

        if (Object.keys(filter).length > 0) {
            pipeline[0].$vectorSearch.filter = filter;
        }

        // console.log('Generated search query:', JSON.stringify(pipeline, null, 2));
        return pipeline;
    }

    // ✅ Fix: Remove `function` keyword
    async getIndexStats() {
        try {
            const stats = await this.collection.stats();
            const indexes = await this.collection.listIndexes().toArray();

            return {
                documentCount: stats.count,
                indexSize: stats.totalIndexSize,
                indexes: indexes.map(index => ({
                    name: index.name,
                    fields: Object.keys(index.key),
                    size: stats.indexSizes ? stats.indexSizes[index.name] : 'N/A'
                }))
            };
        } catch (error) {
            throw new Error(`Failed to get index stats: ${error.message}`);
        }
    }
}

export default IndexManager;
