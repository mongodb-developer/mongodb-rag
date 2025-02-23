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
import detect from 'detect-port'; // Library to find available ports

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Properly resolve playground UI paths based on how the package is installed
const findPlaygroundUiPath = () => {
  // Possible locations for playground-ui based on different installation scenarios
  const possiblePaths = [
    // When installed as a dependency in node_modules
    path.resolve(__dirname, '../../src/playground-ui'),

    // When running from source/development environment
    path.resolve(__dirname, '../playground-ui'),

    // When globally installed
    path.resolve(process.env.npm_config_prefix || '/usr/local', 'lib/node_modules/mongodb-rag/src/playground-ui')
  ];

  for (const potentialPath of possiblePaths) {
    if (fs.existsSync(potentialPath)) {
      // console.log(`✅ Found playground UI at: ${potentialPath}`);
      return potentialPath;
    }
  }

  console.warn('⚠️ Could not locate playground-ui directory');
  return null;
};

const PLAYGROUND_UI_PATH = findPlaygroundUiPath();

const DEFAULT_BACKEND_PORT = 4000;
const DEFAULT_FRONTEND_PORT = 3000;

// Use environment variables or fallback
let backendPort = process.env.BACKEND_PORT || DEFAULT_BACKEND_PORT;
let playgroundPort = process.env.PLAYGROUND_PORT || DEFAULT_FRONTEND_PORT;

// Function to find an available port if the default is in use
const findAvailablePort = async (preferredPort, defaultPort) => {
  const availablePort = await detect(preferredPort);
  return availablePort === preferredPort ? preferredPort : await detect(defaultPort);
};

console.log('Current directory:', __dirname);
console.log('Process working directory:', process.cwd());

const upload = multer({ storage: multer.memoryStorage() });

