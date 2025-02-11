import MongoRAG from '../src/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Verify required environment variables
const requiredEnvVars = ['MONGODB_URI', 'OPENAI_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

// Sample documents
const documents = [
  {
    id: 'doc1',
    content: 'MongoDB Atlas Vector Search enables semantic search capabilities through the storage and querying of vector embeddings.',
    metadata: {
      source: 'documentation',
      category: 'features'
    }
  },
  {
    id: 'doc2',
    content: 'Vector similarity search uses mathematical representations of content to find related items, making it ideal for semantic search applications.',
    metadata: {
      source: 'tutorial',
      category: 'concepts'
    }
  }
];

async function runExample() {
  console.log('Initializing MongoRAG...');
  
  const rag = new MongoRAG({
    mongoUrl: process.env.MONGODB_URI,
    database: 'ragtest',
    collection: 'documents',
    embedding: {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY
    }
  });

  try {
    // Ensure connection and indexes
    await rag.connect();
    console.log('Connected to MongoDB Atlas');

    // Ingest documents
    console.log('\nIngesting documents...');
    const ingestResult = await rag.ingestBatch(documents, {
      onProgress: (progress) => {
        console.log(`Progress: ${progress.percent}%`);
      }
    });
    console.log(`Ingested ${ingestResult.processed} documents`);

    // Perform a search
    console.log('\nPerforming search...');
    const searchQuery = 'What is vector similarity search?';
    console.log(`Query: "${searchQuery}"`);
    
    const results = await rag.search(searchQuery, {
      maxResults: 2,
      includeMetadata: true
    });

    // Display results
    console.log('\nSearch results:');
    results.forEach((result, i) => {
      console.log(`\n${i + 1}. Score: ${result.score.toFixed(3)}`);
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