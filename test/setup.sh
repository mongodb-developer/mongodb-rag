#!/bin/bash

# Create the directory structure
mkdir -p rag-workshop/{data/articles,src/utils,tests}

# Create package.json
cat <<EOL > rag-workshop/package.json
{
  "name": "rag-workshop",
  "version": "1.0.0",
  "description": "RAG application workshop with MongoDB Atlas",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "ingest": "node src/ingest.js",
    "search": "node src/search.js",
    "test": "jest"
  },
  "dependencies": {
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "mongodb-rag": "^0.53.0",
    "openai": "^4.10.0",
    "fs-extra": "^11.1.1"
  },
  "devDependencies": {
    "jest": "^29.6.2"
  }
}
EOL

# Create .env file
cat <<EOL > rag-workshop/.env
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
EOL

# Create sample data files
cat <<EOL > rag-workshop/data/articles/mongodb-atlas.md
# MongoDB Atlas: The Cloud Database Service

MongoDB Atlas is a fully-managed cloud database service developed by MongoDB. It handles all the complexity of deploying, managing, and healing your deployments on the cloud service provider of your choice (AWS, Azure, and GCP).

## Key Features

### Automated Deployment and Management
MongoDB Atlas automates deployment, maintenance, and scaling. You can deploy a cluster with a few clicks or API calls.

### Security
MongoDB Atlas provides multiple layers of security for your database:
- Network isolation with VPC peering
- IP whitelisting
- Advanced authentication
- Field-level encryption
- RBAC (Role-Based Access Control)
- LDAP integration

### Monitoring and Alerts
The service includes built-in monitoring tools and customizable alerts based on over a dozen different metrics.

### Automated Backups
Continuous backups with point-in-time recovery ensure your data is protected.

### Scaling Options
Scale up or down without application downtime. Auto-scaling provisions storage capacity automatically.

### Global Clusters
Create globally distributed clusters that route data to the closest available region to minimize latency.

## Integrations

MongoDB Atlas integrates with popular services and tools:
- AWS services (Lambda, SageMaker, etc.)
- Google Cloud (Firebase, DataFlow, etc.)
- Microsoft Azure services
- Kafka
- Kubernetes

## Atlas Vector Search

MongoDB Atlas Vector Search enables you to build vector search applications by storing embeddings and performing k-nearest neighbor (k-NN) search.

Key capabilities include:
- Store vector embeddings along with your operational data
- Build semantic search applications
- Power recommendation engines
- Implement AI-powered applications
EOL

cat <<EOL > rag-workshop/data/articles/rag-overview.md
# Retrieval-Augmented Generation (RAG): An Overview

Retrieval-Augmented Generation (RAG) is an AI framework that enhances large language models (LLMs) by retrieving relevant information from external knowledge sources to ground the model's responses in factual, up-to-date information.

## How RAG Works

The RAG process typically consists of three main stages:

1. **Retrieval**: The system queries a knowledge base to find information relevant to the input prompt
2. **Augmentation**: Retrieved information is added to the context provided to the LLM
3. **Generation**: The LLM generates a response based on both the prompt and the retrieved information

## Benefits of RAG

Retrieval-Augmented Generation offers several advantages:

### Reduced Hallucinations
By grounding responses in retrieved facts, RAG significantly reduces the tendency of LLMs to generate plausible-sounding but incorrect information.

### Up-to-date Information
RAG systems can access recent information beyond the LLM's training cutoff date, keeping responses current.

### Domain Specialization
RAG enables general-purpose LLMs to provide expert-level responses in specialized domains by retrieving domain-specific information.

### Transparency and Attribution
Information sources can be tracked and cited, improving transparency and trustworthiness.

### Cost Efficiency
Retrieving information can be more efficient than training ever-larger models to memorize more facts.

## Implementation Considerations

When implementing RAG, several factors must be considered:

### Knowledge Base Design
The structure, format, and organization of the knowledge base significantly impact retrieval effectiveness.

### Embedding Strategy
How documents are converted to vector embeddings affects search quality.

### Chunking Approach
The method used to divide documents into chunks can impact retrieval precision.

### Retrieval Algorithms
Different retrieval methods (BM25, vector search, hybrid approaches) have varying effectiveness depending on the use case.

### Context Window Management
Efficiently using the LLM's context window is essential for complex queries requiring multiple retrieved documents.

## Common Challenges

RAG implementations often face several challenges:

- Balancing retrieval precision and recall
- Handling contradictory information from multiple sources
- Managing context window limitations
- Addressing retrieval latency in real-time applications
EOL

cat <<EOL > rag-workshop/data/qa-pairs.json
[
  {
    "question": "What is MongoDB Atlas?",
    "expected_source": "mongodb-atlas.md"
  },
  {
    "question": "What security features does MongoDB Atlas offer?",
    "expected_source": "mongodb-atlas.md"
  },
  {
    "question": "How does RAG reduce hallucinations?",
    "expected_source": "rag-overview.md"
  },
  {
    "question": "What are the three main stages of RAG?",
    "expected_source": "rag-overview.md"
  },
  {
    "question": "What is Atlas Vector Search used for?",
    "expected_source": "mongodb-atlas.md"
  }
]
EOL

