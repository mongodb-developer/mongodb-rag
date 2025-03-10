---
title: Usage
sidebar_position: 3
---

# Usage Guide

## Importing MongoRAG
```js
import MongoRAG from 'mongodb-rag';

const rag = new MongoRAG({
  mongoUrl: 'mongodb+srv://your-db-url',
  database: 'mydb',
  collection: 'mycollection',
  embedding: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY
  }
});

await rag.connect();
```

## Configuring Different Embedding Providers

### OpenAI (default)
```js
const rag = new MongoRAG({
  // MongoDB configuration...
  embedding: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'text-embedding-3-small' // optional, this is the default
  }
});
```

### VoyageAI
```js
const rag = new MongoRAG({
  // MongoDB configuration...
  embedding: {
    provider: 'voyage',
    apiKey: process.env.VOYAGE_API_KEY,
    model: 'voyage-3' // optional, this is the default
    // Other options: voyage-3-large, voyage-3-lite, voyage-code-3, voyage-finance-2, voyage-law-2
  }
});
```

### Ollama (local)
```js
const rag = new MongoRAG({
  // MongoDB configuration...
  embedding: {
    provider: 'ollama',
    baseUrl: 'http://localhost:11434', // optional, this is the default
    model: 'llama2' // required for Ollama
  }
});
```

## Running a Search Query
```js
const results = await rag.search('What is vector search?');
console.log(results);
```
