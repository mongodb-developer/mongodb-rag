"use strict";(self.webpackChunkmongodb_rag_docs=self.webpackChunkmongodb_rag_docs||[]).push([[6470],{2690:function(e,n,t){t.r(n),t.d(n,{assets:function(){return c},contentTitle:function(){return a},default:function(){return g},frontMatter:function(){return i},metadata:function(){return o},toc:function(){return d}});var o=JSON.parse('{"id":"workshop/create-embeddings","title":"\ud83d\udc50 Creating Vector Embeddings","description":"In this section, you\'ll learn how to create vector embeddings from text documents and store them in MongoDB Atlas using the mongodb-rag library.","source":"@site/docs/workshop/create-embeddings.md","sourceDirName":"workshop","slug":"/workshop/create-embeddings","permalink":"/mongodb-rag/docs/workshop/create-embeddings","draft":false,"unlisted":false,"editUrl":"https://github.com/mongodb-developer/mongodb-rag/tree/main/mongodb-rag-docs/docs/workshop/create-embeddings.md","tags":[],"version":"current","frontMatter":{"id":"create-embeddings","title":"\ud83d\udc50 Creating Vector Embeddings"},"sidebar":"docs","previous":{"title":"\ud83d\udc50 Setting up MongoDB Atlas","permalink":"/mongodb-rag/docs/workshop/setup-mongodb"},"next":{"title":"\ud83d\udc50 Building a RAG Application","permalink":"/mongodb-rag/docs/workshop/build-rag-app"}}'),s=t(4848),r=t(8453);const i={id:"create-embeddings",title:"\ud83d\udc50 Creating Vector Embeddings"},a="Creating and Managing Vector Embeddings",c={},d=[{value:"Understanding Embeddings",id:"understanding-embeddings",level:2},{value:"Setting Up Your Project",id:"setting-up-your-project",level:2},{value:"Selecting an Embedding Provider",id:"selecting-an-embedding-provider",level:2},{value:"Creating a Simple Embeddings Generator",id:"creating-a-simple-embeddings-generator",level:2},{value:"Ingesting Documents with MongoDB-RAG",id:"ingesting-documents-with-mongodb-rag",level:2},{value:"Document Chunking Strategies",id:"document-chunking-strategies",level:2},{value:"Advanced: Creating a Vector Search Index",id:"advanced-creating-a-vector-search-index",level:2},{value:"Testing Vector Search",id:"testing-vector-search",level:2},{value:"Next Steps",id:"next-steps",level:2}];function l(e){const n={code:"code",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"creating-and-managing-vector-embeddings",children:"Creating and Managing Vector Embeddings"})}),"\n",(0,s.jsxs)(n.p,{children:["In this section, you'll learn how to create vector embeddings from text documents and store them in MongoDB Atlas using the ",(0,s.jsx)(n.code,{children:"mongodb-rag"})," library."]}),"\n",(0,s.jsx)(n.h2,{id:"understanding-embeddings",children:"Understanding Embeddings"}),"\n",(0,s.jsx)(n.p,{children:"Embeddings are numerical representations of text that capture semantic meaning. For RAG applications, we use embeddings to:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"Convert documents into vector representations during ingestion"}),"\n",(0,s.jsx)(n.li,{children:"Convert user queries into vector representations during search"}),"\n",(0,s.jsx)(n.li,{children:"Find the most similar documents using vector similarity"}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"setting-up-your-project",children:"Setting Up Your Project"}),"\n",(0,s.jsx)(n.p,{children:"First, let's create a new project directory and install the necessary dependencies:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"mkdir rag-workshop\ncd rag-workshop\nnpm init -y\nnpm install mongodb-rag dotenv\n"})}),"\n",(0,s.jsx)(n.h2,{id:"selecting-an-embedding-provider",children:"Selecting an Embedding Provider"}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"mongodb-rag"})," library supports multiple embedding providers:"]}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"OpenAI"})," - High-quality embeddings (requires API key)"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Ollama"})," - Local embeddings (no API key needed, runs on your machine)"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"DeepSeek"})," - Alternative embedding provider"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Custom"})," - Use any embedding model with a custom adapter"]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["For this workshop, we'll focus on OpenAI and Ollama. Make sure your ",(0,s.jsx)(n.code,{children:".env"})," file is configured appropriately from the previous section."]}),"\n",(0,s.jsx)(n.h2,{id:"creating-a-simple-embeddings-generator",children:"Creating a Simple Embeddings Generator"}),"\n",(0,s.jsxs)(n.p,{children:["Let's create a script to generate embeddings for some sample text and visualize them. Create a file called ",(0,s.jsx)(n.code,{children:"generate-embeddings.js"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"const { MongoRAG } = require('mongodb-rag');\nrequire('dotenv').config();\n\nasync function generateEmbeddings() {\n  // Initialize MongoRAG with your configuration\n  const rag = new MongoRAG({\n    mongoUrl: process.env.MONGODB_URI,\n    database: 'rag_workshop',\n    collection: 'embeddings',\n    embedding: {\n      provider: process.env.EMBEDDING_PROVIDER || 'openai',\n      apiKey: process.env.EMBEDDING_API_KEY,\n      model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',\n      dimensions: 1536  // Dimensionality depends on your model\n    }\n  });\n\n  await rag.connect();\n\n  // Sample texts to embed\n  const texts = [\n    \"MongoDB is a document database used to build highly available and scalable applications.\",\n    \"Vector search enables similarity-based information retrieval using embeddings.\",\n    \"Retrieval-Augmented Generation (RAG) enhances LLMs with external knowledge.\"\n  ];\n\n  try {\n    // Generate embeddings\n    console.log('Generating embeddings...');\n    \n    // Get embeddings directly without storing them\n    const embeddings = await rag.provider.getEmbeddings(texts);\n    \n    // Print embedding information\n    console.log(`Generated ${embeddings.length} embeddings`);\n    console.log(`Each embedding has ${embeddings[0].length} dimensions`);\n    \n    // Print a small sample of the first embedding vector\n    console.log('Sample of first embedding vector:');\n    console.log(embeddings[0].slice(0, 5), '...');\n    \n    // Calculate similarity between vectors (simple cosine similarity)\n    const similarity = calculateCosineSimilarity(embeddings[0], embeddings[1]);\n    console.log(`Similarity between first two embeddings: ${similarity.toFixed(4)}`);\n    \n  } catch (error) {\n    console.error('Error generating embeddings:', error);\n  } finally {\n    await rag.close();\n  }\n}\n\n// Calculate cosine similarity between two vectors\nfunction calculateCosineSimilarity(vectorA, vectorB) {\n  // Calculate dot product\n  const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);\n  \n  // Calculate magnitudes\n  const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));\n  const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));\n  \n  // Return cosine similarity\n  return dotProduct / (magnitudeA * magnitudeB);\n}\n\ngenerateEmbeddings();\n"})}),"\n",(0,s.jsx)(n.p,{children:"Run this script to see the embeddings:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"node generate-embeddings.js\n"})}),"\n",(0,s.jsx)(n.p,{children:"You should see output showing the dimensions of your embeddings and a similarity score between the first two embeddings."}),"\n",(0,s.jsx)(n.h2,{id:"ingesting-documents-with-mongodb-rag",children:"Ingesting Documents with MongoDB-RAG"}),"\n",(0,s.jsxs)(n.p,{children:["Now let's create a script to ingest documents, generate embeddings, and store them in MongoDB Atlas. Create a file called ",(0,s.jsx)(n.code,{children:"ingest-documents.js"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"const { MongoRAG } = require('mongodb-rag');\nrequire('dotenv').config();\n\nasync function ingestDocuments() {\n  // Initialize MongoRAG\n  const rag = new MongoRAG({\n    mongoUrl: process.env.MONGODB_URI,\n    database: 'rag_workshop',\n    collection: 'documents',\n    embedding: {\n      provider: process.env.EMBEDDING_PROVIDER || 'openai',\n      apiKey: process.env.EMBEDDING_API_KEY,\n      model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small'\n    }\n  });\n\n  await rag.connect();\n\n  // Sample documents to ingest\n  const documents = [\n    {\n      id: 'doc1',\n      content: 'MongoDB Atlas is a fully-managed cloud database developed by MongoDB. It handles all the complexity of deploying, managing, and healing your deployments on the cloud service provider of your choice (AWS, Azure, and GCP). MongoDB Atlas allows you to deploy fully managed MongoDB across AWS, Google Cloud, and Azure.',\n      metadata: {\n        source: 'MongoDB Documentation',\n        category: 'cloud',\n        date: '2023-01-15'\n      }\n    },\n    {\n      id: 'doc2',\n      content: 'MongoDB Atlas Vector Search enables you to build vector search capabilities into your applications. Define and create Atlas Vector Search indexes to perform k-Nearest Neighbors (kNN) vector search queries on vector embeddings of your data stored in your Atlas cluster.',\n      metadata: {\n        source: 'MongoDB Documentation',\n        category: 'vector-search',\n        date: '2023-05-22'\n      }\n    },\n    {\n      id: 'doc3',\n      content: 'Retrieval-Augmented Generation (RAG) is an AI framework for retrieving facts from an external knowledge base to ground large language models (LLMs) on the most accurate, up-to-date information and reduce hallucinations. RAG combines information retrieval with text generation capabilities of LLMs.',\n      metadata: {\n        source: 'AI Research Papers',\n        category: 'artificial-intelligence',\n        date: '2023-08-10'\n      }\n    }\n  ];\n\n  try {\n    console.log(`Ingesting ${documents.length} documents...`);\n    const result = await rag.ingestBatch(documents);\n    console.log(`Successfully ingested ${result.processed} documents`);\n    \n    // Verify documents were stored properly\n    const collection = await rag._getCollection();\n    const count = await collection.countDocuments();\n    console.log(`Total documents in collection: ${count}`);\n    \n    // Sample a document to verify it has an embedding\n    const sample = await collection.findOne();\n    console.log('Sample document:');\n    console.log(`ID: ${sample.documentId}`);\n    console.log(`Content: ${sample.content.substring(0, 100)}...`);\n    console.log(`Embedding dimensions: ${sample.embedding.length}`);\n    console.log(`Metadata:`, sample.metadata);\n    \n  } catch (error) {\n    console.error('Error ingesting documents:', error);\n  } finally {\n    await rag.close();\n  }\n}\n\ningestDocuments();\n"})}),"\n",(0,s.jsx)(n.p,{children:"Run this script to ingest the documents:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"node ingest-documents.js\n"})}),"\n",(0,s.jsx)(n.h2,{id:"document-chunking-strategies",children:"Document Chunking Strategies"}),"\n",(0,s.jsx)(n.p,{children:"For longer documents, it's important to break them into smaller chunks before creating embeddings. MongoDB-RAG provides several chunking strategies:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Sliding Window"})," - Create overlapping chunks of fixed size"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Semantic"})," - Split based on semantic boundaries (paragraphs, sentences)"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Recursive"})," - Hierarchical chunking for nested document structures"]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["Let's create a script to demonstrate chunking. Create a file called ",(0,s.jsx)(n.code,{children:"chunk-document.js"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"const { MongoRAG, Chunker } = require('mongodb-rag');\nrequire('dotenv').config();\n\nasync function demonstrateChunking() {\n  console.log('Demonstrating different chunking strategies:');\n  \n  // Create a long document\n  const longDocument = {\n    id: 'long-doc',\n    content: `\n    # MongoDB Atlas Vector Search\n    \n    MongoDB Atlas Vector Search is a fully managed service that helps developers build vector search into their applications. \n    \n    ## Key Features\n    \n    Vector search in MongoDB Atlas provides several key capabilities:\n    \n    1. Integration with Atlas: Seamlessly works with your existing MongoDB Atlas deployment.\n    2. Multiple similarity metrics: Supports cosine similarity, dot product, and Euclidean distance.\n    3. Approximate nearest neighbor algorithms: Uses efficient indexing for fast searches.\n    4. Hybrid search capabilities: Combine vector search with traditional MongoDB queries.\n    \n    ## Use Cases\n    \n    Vector search enables various applications:\n    \n    - Semantic text search\n    - Image similarity\n    - Recommendation systems\n    - Anomaly detection\n    \n    ## Getting Started\n    \n    To get started with vector search in MongoDB Atlas, you need to:\n    1. Create a MongoDB Atlas cluster\n    2. Enable Vector Search\n    3. Create a vector search index\n    4. Store embeddings in your collection\n    5. Perform vector search queries\n    \n    ## Performance Considerations\n    \n    When working with vector search at scale, consider:\n    - Index size and performance trade-offs\n    - Vector dimensions and precision\n    - Query concurrency and resource allocation\n    - Horizontal scaling for large vector collections\n    `,\n    metadata: {\n      source: 'workshop',\n      category: 'vector-search'\n    }\n  };\n  \n  // Create chunkers with different strategies\n  const slidingChunker = new Chunker({\n    strategy: 'sliding',\n    maxChunkSize: 200,\n    overlap: 50\n  });\n  \n  const semanticChunker = new Chunker({\n    strategy: 'semantic',\n    maxChunkSize: 200\n  });\n  \n  const recursiveChunker = new Chunker({\n    strategy: 'recursive',\n    maxChunkSize: 200\n  });\n  \n  // Generate chunks using each strategy\n  const slidingChunks = await slidingChunker.chunkDocument(longDocument);\n  const semanticChunks = await semanticChunker.chunkDocument(longDocument);\n  const recursiveChunks = await recursiveChunker.chunkDocument(longDocument);\n  \n  // Display results\n  console.log(`\\nSliding Window Strategy (${slidingChunks.length} chunks):`);\n  slidingChunks.forEach((chunk, i) => {\n    console.log(`Chunk ${i+1}: ${chunk.content.length} chars`);\n    console.log(`${chunk.content.substring(0, 50)}...`);\n  });\n  \n  console.log(`\\nSemantic Strategy (${semanticChunks.length} chunks):`);\n  semanticChunks.forEach((chunk, i) => {\n    console.log(`Chunk ${i+1}: ${chunk.content.length} chars`);\n    console.log(`${chunk.content.substring(0, 50)}...`);\n  });\n  \n  console.log(`\\nRecursive Strategy (${recursiveChunks.length} chunks):`);\n  recursiveChunks.forEach((chunk, i) => {\n    console.log(`Chunk ${i+1}: ${chunk.content.length} chars`);\n    console.log(`${chunk.content.substring(0, 50)}...`);\n  });\n}\n\ndemonstrateChunking();\n"})}),"\n",(0,s.jsx)(n.p,{children:"Run this script to see the different chunking strategies in action:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"node chunk-document.js\n"})}),"\n",(0,s.jsx)(n.h2,{id:"advanced-creating-a-vector-search-index",children:"Advanced: Creating a Vector Search Index"}),"\n",(0,s.jsxs)(n.p,{children:["Let's create a script to programmatically create a Vector Search index. Create a file called ",(0,s.jsx)(n.code,{children:"create-index.js"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"const { MongoClient } = require('mongodb');\nrequire('dotenv').config();\n\nasync function createVectorSearchIndex() {\n  const uri = process.env.MONGODB_URI;\n  const client = new MongoClient(uri);\n  \n  try {\n    await client.connect();\n    console.log('Connected to MongoDB Atlas');\n    \n    const database = client.db('rag_workshop');\n    const collection = database.collection('documents');\n    \n    // Define the vector search index\n    const indexDefinition = {\n      name: \"vector_index\",\n      type: \"vectorSearch\",\n      definition: {\n        fields: [\n          {\n            type: \"vector\",\n            path: \"embedding\",\n            numDimensions: 1536,\n            similarity: \"cosine\"\n          }\n        ]\n      }\n    };\n    \n    // Create the index\n    console.log('Creating vector search index...');\n    const result = await collection.createSearchIndex(indexDefinition);\n    console.log('Index creation initiated:', result);\n    \n    // Check index status\n    console.log('Checking index status...');\n    let indexStatus = 'creating';\n    while (indexStatus !== 'READY') {\n      const indexes = await collection.listSearchIndexes().toArray();\n      const vectorIndex = indexes.find(idx => idx.name === 'vector_index');\n      \n      if (vectorIndex) {\n        indexStatus = vectorIndex.status;\n        console.log(`Current index status: ${indexStatus}`);\n        \n        if (indexStatus === 'READY') {\n          console.log('Vector search index is now ready to use!');\n          break;\n        } else if (indexStatus === 'FAILED') {\n          console.error('Index creation failed:', vectorIndex.error);\n          break;\n        }\n      }\n      \n      console.log('Waiting for index to be built...');\n      await new Promise(resolve => setTimeout(resolve, 5000));\n    }\n    \n  } catch (error) {\n    console.error('Error creating vector search index:', error);\n  } finally {\n    await client.close();\n  }\n}\n\ncreateVectorSearchIndex();\n"})}),"\n",(0,s.jsx)(n.p,{children:"Run this script to create a Vector Search index:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"node create-index.js\n"})}),"\n",(0,s.jsx)(n.h2,{id:"testing-vector-search",children:"Testing Vector Search"}),"\n",(0,s.jsxs)(n.p,{children:["Finally, let's create a script to test our vector search capabilities. Create a file called ",(0,s.jsx)(n.code,{children:"test-vector-search.js"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"const { MongoRAG } = require('mongodb-rag');\nrequire('dotenv').config();\n\nasync function testVectorSearch() {\n  // Initialize MongoRAG\n  const rag = new MongoRAG({\n    mongoUrl: process.env.MONGODB_URI,\n    database: 'rag_workshop',\n    collection: 'documents',\n    embedding: {\n      provider: process.env.EMBEDDING_PROVIDER || 'openai',\n      apiKey: process.env.EMBEDDING_API_KEY,\n      model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small'\n    },\n    search: {\n      maxResults: 2,\n      minScore: 0.6\n    }\n  });\n\n  await rag.connect();\n\n  try {\n    // Test queries\n    const queries = [\n      \"What is MongoDB Atlas?\",\n      \"How does vector search work?\",\n      \"What is RAG in artificial intelligence?\"\n    ];\n    \n    for (const query of queries) {\n      console.log(`\\n\ud83d\udd0d Searching for: \"${query}\"`);\n      const results = await rag.search(query);\n      \n      console.log(`Found ${results.length} results:`);\n      results.forEach((result, i) => {\n        console.log(`\\n\ud83d\udcc4 Result ${i+1} (similarity score: ${result.score.toFixed(4)}):`);\n        console.log(`Content: ${result.content}`);\n        if (result.metadata) {\n          console.log('Metadata:', result.metadata);\n        }\n      });\n    }\n    \n  } catch (error) {\n    console.error('Error during vector search:', error);\n  } finally {\n    await rag.close();\n  }\n}\n\ntestVectorSearch();\n"})}),"\n",(0,s.jsx)(n.p,{children:"Run this script to test your vector search:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"node test-vector-search.js\n"})}),"\n",(0,s.jsx)(n.h2,{id:"next-steps",children:"Next Steps"}),"\n",(0,s.jsx)(n.p,{children:"Now that you've learned how to create and manage vector embeddings, it's time to build a complete RAG application. In the next section, you'll integrate these components into a full-fledged application."})]})}function g(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},8453:function(e,n,t){t.d(n,{R:function(){return i},x:function(){return a}});var o=t(6540);const s={},r=o.createContext(s);function i(e){const n=o.useContext(r);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),o.createElement(r.Provider,{value:n},e.children)}}}]);