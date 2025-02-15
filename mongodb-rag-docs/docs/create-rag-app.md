---
id: create-rag-app
title: Creating a RAG Application
sidebar_label: Create RAG App
---

# Creating a MongoDB RAG Application

The MongoDB RAG CLI provides a powerful `create-rag-app` command that helps you quickly scaffold a complete RAG (Retrieval Augmented Generation) application with both frontend and backend components.

![MongoDB RAG Application Interface](/img/rag-app-screenshot.png)

## Quick Start

This command creates a new directory `my-rag-app` with a fully configured RAG application.

## Project Structure

The generated application includes:

## Setup

1. Navigate to your project directory:
   ```bash
   cd my-rag-app
   ```

2. Configure your environment variables in `backend/.env`:
   ```bash
   MONGODB_URI=your_mongodb_uri
   OPENAI_API_KEY=your_openai_key
   ```

3. Install dependencies and start the application:
   ```bash
   # Install backend dependencies
   cd backend && npm install
   
   # Install frontend dependencies
   cd ../frontend && npm install
   
   # Start both frontend and backend (from root directory)
   npm run dev
   ```

## Features

### Backend
- Express.js server with MongoDB integration
- Pre-configured RAG endpoints
- Document processing and vector storage
- Streaming chat responses
- Error handling middleware

### Frontend
- Modern React UI with Material-UI
- Interactive chat interface
- Document upload and management
- Real-time search results
- Mobile-responsive design

## API Endpoints

The backend exposes these REST API endpoints:

- `POST /api/documents` - Upload and process documents
- `POST /api/chat` - Send questions and receive AI-generated responses
- `GET /api/search` - Perform vector similarity search
- `GET /api/documents` - Retrieve processed documents

## Customization

You can customize the application by:

- Adjusting vector search parameters in `backend/src/config/ragConfig.js`
- Modifying UI components in the frontend
- Adding authentication and authorization
- Implementing domain-specific features

![RAG App Architecture](/img/rag-app-architecture.png)

## Next Steps

1. Deploy your application
2. Add your documents to the system
3. Customize the UI to match your brand
4. Implement user authentication
5. Add features specific to your use case

For more detailed information about MongoDB RAG, visit the [main documentation](./README.md).