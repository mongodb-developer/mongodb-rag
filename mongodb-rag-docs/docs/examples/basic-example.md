---
id: basic-example
title: Basic Example
sidebar_position: 1
---

# Basic RAG Example

This example demonstrates how to set up a simple RAG system using MongoDB-RAG for document retrieval and question answering.

## Setup

First, install the required dependencies:

```bash
npm install mongodb-rag dotenv
```

Create a `.env` file with your configuration:

```env
MONGODB_URI=your_mongodb_uri
OPENAI_API_KEY=your_openai_api_key
```

## Code Example

```javascript
import { MongoRAG } from 'mongodb-rag';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  // Initialize MongoRAG
  const rag = new MongoRAG({
    mongoUrl: process.env.MONGODB_URI,
    database: 'ragExample',
    collection: 'documents',
    embedding: {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      model: 'text-embedding-ada-002' // OpenAI embedding model
    }
  });

  // Connect to MongoDB
  await rag.connect();

  // Sample documents to ingest
  const documents = [
    {
      title: 'MongoDB Overview',
      content: 'MongoDB is a document database with the scalability and flexibility that you want with the querying and indexing that you need.'
    },
    {
      title: 'Vector Search',
      content: 'MongoDB Atlas Vector Search enables you to build vector search applications by storing embeddings and performing k-nearest neighbor (k-NN) search.'
    }
  ];

  // Ingest documents
  await rag.ingestBatch(documents);

  // Perform a search
  const searchResult = await rag.search('What is MongoDB?');
  console.log('Search Results:', searchResult);
}

main().catch(console.error);
```

## Step-by-Step Explanation

1. **Installation and Setup**
   - Install the required packages
   - Set up environment variables for MongoDB and OpenAI

2. **Initialize MongoRAG**
   - Create a new instance with your configuration
   - Connect to MongoDB

3. **Ingest Documents**
   - Prepare your documents in a simple format
   - Use `ingestBatch` to process and store documents

4. **Perform Search**
   - Use the `search` method to find relevant documents
   - Results include similarity scores and document content

## Expected Output

The search results will include:
- Relevant document matches
- Similarity scores
- Original document content

## Additional Tips

- Ensure your MongoDB Atlas cluster has Vector Search enabled
- Index creation is handled automatically by the library
- Use batched ingestion for large document sets
- Monitor memory usage when processing large documents