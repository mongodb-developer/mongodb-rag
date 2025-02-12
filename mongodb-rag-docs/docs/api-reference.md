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
  embedding: {
    provider: 'openai',
    apiKey: string,
    model?: string,
    batchSize?: number,
    dimensions?: number
  },
  search?: {
    maxResults?: number,
    minScore?: number,
    similarityMetric?: 'cosine' | 'dotProduct' | 'euclidean'
  }
});
```

#### Parameters

- `config.mongoUrl` (string, required): MongoDB connection URI.
- `config.database` (string, required): Default MongoDB database name.
- `config.collection` (string, required): Default MongoDB collection name.
- `config.embedding` (object, required):
    - `provider` (string, required): Embedding provider (`openai` is supported).
    - `apiKey` (string, required): API key for the embedding provider.
    - `model` (string, optional): Model name (default: `'text-embedding-3-small'`).
    - `batchSize` (number, optional): Batch size for embedding generation (default: `100`).
    - `dimensions` (number, optional): Number of dimensions in the embedding space (default: `1536`).
- `config.search` (object, optional):
    - `maxResults` (number, optional): Maximum number of results to return (default: `5`).
    - `minScore` (number, optional): Minimum similarity score threshold (default: `0.7`).
    - `similarityMetric` (string, optional): Similarity function for search (`cosine`, `dotProduct`, `euclidean`). Defaults to `'cosine'`.

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
  database?: string,
  collection?: string,
  maxResults?: number,
  minScore?: number
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
  documentId: string;
  metadata?: Record<string, any>;
  score: number;
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
    batchSize: 100,
    dimensions: 1536
  },
  search: {
    maxResults: 10,
    minScore: 0.8,
    similarityMetric: 'dotProduct'
  }
});
```

### Error Handling

The library provides specific error types:

```javascript
try {
  await rag.search('query');
} catch (error) {
  console.error('An error occurred:', error.message);
  // Handle the error appropriately
}
```

For more detailed examples and use cases, refer to:
- [Basic Example](./examples/basic-example.md)
- [Advanced Example](./examples/advanced-example.md)