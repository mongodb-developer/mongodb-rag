---
id: voyage-example
title: Using VoyageAI Embeddings
sidebar_position: 3
---

# Using VoyageAI Embeddings with MongoDB-RAG

This example demonstrates how to use VoyageAI's embedding models with MongoDB-RAG for vector search.

## Prerequisites

1. Install the mongodb-rag package:
   ```bash
   npm install mongodb-rag voyageai
   ```

2. Get a VoyageAI API key from [VoyageAI's website](https://www.voyageai.com/).

3. Set up your environment variables:
   ```bash
   export VOYAGE_API_KEY=your_api_key_here
   ```

## Basic Usage

```javascript
import MongoRAG from 'mongodb-rag';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  // Initialize MongoRAG with VoyageAI provider
  const rag = new MongoRAG({
    mongoUrl: 'mongodb+srv://your-connection-string',
    database: 'ragdb',
    collection: 'documents',
    embedding: {
      provider: 'voyage',
      apiKey: process.env.VOYAGE_API_KEY,
      model: 'voyage-3' // This is the default model
    }
  });

  // Connect to MongoDB
  await rag.connect();

  // Ingest some documents
  await rag.ingestBatch([
    {
      documentId: 'doc1',
      content: 'MongoDB is a document database with the scalability and flexibility that you want with the querying and indexing that you need.',
      metadata: { source: 'MongoDB Website', category: 'Database' }
    },
    {
      documentId: 'doc2',
      content: 'Vector search in MongoDB allows you to search for documents based on semantic similarity using vector embeddings.',
      metadata: { source: 'MongoDB Documentation', category: 'Search' }
    }
  ]);

  // Perform a search
  const results = await rag.search('How does vector search work?');
  console.log(results);

  // Close the connection
  await rag.close();
}

main().catch(console.error);
```

## Using Different VoyageAI Models

VoyageAI offers several embedding models optimized for different use cases:

```javascript
// For general purpose (default)
const rag = new MongoRAG({
  // MongoDB configuration...
  embedding: {
    provider: 'voyage',
    apiKey: process.env.VOYAGE_API_KEY,
    model: 'voyage-3' // Default model
  }
});

// For higher quality embeddings
const ragLarge = new MongoRAG({
  // MongoDB configuration...
  embedding: {
    provider: 'voyage',
    apiKey: process.env.VOYAGE_API_KEY,
    model: 'voyage-3-large' // Higher quality, larger model
  }
});

// For faster, more efficient embeddings
const ragLite = new MongoRAG({
  // MongoDB configuration...
  embedding: {
    provider: 'voyage',
    apiKey: process.env.VOYAGE_API_KEY,
    model: 'voyage-3-lite' // Faster, more efficient
  }
});

// For code-specific embeddings
const ragCode = new MongoRAG({
  // MongoDB configuration...
  embedding: {
    provider: 'voyage',
    apiKey: process.env.VOYAGE_API_KEY,
    model: 'voyage-code-3' // Optimized for code
  }
});

// For finance-specific embeddings
const ragFinance = new MongoRAG({
  // MongoDB configuration...
  embedding: {
    provider: 'voyage',
    apiKey: process.env.VOYAGE_API_KEY,
    model: 'voyage-finance-2' // Optimized for finance
  }
});

// For legal-specific embeddings
const ragLaw = new MongoRAG({
  // MongoDB configuration...
  embedding: {
    provider: 'voyage',
    apiKey: process.env.VOYAGE_API_KEY,
    model: 'voyage-law-2' // Optimized for legal content
  }
});
```

## Advanced Configuration

You can combine VoyageAI embeddings with advanced search options:

```javascript
const rag = new MongoRAG({
  mongoUrl: 'mongodb+srv://your-connection-string',
  database: 'ragdb',
  collection: 'documents',
  embedding: {
    provider: 'voyage',
    apiKey: process.env.VOYAGE_API_KEY,
    model: 'voyage-3',
    batchSize: 50 // Process 50 documents at a time
  },
  search: {
    maxResults: 10,
    minScore: 0.75,
    similarityMetric: 'cosine'
  }
});

// Search with metadata filtering
const results = await rag.search('vector search techniques', {
  filter: { category: 'Search' }
});
```

## Error Handling

```javascript
try {
  const rag = new MongoRAG({
    // MongoDB configuration...
    embedding: {
      provider: 'voyage',
      apiKey: process.env.VOYAGE_API_KEY,
      model: 'voyage-3'
    }
  });
  
  await rag.connect();
  const results = await rag.search('vector search');
} catch (error) {
  if (error.message.includes('VoyageAI API error')) {
    console.error('Error with VoyageAI API:', error.message);
    // Handle VoyageAI specific errors
  } else {
    console.error('General error:', error);
  }
}
