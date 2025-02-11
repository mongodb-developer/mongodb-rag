# MongoDB-RAG

![NPM Version](https://img.shields.io/npm/v/mongodb-rag?color=blue&label=npm)  
![Build Status](https://github.com/mongodb-developer/mongodb-rag/actions/workflows/test.yml/badge.svg)  
![License](https://img.shields.io/github/license/mongodb-developer/mongodb-rag)  
![Issues](https://img.shields.io/github/issues/mongodb-developer/mongodb-rag)  
![Pull Requests](https://img.shields.io/github/issues-pr/mongodb-developer/mongodb-rag)  
![Downloads](https://img.shields.io/npm/dt/mongodb-rag)  

## Overview
MongoDB-RAG (Retrieval Augmented Generation) is an NPM module that simplifies vector search using MongoDB Atlas. This library enables developers to efficiently perform similarity search, caching, batch processing, and indexing for fast and accurate retrieval of relevant data.

## Features
- **Vector Search**: Efficiently retrieves similar documents using MongoDB's Atlas Vector Search.
- **Dynamic Database & Collection Selection**: Supports flexible selection of multiple databases and collections.
- **Batch Processing**: Handles bulk processing of documents with retry mechanisms.
- **Index Management**: Ensures necessary indexes are available and optimized.
- **Caching Mechanism**: Provides in-memory caching for frequently accessed data.
- **Advanced Chunking**: Supports **sliding window**, **semantic**, and **recursive** chunking strategies.

---

## **🚀 Getting Started**

### **1️⃣ Install the Package**
```sh
npm install mongodb-rag dotenv
```

### **2️⃣ Set Up MongoDB Atlas**
1. **Create a MongoDB Atlas Cluster** ([MongoDB Atlas](https://www.mongodb.com/atlas))
2. **Enable Vector Search** under Indexes:
   ```json
   {
     "definition": {
       "fields": [
         { "path": "embedding", "type": "vector", "numDimensions": 1536, "similarity": "cosine" }
       ]
     }
   }
   ```
3. **Get Your Connection String** and store it in `.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/
   EMBEDDING_API_KEY=your-openai-api-key
   ```

### **3️⃣ Initialize MongoRAG**
```javascript
import { MongoRAG } from 'mongodb-rag';
import dotenv from 'dotenv';
dotenv.config();

const rag = new MongoRAG({
    mongoUrl: process.env.MONGODB_URI,
    database: 'my_rag_db',  // Default database
    collection: 'documents', // Default collection
    embedding: {
        provider: 'openai',
        apiKey: process.env.EMBEDDING_API_KEY,
        dimensions: 1536,
        model: 'text-embedding-3-small'
    }
});
await rag.connect();
```

### **4️⃣ Ingest Documents**
```javascript
const documents = [
    { id: 'doc1', content: 'MongoDB is a NoSQL database.', metadata: { source: 'docs' } },
    { id: 'doc2', content: 'Vector search is useful for semantic search.', metadata: { source: 'ai' } }
];

await rag.ingestBatch(documents, { database: 'dynamic_db', collection: 'dynamic_docs' });
console.log('Documents ingested.');
```

### **5️⃣ Perform a Vector Search**
```javascript
const query = 'How does vector search work?';

const results = await rag.search(query, {
    database: 'dynamic_db',
    collection: 'dynamic_docs',
    maxResults: 3
});

console.log('Search Results:', results);
```

### **6️⃣ Close Connection**
```javascript
await rag.close();
```

---

## **⚡ Additional Features**

### **🌍 Multi-Database & Collection Support**
Store embeddings in multiple **databases and collections** dynamically.
```javascript
await rag.ingestBatch(docs, { database: 'finance_db', collection: 'reports' });
```

### **🔎 Hybrid Search (Vector + Metadata Filtering)**
```javascript
const results = await rag.search('AI topics', {
    database: 'my_rag_db',
    collection: 'documents',
    maxResults: 5,
    filter: { 'metadata.source': 'ai' }
});
```

---

## **🧪 Testing**
Run tests using:
```sh
npm test
```
Run in watch mode:
```sh
npm run test:watch
```
Check test coverage:
```sh
npm run test:coverage
```

---

## **🤝 Contributing**
Contributions are welcome! Please fork the repository and submit a pull request.

---

## **📜 License**
This project is licensed under the MIT License.

