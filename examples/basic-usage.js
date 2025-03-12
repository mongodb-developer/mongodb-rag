import { MongoRAG } from '../src/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Debug loading of environment variables
console.log('Loaded ENV:', {
  mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
  provider: process.env.EMBEDDING_PROVIDER || 'openai',
  apiKey: process.env.EMBEDDING_API_KEY ? 'Set' : 'Not set'
});

// Sample documents
const documents = [
  {
    id: 'doc1',
    content: 'MongoDB Atlas Vector Search enables semantic search capabilities through vector embeddings.',
    metadata: { source: 'docs', category: 'features' }
  },
  {
    id: 'doc2',
    content: 'Vector similarity search uses mathematical representations to find related items.',
    metadata: { source: 'tutorial', category: 'concepts' }
  }
];

async function runExample() {
  console.log('Initializing MongoRAG...');
  
  const rag = new MongoRAG({
    mongoUrl: process.env.MONGODB_URI,
    database: 'ragtest',  // Default database
    collection: 'documents',  // Default collection
    embedding: {
      provider: process.env.EMBEDDING_PROVIDER || 'openai',
      apiKey: process.env.EMBEDDING_API_KEY,
      dimensions: 1024,
      model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small'
    }
  });

  try {
    await rag.connect();
    console.log('Successfully connected and initialized indexes');

    console.log('Ingesting documents into `dynamic_test_db.dynamic_docs`...');
    const ingestResult = await rag.ingestBatch(documents, {
      database: 'dynamic_test_db',   // NEW: Dynamic database
      collection: 'dynamic_docs'     // NEW: Dynamic collection
    });

    console.log(`Ingested ${ingestResult.processed} documents`);

    console.log('\nPerforming search...');
    const searchQuery = 'What is vector similarity search?';
    console.log(`Query: "${searchQuery}"`);

    const results = await rag.search(searchQuery, {
      database: 'dynamic_test_db',   // NEW: Dynamic database
      collection: 'dynamic_docs',    // NEW: Dynamic collection
      maxResults: 2,
      includeMetadata: true
    });

    console.log('\nSearch results:');
    results.forEach((result, i) => {
      //console.log(`\n${i + 1}. Score: ${result.score.toFixed(3)}`);
      console.log(`Content: ${result.content}`);
      console.log(`Metadata: ${JSON.stringify(result.metadata)}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await rag.close();
  }
}

// Run the example
runExample().catch(console.error);