export async function startPlayground() {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, { cors: { origin: '*' } });

  app.use(express.json());
  app.use(cors());

  let mongodbUrl = process.env.MONGODB_URI;
  let databaseName = 'playground';
  let collectionName = 'documents';

  const configPath = path.join(process.cwd(), '.mongodb-rag.json');

  console.log("🔍 Looking for config file at:", configPath);
  console.log("🔍 Current Working Directory:", process.cwd());

  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      console.log("✅ Loaded Configuration from File:", config);

      mongodbUrl = config.mongoUrl || mongodbUrl;
      databaseName = config.database || databaseName;
      collectionName = config.collection || collectionName;

      console.log("📌 Loaded MongoDB URL:", mongodbUrl);
      console.log("📌 Loaded Database Name:", databaseName);
      console.log("📌 Loaded Collection Name:", collectionName);
    } catch (error) {
      console.error("❌ Error reading .mongodb-rag.json:", error.message);
    }
  } else {
    console.warn("🚨 Config file not found at:", configPath);
  }

  console.log("📌 Final MongoDB URL:", mongodbUrl);
  console.log("📌 Final Database Name:", databaseName);
  console.log("📌 Final Collection Name:", collectionName);

  // Declare rag here to ensure it's in scope for all routes
  let rag = null;

  // Initialize RAG with configuration
  try {
    console.log("🟢 Before initializing MongoRAG:");
    console.log("   📌 MongoDB URL:", mongodbUrl);
    console.log("   📌 Database Name:", databaseName);
    console.log("   📌 Collection Name:", collectionName);

    rag = new MongoRAG({
      mongoUrl: mongodbUrl,
      database: databaseName,
      collection: collectionName,
      embedding: {
        provider: process.env.EMBEDDING_PROVIDER || 'ollama',
        apiKey: process.env.EMBEDDING_API_KEY,
        model: process.env.EMBEDDING_MODEL || 'llama3',
        dimensions: 1536,
        baseUrl: process.env.EMBEDDING_BASE_URL || 'http://localhost:11434'
      }
    });

    console.log("✅ MongoRAG Final Config:", JSON.stringify(rag.config, null, 2));
    console.log("✅ After initializing MongoRAG:");
    console.log("   📌 Database in rag.config:", rag.config.database);
    console.log("   📌 Collection in rag.config:", rag.config.collection);

    await rag.connect();
    console.log('✅ Successfully connected to MongoDB');
  } catch (error) {
    console.error("⚠️ MongoDB Connection Error:", error.message);
    console.info("ℹ️ Playground will start with limited functionality");
  }

  // API endpoints...
  app.post('/api/save-config', (req, res) => {
    fs.writeFileSync('.mongodb-rag.json', JSON.stringify(req.body, null, 2));
    res.json({ message: "Configuration saved successfully!" });
  });

  app.get("/api/config", (req, res) => {
    if (!rag) {
      return res.status(503).json({ error: "MongoDB connection not available" });
    }

    res.json({
      mongoUrl: rag.config.mongoUrl || "Unknown",
      database: rag.config.database || "Unknown",
      collection: rag.config.collection || "Unknown",
      provider: rag.config.embedding.provider || "Unknown",
      apiKey: rag.config.embedding.apiKey || "Unknown",
      model: rag.config.embedding.model || "Unknown",
      dimensions: rag.config.embedding.dimensions || 1536,
      batchSize: rag.config.embedding.batchSize || 100,
      maxResults: rag.config.search.maxResults || 5,
      minScore: rag.config.search.minScore || 0.7,
      indexName: rag.config.indexName || "vector_index",
      embeddingFieldPath: rag.config.embeddingFieldPath || "embedding"
    });
  });


  app.post("/api/config", (req, res) => {
    const newConfig = req.body;

    // Update rag.config
    rag.config.database = newConfig.database;
    rag.config.collection = newConfig.collection;
    rag.config.embeddingFieldPath = newConfig.embeddingFieldPath || "embedding";
    rag.config.indexName = newConfig.indexName;

    // Save to file (so changes persist)
    fs.writeFileSync(".mongodb-rag.json", JSON.stringify(newConfig, null, 2));

    res.json(newConfig);
  });
  // Add this new endpoint for creating vector search indexes
  app.post('/api/indexes/create', async (req, res) => {
    const existingIndexes = await collection.listIndexes().toArray();
    if (existingIndexes.some(idx => idx.name === name)) {
      return res.status(400).json({ error: "Index already exists" });
    }
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

  // Add this endpoint to fetch documents
  app.get('/api/documents', async (req, res) => {
    if (!rag) {
      return res.status(503).json({ error: "MongoDB connection not available" });
    }

    try {
      const client = await rag.getClient();
      const collection = client.db(rag.config.database).collection(rag.config.collection);
      const documents = await collection.find({}).toArray();
      res.json({ documents });
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Add this endpoint to fetch indexes
  app.get('/api/indexes', async (req, res) => {
    if (!rag) {
      return res.status(503).json({ error: "MongoDB connection not available" });
    }

    try {
      const client = await rag.getClient();
      console.log("Using database for indexes:", rag.config.database);
      console.log("Using collection for indexes:", rag.config.collection);

      const collection = client.db(rag.config.database).collection(rag.config.collection);

      // Fetch regular indexes
      console.log("Fetching regular indexes...");
      const regularIndexes = await collection.listIndexes().toArray();
      console.log("Regular indexes fetched:", regularIndexes);

      // Fetch search indexes
      console.log("Fetching search indexes...");
      const searchIndexes = await collection.aggregate([
        { $listSearchIndexes: {} }
      ]).toArray();
      console.log("Search indexes fetched:", searchIndexes);

      res.json({ regularIndexes, searchIndexes });
    } catch (error) {
      console.error('Error fetching indexes:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Add this endpoint to handle search queries
  app.post('/api/search', async (req, res) => {
    if (!rag) {
      return res.status(503).json({ error: "MongoDB connection not available" });
    }

    const { query } = req.body;

    try {
      const client = await rag.getClient();
      const collection = client.db(rag.config.database).collection(rag.config.collection);

      // Perform a search using the query
      const results = await collection.find({ $text: { $search: query } }).toArray();
      res.json({ results });
    } catch (error) {
      console.error('Error performing search:', error);
      res.status(500).json({ error: error.message });
    }
  });

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  // Start the backend server
  backendPort = await findAvailablePort(backendPort, DEFAULT_BACKEND_PORT);
  server.listen(backendPort, () => {
    console.log(`🚀 Playground backend running at http://localhost:${backendPort}`);
  });

  // Serve the React UI with proper path resolution and build process
  if (PLAYGROUND_UI_PATH) {
    const frontendBuildPath = path.join(PLAYGROUND_UI_PATH, 'build');
    const frontendDistPath = path.join(PLAYGROUND_UI_PATH, 'dist');

    // Determine which directory to use (build or dist)
    let uiBuildPath = fs.existsSync(frontendBuildPath) ? frontendBuildPath :
      (fs.existsSync(frontendDistPath) ? frontendDistPath : null);

    if (!uiBuildPath) {
      console.warn("⚠️ Frontend build not found. Attempting to build...");
      try {
        // Check if package.json exists in the playground-ui directory
        const packageJsonPath = path.join(PLAYGROUND_UI_PATH, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
          throw new Error("package.json not found in playground-ui directory");
        }

        // Attempt to install dependencies and build
        execSync(`cd "${PLAYGROUND_UI_PATH}" && npm install && npm run build`, {
          stdio: 'inherit',
          timeout: 300000 // 5 minute timeout for build process
        });

        // Re-check build paths after building
        uiBuildPath = fs.existsSync(frontendBuildPath) ? frontendBuildPath :
          (fs.existsSync(frontendDistPath) ? frontendDistPath : null);

        if (!uiBuildPath) {
          throw new Error("Build completed but build directory not found");
        }
      } catch (error) {
        console.error(`⚠️ Failed to build frontend: ${error.message}`);
        console.info("ℹ️ Starting in API-only mode");
        return; // Exit frontend setup but keep backend running
      }
    }

    const uiApp = express();
    uiApp.use(express.static(uiBuildPath));

    uiApp.get('*', (req, res) => {
      res.sendFile(path.join(uiBuildPath, 'index.html'));
    });

    // Start the frontend server
    playgroundPort = await findAvailablePort(playgroundPort, DEFAULT_FRONTEND_PORT);
    uiApp.listen(playgroundPort, () => {
      console.log(`🚀 Playground UI running at http://localhost:${playgroundPort}`);
      open(`http://localhost:${playgroundPort}`);
    });
  } else {
    console.warn("⚠️ Playground UI components not found. Running in API-only mode.");
    console.info("ℹ️ You can still use the API endpoints at http://localhost:" + backendPort);
  }
}


















