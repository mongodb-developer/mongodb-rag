---
id: create-embeddings
title: 👐 Creating Vector Embeddings
---

# Creating and Managing Vector Embeddings

In this section, you'll learn how to create vector embeddings from text documents and store them in MongoDB Atlas using the `mongodb-rag` library.

## Understanding Embeddings

Embeddings are numerical representations of text that capture semantic meaning. For RAG applications, we use embeddings to:

1. Convert documents into vector representations during ingestion
2. Convert user queries into vector representations during search
3. Find the most similar documents using vector similarity

## Setting Up Your Project

First, let's create a new project directory and install the necessary dependencies:

```bash
mkdir rag-workshop
cd rag-workshop
npm init -y
npm install mongodb-rag dotenv
```

## Selecting an Embedding Provider

The `mongodb-rag` library supports multiple embedding providers:

1. **OpenAI** - High-quality embeddings (requires API key)
2. **Ollama** - Local embeddings (no API key needed, runs on your machine)
3. **DeepSeek** - Alternative embedding provider
4. **Custom** - Use any embedding model with a custom adapter

For this workshop, we'll focus on OpenAI and Ollama. Make sure your `.env` file is configured appropriately from the previous section.

## Creating a Simple Embeddings Generator

Let's create a script to generate embeddings for some sample text and visualize them. Create a file called `generate-embeddings.js`:

```javascript
const { MongoRAG } = require('mongodb-rag');
require('dotenv').config();

async function generateEmbeddings() {
  // Initialize MongoRAG with your configuration
  const rag = new MongoRAG({
    mongoUrl: process.env.MONGODB_URI,
    database: 'rag_workshop',
    collection: 'embeddings',
    embedding: {
      provider: process.env.EMBEDDING_PROVIDER || 'openai',
      apiKey: process.env.EMBEDDING_API_KEY,
      model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
      dimensions: 1536  // Dimensionality depends on your model
    }
  });

  await rag.connect();

  // Sample texts to embed
  const texts = [
    "MongoDB is a document database used to build highly available and scalable applications.",
    "Vector search enables similarity-based information retrieval using embeddings.",
    "Retrieval-Augmented Generation (RAG) enhances LLMs with external knowledge."
  ];

  try {
    // Generate embeddings
    console.log('Generating embeddings...');
    
    // Get embeddings directly without storing them
    const embeddings = await rag.provider.getEmbeddings(texts);
    
    // Print embedding information
    console.log(`Generated ${embeddings.length} embeddings`);
    console.log(`Each embedding has ${embeddings[0].length} dimensions`);
    
    // Print a small sample of the first embedding vector
    console.log('Sample of first embedding vector:');
    console.log(embeddings[0].slice(0, 5), '...');
    
    // Calculate similarity between vectors (simple cosine similarity)
    const similarity = calculateCosineSimilarity(embeddings[0], embeddings[1]);
    console.log(`Similarity between first two embeddings: ${similarity.toFixed(4)}`);
    
  } catch (error) {
    console.error('Error generating embeddings:', error);
  } finally {
    await rag.close();
  }
}

// Calculate cosine similarity between two vectors
function calculateCosineSimilarity(vectorA, vectorB) {
  // Calculate dot product
  const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
  
  // Calculate magnitudes
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));
  
  // Return cosine similarity
  return dotProduct / (magnitudeA * magnitudeB);
}

generateEmbeddings();
```

Run this script to see the embeddings:

```bash
node generate-embeddings.js
```

You should see output showing the dimensions of your embeddings and a similarity score between the first two embeddings.

## Ingesting Documents with MongoDB-RAG

Now let's create a script to ingest documents, generate embeddings, and store them in MongoDB Atlas. Create a file called `ingest-documents.js`:

