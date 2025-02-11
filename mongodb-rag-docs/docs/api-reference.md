---
id: api-reference
title: API Reference
sidebar_position: 5
---

# API Reference

## MongoRAG Class

### Constructor

Creates a new instance of the MongoRAG class.

```javascript
const rag = new MongoRAG({
  mongoUrl: string,
  database: string,
  collection: string,
  embedding?: {
    provider: 'openai',
    apiKey: string,
    model?: string,
    batchSize?: number
  },
  preprocessing?: {
    documentPreprocessor?: Function,
    chunkSize?: number,
    chunkOverlap?: number
  },
  search?: {
    maxResults?: number,
    minScore?: number
  }
});
```

#### Parameters

- `config.mongoUrl` (string, required): MongoDB connection URI
- `config.database` (string, required): MongoDB database name
- `config.collection` (string, required): MongoDB collection name
- `config.embedding` (object, optional):
  - `provider`: Embedding provider (currently supports 'openai')
  - `apiKey`: API key for the embedding provider
  - `model`: Model name (default: 'text-embedding-ada-002')
  - `batchSize`: Number of documents to embed in each batch
- `config.preprocessing` (object, optional):
  - `documentPreprocessor`: Custom function for document preprocessing
  - `chunkSize`: Maximum chunk size in tokens
  - `chunkOverlap`: Number of overlapping tokens between chunks
- `config.search` (object, optional):
  - `maxResults`: Maximum number of results to return
  - `minScore`: Minimum similarity score threshold

### Methods

#### connect()

Establishes connection to MongoDB.

```javascript
await rag.connect();
```

#### disconnect()

Closes the MongoDB connection.

```javascript
await rag.disconnect();
```

#### ingestBatch()

Ingests a batch of documents into the vector store.

```javascript
await rag.ingestBatch(documents, {
  batchSize?: number,
  preprocessor?: Function
});
```

**Parameters:**
- `documents` (array, required): Array of documents to ingest
- `options` (object, optional):
  - `batchSize`: Override default batch size
  - `preprocessor`: Custom preprocessor for this batch

**Returns:** Promise\<void\>

#### search()

Performs a vector search for similar documents.

```javascript
const results = await rag.search(query, {
  maxResults?: number,
  minScore?: number,
  filter?: object
});
```

**Parameters:**
- `query` (string, required): Search query
- `options` (object, optional):
  - `maxResults`: Maximum number of results
  - `minScore`: Minimum similarity score
  - `filter`: MongoDB filter for metadata

**Returns:** Promise\<Array\<SearchResult\>\>

### Type Definitions

```typescript
interface SearchResult {
  content: string;
  score: number;
  metadata?: Record<string, any>;
}
```

### Configuration Examples

#### Basic Configuration

```javascript
const rag = new MongoRAG({
  mongoUrl: 'mongodb+srv://your-connection-string',
  database: 'ragdb',
  collection: 'documents',
  embedding: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY
  }
});
```

#### Advanced Configuration

```javascript
const rag = new MongoRAG({
  mongoUrl: 'mongodb+srv://your-connection-string',
  database: 'ragdb',
  collection: 'documents',
  embedding: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'text-embedding-ada-002',
    batchSize: 100
  },
  preprocessing: {
    documentPreprocessor: (doc) => ({
      ...doc,
      content: doc.content.toLowerCase().trim(),
      metadata: {
        ...doc.metadata,
        processedAt: new Date()
      }
    }),
    chunkSize: 500,
    chunkOverlap: 50
  },
  search: {
    maxResults: 5,
    minScore: 0.7
  }
});
```

### Error Handling

The library provides specific error types:

```javascript
try {
  await rag.search('query');
} catch (error) {
  if (error instanceof ConnectionError) {
    // Handle connection errors
  } else if (error instanceof EmbeddingError) {
    // Handle embedding generation errors
  } else if (error instanceof SearchError) {
    // Handle search errors
  }
}
```

### Events

MongoRAG emits events you can listen to:

```javascript
rag.on('connect', () => {
  console.log('Connected to MongoDB');
});

rag.on('ingest:start', (batchSize) => {
  console.log(`Starting ingestion of ${batchSize} documents`);
});

rag.on('ingest:complete', (count) => {
  console.log(`Completed ingestion of ${count} documents`);
});

rag.on('search:start', (query) => {
  console.log(`Starting search for: ${query}`);
});

rag.on('error', (error) => {
  console.error('An error occurred:', error);
});
```

For more detailed examples and use cases, refer to:
- [Basic Example](./examples/basic-example.md)
- [Advanced Example](./examples/advanced-example.md)