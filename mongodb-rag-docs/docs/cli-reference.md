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
- MONGODB_DATABASE_NAME
- MONGODB_COLLECTION_NAME

For more details, refer to the MongoDB-RAG API Reference.
