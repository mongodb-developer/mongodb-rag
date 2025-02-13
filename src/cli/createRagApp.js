// src/cli/createRagApp.js
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { displayLogo } from './asciiLogo.js';

export function createRagApp(projectName) {
  const projectPath = path.resolve(process.cwd(), projectName);
  displayLogo();

  
  if (fs.existsSync(projectPath)) {
    console.error(chalk.red(`Error: Directory "${projectName}" already exists.`));
    process.exit(1);
  }

  console.log(chalk.green(`\n🚀 Creating a new RAG app in ${projectPath}\n`));
  fs.mkdirSync(projectPath, { recursive: true });

  // Step 1: Create package.json
  fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify({
    name: projectName,
    version: "1.0.0",
    main: "server.js",
    scripts: {
      start: "node server.js",
      dev: "nodemon server.js"
    },
    dependencies: {
      express: "^4.18.2",
      mongodb: "^6.3.0",
      dotenv: "^16.0.3",
      cors: "^2.8.5",
      "mongodb-rag": "^0.15.0"
    }
  }, null, 2));

  // Step 2: Create .env file with corrected variables
  fs.writeFileSync(path.join(projectPath, '.env'), `
MONGODB_URI=mongodb+srv://your_user:your_password@your-cluster.mongodb.net/mongorag
PORT=5000

# Embedding Configuration
EMBEDDING_PROVIDER=openai  # Options: openai, deepseek
EMBEDDING_API_KEY=your-embedding-api-key
EMBEDDING_MODEL=text-embedding-3-small  # Adjust for different providers

# MongoDB Vector Search Index
VECTOR_INDEX=default
  `);

  // Step 3: Create server.js with environment-aware embedding configuration
  fs.writeFileSync(path.join(projectPath, 'server.js'), `
import express from 'express';
import cors from 'cors';
import { MongoRAG } from 'mongodb-rag';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const rag = new MongoRAG({
  mongoUrl: process.env.MONGODB_URI,
  database: "mongorag",
  collection: "documents",
  embedding: {
    provider: process.env.EMBEDDING_PROVIDER || "openai",
    apiKey: process.env.EMBEDDING_API_KEY,
    model: process.env.EMBEDDING_MODEL || "text-embedding-3-small",
    dimensions: 1536
  },
  indexName: process.env.VECTOR_INDEX || "default"
});

// Ingest Documents
app.post('/ingest', async (req, res) => {
  const { documents } = req.body;
  const result = await rag.ingestBatch(documents);
  res.json(result);
});

// Search Documents
app.get('/search', async (req, res) => {
  const { query } = req.query;
  const results = await rag.search(query, { maxResults: 5 });
  res.json(results);
});

// Delete a document
app.delete('/delete/:id', async (req, res) => {
  const col = await rag._getCollection();
  await col.deleteOne({ documentId: req.params.id });
  res.json({ message: 'Deleted successfully' });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(\`🚀 Server running on port \${process.env.PORT || 5000}\`);
});
  `);

  // Step 4: Install dependencies
  console.log(chalk.blue(`\n📦 Installing dependencies...\n`));
  execSync(`cd ${projectPath} && npm install`, { stdio: 'inherit' });

  console.log(chalk.green(`\n✅ Project created successfully!`));
  console.log(chalk.yellow(`\nNext steps:`));
  console.log(chalk.cyan(`  cd ${projectName}`));
  console.log(chalk.cyan(`  npm run dev`));
}
