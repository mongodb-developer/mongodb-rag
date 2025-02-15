// bin/commands/init/createRagApp.js
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { displayLogo } from '../../../src/cli/asciiLogo.js';
import MongoSpinner from '../../../src/cli/spinner.js';
import { celebrate } from '../../../src/cli/celebration.js';
import FunProgressBar from '../../../src/cli/progressBar.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import net from 'net';

async function findAvailablePort(startPort) {
  const isPortAvailable = (port) => {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.listen(port, () => {
        server.once('close', () => resolve(true));
        server.close();
      });
      server.on('error', () => resolve(false));
    });
  };

  let port = startPort;
  while (!(await isPortAvailable(port))) {
    port++;
  }
  return port;
}

function generateReadme(projectName) {
  return `# ${projectName}

This RAG (Retrieval Augmented Generation) application was created with [mongodb-rag](https://npmjs.com/package/mongodb-rag).

## Getting Started

1. Configure your environment variables in \`.env\`:
   - Set your MongoDB connection string
   - Configure your embedding provider (OpenAI or Ollama)
   - Adjust other settings as needed

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development servers:
\`\`\`bash
npm run dev    # Starts both frontend and backend
\`\`\`

## Project Structure

\`\`\`
${projectName}/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/           # Express backend
│   ├── config/
│   ├── server.js
│   └── package.json
├── .env              # Environment variables
└── package.json      # Root workspace
\`\`\`

## Available CLI Commands

The mongodb-rag CLI provides several commands to manage your RAG application:

### Configuration
- \`npx mongodb-rag init\` - Initialize configuration
- \`npx mongodb-rag test-connection\` - Test provider connection
- \`npx mongodb-rag show-config\` - Display current configuration

### Document Management
- \`npx mongodb-rag ingest --file <path>\` - Ingest a single file
- \`npx mongodb-rag ingest --directory <path>\` - Ingest a directory of files
  - Options:
    - \`--recursive\` - Process subdirectories
    - \`--chunk-size <number>\` - Tokens per chunk
    - \`--chunk-overlap <number>\` - Overlap between chunks
    - \`--chunk-method <method>\` - Chunking strategy (fixed/recursive/semantic)

### Search
- \`npx mongodb-rag search "your query"\` - Search documents

## API Endpoints

- POST \`/api/ingest\` - Ingest documents
- GET \`/api/search?query=<text>\` - Search documents
- DELETE \`/api/documents/:id\` - Delete a document

## Documentation

For detailed documentation, visit:
- [MongoDB RAG Documentation](https://mongodb-developer.github.io/mongodb-rag)
- [MongoDB Vector Search](https://www.mongodb.com/docs/atlas/atlas-vector-search/)
`;
}

