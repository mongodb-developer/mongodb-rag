---
id: advanced-example
title: Advanced Example
sidebar_position: 2
---

# Advanced RAG Example

This example demonstrates advanced features of MongoDB-RAG, including custom preprocessing, metadata filtering, and integration with an LLM for question answering.

## Prerequisites

Install additional dependencies:

```bash
npm install mongodb-rag dotenv openai
```

## Advanced Configuration Example

```javascript
import { MongoRAG } from 'mongodb-rag';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function createAdvancedRAGSystem() {
  // Custom document preprocessor
  const documentPreprocessor = (doc) => {
    return {
      ...doc,
      content: doc.content.trim(),
      metadata: {
        ...doc.metadata,
        processedDate: new Date(),
        wordCount: doc.content.split(' ').length
      }
    };
  };

  // Initialize MongoRAG with advanced configuration
  const rag = new MongoRAG({
    mongoUrl: process.env.MONGODB_URI,
    database: 'ragAdvanced',
    collection: 'documents',
    embedding: {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      model: 'text-embedding-ada-002',
      batchSize: 100  // Custom batch size for embeddings
    },
    preprocessing: {
      documentPreprocessor,
      chunkSize: 500,     // Split documents into 500-token chunks
      chunkOverlap: 50    // 50-token overlap between chunks
    },
    search: {
      maxResults: 5,      // Return top 5 matches
      minScore: 0.7       // Minimum similarity score threshold
    }
  });

  return rag;
}

// Advanced QA function using RAG results
async function answerQuestion(rag, question, metadata = {}) {
  // Search with metadata filters
  const searchResults = await rag.search(question, {
    filter: metadata,
    maxResults: 3
  });

  // Format context from search results
  const context = searchResults
    .map(result => result.content)
    .join('\n\n');

  // Generate answer using OpenAI
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant. Use the provided context to answer questions accurately.'
      },
      {
        role: 'user',
        content: `Context: ${context}\n\nQuestion: ${question}`
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  return {
    answer: completion.choices[0].message.content,
    sources: searchResults.map(result => ({
      content: result.content,
      score: result.score,
      metadata: result.metadata
    }))
  };
}

// Example usage
async function main() {
  const rag = await createAdvancedRAGSystem();
  await rag.connect();

  // Example documents with metadata
  const documents = [
    {
      title: 'Vector Search Setup',
      content: 'Setting up Vector Search in MongoDB Atlas requires selecting the proper index type...',
      metadata: {
        category: 'setup',
        difficulty: 'intermediate'
      }
    },
    {
      title: 'Performance Optimization',
      content: 'To optimize vector search performance, consider index size and dimension reduction...',
      metadata: {
        category: 'optimization',
        difficulty: 'advanced'
      }
    }
  ];

  // Ingest documents
  await rag.ingestBatch(documents);

  // Answer a question with metadata filtering
  const response = await answerQuestion(
    rag,
    'How do I optimize vector search performance?',
    { difficulty: 'advanced' }
  );

  console.log('Answer:', response.answer);
  console.log('Sources:', response.sources);
}

main().catch(console.error);
```

## Advanced Features Explained

### 1. Custom Document Preprocessing
- Document enhancement with metadata
- Custom chunking strategy
- Batch processing optimization

### 2. Metadata Filtering
- Filter search results by metadata fields
- Combine semantic search with metadata constraints
- Flexible query conditions

### 3. Advanced Search Configuration
- Customizable similarity thresholds
- Result count control
- Score-based filtering

### 4. LLM Integration
- Context formatting
- Prompt engineering
- Source attribution

### 5. Error Handling and Monitoring

```javascript
// Error handling example
async function robustSearch(rag, question, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await rag.search(question);
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// Monitoring example
const searchWithMetrics = async (rag, question) => {
  const startTime = Date.now();
  const results = await rag.search(question);
  const duration = Date.now() - startTime;

  console.log(`Search metrics:
    - Duration: ${duration}ms
    - Results found: ${results.length}
    - Average score: ${results.reduce((acc, r) => acc + r.score, 0) / results.length}
  `);

  return results;
};
```

## Best Practices

1. **Document Processing**
   - Implement robust text cleaning
   - Consider domain-specific preprocessing
   - Optimize chunk sizes for your use case

2. **Search Optimization**
   - Balance precision vs. recall
   - Use appropriate similarity thresholds
   - Implement caching for frequent queries

3. **Performance**
   - Monitor memory usage
   - Implement connection pooling
   - Use appropriate batch sizes

4. **Security**
   - Implement proper API key management
   - Validate and sanitize input
   - Monitor usage and implement rate limiting