---
title: "Introducing MongoDB-RAG.com"
author: Michael Lynn
author_title: Developer Advocate @ MongoDB
author_url: https://github.com/mrlynn
author_image_url: https://avatars.githubusercontent.com/u/192552?v=4
tags: [mongodb, vector-search, rag, ai, workshop, tutorial]
---

import Screenshot from '@site/src/components/Screenshot';

We're thrilled to announce the launch of [MongoDB-RAG.com](http://mongodb-rag.com/), a comprehensive marketing landing page showcasing the power and flexibility of our MongoDB-RAG npm library. This new site not only provides detailed information about the library's capabilities but also features an interactive demonstration that lets visitors experience Retrieval Augmented Generation (RAG) with MongoDB Vector Search firsthand.

<Screenshot url="https://mongodb-rag.com" src={"img/screenshots/mongodb-rag-com.png"} alt="Landing Page" />

## What's New on MongoDB-RAG.com

The new landing page serves as a central hub for everything related to the MongoDB-RAG library, with several exciting features:

### Enhanced Documentation and Resources

The site provides clear, concise information about the MongoDB-RAG library, including its core features:

- Vector Search capabilities for efficient retrieval of semantically similar documents
- Dynamic database and collection selection for flexible data organization
- Batch processing with built-in retry mechanisms
- Index management to ensure optimal performance
- Caching for frequently accessed data
- Advanced chunking strategies (sliding window, semantic, and recursive)

### Meet the New Owlbert Chatbot

We've introduced an enhanced version of Owlbert, our friendly assistant chatbot. This new iteration showcases the practical applications of RAG technology in creating responsive, knowledgeable AI assistants. Owlbert can answer questions about MongoDB-RAG and demonstrate how effectively the library can power conversational AI experiences.

### Interactive Live Demo

The centerpiece of MongoDB-RAG.com is our innovative, real-time demonstration of RAG with MongoDB. This interactive feature includes:

1. **Documentation Window**: Browse through a selection of MongoDB documentation right on the page, giving you immediate access to reference materials.
2. **Ingestion Controls**: Configure and observe the document ingestion process with customizable parameters such as:
    - Chunking strategy (sliding window, semantic, or recursive)
    - Chunk size and overlap settings
    - Vector dimensions
    - Embedding provider selection
3. **Search Interface**: Experience the power of vector search firsthand with a user-friendly search bar that returns semantically relevant results from the ingested documentation.

The demo allows visitors to see the entire RAG pipeline in action—from document ingestion to embedding generation to semantic search—all without leaving the browser.

## Why We Built It

We created MongoDB-RAG.com with several goals in mind:

1. **Demystify RAG Technology**: By providing a hands-on demonstration, we're making the concepts of vector embeddings and semantic search more accessible and understandable.
2. **Showcase Integration Ease**: The site demonstrates how seamlessly MongoDB-RAG integrates with MongoDB Atlas Vector Search and various embedding providers like OpenAI and Ollama.
3. **Support Developers**: Through comprehensive documentation and interactive examples, we're helping developers implement RAG solutions in their own applications.
4. **Highlight Flexibility**: The demo showcases the library's ability to work with different chunking strategies, embedding models, and search configurations to meet diverse use cases.

## Getting Started with MongoDB-RAG

If the demo inspires you to incorporate MongoDB-RAG into your projects, getting started is simple:

```bash
npm install mongodb-rag dotenv
```
Then initialize your MongoDB-RAG instance:

```javascript
import { MongoRAG } from 'mongodb-rag';
import dotenv from 'dotenv';
dotenv.config();

const rag = new MongoRAG({
    mongoUrl: process.env.MONGODB_URI,
    database: 'my_rag_db',
    collection: 'documents',
    embedding: {
        provider: process.env.EMBEDDING_PROVIDER,
        apiKey: process.env.EMBEDDING_API_KEY,
        model: process.env.EMBEDDING_MODEL,
        dimensions: 1536
    }
});
```
## Visit Today!

We invite you to explore [MongoDB-RAG.com](http://mongodb-rag.com/) and experience firsthand the capabilities of our library. Whether you're building a chatbot, implementing semantic search, or exploring innovative AI applications, MongoDB-RAG provides the tools you need to harness the power of vector search with MongoDB.

Stay tuned for more updates as we continue to enhance both the website and the library with new features and improvements!