function createBackendFiles(projectPath, backendPort) {
  // Create backend directory structure
  fs.mkdirSync(path.join(projectPath, 'backend'), { recursive: true });
  fs.mkdirSync(path.join(projectPath, 'backend', 'config'), { recursive: true });

  // Create backend package.json
  fs.writeFileSync(path.join(projectPath, 'backend', 'package.json'), JSON.stringify({
    name: `${path.basename(projectPath)}-backend`,
    version: "1.0.0",
    type: "module",
    scripts: {
      "start": "node server.js",
      "dev": "nodemon server.js"
    },
    dependencies: {
      "express": "^4.18.2",
      "mongodb": "^6.3.0",
      "dotenv": "^16.0.3",
      "cors": "^2.8.5",
      "mongodb-rag": "latest",
      "nodemon": "^3.0.2"
    }
  }, null, 2));

  // Create backend config
  fs.writeFileSync(path.join(projectPath, 'backend', 'config', 'dbConfig.js'), `
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  mongoUrl: process.env.MONGODB_URI,
  database: process.env.MONGODB_DATABASE || "mongorag",
  collection: process.env.MONGODB_COLLECTION || "documents",
  embedding: {
    provider: process.env.EMBEDDING_PROVIDER || "openai",
    apiKey: process.env.EMBEDDING_API_KEY,
    model: process.env.EMBEDDING_MODEL || "text-embedding-3-small",
    dimensions: parseInt(process.env.EMBEDDING_DIMENSIONS || "1536", 10)
  },
  indexName: process.env.VECTOR_INDEX || "default",
  maxResults: parseInt(process.env.MAX_RESULTS || "5", 10)
};

// Validate configuration
if (!config.mongoUrl) {
  throw new Error('MONGODB_URI is required in .env file');
}

if (!config.embedding.apiKey && config.embedding.provider !== 'ollama') {
  throw new Error('EMBEDDING_API_KEY is required in .env file unless using Ollama');
}
`);

  // Create backend .env file
  fs.writeFileSync(path.join(projectPath, 'backend', '.env'), `# MongoDB Connection
MONGODB_URI=mongodb+srv://your_user:your_password@your-cluster.mongodb.net/mongorag
MONGODB_DATABASE=mongorag
MONGODB_COLLECTION=documents
PORT=${backendPort}

# Embedding Configuration
EMBEDDING_PROVIDER=openai  # Options: openai, ollama
EMBEDDING_API_KEY=your-embedding-api-key
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIMENSIONS=1536

# Vector Search Configuration
VECTOR_INDEX=default
MAX_RESULTS=5
`);

  // Create backend server.js
  fs.writeFileSync(path.join(projectPath, 'backend', 'server.js'), `
import express from 'express';
import cors from 'cors';
import { MongoRAG } from 'mongodb-rag';
import { config } from './config/dbConfig.js';

const app = express();
const PORT = 4001;  // Hardcode the port for now

app.use(cors());
app.use(express.json());

// Initialize RAG with better error handling
let rag;
try {
  rag = new MongoRAG(config);
} catch (error) {
  console.error('Failed to initialize MongoRAG:', error);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    ragInitialized: !!rag,
    config: {
      provider: config.embedding.provider,
      database: config.database,
      collection: config.collection,
      indexName: config.indexName
    }
  });
});

// Search Documents
app.get('/api/search', async (req, res) => {
  try {
    // Check if RAG is initialized
    if (!rag) {
      console.error('RAG not initialized. Current config:', config);
      return res.status(500).json({ 
        error: 'RAG system not initialized. Check your configuration.',
        config: {
          provider: config.embedding.provider,
          hasApiKey: !!config.embedding.apiKey,
          database: config.database,
          collection: config.collection
        }
      });
    }

    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const results = await rag.search(query, { maxResults: config.maxResults });
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to perform search',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      config: {
        provider: config.embedding.provider,
        hasApiKey: !!config.embedding.apiKey,
        database: config.database,
        collection: config.collection
      }
    });
  }
});

// Ingest Documents
app.post('/api/ingest', async (req, res) => {
  try {
    const { documents } = req.body;
    const result = await rag.ingestBatch(documents);
    res.json(result);
  } catch (error) {
    console.error('Ingest error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a document
app.delete('/api/documents/:id', async (req, res) => {
  try {
    const col = await rag._getCollection();
    await col.deleteOne({ documentId: req.params.id });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
  if (!rag) {
    console.warn('⚠️  Warning: RAG system not initialized. Check your configuration:');
    console.warn('   - MONGODB_URI:', config.mongoUrl ? '✓ Set' : '✗ Missing');
    console.warn('   - EMBEDDING_PROVIDER:', config.embedding.provider);
    console.warn('   - EMBEDDING_API_KEY:', config.embedding.apiKey ? '✓ Set' : '✗ Missing');
  }
  console.log(\`📚 API Documentation:
  GET    /api/health           - Health check
  POST   /api/ingest          - Ingest documents
  GET    /api/search?query=   - Search documents
  DELETE /api/documents/:id   - Delete document\`);
});
`);
}

