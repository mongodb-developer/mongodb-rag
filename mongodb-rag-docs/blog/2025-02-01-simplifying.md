---
title: Simplifying RAG with MongoDB
author: Michael Lynn
author_title: Developer Advocate @ MongoDB
author_url: https://github.com/mrlynn
author_image_url: https://avatars.githubusercontent.com/u/192552?v=4
tags: [mongodb, docusaurus, blog]
---

Over the past year, I\'ve spent a lot of time talking to developers about Retrieval-Augmented Generation (RAG) and how MongoDB Atlas Vector Search enables efficient vector-based retrieval. While the power of MongoDB as a vector database is undeniable, I noticed a recurring theme: developers wanted a simpler way to implement RAG applications.

That\'s what inspired me to create MongoDB-RAG, an npm library that abstracts away the complexity of embedding generation, vector search, and document retrieval giving developers a plug-and-play way to build RAG-powered applications with MongoDB.

Today, I want to introduce the library and share some of the exciting new features we\'ve recently added to make RAG with MongoDB even more intuitive and performant.

📌 Why I Built MongoDB-RAG
When I first started experimenting with vector search and large language models (LLMs), I found myself repeatedly writing boilerplate code for:

- ✅ Generating embeddings using OpenAI, DeepSeek, or Ollama
- ✅ Storing embeddings in MongoDB efficiently
- ✅ Building vector indexes with optimal settings
- ✅ Running similarity searches using MongoDB Atlas Vector Search
- ✅ Filtering and retrieving documents with hybrid search

Every RAG application required these steps, but the process felt unnecessarily repetitive. What if we could standardize this flow into a reusable library?

MongoDB-RAG does just that—eliminating complexity so that you can go from querying unstructured data to getting intelligent results in just a few lines of code.

## 🚀 What\'s New in MongoDB-RAG?
Since launching the first version, we\'ve been working hard to refine and expand the library. Here are some of the latest features that make MongoDB-RAG a must-have for building RAG applications with MongoDB Atlas:

### 🔹 Dynamic Database & Collection Selection
Developers can now specify custom databases and collections at query time, allowing more flexible data organization. Previously, all data had to be stored in a predefined database, but now you can run searches dynamically across multiple datasets.

```javascript

const results = await rag.search("What is AI?", {
  database: "research_db",
  collection: "ai_papers",
  maxResults: 5
});
```
### 🔹 Intelligent Document Chunking
One of the biggest challenges in RAG is breaking large documents into meaningful chunks. MongoDB-RAG now includes three advanced chunking strategies:

1. Sliding Window - Maintains context with overlapping chunks
2. Semantic Chunking - Uses sentence boundaries to create more meaningful segments
3. Recursive Chunking - Dynamically splits large sections into smaller chunks

```
const chunkedDocs = chunker.chunkDocument(myDocument, { strategy: "semantic" });
```

### 🔹 Multi-Embedding Provider Support
MongoDB-RAG now supports multiple embedding providers—so you\'re not locked into one ecosystem.

Supported providers include:
- ✅ OpenAI (text-embedding-3-small, text-embedding-3-large)
- ✅ DeepSeek (high-performance embeddings with affordable pricing)
- ✅ Ollama (local LLM-based embeddings for privacy and cost-efficiency)

```
const rag = new MongoRAG({
  embedding: { provider: "ollama", baseUrl: "http://localhost:11434", model: "llama3" }
});
```

### 🔹 Vector Quantization for Faster Queries
We\'ve integrated automatic vector quantization, reducing memory footprint and boosting search performance in MongoDB Atlas. You can now enable scalar or binary quantization effortlessly.

```
const indexDefinition = {
  fields: [
    { type: "vector", path: "embedding", numDimensions: 1536, similarity: "cosine", quantization: "binary" }
  ]
};
```

### 🔹 Hybrid Search: Combining Vector & Metadata Filters
One of the biggest advantages of MongoDB over other vector databases is the ability to perform hybrid searches—combining vector similarity with traditional filters.

MongoDB-RAG makes it seamless:

```
const results = await rag.search("Latest AI papers", {
  database: "research_db",
  collection: "papers",
  filter: { "metadata.year": { $gte: 2022 } }
});
```

Now, you can refine vector searches using structured metadata like dates, authors, or categories.

## ⚡ How to Get Started
Setting up MongoDB-RAG is ridiculously easy. Just install the package and connect it to your MongoDB Atlas cluster:

1️⃣ Install MongoDB-RAG

```
npm install mongodb-rag dotenv
```

2️⃣ Set Up MongoDB Atlas
Ensure you have an Atlas cluster with Vector Search enabled, then store your connection string in .env:

```
MONGODB_URI=mongodb+srv://your-user:your-password@your-cluster.mongodb.net/
EMBEDDING_PROVIDER=openai
EMBEDDING_API_KEY=your-openai-api-key
EMBEDDING_MODEL=text-embedding-3-small
```

3️⃣ Ingest Documents

```
const documents = [
  { id: "doc1", content: "MongoDB is a NoSQL database.", metadata: { source: "docs" } },
  { id: "doc2", content: "Vector search is useful for semantic search.", metadata: { source: "ai" } }
];

await rag.ingestBatch(documents, { database: "my_db", collection: "docs" });
```

4️⃣ Perform a Vector Search

```
const results = await rag.search("How does vector search work?", {
  database: "my_db",
  collection: "docs",
  maxResults: 3
});
console.log("Search Results:", results);
```

And just like that, your MongoDB-powered RAG application is up and running!

## 🔮 What\'s Next?

We\'re constantly evolving MongoDB-RAG based on developer feedback. Here\'s what\'s coming next:

- ✅ RAG Pipelines: End-to-end orchestration for document retrieval & LLM response generation
- ✅ Integration with LangChain: Seamless connection with AI agent frameworks
- ✅ Built-in UI Dashboard: Visualize vector search performance and document embeddings

## 🎯 Final Thoughts

I built MongoDB-RAG because I wanted an easier, more efficient way to work with vector search in MongoDB. Instead of reinventing the wheel every time I built a RAG system, I wanted a reusable, well-optimized library that handles all the heavy lifting.

Now, with dynamic database selection, hybrid search, intelligent chunking, and multi-provider embeddings, I truly believe MongoDB-RAG is the fastest way to build production-ready RAG applications.

Give it a try, and let me know what you think! 🚀

- 📌 GitHub Repo: github.com/mongodb-developer/mongodb-rag
- 📌 NPM Package: npmjs.com/package/mongodb-rag

Let\'s simplify RAG development together! 👏