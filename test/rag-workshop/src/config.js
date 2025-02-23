require('dotenv').config();

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    database: process.env.MONGODB_DATABASE_NAME,
    collection: process.env.MONGODB_COLLECTION_NAME
  },
  embedding: {
    provider: process.env.EMBEDDING_PROVIDER || 'openai',
    apiKey: process.env.EMBEDDING_API_KEY,
    model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
    dimensions: 1536
  },
  llm: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.LLM_MODEL || 'gpt-3.5-turbo'
  },
  chunking: {
    strategy: 'semantic',
    maxChunkSize: 500,
    overlap: 50
  },
  search: {
    maxResults: 5,
    minScore: 0.7,
    returnSources: true
  }
};