function createFrontendFiles(projectPath, backendPort, frontendPort) {
  // Create frontend directory structure
  fs.mkdirSync(path.join(projectPath, 'frontend'), { recursive: true });
  fs.mkdirSync(path.join(projectPath, 'frontend', 'src'), { recursive: true });
  fs.mkdirSync(path.join(projectPath, 'frontend', 'src', 'components'), { recursive: true });
  fs.mkdirSync(path.join(projectPath, 'frontend', 'public'), { recursive: true });

  // Create frontend package.json using Vite
  fs.writeFileSync(path.join(projectPath, 'frontend', 'package.json'), JSON.stringify({
    name: `${path.basename(projectPath)}-frontend`,
    version: "1.0.0",
    type: "module",
    scripts: {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview"
    },
    dependencies: {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "axios": "^1.6.2"
    },
    devDependencies: {
      "@vitejs/plugin-react": "^4.2.1",
      "vite": "^5.0.8"
    }
  }, null, 2));

  // Copy the MongoDB RAG logo from the installed package
  const packageDir = path.dirname(fileURLToPath(import.meta.url));
  // When installed via npm, the package will be in node_modules/mongodb-rag
  const logoPath = path.resolve(packageDir, '../../../node_modules/mongodb-rag/static/logo-square.png');
  
  // Create public directory if it doesn't exist
  const publicDir = path.join(projectPath, 'frontend', 'public');
  fs.mkdirSync(publicDir, { recursive: true });
  const logoDestPath = path.join(publicDir, 'logo-square.png');
  
  try {
    if (fs.existsSync(logoPath)) {
      fs.copyFileSync(logoPath, logoDestPath);
      console.log(chalk.green('✓ Logo copied successfully'));
    } else {
      // Try fallback path for local development
      const devLogoPath = path.resolve(packageDir, '../../../static/logo-square.png');
      if (fs.existsSync(devLogoPath)) {
        fs.copyFileSync(devLogoPath, logoDestPath);
        console.log(chalk.green('✓ Logo copied successfully (dev mode)'));
      } else {
        console.warn(chalk.yellow('⚠️ Logo file not found. Using fallback styling.'));
      }
    }
  } catch (error) {
    console.warn(chalk.yellow('⚠️ Could not copy logo file:', error.message));
  }

  // Create frontend components
  const components = {
    'Header.jsx': `
import React from 'react';

export function Header() {
  return (
    <header className="header">
      <div className="logo-container">
        <img src="/logo-square.png" alt="MongoDB RAG Logo" className="logo" />
        <h1>MongoDB RAG Application</h1>
      </div>
    </header>
  );
}`,
    'Footer.jsx': `
import React from 'react';

export function Footer() {
  return (
    <footer className="footer">
      <p>Built with <a href="https://npmjs.com/package/mongodb-rag">mongodb-rag</a></p>
    </footer>
  );
}`,
    'Chatbot.jsx': `
import React, { useState } from 'react';
import axios from 'axios';

export function Chatbot() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      // Use relative URL to leverage Vite's proxy configuration
      const response = await axios.get('/api/search', {
        params: { query: query.trim() }
      });
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
      setError(error.response?.data?.error || 'Failed to perform search. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !query.trim()}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="results">
        {results.length > 0 ? (
          results.map((result, index) => (
            <div key={index} className="result">
              <p>{result.content}</p>
              <small>Score: {result.score.toFixed(2)}</small>
            </div>
          ))
        ) : !loading && !error && query && (
          <p className="no-results">No results found. Try a different query.</p>
        )}
      </div>
    </div>
  );
}`
  };

  // Create component files
  Object.entries(components).forEach(([filename, content]) => {
    fs.writeFileSync(path.join(projectPath, 'frontend', 'src', 'components', filename), content);
  });

  // Create App.jsx
  fs.writeFileSync(path.join(projectPath, 'frontend', 'src', 'App.jsx'), `
import React from 'react';
import { Header } from './components/Header';
import { Chatbot } from './components/Chatbot';
import { Footer } from './components/Footer';
import './styles.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Chatbot />
      </main>
      <Footer />
    </div>
  );
}

export default App;
`);

  // Create styles.css with proper imports and reset
  fs.writeFileSync(path.join(projectPath, 'frontend', 'src', 'styles.css'), `
/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f5f5f5;
}

.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  min-height: 100vh;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.header .logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.header .logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.header h1 {
  color: #00684A;
  font-size: 1.8rem;
}

.chatbot {
  margin: 2rem 0;
}

.chatbot form {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.chatbot input {
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  transition: border-color 0.2s;
}

.chatbot input:focus {
  outline: none;
  border-color: #00684A;
}

.chatbot button {
  padding: 0.75rem 1.5rem;
  background: #00684A;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.chatbot button:hover {
  background: #005138;
}

.chatbot button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.results {
  margin-top: 2rem;
}

.result {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  margin-bottom: 1rem;
  border-radius: 8px;
  background: #f8f9fa;
  transition: transform 0.2s;
}

.result:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.result small {
  display: block;
  margin-top: 0.5rem;
  color: #666;
}

.footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
  color: #666;
}

.footer a {
  color: #00684A;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

.error-message {
  color: #dc3545;
  background: #f8d7da;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
}

.no-results {
  text-align: center;
  color: #666;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  font-style: italic;
}
`);

  // Create main.jsx
  fs.writeFileSync(path.join(projectPath, 'frontend', 'src', 'main.jsx'), `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`);

  // Create index.html with proper public path
  fs.writeFileSync(path.join(projectPath, 'frontend', 'index.html'), `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/x-icon" href="/logo-square.png">
    <title>MongoDB RAG App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`);

  // Create vite.config.js with dynamic backend port
  fs.writeFileSync(path.join(projectPath, 'frontend', 'vite.config.js'), `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The backend is running on port ${backendPort}
export default defineConfig({
  plugins: [react()],
  server: {
    port: ${frontendPort},
    proxy: {
      '/api': {
        target: 'http://localhost:4001',  // Hardcode the port for now
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy Error:', err.message);
          });
        }
      }
    }
  }
});
`);

  // Create a basic favicon (or you could copy an existing one)
  fs.writeFileSync(path.join(projectPath, 'frontend', 'public', 'favicon.ico'), '');
}

