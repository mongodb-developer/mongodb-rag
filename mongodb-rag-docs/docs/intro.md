---
id: intro
title: Introduction
sidebar_position: 1
---

# MongoDB-RAG

MongoDB-RAG is a library designed to integrate Retrieval-Augmented Generation (RAG) with MongoDB Atlas Vector Search.

## 🚀 Features
- Fast Vector Search with MongoDB Atlas
- OpenAI Embeddings Support
- Batch Processing for Large Datasets
- Advanced Indexing via MongoDB Aggregation

## 📦 Installation
```sh
npm install mongodb-rag
```

## 📚 Usage Example
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
const results = await rag.search('What is vector search?');
console.log(results);
```