```javascript
const { MongoRAG } = require('mongodb-rag');
require('dotenv').config();

async function ingestDocuments() {
  // Initialize MongoRAG
  const rag = new MongoRAG({
    mongoUrl: process.env.MONGODB_URI,
    database: 'rag_workshop',
    collection: 'documents',
    embedding: {
      provider: process.env.EMBEDDING_PROVIDER || 'openai',
      apiKey: process.env.EMBEDDING_API_KEY,
      model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small'
    }
  });

  await rag.connect();

  // Sample documents to ingest
  const documents = [
    {
      id: 'doc1',
      content: 'MongoDB Atlas is a fully-managed cloud database developed by MongoDB. It handles all the complexity of deploying, managing, and healing your deployments on the cloud service provider of your choice (AWS, Azure, and GCP). MongoDB Atlas allows you to deploy fully managed MongoDB across AWS, Google Cloud, and Azure.',
      metadata: {
        source: 'MongoDB Documentation',
        category: 'cloud',
        date: '2023-01-15'
      }
    },
    {
      id: 'doc2',
      content: 'MongoDB Atlas Vector Search enables you to build vector search capabilities into your applications. Define and create Atlas Vector Search indexes to perform k-Nearest Neighbors (kNN) vector search queries on vector embeddings of your data stored in your Atlas cluster.',
      metadata: {
        source: 'MongoDB Documentation',
        category: 'vector-search',
        date: '2023-05-22'
      }
    },
    {
      id: 'doc3',
      content: 'Retrieval-Augmented Generation (RAG) is an AI framework for retrieving facts from an external knowledge base to ground large language models (LLMs) on the most accurate, up-to-date information and reduce hallucinations. RAG combines information retrieval with text generation capabilities of LLMs.',
      metadata: {
        source: 'AI Research Papers',
        category: 'artificial-intelligence',
        date: '2023-08-10'
      }
    }
  ];

  try {
    console.log(`Ingesting ${documents.length} documents...`);
    const result = await rag.ingestBatch(documents);
    console.log(`Successfully ingested ${result.processed} documents`);
    
    // Verify documents were stored properly
    const collection = await rag._getCollection();
    const count = await collection.countDocuments();
    console.log(`Total documents in collection: ${count}`);
    
    // Sample a document to verify it has an embedding
    const sample = await collection.findOne();
    console.log('Sample document:');
    console.log(`ID: ${sample.documentId}`);
    console.log(`Content: ${sample.content.substring(0, 100)}...`);
    console.log(`Embedding dimensions: ${sample.embedding.length}`);
    console.log(`Metadata:`, sample.metadata);
    
  } catch (error) {
    console.error('Error ingesting documents:', error);
  } finally {
    await rag.close();
  }
}

ingestDocuments();
```

Run this script to ingest the documents:

```bash
node ingest-documents.js
```

## Document Chunking Strategies

For longer documents, it's important to break them into smaller chunks before creating embeddings. MongoDB-RAG provides several chunking strategies:

1. **Sliding Window** - Create overlapping chunks of fixed size
2. **Semantic** - Split based on semantic boundaries (paragraphs, sentences)
3. **Recursive** - Hierarchical chunking for nested document structures

Let's create a script to demonstrate chunking. Create a file called `chunk-document.js`:

```javascript
const { MongoRAG, Chunker } = require('mongodb-rag');
require('dotenv').config();

async function demonstrateChunking() {
  console.log('Demonstrating different chunking strategies:');
  
  // Create a long document
  const longDocument = {
    id: 'long-doc',
    content: `
    # MongoDB Atlas Vector Search
    
    MongoDB Atlas Vector Search is a fully managed service that helps developers build vector search into their applications. 
    
    ## Key Features
    
    Vector search in MongoDB Atlas provides several key capabilities:
    
    1. Integration with Atlas: Seamlessly works with your existing MongoDB Atlas deployment.
    2. Multiple similarity metrics: Supports cosine similarity, dot product, and Euclidean distance.
    3. Approximate nearest neighbor algorithms: Uses efficient indexing for fast searches.
    4. Hybrid search capabilities: Combine vector search with traditional MongoDB queries.
    
    ## Use Cases
    
    Vector search enables various applications:
    
    - Semantic text search
    - Image similarity
    - Recommendation systems
    - Anomaly detection
    
    ## Getting Started
    
    To get started with vector search in MongoDB Atlas, you need to:
    1. Create a MongoDB Atlas cluster
    2. Enable Vector Search
    3. Create a vector search index
    4. Store embeddings in your collection
    5. Perform vector search queries
    
    ## Performance Considerations
    
    When working with vector search at scale, consider:
    - Index size and performance trade-offs
    - Vector dimensions and precision
    - Query concurrency and resource allocation
    - Horizontal scaling for large vector collections
    `,
    metadata: {
      source: 'workshop',
      category: 'vector-search'
    }
  };
  
  // Create chunkers with different strategies
  const slidingChunker = new Chunker({
    strategy: 'sliding',
    maxChunkSize: 200,
    overlap: 50
  });
  
  const semanticChunker = new Chunker({
    strategy: 'semantic',
    maxChunkSize: 200
  });
  
  const recursiveChunker = new Chunker({
    strategy: 'recursive',
    maxChunkSize: 200
  });
  
  // Generate chunks using each strategy
  const slidingChunks = await slidingChunker.chunkDocument(longDocument);
  const semanticChunks = await semanticChunker.chunkDocument(longDocument);
  const recursiveChunks = await recursiveChunker.chunkDocument(longDocument);
  
  // Display results
  console.log(`\nSliding Window Strategy (${slidingChunks.length} chunks):`);
  slidingChunks.forEach((chunk, i) => {
    console.log(`Chunk ${i+1}: ${chunk.content.length} chars`);
    console.log(`${chunk.content.substring(0, 50)}...`);
  });
  
  console.log(`\nSemantic Strategy (${semanticChunks.length} chunks):`);
  semanticChunks.forEach((chunk, i) => {
    console.log(`Chunk ${i+1}: ${chunk.content.length} chars`);
    console.log(`${chunk.content.substring(0, 50)}...`);
  });
  
  console.log(`\nRecursive Strategy (${recursiveChunks.length} chunks):`);
  recursiveChunks.forEach((chunk, i) => {
    console.log(`Chunk ${i+1}: ${chunk.content.length} chars`);
    console.log(`${chunk.content.substring(0, 50)}...`);
  });
}

demonstrateChunking();
```