export async function createRagApp(projectName) {
  const spinner = new MongoSpinner();
  const progressBar = new FunProgressBar();
  
  // Display the ASCII logo
  displayLogo();
  
  const projectPath = path.resolve(process.cwd(), projectName);
  
  if (fs.existsSync(projectPath)) {
    console.error(chalk.red(`Error: Directory "${projectName}" already exists.`));
    process.exit(1);
  }

  console.log(chalk.green(`\n🚀 Creating a new RAG app in ${projectPath}\n`));
  
  try {
    // Find available ports
    const backendPort = await findAvailablePort(5000);
    const frontendPort = await findAvailablePort(3000);

    // Create project structure
    fs.mkdirSync(projectPath, { recursive: true });

    // Create backend with dynamic port
    console.log(chalk.blue('\n📁 Creating backend...'));
    createBackendFiles(projectPath, backendPort);
    
    // Create frontend with dynamic port configuration
    console.log(chalk.blue('\n📁 Creating frontend...'));
    createFrontendFiles(projectPath, backendPort, frontendPort);

    // Create root package.json for workspace
    fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify({
      name: projectName,
      version: "1.0.0",
      private: true,
      workspaces: ["frontend", "backend"],
      scripts: {
        "dev": "concurrently \"npm run dev -w frontend\" \"npm run dev -w backend\"",
        "build": "npm run build -w frontend",
        "start": "npm run start -w backend"
      },
      devDependencies: {
        "concurrently": "^8.2.2"
      }
    }, null, 2));

    // Install dependencies
    console.log(chalk.blue('\n📦 Installing dependencies...'));
    spinner.start('Installing packages');
    
    // Install root dependencies
    execSync(`cd ${projectPath} && npm install`, { stdio: 'inherit' });
    
    // Install frontend dependencies
    console.log(chalk.blue('\n📦 Installing frontend dependencies...'));
    execSync(`cd ${projectPath}/frontend && npm install`, { stdio: 'inherit' });
    
    // Install backend dependencies
    console.log(chalk.blue('\n📦 Installing backend dependencies...'));
    execSync(`cd ${projectPath}/backend && npm install`, { stdio: 'inherit' });
    
    spinner.stop(true);

    // Create README
    fs.writeFileSync(
      path.join(projectPath, 'README.md'),
      generateReadme(projectName)
    );

    // Show success message
    celebrate('Full-Stack RAG App Created Successfully! 🎉');

    console.log(chalk.green('\n✅ Project created successfully!'));
    console.log(chalk.yellow('\nNext steps:'));
    console.log(chalk.cyan(`  1. cd ${projectName}`));
    console.log(chalk.cyan('  2. Update backend/.env with your MongoDB and API credentials'));
    console.log(chalk.cyan('  3. npm run dev    # This will start both frontend and backend'));
    console.log(chalk.cyan('\nYour app will be available at:'));
    console.log(chalk.cyan(`  Frontend: http://localhost:${frontendPort}`));
    console.log(chalk.cyan(`  Backend:  http://localhost:${backendPort}`));

  } catch (error) {
    console.error(chalk.red('\n❌ Error creating project:'), error);
    process.exit(1);
  }
}