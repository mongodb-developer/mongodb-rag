---
id: intro
title: Introduction
sidebar_position: 1
---

# MongoDB-RAG

MongoDB-RAG is a library designed to integrate Retrieval-Augmented Generation (RAG) with MongoDB Atlas Vector Search.

## 🚀 Features
- Fast Vector Search with MongoDB Atlas
- OpenAI and DeepSeek Embeddings Support
- Batch Processing for Large Datasets
- Advanced Indexing via MongoDB Aggregation
- **CLI for Scaffolding RAG Apps**

## RAG Background

Retrieval-Augmented Generation (RAG) is a technique that uses a large language model to generate text based on a given context. The context is typically a set of documents that are relevant to the query.

The RAG process typically involves the following steps:

1. **Retrieval**: The model retrieves a set of documents from a vector database that are relevant to the query.
2. **Generation**: The model generates a response to the query based on the retrieved documents.


## 📦 Installation
```sh
npm install mongodb-rag
```

## 📚 Quick Start with CLI
You can generate a fully working RAG-enabled app with **MongoDB Atlas Vector Search** using:

```sh
npx mongodb-rag create-rag-app my-rag-app
```

This will:
- Scaffold a new **CRUD RAG app** with Express and MongoDB Atlas.
- Set up **environment variables** for **embedding providers**.
- Create API routes for **ingestion, search, and deletion**.

Then, navigate into your project and run:

```sh
cd my-rag-app
npm install
npm run dev
```

## 📚 Usage Example
```js
import MongoRAG from 'mongodb-rag';

const rag = new MongoRAG({
  mongoUrl: 'mongodb+srv://your-db-url',
  database: 'mydb',
  collection: 'mycollection',
  embedding: {
    provider: process.env.EMBEDDING_PROVIDER || 'openai',
    apiKey: process.env.EMBEDDING_API_KEY,
    model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small'
  }
});

await rag.connect();
const results = await rag.search('What is vector search?');
console.log(results);
```

