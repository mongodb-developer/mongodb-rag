"use strict";(self.webpackChunkmongodb_rag_docs=self.webpackChunkmongodb_rag_docs||[]).push([[1116],{5393:function(e,n,s){s(6540),s(9382),s(9030),s(4848)},6097:function(e,n,s){s.r(n),s.d(n,{assets:function(){return c},contentTitle:function(){return i},default:function(){return u},frontMatter:function(){return a},metadata:function(){return t},toc:function(){return l}});var t=JSON.parse('{"id":"workshop/build-rag-app","title":"\ud83d\udc50 Building a RAG Application","description":"In this section, you\'ll build a complete RAG application that:","source":"@site/docs/workshop/build-rag-app.md","sourceDirName":"workshop","slug":"/workshop/build-rag-app","permalink":"/mongodb-rag/docs/workshop/build-rag-app","draft":false,"unlisted":false,"editUrl":"https://github.com/mongodb-developer/mongodb-rag/tree/main/mongodb-rag-docs/docs/workshop/build-rag-app.md","tags":[],"version":"current","frontMatter":{"id":"build-rag-app","title":"\ud83d\udc50 Building a RAG Application"},"sidebar":"docs","previous":{"title":"\ud83d\udc50 Creating Vector Embeddings","permalink":"/mongodb-rag/docs/workshop/create-embeddings"},"next":{"title":"\ud83d\udc50 Advanced RAG Techniques","permalink":"/mongodb-rag/docs/workshop/advanced-techniques"}}'),r=s(4848),o=s(8453);s(9382),s(5393);const a={id:"build-rag-app",title:"\ud83d\udc50 Building a RAG Application"},i="Building a Complete RAG Application",c={},l=[{value:"Project Structure",id:"project-structure",level:2},{value:"Setting Up Dependencies",id:"setting-up-dependencies",level:2},{value:"Creating Sample Data",id:"creating-sample-data",level:2},{value:"Configuration File",id:"configuration-file",level:2},{value:"Document Ingestion",id:"document-ingestion",level:2},{value:"Vector Search",id:"vector-search",level:2},{value:"LLM Response Generation",id:"llm-response-generation",level:2},{value:"Main Application",id:"main-application",level:2},{value:"Running the Application",id:"running-the-application",level:2},{value:"Testing the API",id:"testing-the-api",level:2},{value:"Search Endpoint",id:"search-endpoint",level:3},{value:"RAG Endpoint",id:"rag-endpoint",level:3},{value:"Test Suite",id:"test-suite",level:3},{value:"Evaluating Your RAG Application",id:"evaluating-your-rag-application",level:2},{value:"Next Steps",id:"next-steps",level:2}];function d(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,o.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"building-a-complete-rag-application",children:"Building a Complete RAG Application"})}),"\n",(0,r.jsx)(n.p,{children:"In this section, you'll build a complete RAG application that:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:"Ingests documents from multiple sources"}),"\n",(0,r.jsx)(n.li,{children:"Creates and stores vector embeddings"}),"\n",(0,r.jsx)(n.li,{children:"Performs semantic search"}),"\n",(0,r.jsx)(n.li,{children:"Integrates with an LLM to generate responses"}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"project-structure",children:"Project Structure"}),"\n",(0,r.jsx)(n.p,{children:"Let's start by creating a proper project structure:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"rag-workshop/\n\u251c\u2500\u2500 .env                    # Environment variables\n\u251c\u2500\u2500 package.json            # Dependencies\n\u251c\u2500\u2500 data/                   # Sample documents\n\u2502   \u251c\u2500\u2500 articles/           # Text documents\n\u2502   \u2514\u2500\u2500 qa-pairs.json       # Sample Q&A pairs for testing\n\u251c\u2500\u2500 src/\n\u2502   \u251c\u2500\u2500 config.js           # Configuration\n\u2502   \u251c\u2500\u2500 ingest.js           # Document ingestion\n\u2502   \u251c\u2500\u2500 search.js           # Vector search\n\u2502   \u251c\u2500\u2500 generate.js         # LLM response generation\n\u2502   \u251c\u2500\u2500 utils/              # Utility functions\n\u2502   \u2502   \u251c\u2500\u2500 chunker.js      # Document chunking\n\u2502   \u2502   \u2514\u2500\u2500 formatter.js    # Response formatting\n\u2502   \u2514\u2500\u2500 index.js            # Main application\n\u2514\u2500\u2500 tests/                  # Tests\n    \u2514\u2500\u2500 app.test.js         # Test suite\n"})}),"\n",(0,r.jsx)(n.p,{children:"Create these directories:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"mkdir -p data/articles src/utils tests\n"})}),"\n",(0,r.jsx)(n.h2,{id:"setting-up-dependencies",children:"Setting Up Dependencies"}),"\n",(0,r.jsxs)(n.p,{children:["Update your ",(0,r.jsx)(n.code,{children:"package.json"})," to include all necessary dependencies:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",children:'{\n  "name": "rag-workshop",\n  "version": "1.0.0",\n  "description": "RAG application workshop with MongoDB Atlas",\n  "main": "src/index.js",\n  "scripts": {\n    "start": "node src/index.js",\n    "ingest": "node src/ingest.js",\n    "search": "node src/search.js",\n    "test": "jest"\n  },\n  "dependencies": {\n    "dotenv": "^16.3.1",\n    "express": "^4.18.2",\n    "mongodb-rag": "^0.53.0",\n    "openai": "^4.10.0",\n    "fs-extra": "^11.1.1"\n  },\n  "devDependencies": {\n    "jest": "^29.6.2"\n  }\n}\n'})}),"\n",(0,r.jsx)(n.p,{children:"Install the dependencies:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"npm install\n"})}),"\n",(0,r.jsx)(n.h2,{id:"creating-sample-data",children:"Creating Sample Data"}),"\n",(0,r.jsxs)(n.p,{children:["Let's create some sample data to work with. Create a file at ",(0,r.jsx)(n.code,{children:"data/articles/mongodb-atlas.md"}),":"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-md",children:"# MongoDB Atlas: The Cloud Database Service\n\nMongoDB Atlas is a fully-managed cloud database service developed by MongoDB. It handles all the complexity of deploying, managing, and healing your deployments on the cloud service provider of your choice (AWS, Azure, and GCP).\n\n## Key Features\n\n### Automated Deployment and Management\nMongoDB Atlas automates deployment, maintenance, and scaling. You can deploy a cluster with a few clicks or API calls.\n\n### Security\nMongoDB Atlas provides multiple layers of security for your database:\n- Network isolation with VPC peering\n- IP whitelisting\n- Advanced authentication\n- Field-level encryption\n- RBAC (Role-Based Access Control)\n- LDAP integration\n\n### Monitoring and Alerts\nThe service includes built-in monitoring tools and customizable alerts based on over a dozen different metrics.\n\n### Automated Backups\nContinuous backups with point-in-time recovery ensure your data is protected.\n\n### Scaling Options\nScale up or down without application downtime. Auto-scaling provisions storage capacity automatically.\n\n### Global Clusters\nCreate globally distributed clusters that route data to the closest available region to minimize latency.\n\n## Integrations\n\nMongoDB Atlas integrates with popular services and tools:\n- AWS services (Lambda, SageMaker, etc.)\n- Google Cloud (Firebase, DataFlow, etc.)\n- Microsoft Azure services\n- Kafka\n- Kubernetes\n\n## Atlas Vector Search\n\nMongoDB Atlas Vector Search enables you to build vector search applications by storing embeddings and performing k-nearest neighbor (k-NN) search.\n\nKey capabilities include:\n- Store vector embeddings along with your operational data\n- Build semantic search applications\n- Power recommendation engines\n- Implement AI-powered applications\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Create another file at ",(0,r.jsx)(n.code,{children:"data/articles/rag-overview.md"}),":"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-md",children:"# Retrieval-Augmented Generation (RAG): An Overview\n\nRetrieval-Augmented Generation (RAG) is an AI framework that enhances large language models (LLMs) by retrieving relevant information from external knowledge sources to ground the model's responses in factual, up-to-date information.\n\n## How RAG Works\n\nThe RAG process typically consists of three main stages:\n\n1. **Retrieval**: The system queries a knowledge base to find information relevant to the input prompt\n2. **Augmentation**: Retrieved information is added to the context provided to the LLM\n3. **Generation**: The LLM generates a response based on both the prompt and the retrieved information\n\n## Benefits of RAG\n\nRetrieval-Augmented Generation offers several advantages:\n\n### Reduced Hallucinations\nBy grounding responses in retrieved facts, RAG significantly reduces the tendency of LLMs to generate plausible-sounding but incorrect information.\n\n### Up-to-date Information\nRAG systems can access recent information beyond the LLM's training cutoff date, keeping responses current.\n\n### Domain Specialization\nRAG enables general-purpose LLMs to provide expert-level responses in specialized domains by retrieving domain-specific information.\n\n### Transparency and Attribution\nInformation sources can be tracked and cited, improving transparency and trustworthiness.\n\n### Cost Efficiency\nRetrieving information can be more efficient than training ever-larger models to memorize more facts.\n\n## Implementation Considerations\n\nWhen implementing RAG, several factors must be considered:\n\n### Knowledge Base Design\nThe structure, format, and organization of the knowledge base significantly impact retrieval effectiveness.\n\n### Embedding Strategy\nHow documents are converted to vector embeddings affects search quality.\n\n### Chunking Approach\nThe method used to divide documents into chunks can impact retrieval precision.\n\n### Retrieval Algorithms\nDifferent retrieval methods (BM25, vector search, hybrid approaches) have varying effectiveness depending on the use case.\n\n### Context Window Management\nEfficiently using the LLM's context window is essential for complex queries requiring multiple retrieved documents.\n\n## Common Challenges\n\nRAG implementations often face several challenges:\n\n- Balancing retrieval precision and recall\n- Handling contradictory information from multiple sources\n- Managing context window limitations\n- Addressing retrieval latency in real-time applications\n"})}),"\n",(0,r.jsxs)(n.p,{children:["Create a sample Q&A pairs file at ",(0,r.jsx)(n.code,{children:"data/qa-pairs.json"}),":"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",children:'[\n  {\n    "question": "What is MongoDB Atlas?",\n    "expected_source": "mongodb-atlas.md"\n  },\n  {\n    "question": "What security features does MongoDB Atlas offer?",\n    "expected_source": "mongodb-atlas.md"\n  },\n  {\n    "question": "How does RAG reduce hallucinations?",\n    "expected_source": "rag-overview.md"\n  },\n  {\n    "question": "What are the three main stages of RAG?",\n    "expected_source": "rag-overview.md"\n  },\n  {\n    "question": "What is Atlas Vector Search used for?",\n    "expected_source": "mongodb-atlas.md"\n  }\n]\n'})}),"\n",(0,r.jsx)(n.h2,{id:"configuration-file",children:"Configuration File"}),"\n",(0,r.jsxs)(n.p,{children:["Create a configuration file at ",(0,r.jsx)(n.code,{children:"src/config.js"}),":"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:"require('dotenv').config();\n\nmodule.exports = {\n  mongodb: {\n    uri: process.env.MONGODB_URI,\n    database: 'rag_workshop',\n    collection: 'documents'\n  },\n  embedding: {\n    provider: process.env.EMBEDDING_PROVIDER || 'openai',\n    apiKey: process.env.EMBEDDING_API_KEY,\n    model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',\n    dimensions: 1536\n  },\n  llm: {\n    provider: 'openai',\n    apiKey: process.env.OPENAI_API_KEY,\n    model: process.env.LLM_MODEL || 'gpt-3.5-turbo'\n  },\n  chunking: {\n    strategy: 'semantic',\n    maxChunkSize: 500,\n    overlap: 50\n  },\n  search: {\n    maxResults: 5,\n    minScore: 0.7,\n    returnSources: true\n  }\n};\n"})}),"\n",(0,r.jsx)(n.h2,{id:"document-ingestion",children:"Document Ingestion"}),"\n",(0,r.jsxs)(n.p,{children:["Create the document ingestion script at ",(0,r.jsx)(n.code,{children:"src/ingest.js"}),":"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:"const fs = require('fs-extra');\nconst path = require('path');\nconst { MongoRAG, Chunker } = require('mongodb-rag');\nconst config = require('./config');\n\n// Initialize MongoRAG\nconst rag = new MongoRAG({\n  mongoUrl: config.mongodb.uri,\n  database: config.mongodb.database,\n  collection: config.mongodb.collection,\n  embedding: config.embedding\n});\n\n// Create a chunker\nconst chunker = new Chunker({\n  strategy: config.chunking.strategy,\n  maxChunkSize: config.chunking.maxChunkSize,\n  overlap: config.chunking.overlap\n});\n\n// Function to read and process markdown files\nasync function ingestMarkdownFiles(directory) {\n  try {\n    // Get all markdown files\n    const files = await fs.readdir(directory);\n    const markdownFiles = files.filter(file => file.endsWith('.md'));\n    \n    console.log(`Found ${markdownFiles.length} markdown files to process`);\n    \n    // Process each file\n    for (const filename of markdownFiles) {\n      const filePath = path.join(directory, filename);\n      const content = await fs.readFile(filePath, 'utf-8');\n      \n      // Create document object\n      const document = {\n        id: path.basename(filename, '.md'),\n        content: content,\n        metadata: {\n          source: filename,\n          type: 'markdown',\n          created: new Date().toISOString(),\n          filename: filename\n        }\n      };\n      \n      console.log(`Processing ${filename}...`);\n      \n      // Chunk the document\n      const chunks = await chunker.chunkDocument(document);\n      console.log(`Created ${chunks.length} chunks from ${filename}`);\n      \n      // Ingest the chunks\n      const result = await rag.ingestBatch(chunks);\n      console.log(`Ingested ${result.processed} chunks from ${filename}`);\n    }\n    \n    console.log('Document ingestion complete!');\n    \n  } catch (error) {\n    console.error('Error ingesting documents:', error);\n  } finally {\n    await rag.close();\n  }\n}\n\n// Main function\nasync function main() {\n  const articlesDir = path.join(__dirname, '../data/articles');\n  \n  console.log('Starting document ingestion...');\n  console.log(`Using ${config.chunking.strategy} chunking strategy`);\n  console.log(`Max chunk size: ${config.chunking.maxChunkSize} characters`);\n  console.log(`Chunk overlap: ${config.chunking.overlap} characters`);\n  \n  await rag.connect();\n  await ingestMarkdownFiles(articlesDir);\n}\n\n// Run the ingestion process\nmain().catch(console.error);\n"})}),"\n",(0,r.jsx)(n.h2,{id:"vector-search",children:"Vector Search"}),"\n",(0,r.jsxs)(n.p,{children:["Create the search functionality at ",(0,r.jsx)(n.code,{children:"src/search.js"}),":"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:"const { MongoRAG } = require('mongodb-rag');\nconst config = require('./config');\n\n// Initialize MongoRAG\nconst rag = new MongoRAG({\n  mongoUrl: config.mongodb.uri,\n  database: config.mongodb.database,\n  collection: config.mongodb.collection,\n  embedding: config.embedding,\n  search: {\n    maxResults: config.search.maxResults,\n    minScore: config.search.minScore\n  }\n});\n\n/**\n * Search for documents relevant to a query\n * @param {string} query - The search query\n * @param {Object} options - Search options\n * @returns {Promise<Array>} - Search results\n */\nasync function searchDocuments(query, options = {}) {\n  try {\n    await rag.connect();\n    \n    console.log(`Searching for: \"${query}\"`);\n    const results = await rag.search(query, {\n      maxResults: options.maxResults || config.search.maxResults,\n      filter: options.filter || {}\n    });\n    \n    // Post-process results if needed\n    const processedResults = results.map(result => {\n      // Add source document if returnSources is enabled\n      if (config.search.returnSources) {\n        return {\n          ...result,\n          source: result.metadata?.filename || 'unknown'\n        };\n      }\n      return result;\n    });\n    \n    return processedResults;\n    \n  } catch (error) {\n    console.error('Search error:', error);\n    throw error;\n  } finally {\n    await rag.close();\n  }\n}\n\n// Export for use in other modules\nmodule.exports = {\n  searchDocuments\n};\n\n// If run directly, perform a test search\nif (require.main === module) {\n  const testQuery = process.argv[2] || 'What is MongoDB Atlas?';\n  \n  searchDocuments(testQuery)\n    .then(results => {\n      console.log(`Found ${results.length} results:`);\n      results.forEach((result, i) => {\n        console.log(`\\nResult ${i+1} (score: ${result.score.toFixed(4)}):`);\n        console.log(`Source: ${result.source}`);\n        console.log(`Content: ${result.content.substring(0, 150)}...`);\n      });\n    })\n    .catch(console.error);\n}\n"})}),"\n",(0,r.jsx)(n.h2,{id:"llm-response-generation",children:"LLM Response Generation"}),"\n",(0,r.jsxs)(n.p,{children:["Create the response generation module at ",(0,r.jsx)(n.code,{children:"src/generate.js"}),":"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:"const { OpenAI } = require('openai');\nconst config = require('./config');\nconst { searchDocuments } = require('./search');\n\n// Initialize OpenAI client\nconst openai = new OpenAI({\n  apiKey: config.llm.apiKey\n});\n\n/**\n * Generate a response using RAG\n * @param {string} query - User query\n * @param {Object} options - Generation options\n * @returns {Promise<Object>} - Generated response and metadata\n */\nasync function generateResponse(query, options = {}) {\n  try {\n    // Step 1: Retrieve relevant documents\n    const searchResults = await searchDocuments(query, {\n      maxResults: options.maxResults || 3\n    });\n    \n    if (searchResults.length === 0) {\n      return {\n        answer: \"I couldn't find any relevant information to answer your question.\",\n        sources: []\n      };\n    }\n    \n    // Step 2: Format context from retrieved documents\n    const context = searchResults\n      .map(result => `Source: ${result.source}\\nContent: ${result.content}`)\n      .join('\\n\\n');\n    \n    // Step 3: Create prompt with context\n    const messages = [\n      {\n        role: 'system',\n        content: `You are a helpful assistant. Answer the user's question based ONLY on the provided context. \n                 If the context doesn't contain relevant information, say \"I don't have enough information to answer that question.\"\n                 Always cite your sources at the end of your answer.`\n      },\n      {\n        role: 'user',\n        content: `Context:\\n${context}\\n\\nQuestion: ${query}`\n      }\n    ];\n    \n    // Step 4: Generate response using LLM\n    const completion = await openai.chat.completions.create({\n      model: config.llm.model,\n      messages: messages,\n      temperature: options.temperature || 0.3,\n      max_tokens: options.maxTokens || 500\n    });\n    \n    // Step 5: Return formatted response with sources\n    return {\n      answer: completion.choices[0].message.content,\n      sources: searchResults.map(result => ({\n        source: result.source,\n        score: result.score\n      }))\n    };\n    \n  } catch (error) {\n    console.error('Error generating response:', error);\n    throw error;\n  }\n}\n\n// Export for use in other modules\nmodule.exports = {\n  generateResponse\n};\n\n// If run directly, perform a test generation\nif (require.main === module) {\n  const testQuery = process.argv[2] || 'What are the security features of MongoDB Atlas?';\n  \n  generateResponse(testQuery)\n    .then(response => {\n      console.log('\\n\ud83e\udd16 Generated Answer:');\n      console.log(response.answer);\n      \n      console.log('\\n\ud83d\udcda Sources:');\n      response.sources.forEach((source, i) => {\n        console.log(`${i+1}. ${source.source} (relevance: ${source.score.toFixed(4)})`);\n      });\n    })\n    .catch(console.error);\n}\n"})}),"\n",(0,r.jsx)(n.h2,{id:"main-application",children:"Main Application"}),"\n",(0,r.jsxs)(n.p,{children:["Create the main application file at ",(0,r.jsx)(n.code,{children:"src/index.js"}),":"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:"const express = require('express');\nconst fs = require('fs-extra');\nconst path = require('path');\nconst { generateResponse } = require('./generate');\nconst { searchDocuments } = require('./search');\nconst config = require('./config');\n\n// Initialize Express app\nconst app = express();\napp.use(express.json());\napp.use(express.urlencoded({ extended: true }));\n\n// Health check endpoint\napp.get('/healthz', (req, res) => {\n  res.status(200).send('OK');\n});\n\n// Search endpoint\napp.get('/api/search', async (req, res) => {\n  try {\n    const { query, maxResults } = req.query;\n    \n    if (!query) {\n      return res.status(400).json({\n        error: 'Missing required parameter: query'\n      });\n    }\n    \n    const results = await searchDocuments(query, {\n      maxResults: maxResults ? parseInt(maxResults) : undefined\n    });\n    \n    res.json({\n      query,\n      results\n    });\n    \n  } catch (error) {\n    console.error('Search API error:', error);\n    res.status(500).json({\n      error: 'An error occurred during search',\n      message: error.message\n    });\n  }\n});\n\n// RAG endpoint\napp.post('/api/rag', async (req, res) => {\n  try {\n    const { query, options } = req.body;\n    \n    if (!query) {\n      return res.status(400).json({\n        error: 'Missing required parameter: query'\n      });\n    }\n    \n    const response = await generateResponse(query, options);\n    res.json(response);\n    \n  } catch (error) {\n    console.error('RAG API error:', error);\n    res.status(500).json({\n      error: 'An error occurred during response generation',\n      message: error.message\n    });\n  }\n});\n\n// Load and answer test questions\napp.get('/api/test', async (req, res) => {\n  try {\n    const qaFilePath = path.join(__dirname, '../data/qa-pairs.json');\n    const qaData = await fs.readJSON(qaFilePath);\n    \n    const results = [];\n    \n    for (const qa of qaData) {\n      const response = await generateResponse(qa.question);\n      \n      // Check if the expected source appears in the sources\n      const foundExpectedSource = response.sources.some(\n        source => source.source.includes(qa.expected_source)\n      );\n      \n      results.push({\n        question: qa.question,\n        answer: response.answer,\n        expected_source: qa.expected_source,\n        found_expected_source: foundExpectedSource,\n        sources: response.sources\n      });\n    }\n    \n    res.json({\n      total: qaData.length,\n      correct_sources: results.filter(r => r.found_expected_source).length,\n      results\n    });\n    \n  } catch (error) {\n    console.error('Test API error:', error);\n    res.status(500).json({\n      error: 'An error occurred during test',\n      message: error.message\n    });\n  }\n});\n\n// Start the server\nconst PORT = process.env.PORT || 3000;\napp.listen(PORT, () => {\n  console.log(`\ud83d\ude80 RAG application server running on port ${PORT}`);\n  console.log(`\ud83d\udcdd API Documentation:`);\n  console.log(`   - GET  /healthz             Health check`);\n  console.log(`   - GET  /api/search?query=X  Vector search`);\n  console.log(`   - POST /api/rag              RAG response generation`);\n  console.log(`   - GET  /api/test             Run test suite`);\n});\n"})}),"\n",(0,r.jsx)(n.h2,{id:"running-the-application",children:"Running the Application"}),"\n",(0,r.jsx)(n.p,{children:"Now it's time to run your application:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"First, ingest the documents:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"npm run ingest\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"Test the search functionality:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:'node src/search.js "What security features does MongoDB Atlas provide?"\n'})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"Test the RAG response generation:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:'node src/generate.js "What are the main benefits of using RAG?"\n'})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"Start the complete application:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"npm start\n"})}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"testing-the-api",children:"Testing the API"}),"\n",(0,r.jsx)(n.p,{children:"Once your application is running, you can test the API endpoints:"}),"\n",(0,r.jsx)(n.h3,{id:"search-endpoint",children:"Search Endpoint"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:'curl "http://localhost:3000/api/search?query=What%20is%20MongoDB%20Atlas?"\n'})}),"\n",(0,r.jsx)(n.h3,{id:"rag-endpoint",children:"RAG Endpoint"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:'curl -X POST http://localhost:3000/api/rag \\\n  -H "Content-Type: application/json" \\\n  -d \'{"query":"How does RAG reduce hallucinations?"}\'\n'})}),"\n",(0,r.jsx)(n.h3,{id:"test-suite",children:"Test Suite"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"curl http://localhost:3000/api/test\n"})}),"\n",(0,r.jsx)(n.h2,{id:"evaluating-your-rag-application",children:"Evaluating Your RAG Application"}),"\n",(0,r.jsx)(n.p,{children:"To evaluate the effectiveness of your RAG application, check:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Retrieval Precision"}),": Are the correct documents being retrieved?"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Response Accuracy"}),": Are the generated answers correct and based on the retrieved information?"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Source Attribution"}),": Does the system correctly cite its sources?"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Handling Edge Cases"}),": Does it properly handle questions outside its knowledge base?"]}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.code,{children:"/api/test"})," endpoint helps evaluate these aspects automatically."]}),"\n",(0,r.jsx)(n.h2,{id:"next-steps",children:"Next Steps"}),"\n",(0,r.jsx)(n.p,{children:"Congratulations! You've built a complete RAG application with MongoDB Atlas. In the next section, we'll explore advanced techniques to enhance your application's capabilities."})]})}function u(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},8453:function(e,n,s){s.d(n,{R:function(){return a},x:function(){return i}});var t=s(6540);const r={},o=t.createContext(r);function a(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),t.createElement(o.Provider,{value:n},e.children)}},9382:function(e,n,s){s(6540),s(4848)}}]);