# Create configuration file
cat <<EOL > rag-workshop/src/config.js
require('dotenv').config();

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    database: process.env.MONGODB_DATABASE_NAME,
    collection: process.env.MONGODB_COLLECTION_NAME
  },
  embedding: {
    provider: process.env.EMBEDDING_PROVIDER || 'openai',
    apiKey: process.env.EMBEDDING_API_KEY,
    model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
    dimensions: 1536
  },
  search: {
    maxResults: 5,
    minScore: 0.7,
    returnSources: true
  }
};
EOL

# Create document ingestion script
cat <<EOL > rag-workshop/src/ingest.js
const fs = require('fs-extra');
const path = require('path');
const { MongoRAG, Chunker } = require('mongodb-rag');
const config = require('./config');

// Initialize MongoRAG
const rag = new MongoRAG({
  mongoUrl: config.mongodb.uri,
  database: config.mongodb.database,
  collection: config.mongodb.collection,
  embedding: config.embedding
});

// Create a chunker
const chunker = new Chunker({
  strategy: config.chunking.strategy,
  maxChunkSize: config.chunking.maxChunkSize,
  overlap: config.chunking.overlap
});

// Function to read and process markdown files
async function ingestMarkdownFiles(directory) {
  try {
    // Get all markdown files
    const files = await fs.readdir(directory);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    console.log(\`Found \${markdownFiles.length} markdown files to process\`);
    
    // Process each file
    for (const filename of markdownFiles) {
      const filePath = path.join(directory, filename);
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Create document object
      const document = {
        id: path.basename(filename, '.md'),
        content: content,
        metadata: {
          source: filename,
          type: 'markdown',
          created: new Date().toISOString(),
          filename: filename
        }
      };
      
      console.log(\`Processing \${filename}...\`);
      
      // Chunk the document
      const chunks = await chunker.chunkDocument(document);
      console.log(\`Created \${chunks.length} chunks from \${filename}\`);
      
      // Ingest the chunks
      const result = await rag.ingestBatch(chunks);
      console.log(\`Ingested \${result.processed} chunks from \${filename}\`);
    }
    
    console.log('Document ingestion complete!');
    
  } catch (error) {
    console.error('Error ingesting documents:', error);
  } finally {
    await rag.close();
  }
}

// Main function
async function main() {
  const articlesDir = path.join(__dirname, '../data/articles');
  
  console.log('Starting document ingestion...');
  console.log(\`Using \${config.chunking.strategy} chunking strategy\`);
  console.log(\`Max chunk size: \${config.chunking.maxChunkSize} characters\`);
  console.log(\`Chunk overlap: \${config.chunking.overlap} characters\`);
  
  await rag.connect();
  await ingestMarkdownFiles(articlesDir);
}

// Run the ingestion process
main().catch(console.error);
EOL

# Create vector search script
cat <<EOL > rag-workshop/src/search.js
const { MongoRAG } = require('mongodb-rag');
const config = require('./config');

// Initialize MongoRAG
const rag = new MongoRAG({
  mongoUrl: config.mongodb.uri,
  database: config.mongodb.database,
  collection: config.mongodb.collection,
  embedding: config.embedding,
  search: {
    maxResults: config.search.maxResults,
    minScore: config.search.minScore
  }
});

/**
 * Search for documents relevant to a query
 * @param {string} query - The search query
 * @param {Object} options - Search options
 * @returns {Promise<Array>} - Search results
 */
async function searchDocuments(query, options = {}) {
  try {
    await rag.connect();
    
    console.log(\`Searching for: "\${query}"\`);
    const results = await rag.search(query, {
      maxResults: options.maxResults || config.search.maxResults,
      filter: options.filter || {}
    });
    
    // Post-process results if needed
    const processedResults = results.map(result => {
      // Add source document if returnSources is enabled
      if (config.search.returnSources) {
        return {
          ...result,
          source: result.metadata?.filename || 'unknown'
        };
      }
      return result;
    });
    
    return processedResults;
    
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  } finally {
    await rag.close();
  }
}

// Export for use in other modules
module.exports = {
  searchDocuments
};

// If run directly, perform a test search
if (require.main === module) {
  const testQuery = process.argv[2] || 'What is MongoDB Atlas?';
  
  searchDocuments(testQuery)
    .then(results => {
      console.log(\`Found \${results.length} results:\`);
      results.forEach((result, i) => {
        console.log(\`\nResult \${i+1} (score: \${result.score.toFixed(4)}):\`);
        console.log(\`Source: \${result.source}\`);
        console.log(\`Content: \${result.content.substring(0, 150)}...\`);
      });
    })
    .catch(console.error);
}
EOL

# Create LLM response generation script
cat <<EOL > rag-workshop/src/generate.js
const { OpenAI } = require('openai');
const config = require('./config');
const { searchDocuments } = require('./search');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.llm.apiKey
});

/**
 * Generate a response using RAG
 * @param {string} query - User query
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} - Generated response and metadata
 */
async function generateResponse(query, options = {}) {
  try {
    // Step 1: Retrieve relevant documents
    const searchResults = await searchDocuments(query, {
      maxResults: options.maxResults || 3
    });
    
    if (searchResults.length === 0) {
      return {
        answer: "I couldn't find any relevant information to answer your question.",
        sources: []
      };
    }
    
    // Step 2: Format context from retrieved documents
    const context = searchResults
      .map(result => \`Source: \${result.source}\\nContent: \${result.content}\`)
      .join('\\n\\n');
    
    // Step 3: Create prompt with context
    const messages = [
      {
        role: 'system',
        content: \`You are a helpful assistant. Answer the user's question based ONLY on the provided context. 
                 If the context doesn't contain relevant information, say "I don't have enough information to answer that question."
                 Always cite your sources at the end of your answer.\`
      },
      {
        role: 'user',
        content: \`Context:\\n\${context}\\n\\nQuestion: \${query}\`
      }
    ];
    
    // Step 4: Generate response using LLM
    const completion = await openai.chat.completions.create({
      model: config.llm.model,
      messages: messages,
      temperature: options.temperature || 0.3,
      max_tokens: options.maxTokens || 500
    });
    
    // Step 5: Return formatted response with sources
    return {
      answer: completion.choices[0].message.content,
      sources: searchResults.map(result => ({
        source: result.source,
        score: result.score
      }))
    };
    
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

// Export for use in other modules
module.exports = {
  generateResponse
};

// If run directly, perform a test generation
if (require.main === module) {
  const testQuery = process.argv[2] || 'What are the security features of MongoDB Atlas?';
  
  generateResponse(testQuery)
    .then(response => {
      console.log('\\n🤖 Generated Answer:');
      console.log(response.answer);
      
      console.log('\\n📚 Sources:');
      response.sources.forEach((source, i) => {
        console.log(\`\${i+1}. \${source.source} (relevance: \${source.score.toFixed(4)})\`);
      });
    })
    .catch(console.error);
}
EOL

# Create main application script
cat <<EOL > rag-workshop/src/index.js
const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { generateResponse } = require('./generate');
const { searchDocuments } = require('./search');
const config = require('./config');

// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { query, maxResults } = req.query;
    
    if (!query) {
      return res.status(400).json({
        error: 'Missing required parameter: query'
      });
    }
    
    const results = await searchDocuments(query, {
      maxResults: maxResults ? parseInt(maxResults) : undefined
    });
    
    res.json({
      query,
      results
    });
    
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({
      error: 'An error occurred during search',
      message: error.message
    });
  }
});

// RAG endpoint
app.post('/api/rag', async (req, res) => {
  try {
    const { query, options } = req.body;
    
    if (!query) {
      return res.status(400).json({
        error: 'Missing required parameter: query'
      });
    }
    
    const response = await generateResponse(query, options);
    res.json(response);
    
  } catch (error) {
    console.error('RAG API error:', error);
    res.status(500).json({
      error: 'An error occurred during response generation',
      message: error.message
    });
  }
});

// Load and answer test questions
app.get('/api/test', async (req, res) => {
  try {
    const qaFilePath = path.join(__dirname, '../data/qa-pairs.json');
    const qaData = await fs.readJSON(qaFilePath);
    
    const results = [];
    
    for (const qa of qaData) {
      const response = await generateResponse(qa.question);
      
      // Check if the expected source appears in the sources
      const foundExpectedSource = response.sources.some(
        source => source.source.includes(qa.expected_source)
      );
      
      results.push({
        question: qa.question,
        answer: response.answer,
        expected_source: qa.expected_source,
        found_expected_source: foundExpectedSource,
        sources: response.sources
      });
    }
    
    res.json({
      total: qaData.length,
      correct_sources: results.filter(r => r.found_expected_source).length,
      results
    });
    
  } catch (error) {
    console.error('Test API error:', error);
    res.status(500).json({
      error: 'An error occurred during test',
      message: error.message
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`🚀 RAG application server running on port \${PORT}\`);
  console.log(\`📝 API Documentation:\`);
  console.log(\`   - GET  /healthz             Health check\`);
  console.log(\`   - GET  /api/search?query=X  Vector search\`);
  console.log(\`   - POST /api/rag              RAG response generation\`);
  console.log(\`   - GET  /api/test             Run test suite\`);
});
EOL

# Create a test script
cat <<EOL > rag-workshop/tests/app.test.js
const request = require('supertest');
const app = require('../src/index');

describe('RAG Application API', () => {
  it('should return OK for health check', async () => {
    const res = await request(app).get('/healthz');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('OK');
  });

  it('should return search results for a valid query', async () => {
    const res = await request(app).get('/api/search?query=What%20is%20MongoDB%20Atlas?');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('results');
  });

  it('should return a response for a valid RAG query', async () => {
    const res = await request(app)
      .post('/api/rag')
      .send({ query: 'What are the security features of MongoDB Atlas?' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('answer');
  });
});
EOL

echo "Project setup complete. Navigate to the 'rag-workshop' directory and run 'npm install' to install dependencies."
