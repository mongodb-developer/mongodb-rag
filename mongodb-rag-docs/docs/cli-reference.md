---
id: cli-reference
title: CLI Reference
sidebar_position: 4
---

# MongoDB-RAG CLI Reference

MongoDB-RAG provides a command-line interface (CLI) to help manage vector search configurations, test indexes, and run searches efficiently.

## 📌 Usage
To see available commands, run:
```sh
npx mongodb-rag --help
```

## ⚡ CLI Commands

### **Initialize MongoRAG Configuration**

```
npx mongodb-rag init
```

Initializes the `.mongodb-rag.json` configuration file.

### **Test MongoDB Vector Search Index**

```
npx mongodb-rag test-index
```

Runs a test on the configured MongoDB Vector Search index.

### **Ingest a JSON File into MongoDB**

```
npx mongodb-rag ingest <file-path>
```

- `file-path`: Path to a JSON file containing documents to ingest.

### **Create a MongoDB Atlas Vector Search Index**

```
npx mongodb-rag create-index
```

Creates a vector search index in MongoDB Atlas.

### **Delete a MongoDB Atlas Vector Search Index**

```
npx mongodb-rag delete-index
```

Deletes an existing vector search index.

### **Generate a Vector Embedding**

```
npx mongodb-rag generate-embedding <text>
```

- `text`: The input text for which to generate an embedding.

### **Perform a Vector Search**

```
npx mongodb-rag search <query>
```

- `query`: The search query to retrieve semantically similar documents.

### **Ask a Question About Your Documents**

```
npx mongodb-rag ask <question>
```

- `question`: Ask a natural language question and get an answer based on your documents.
- Options:
  - `--show-sources`: Display the source documents used to generate the answer
  - `--cite-sources`: Include citations in the generated answer

### **Start an Interactive Chat Session**

```
npx mongodb-rag chat
```

Start an interactive chat session powered by your document knowledge base.
- Options:
  - `--show-sources`: Display the source documents used to generate each response
  - `--cite-sources`: Include citations in the generated responses

### **Show All Indexes in the Configured MongoDB Collection**

```
npx mongodb-rag show-indexes
```

Displays all vector indexes available in the configured MongoDB collection.

### **Show Current MongoRAG Configuration**

```
npx mongodb-rag show-config
```

Displays the current `.mongodb-rag.json` configuration.

### **Edit MongoRAG Configuration**

```
npx mongodb-rag edit-config
```

Allows editing of the MongoRAG configuration file.

### **Clear MongoRAG Configuration**

```
npx mongodb-rag clear-config
```

Removes the current MongoRAG configuration.

### **Reset MongoRAG Configuration**

```
npx mongodb-rag reset-config
```

Resets the configuration by re-running the setup.

### **Create Environment File**

```
npx mongodb-rag create-env
```

Creates a `.env` file from your `.mongodb-rag.json` configuration. This command generates environment variables needed for your RAG application:
- MONGODB_URI
- EMBEDDING_PROVIDER
- EMBEDDING_API_KEY
- EMBEDDING_MODEL
- VECTOR_INDEX
- MONGODB_DATABASE
- MONGODB_COLLECTION

## 🔍 Search vs Ask vs Chat - When to Use Each

MongoDB-RAG offers three different ways to interact with your document knowledge base:

- **Search**: Use when you need to see the raw documents that match your query
  ```sh
  npx mongodb-rag search "MongoDB vector search capabilities"
  ```

- **Ask**: Use when you want a direct answer to a specific question
  ```sh
  npx mongodb-rag ask "What are the key features of MongoDB Atlas Vector Search?"
  ```

- **Chat**: Use when you need an interactive conversation with context retention
  ```sh
  npx mongodb-rag chat --show-sources --cite-sources
  ```

## 🗣️ Conversational RAG Capabilities

MongoDB-RAG goes beyond vector search to provide true conversational capabilities with your data:

1. **Natural Language Answers**: Get complete, synthesized answers to your questions instead of just document snippets

2. **Context-Aware Chat**: Have multi-turn conversations that reference your document knowledge base

3. **Provider Flexibility**: Works with both OpenAI and Ollama for embedding and chat generation

4. **Source Attribution**: Optionally cite document sources in responses with the `--cite-sources` flag

5. **Transparent Results**: View the underlying documents with the `--show-sources` flag

For more details, refer to the MongoDB-RAG API Reference.
