---
title: "Introducing the MongoDB-RAG Playground"
author: Michael Lynn
author_title: Developer Advocate @ MongoDB
author_url: https://github.com/mrlynn
author_image_url: https://avatars.githubusercontent.com/u/192552?v=4
tags: [mongodb, vector-search, rag, ai, workshop, tutorial]
---
# Introducing the MongoDB-RAG Playground: A Developer's Guide to Vector Search

## 🚀 What is the MongoDB-RAG Playground?

The **MongoDB-RAG Playground** is an interactive UI built directly into the `mongodb-rag` library. Designed to provide developers with a **quick and easy** way to explore **vector search**, the Playground helps users visualize their documents, manage indexes, and run search queries—all without writing extra code.

Once a developer has set up their MongoDB Atlas cluster and ingested data, they can launch the Playground with a single command:

```sh
npx mongodb-rag playground
```

This command spins up a UI where developers can **view documents**, **manage vector indexes**, and **perform vector searches**, making it a powerful tool for experimentation and debugging.

---

## 🔧 Getting Started with the Playground

To take full advantage of the Playground, follow these steps:

### 1️⃣ Initialize MongoDB-RAG
First, install the `mongodb-rag` package if you haven’t already:

```sh
npm install mongodb-rag dotenv
```

Then, initialize a configuration file:

```sh
npx mongodb-rag init
```

This will generate a `.mongodb-rag.json` file where you can specify your **MongoDB connection string**, database name, and collection name.

### 2️⃣ Ingest Data
Before running vector search, you need to ingest documents. This can be done using:

```sh
npx mongodb-rag ingest --file data.json
```

or by uploading a document directly from the Playground UI.

### 3️⃣ Create a Vector Search Index
Once the data is loaded, create an **Atlas Vector Search Index** using:

```sh
npx mongodb-rag create-index
```

Alternatively, you can manage indexes from within the Playground UI.

### 4️⃣ Launch the Playground
With the dataset and vector index in place, start the Playground:

```sh
npx mongodb-rag playground
```

This command launches a **local UI**, allowing you to explore your data in real time.

---

## 🖥️ Features of the Playground

### 📂 Document Viewer
- Browse your stored documents with ease.
- Quickly inspect metadata, embeddings, and content.

### 🔍 Search Panel
- Run **vector search queries** directly from the UI.
- Experiment with different similarity metrics (cosine, dot-product, Euclidean).

### ⚙️ Index Management
- View existing indexes.
- Create new **vector search indexes**.
- Configure embedding models and dimensions.

### 📡 Live Updates
- Real-time indexing and search updates via **WebSockets**.
- Instant feedback on configuration changes.

---

## 🔥 Why Use the Playground?

- **No need to build a frontend** – The Playground provides an out-of-the-box UI for MongoDB vector search.
- **Debugging made easy** – Quickly inspect documents and indexes without writing queries manually.
- **Seamless experimentation** – Tweak search parameters and embeddings dynamically.

---

## 🎯 Try It Today
The **MongoDB-RAG Playground** is the fastest way to interact with **MongoDB Atlas Vector Search**. Whether you're building an **AI-powered search** engine or testing **RAG (Retrieval-Augmented Generation)** workflows, the Playground gives you full control over your data and indexes in a simple UI.

Ready to get started?

Run:

```sh
npx mongodb-rag playground
```

And start exploring the power of **MongoDB Vector Search** today! 🚀

