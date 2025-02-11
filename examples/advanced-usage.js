// examples/advanced-usage.js
import { MongoRAG } from '../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('Loaded ENV:', {
  mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
  provider: process.env.EMBEDDING_PROVIDER || 'openai',
  apiKey: process.env.EMBEDDING_API_KEY ? 'Set' : 'Not set',
  model: process.env.EMBEDDING_MODEL || 'default'
});

// **Test Documents**
const documents = [
  {
    id: 'doc1',
    content: 'MongoDB Atlas Vector Search is used for efficient retrieval of semantically similar documents.',
    metadata: { source: 'docs', category: 'vector search' }
  },
  {
    id: 'doc2',
    content: 'Embeddings are numerical representations of text used in machine learning and AI applications.',
    metadata: { source: 'tutorial', category: 'AI' }
  },
  {
    id: 'doc3',
    content: 'Atlas Search allows full-text search capabilities with advanced indexing options.',
    metadata: { source: 'docs', category: 'search' }
  },
  {
    id: 'doc4',
    content: 'MongoDB provides a document-based database that scales horizontally.',
    metadata: { source: 'database', category: 'MongoDB' }
  }
];

async function runAdvancedTest() {
  console.log('\n🔍 Initializing MongoRAG...');
  
  const rag = new MongoRAG({
    mongoUrl: process.env.MONGODB_URI,
    database: 'ragtest',   // Default database
    collection: 'documents',  // Default collection
    embedding: {
      provider: process.env.EMBEDDING_PROVIDER || 'openai',
      apiKey: process.env.EMBEDDING_API_KEY,
      dimensions: 1536,
      model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small'
    }
  });

  try {
    await rag.connect();
    console.log('✅ Connected to MongoDB and initialized indexes.');

    // **Step 1: Ingest into multiple collections**
    console.log('\n📥 Ingesting documents into `dynamic_db.documents_ai`...');
    const ingestResultAI = await rag.ingestBatch(documents, {
      database: 'dynamic_db',
      collection: 'documents_ai'
    });

    console.log(`✅ Ingested ${ingestResultAI.processed} AI-related documents.`);

    console.log('\n📥 Ingesting documents into `dynamic_db.documents_search`...');
    const ingestResultSearch = await rag.ingestBatch(documents, {
      database: 'dynamic_db',
      collection: 'documents_search'
    });

    console.log(`✅ Ingested ${ingestResultSearch.processed} search-related documents.`);

    // **Step 2: Perform searches in different collections**
    console.log('\n🔎 Searching in `documents_ai` for: "What is AI?"');
    const searchResultsAI = await rag.search('What is AI?', {
      database: 'dynamic_db',
      collection: 'documents_ai',
      maxResults: 3,
      includeMetadata: true
    });

    console.log('\n📌 **Search Results (AI Collection):**');
    searchResultsAI.forEach((result, i) => {
      console.log(`\n${i + 1}. Score: ${result.score.toFixed(3)}`);
      console.log(`Content: ${result.content}`);
      console.log(`Metadata: ${JSON.stringify(result.metadata)}`);
    });

    console.log('\n🔎 Searching in `documents_search` for: "How does vector search work?"');
    const searchResultsSearch = await rag.search('How does vector search work?', {
      database: 'dynamic_db',
      collection: 'documents_search',
      maxResults: 3,
      includeMetadata: true
    });

    console.log('\n📌 **Search Results (Search Collection):**');
    searchResultsSearch.forEach((result, i) => {
      console.log(`\n${i + 1}. Score: ${result.score.toFixed(3)}`);
      console.log(`Content: ${result.content}`);
      console.log(`Metadata: ${JSON.stringify(result.metadata)}`);
    });

  } catch (error) {
    console.error('❌ Test Failed:', error);
  } finally {
    await rag.close();
    console.log('\n🔒 Connection closed. Advanced test completed.');
  }
}

// **Run the test**
runAdvancedTest().catch(console.error);
