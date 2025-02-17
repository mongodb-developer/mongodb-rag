// src/cli/playground.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import open from 'open';
import { MongoRAG } from '../index.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Current directory:', __dirname);
console.log('Process working directory:', process.cwd());

const upload = multer({ storage: multer.memoryStorage() });

export async function startPlayground() {
  const app = express();
  const PORT = 4000;
  const server = createServer(app);
  const io = new Server(server, { cors: { origin: '*' } });

  app.use(express.json());
  app.use(cors());

  let mongodbUrl = process.env.MONGODB_URI;
  let databaseName = 'playground';
  let collectionName = 'documents';

  const configPath = path.join(process.cwd(), '.mongodb-rag.json');
  console.log('Looking for config file at:', configPath);

  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      mongodbUrl = config.mongoUrl || mongodbUrl;
      databaseName = config.database || databaseName;
      collectionName = config.collection || collectionName;
    } catch (error) {
      console.error("❌ Error reading .mongodb-rag.json:", error.message);
    }
  }

  // Initialize RAG with configuration
  try {
    const rag = new MongoRAG({
      mongoUrl: mongodbUrl,
      database: databaseName,
      collection: collectionName,
      embedding: {
        provider: process.env.EMBEDDING_PROVIDER || 'openai',
        apiKey: process.env.EMBEDDING_API_KEY,
        model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
        dimensions: 1536
      }
    });
    
    await rag.connect();
    console.log('✅ Successfully connected to MongoDB');
  } catch (error) {
    console.error("⚠️ MongoDB Connection Error:", error.message);
    console.log("ℹ️ Playground will start with limited functionality");
  }

  // Modify API endpoints to handle case where rag is null
  app.post('/api/save-config', (req, res) => {
    fs.writeFileSync('.mongodb-rag.json', JSON.stringify(req.body, null, 2));
    res.json({ message: "Configuration saved successfully!" });
  });

  app.post('/api/ingest', upload.single('file'), async (req, res) => {
    if (!rag) {
      return res.status(503).json({ 
        error: "MongoDB connection not available",
        message: "Please check your MongoDB connection settings and try again"
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      let jsonData;
      const fileType = req.file.mimetype;
      const fileContent = req.file.buffer.toString();

      if (fileType === "application/json") {
        jsonData = JSON.parse(fileContent);
      } else if (fileType === "text/markdown" || fileType === "text/plain") {
        jsonData = fileContent.split("\n").map(line => ({ content: line.trim() })).filter(line => line.content);
      } else if (fileType === "application/pdf") {
        const parsedPDF = await pdfParse(req.file.buffer).catch(() => ({ text: "" }));
        jsonData = parsedPDF.text.split("\n").map(line => ({ content: line.trim() })).filter(line => line.content);
      } else {
        return res.status(400).json({ error: "Unsupported file format. Please upload a JSON, Markdown, or PDF file." });
      }

      if (!Array.isArray(jsonData)) {
        return res.status(400).json({ error: "Uploaded file must contain an array of documents or lines." });
      }

      const result = await rag.ingestBatch(jsonData);
      io.emit('update', { message: "New documents indexed!" });
      res.json({ message: "Documents indexed successfully!", result });
    } catch (error) {
      res.status(500).json({ error: "Invalid file format" });
    }
  });

  app.get('/api/documents', async (req, res) => {
    if (!rag) {
      return res.status(503).json({ 
        error: "MongoDB connection not available",
        message: "Please check your MongoDB connection settings and try again"
      });
    }

    try {
      const limit = parseInt(req.query.limit) || 10;
      const skip = parseInt(req.query.skip) || 0;
      
      const documents = await rag.listDocuments({ limit, skip });
      res.json({ documents });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/search', async (req, res) => {
    if (!rag) {
      return res.status(503).json({ 
        error: "MongoDB connection not available",
        message: "Please check your MongoDB connection settings and try again"
      });
    }

    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query text required" });
    }

    try {
      console.log('Executing search with query:', query);
      const results = await rag.search(query);
      console.log('Search results:', results);
      res.json({ results });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/config', (req, res) => {
    try {
      // First try to read from .mongodb-rag.json
      const configPath = path.join(process.cwd(), '.mongodb-rag.json');
      let config = {};
      
      if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      }

      // Merge with environment variables, preferring env vars when they exist
      const mergedConfig = {
        mongoUrl: process.env.MONGODB_URI || config.mongoUrl,
        database: process.env.MONGODB_DATABASE || config.database,
        collection: process.env.MONGODB_COLLECTION || config.collection,
        provider: process.env.EMBEDDING_PROVIDER || config.provider,
        apiKey: process.env.EMBEDDING_API_KEY || config.apiKey,
        model: process.env.EMBEDDING_MODEL || config.model,
        dimensions: config.dimensions || 1536,
        batchSize: config.embedding?.batchSize || 100,
        maxResults: config.search?.maxResults || 5,
        minScore: config.search?.minScore || 0.7,
        indexName: process.env.VECTOR_INDEX || config.indexName
      };

      // Remove sensitive information before sending to client
      const sanitizedConfig = { ...mergedConfig };
      if (sanitizedConfig.apiKey) {
        sanitizedConfig.apiKey = '********'; // Mask the API key
      }

      res.json(sanitizedConfig);
    } catch (error) {
      console.error('Error reading configuration:', error);
      res.status(500).json({ 
        error: 'Failed to read configuration',
        message: error.message 
      });
    }
  });

  app.get('/api/download/config', (req, res) => {
    try {
      const configPath = path.join(process.cwd(), '.mongodb-rag.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=.mongodb-rag.json');
        res.send(JSON.stringify(config, null, 2));
      } else {
        res.status(404).json({ error: 'Configuration file not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to download configuration' });
    }
  });

  app.get('/api/download/env', (req, res) => {
    try {
      const envContent = [
        `MONGODB_URI="${process.env.MONGODB_URI || ''}"`,
        `MONGODB_DATABASE="${process.env.MONGODB_DATABASE || ''}"`,
        `MONGODB_COLLECTION="${process.env.MONGODB_COLLECTION || ''}"`,
        `EMBEDDING_PROVIDER="${process.env.EMBEDDING_PROVIDER || ''}"`,
        `EMBEDDING_API_KEY="${process.env.EMBEDDING_API_KEY || ''}"`,
        `EMBEDDING_MODEL="${process.env.EMBEDDING_MODEL || ''}"`,
        `VECTOR_INDEX="${process.env.VECTOR_INDEX || ''}"`,
      ].join('\n');

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename=.env');
      res.send(envContent);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate .env file' });
    }
  });

  app.get('/api/indexes', async (req, res) => {
    if (!rag) {
      return res.status(503).json({ 
        error: "MongoDB connection not available",
        message: "Please check your MongoDB connection settings and try again"
      });
    }

    try {
      const client = await rag.getClient();
      const collection = client.db(rag.database).collection(rag.collection);

      // Get vector search indexes
      const searchIndexes = await collection.aggregate([
        { $listSearchIndexes: {} }
      ]).toArray();

      // Get regular indexes
      const regularIndexes = await collection.indexes();

      res.json({ 
        searchIndexes, 
        regularIndexes,
        database: rag.database,
        collection: rag.collection
      });
    } catch (error) {
      console.error('Error retrieving indexes:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Add this new endpoint for creating vector search indexes
  app.post('/api/indexes/create', async (req, res) => {
    if (!rag) {
      return res.status(503).json({ 
        error: "MongoDB connection not available",
        message: "Please check your MongoDB connection settings and try again"
      });
    }

    try {
      const { name, dimensions, path, similarity } = req.body;
      const client = await rag.getClient();
      const collection = client.db(rag.database).collection(rag.collection);

      const indexConfig = {
        name: name || "vector_index",
        type: "vectorSearch",
        definition: {
          fields: [{
            type: "vector",
            path: path || "embedding",
            numDimensions: dimensions || 1536,
            similarity: similarity || "cosine"
          }]
        }
      };

      const result = await collection.createSearchIndex(indexConfig);
      res.json({ 
        success: true,
        message: "Vector search index created successfully",
        indexName: indexConfig.name,
        result 
      });
    } catch (error) {
      console.error('Error creating index:', error);
      res.status(500).json({ error: error.message });
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  server.listen(PORT, () => {
    console.log(`🚀 Playground backend running at http://localhost:${PORT}`);
  });

  // Serve the React UI with enhancements
  const frontendPath = path.join(__dirname, '../playground-ui/build');
  if (!fs.existsSync(frontendPath)) {
    console.error("⚠️ Frontend build not found. Running build...");
    execSync('cd src/playground-ui && npm run build', { stdio: 'inherit' });
  }

  const uiApp = express();
  uiApp.use(express.static(frontendPath));

  uiApp.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });

  uiApp.listen(3000, () => {
    console.log(`🚀 Playground UI running at http://localhost:3000`);
    open(`http://localhost:3000`);
  });
}
