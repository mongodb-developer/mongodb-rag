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

## Running a Search Query
```js
const results = await rag.search('What is vector search?');
console.log(results);
```