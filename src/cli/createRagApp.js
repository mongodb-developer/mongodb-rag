// src/cli/createRagApp.js
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { displayLogo } from './asciiLogo.js';
import MongoSpinner from './spinner.js';
import { celebrate } from './celebration.js';
import FunProgressBar from './progressBar.js';

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

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## Available CLI Commands

The mongodb-rag CLI provides several commands to manage your RAG application:

### Configuration
- \`npx mongodb-rag init\` - Initialize configuration
- \`npx mongodb-rag test-connection\` - Test provider connection
- \`npx mongodb-rag show-config\` - Display current configuration
- \`npx mongodb-rag edit-config\` - Modify configuration

### Vector Search Index Management
- \`npx mongodb-rag create-index\` - Create vector search index
- \`npx mongodb-rag show-indexes\` - List all indexes
- \`npx mongodb-rag delete-index\` - Remove an index

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
  - Options:
    - \`--maxResults <number>\` - Maximum results (default: 5)
    - \`--minScore <number>\` - Minimum similarity score (default: 0.7)

## API Endpoints

- POST \`/ingest\` - Ingest documents
- GET \`/search?query=<text>\` - Search documents
- DELETE \`/delete/:id\` - Delete a document

## Documentation

For detailed documentation, visit:
- [MongoDB RAG Documentation](https://mongodb-developer.github.io/mongodb-rag)
- [MongoDB Vector Search](https://www.mongodb.com/docs/atlas/atlas-vector-search/)

## License

This project is licensed under the MIT License.
`;
}

function createBackendFiles(projectPath) {
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
  database: "mongorag",
  collection: "documents",
  embedding: {
    provider: process.env.EMBEDDING_PROVIDER || "openai",
    apiKey: process.env.EMBEDDING_API_KEY,
    model: process.env.EMBEDDING_MODEL || "text-embedding-3-small",
    dimensions: 1536
  },
  indexName: process.env.VECTOR_INDEX || "default"
};
`);

  // Create backend server.js
  fs.writeFileSync(path.join(projectPath, 'backend', 'server.js'), `
import express from 'express';
import cors from 'cors';
import { MongoRAG } from 'mongodb-rag';
import { config } from './config/dbConfig.js';

const app = express();
app.use(express.json());
app.use(cors());

const rag = new MongoRAG(config);

// Ingest Documents
app.post('/api/ingest', async (req, res) => {
  try {
    const { documents } = req.body;
    const result = await rag.ingestBatch(documents);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search Documents
app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    const results = await rag.search(query, { maxResults: 5 });
    res.json(results);
  } catch (error) {
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
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
});
`);
}

function createFrontendFiles(projectPath) {
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

  // Create frontend components
  const componentFiles = {
    'Header.jsx': `
export function Header() {
  return (
    <header className="header">
      <h1>MongoDB RAG Application</h1>
    </header>
  );
}`,
    'Chatbot.jsx': `
import { useState } from 'react';
import axios from 'axios';

export function Chatbot() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get(\`http://localhost:5000/api/search?query=\${query}\`);
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="chatbot">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question..."
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      <div className="results">
        {results.map((result, index) => (
          <div key={index} className="result">
            <p>{result.content}</p>
            <small>Score: {result.score}</small>
          </div>
        ))}
      </div>
    </div>
  );
}`,
    'Footer.jsx': `
export function Footer() {
  return (
    <footer className="footer">
      <p>Built with <a href="https://npmjs.com/package/mongodb-rag">mongodb-rag</a></p>
    </footer>
  );
}`
  };

  // Create each component file
  Object.entries(componentFiles).forEach(([filename, content]) => {
    fs.writeFileSync(
      path.join(projectPath, 'frontend', 'src', 'components', filename),
      content
    );
  });

  // Create main App.jsx
  fs.writeFileSync(path.join(projectPath, 'frontend', 'src', 'App.jsx'), `
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

  // Create styles.css
  fs.writeFileSync(path.join(projectPath, 'frontend', 'src', 'styles.css'), `
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
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
  padding: 0.5rem;
  font-size: 1rem;
}

.chatbot button {
  padding: 0.5rem 1rem;
  background: #00684A;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.chatbot button:disabled {
  background: #ccc;
}

.results {
  margin-top: 2rem;
}

.result {
  padding: 1rem;
  border: 1px solid #ddd;
  margin-bottom: 1rem;
  border-radius: 4px;
}

.footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
}
`);

  // Create index.html
  fs.writeFileSync(path.join(projectPath, 'frontend', 'index.html'), `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MongoDB RAG App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`);

  // Create main.jsx
  fs.writeFileSync(path.join(projectPath, 'frontend', 'src', 'main.jsx'), `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`);
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
  
  // Start the creation process with spinner
  spinner.start('Initializing your RAG app');
  fs.mkdirSync(projectPath, { recursive: true });
  await new Promise(resolve => setTimeout(resolve, 1000));
  spinner.stop(true);

  // Show progress while creating files
  console.log(chalk.cyan('\nPreparing your MongoDB RAG environment...'));
  let currentProgress = 0;
  progressBar.update(currentProgress);

  // Create backend
  console.log(chalk.blue('\n📁 Creating backend...'));
  createBackendFiles(projectPath);
  
  // Create frontend
  console.log(chalk.blue('\n📁 Creating frontend...'));
  createFrontendFiles(projectPath);

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

  // Create root .env
  fs.writeFileSync(path.join(projectPath, '.env'), `
MONGODB_URI=mongodb+srv://your_user:your_password@your-cluster.mongodb.net/mongorag
PORT=5000

# Embedding Configuration
EMBEDDING_PROVIDER=openai
EMBEDDING_API_KEY=your-embedding-api-key
EMBEDDING_MODEL=text-embedding-3-small

# MongoDB Vector Search Index
VECTOR_INDEX=default
`);

  // Install dependencies
  console.log(chalk.blue('\n📦 Installing dependencies...'));
  execSync(`cd ${projectPath} && npm install`, { stdio: 'inherit' });

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
  console.log(chalk.cyan('  2. Update .env with your MongoDB and API credentials'));
  console.log(chalk.cyan('  3. npm run dev    # This will start both frontend and backend'));
}