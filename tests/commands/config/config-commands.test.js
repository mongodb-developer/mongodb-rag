const mockConfig = {
  mongoUrl: 'mongodb+srv://test:test@cluster.mongodb.net',
  database: 'test_db',
  collection: 'test_collection',
  embedding: {
    provider: 'openai',
    apiKey: 'test-key',
    model: 'text-embedding-3-small',
    dimensions: 1536,
    batchSize: 100
  },
  search: {
    maxResults: 5,
    minScore: 0.7
  },
  indexName: 'vector_index'
}; 