Run this script to see the different chunking strategies in action:

```bash
node chunk-document.js
```

## Advanced: Creating a Vector Search Index

Let's create a script to programmatically create a Vector Search index. Create a file called `create-index.js`:

```javascript
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function createVectorSearchIndex() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const database = client.db('rag_workshop');
    const collection = database.collection('documents');
    
    // Define the vector search index
    const indexDefinition = {
      name: "vector_index",
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            path: "embedding",
            numDimensions: 1536,
            similarity: "cosine"
          }
        ]
      }
    };
    
    // Create the index
    console.log('Creating vector search index...');
    const result = await collection.createSearchIndex(indexDefinition);
    console.log('Index creation initiated:', result);
    
    // Check index status
    console.log('Checking index status...');
    let indexStatus = 'creating';
    while (indexStatus !== 'READY') {
      const indexes = await collection.listSearchIndexes().toArray();
      const vectorIndex = indexes.find(idx => idx.name === 'vector_index');
      
      if (vectorIndex) {
        indexStatus = vectorIndex.status;
        console.log(`Current index status: ${indexStatus}`);
        
        if (indexStatus === 'READY') {
          console.log('Vector search index is now ready to use!');
          break;
        } else if (indexStatus === 'FAILED') {
          console.error('Index creation failed:', vectorIndex.error);
          break;
        }
      }
      
      console.log('Waiting for index to be built...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
  } catch (error) {
    console.error('Error creating vector search index:', error);
  } finally {
    await client.close();
  }
}

createVectorSearchIndex();
```

Run this script to create a Vector Search index:

```bash
node create-index.js
```

## Testing Vector Search

Finally, let's create a script to test our vector search capabilities. Create a file called `test-vector-search.js`:

```javascript
const { MongoRAG } = require('mongodb-rag');
require('dotenv').config();

async function testVectorSearch() {
  // Initialize MongoRAG
  const rag = new MongoRAG({
    mongoUrl: process.env.MONGODB_URI,
    database: 'rag_workshop',
    collection: 'documents',
    embedding: {
      provider: process.env.EMBEDDING_PROVIDER || 'openai',
      apiKey: process.env.EMBEDDING_API_KEY,
      model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small'
    },
    search: {
      maxResults: 2,
      minScore: 0.6
    }
  });

  await rag.connect();

  try {
    // Test queries
    const queries = [
      "What is MongoDB Atlas?",
      "How does vector search work?",
      "What is RAG in artificial intelligence?"
    ];
    
    for (const query of queries) {
      console.log(`\n🔍 Searching for: "${query}"`);
      const results = await rag.search(query);
      
      console.log(`Found ${results.length} results:`);
      results.forEach((result, i) => {
        console.log(`\n📄 Result ${i+1} (similarity score: ${result.score.toFixed(4)}):`);
        console.log(`Content: ${result.content}`);
        if (result.metadata) {
          console.log('Metadata:', result.metadata);
        }
      });
    }
    
  } catch (error) {
    console.error('Error during vector search:', error);
  } finally {
    await rag.close();
  }
}

testVectorSearch();
```

Run this script to test your vector search:

```bash
node test-vector-search.js
```

## Next Steps

Now that you've learned how to create and manage vector embeddings, it's time to build a complete RAG application. In the next section, you'll integrate these components into a full-fledged application.