"use strict";(self.webpackChunkmongodb_rag_docs=self.webpackChunkmongodb_rag_docs||[]).push([[7922],{8449:function(e){e.exports=JSON.parse('{"archive":{"blogPosts":[{"id":"/2025/03/15/workshop-introduction","metadata":{"permalink":"/mongodb-rag/blog/2025/03/15/workshop-introduction","editUrl":"https://github.com/mongodb-developer/mongodb-rag/tree/main/mongodb-rag-docs/blog/blog/2025-03-15-workshop-introduction.md","source":"@site/blog/2025-03-15-workshop-introduction.md","title":"Build AI Applications with MongoDB: A Complete RAG Workshop","description":"Since releasing MongoDB-RAG earlier this year, I\'ve received a consistent stream of questions from developers about best practices for building production-ready AI applications. While the library makes RAG implementation much simpler, many developers are looking for end-to-end guidance on the entire development journey.","date":"2025-03-15T00:00:00.000Z","tags":[{"inline":true,"label":"mongodb","permalink":"/mongodb-rag/blog/tags/mongodb"},{"inline":true,"label":"vector-search","permalink":"/mongodb-rag/blog/tags/vector-search"},{"inline":true,"label":"rag","permalink":"/mongodb-rag/blog/tags/rag"},{"inline":true,"label":"ai","permalink":"/mongodb-rag/blog/tags/ai"},{"inline":true,"label":"workshop","permalink":"/mongodb-rag/blog/tags/workshop"},{"inline":true,"label":"tutorial","permalink":"/mongodb-rag/blog/tags/tutorial"}],"readingTime":3.53,"hasTruncateMarker":false,"authors":[{"name":"Michael Lynn","title":"Developer Advocate @ MongoDB","url":"https://github.com/mrlynn","imageURL":"https://avatars.githubusercontent.com/u/192552?v=4","key":null,"page":null}],"frontMatter":{"title":"Build AI Applications with MongoDB: A Complete RAG Workshop","author":"Michael Lynn","author_title":"Developer Advocate @ MongoDB","author_url":"https://github.com/mrlynn","author_image_url":"https://avatars.githubusercontent.com/u/192552?v=4","tags":["mongodb","vector-search","rag","ai","workshop","tutorial"]},"unlisted":false,"nextItem":{"title":"Introducing the MongoDB-RAG Playground","permalink":"/mongodb-rag/blog/2025/02/23/introducing-playground"}},"content":"Since releasing MongoDB-RAG earlier this year, I\'ve received a consistent stream of questions from developers about best practices for building production-ready AI applications. While the library makes RAG implementation much simpler, many developers are looking for end-to-end guidance on the entire development journey.\\n\\nThat\'s why I\'m excited to announce our new **MongoDB-RAG Workshop** - a comprehensive, hands-on guide to building intelligent applications with MongoDB Atlas Vector Search.\\n\\n## \ud83e\udde0 Why We Created This Workshop\\n\\nBuilding modern AI applications isn\'t just about connecting to an LLM API. It requires:\\n\\n- Understanding vector embeddings and semantic search\\n- Organizing and storing your knowledge base efficiently\\n- Implementing retrieval mechanisms that deliver relevant context\\n- Creating a scalable architecture that performs well in production\\n\\nThis workshop addresses all these challenges, providing a clear path from concept to production.\\n\\n## \ud83d\udcda What You\'ll Learn\\n\\nOur new workshop walks you through the complete process of building a production-ready RAG application:\\n\\n1. **Understanding RAG Fundamentals**  \\n   Before diving into code, we explore how vector search works, why embeddings matter, and the core RAG architecture patterns.\\n\\n2. **Setting Up MongoDB Atlas**  \\n   Learn how to create and configure a MongoDB Atlas cluster with Vector Search capabilities - the foundation of your AI application.\\n\\n3. **Creating Vector Embeddings**  \\n   Master techniques for generating and managing vector embeddings from various text sources, including handling different providers (OpenAI, Ollama, and more).\\n\\n4. **Building a Complete RAG Application**  \\n   Develop a full-featured application that ingests documents, performs semantic search, and generates contextually relevant responses.\\n\\n5. **Advanced Techniques**  \\n   Take your application to the next level with hybrid search, re-ranking, query expansion, and other advanced retrieval strategies.\\n\\n6. **Production Deployment**  \\n   Learn best practices for scaling, monitoring, and optimizing your RAG application in production.\\n\\n## \ud83d\udca1 Who Should Take This Workshop?\\n\\nThis workshop is perfect for:\\n\\n- **Backend Developers** looking to add AI capabilities to existing applications\\n- **AI Engineers** who want to build more robust retrieval systems\\n- **Technical Leaders** evaluating RAG architecture patterns\\n- **Full-Stack Developers** building end-to-end AI applications\\n\\nNo prior experience with vector databases is required, though basic familiarity with MongoDB and Node.js will help you get the most out of the material.\\n\\n## \ud83d\ude80 A Hands-On Approach\\n\\nWhat makes this workshop special is its hands-on nature. You won\'t just read about concepts - you\'ll implement them step-by-step:\\n\\n```javascript\\n// By the end of the workshop, you\'ll be writing code like this\\nasync function advancedRAGPipeline(query) {\\n  // Step 1: Expand query with variations\\n  const expandedQueries = await expandQuery(query);\\n  \\n  // Step 2: Retrieve from multiple collections\\n  const initialResults = await retrieveFromMultipleSources(expandedQueries);\\n  \\n  // Step 3: Rerank results\\n  const rerankedResults = await rerankResults(initialResults, query);\\n  \\n  // Step 4: Generate response with the LLM\\n  const response = await generateResponse(query, rerankedResults);\\n  \\n  return {\\n    answer: response,\\n    sources: rerankedResults.map(r => ({\\n      document: r.documentId,\\n      source: r.metadata?.source,\\n      score: r.score\\n    }))\\n  };\\n}\\n```\\n\\nYou\'ll build real components that solve common challenges:\\n- Document chunking strategies for optimal retrieval\\n- Caching mechanisms for performance optimization\\n- Hybrid search implementations\\n- Microservice architectures for production deployment\\n\\n## \ud83d\udcc8 Real-World Applications\\n\\nThe workshop focuses on practical applications that solve real business problems:\\n\\n- **Customer Support Systems** that retrieve accurate information from knowledge bases\\n- **Research Assistants** that can analyze and retrieve information from scientific literature\\n- **Content Recommendation Engines** powered by semantic similarity\\n- **Intelligent Document Search** across enterprise content\\n\\n## \ud83d\udee0\ufe0f Getting Started\\n\\nThe workshop is available now in our documentation. To begin:\\n\\n1. Make sure you have a [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas/register)\\n2. Install Node.js on your development machine\\n3. Head over to our [Workshop Introduction](/docs/workshop/Introduction/introduction)\\n\\n## \ud83d\udd2e Looking Ahead\\n\\nThis workshop represents the beginning of our commitment to helping developers build sophisticated AI applications. In the coming months, we\'ll be expanding the content with:\\n\\n- Multi-modal RAG implementations (text + images)\\n- Enterprise-scale architectures\\n- Performance optimization techniques\\n- Integration with popular AI frameworks\\n\\n## \ud83e\udd14 Your Feedback Matters\\n\\nAs you work through the workshop, we\'d love to hear your feedback. What challenges are you facing? What additional topics would you like to see covered? Your input will help shape future content.\\n\\nBuilding AI applications doesn\'t have to be complicated. With MongoDB-RAG and this workshop, you have everything you need to create intelligent, context-aware applications that deliver real value.\\n\\nHappy building!"},{"id":"/2025/02/23/introducing-playground","metadata":{"permalink":"/mongodb-rag/blog/2025/02/23/introducing-playground","editUrl":"https://github.com/mongodb-developer/mongodb-rag/tree/main/mongodb-rag-docs/blog/blog/2025-02-23-introducing-playground.md","source":"@site/blog/2025-02-23-introducing-playground.md","title":"Introducing the MongoDB-RAG Playground","description":"\ud83d\ude80 What is the MongoDB-RAG Playground?","date":"2025-02-23T00:00:00.000Z","tags":[{"inline":true,"label":"mongodb","permalink":"/mongodb-rag/blog/tags/mongodb"},{"inline":true,"label":"vector-search","permalink":"/mongodb-rag/blog/tags/vector-search"},{"inline":true,"label":"rag","permalink":"/mongodb-rag/blog/tags/rag"},{"inline":true,"label":"ai","permalink":"/mongodb-rag/blog/tags/ai"},{"inline":true,"label":"workshop","permalink":"/mongodb-rag/blog/tags/workshop"},{"inline":true,"label":"tutorial","permalink":"/mongodb-rag/blog/tags/tutorial"}],"readingTime":2.45,"hasTruncateMarker":false,"authors":[{"name":"Michael Lynn","title":"Developer Advocate @ MongoDB","url":"https://github.com/mrlynn","imageURL":"https://avatars.githubusercontent.com/u/192552?v=4","key":null,"page":null}],"frontMatter":{"title":"Introducing the MongoDB-RAG Playground","author":"Michael Lynn","author_title":"Developer Advocate @ MongoDB","author_url":"https://github.com/mrlynn","author_image_url":"https://avatars.githubusercontent.com/u/192552?v=4","tags":["mongodb","vector-search","rag","ai","workshop","tutorial"]},"unlisted":false,"prevItem":{"title":"Build AI Applications with MongoDB: A Complete RAG Workshop","permalink":"/mongodb-rag/blog/2025/03/15/workshop-introduction"},"nextItem":{"title":"Building an Intelligent Documentation Assistant with MongoDB-RAG","permalink":"/mongodb-rag/blog/2025/02/22/building-the-docs-chatbot"}},"content":"import Screenshot from \'@site/src/components/Screenshot\';\\n\\n<Screenshot url=\\"https://cloud.mongodb.com\\" src={\\"img/screenshots/playground.png\\"} alt=\\"Account creation form\\" />\\n\\n## \ud83d\ude80 What is the MongoDB-RAG Playground?\\n\\nThe **MongoDB-RAG Playground** is an interactive UI built directly into the `mongodb-rag` library. Designed to provide developers with a **quick and easy** way to explore **vector search**, the Playground helps users visualize their documents, manage indexes, and run search queries\u2014all without writing extra code.\\n\\nOnce a developer has set up their MongoDB Atlas cluster and ingested data, they can launch the Playground with a single command:\\n\\n```sh\\nnpx mongodb-rag playground\\n```\\n\\nThis command spins up a UI where developers can **view documents**, **manage vector indexes**, and **perform vector searches**, making it a powerful tool for experimentation and debugging.\\n\\n---\\n\\n## \ud83d\udd27 Getting Started with the Playground\\n\\nTo take full advantage of the Playground, follow these steps:\\n\\n### 1\ufe0f\u20e3 Initialize MongoDB-RAG\\nFirst, install the `mongodb-rag` package if you haven\u2019t already:\\n\\n```sh\\nnpm install mongodb-rag dotenv\\n```\\n\\nThen, initialize a configuration file:\\n\\n```sh\\nnpx mongodb-rag init\\n```\\n\\nThis will generate a `.mongodb-rag.json` file where you can specify your **MongoDB connection string**, database name, and collection name.\\n\\n### 2\ufe0f\u20e3 Ingest Data\\nBefore running vector search, you need to ingest documents. This can be done using:\\n\\n```sh\\nnpx mongodb-rag ingest --file data.json\\n```\\n\\nor by uploading a document directly from the Playground UI.\\n\\n### 3\ufe0f\u20e3 Create a Vector Search Index\\nOnce the data is loaded, create an **Atlas Vector Search Index** using:\\n\\n```sh\\nnpx mongodb-rag create-index\\n```\\n\\nAlternatively, you can manage indexes from within the Playground UI.\\n\\n### 4\ufe0f\u20e3 Launch the Playground\\nWith the dataset and vector index in place, start the Playground:\\n\\n```sh\\nnpx mongodb-rag playground\\n```\\n\\nThis command launches a **local UI**, allowing you to explore your data in real time.\\n\\n---\\n\\n## \ud83d\udda5\ufe0f Features of the Playground\\n\\n### \ud83d\udcc2 Document Viewer\\n- Browse your stored documents with ease.\\n- Quickly inspect metadata, embeddings, and content.\\n\\n### \ud83d\udd0d Search Panel\\n- Run **vector search queries** directly from the UI.\\n- Experiment with different similarity metrics (cosine, dot-product, Euclidean).\\n\\n### \u2699\ufe0f Index Management\\n- View existing indexes.\\n- Create new **vector search indexes**.\\n- Configure embedding models and dimensions.\\n\\n### \ud83d\udce1 Live Updates\\n- Real-time indexing and search updates via **WebSockets**.\\n- Instant feedback on configuration changes.\\n\\n---\\n\\n## \ud83d\udd25 Why Use the Playground?\\n\\n- **No need to build a frontend** \u2013 The Playground provides an out-of-the-box UI for MongoDB vector search.\\n- **Debugging made easy** \u2013 Quickly inspect documents and indexes without writing queries manually.\\n- **Seamless experimentation** \u2013 Tweak search parameters and embeddings dynamically.\\n\\n---\\n\\n## \ud83c\udfaf Try It Today\\nThe **MongoDB-RAG Playground** is the fastest way to interact with **MongoDB Atlas Vector Search**. Whether you\'re building an **AI-powered search** engine or testing **RAG (Retrieval-Augmented Generation)** workflows, the Playground gives you full control over your data and indexes in a simple UI.\\n\\nReady to get started?\\n\\nRun:\\n\\n```sh\\nnpx mongodb-rag playground\\n```\\n\\nAnd start exploring the power of **MongoDB Vector Search** today! \ud83d\ude80"},{"id":"/2025/02/22/building-the-docs-chatbot","metadata":{"permalink":"/mongodb-rag/blog/2025/02/22/building-the-docs-chatbot","editUrl":"https://github.com/mongodb-developer/mongodb-rag/tree/main/mongodb-rag-docs/blog/blog/2025-02-22-building-the-docs-chatbot.md","source":"@site/blog/2025-02-22-building-the-docs-chatbot.md","title":"Building an Intelligent Documentation Assistant with MongoDB-RAG","description":"\ud83d\udcd6 TL;DR","date":"2025-02-22T00:00:00.000Z","tags":[{"inline":true,"label":"mongodb","permalink":"/mongodb-rag/blog/tags/mongodb"},{"inline":true,"label":"vector-search","permalink":"/mongodb-rag/blog/tags/vector-search"},{"inline":true,"label":"rag","permalink":"/mongodb-rag/blog/tags/rag"},{"inline":true,"label":"ai","permalink":"/mongodb-rag/blog/tags/ai"},{"inline":true,"label":"workshop","permalink":"/mongodb-rag/blog/tags/workshop"},{"inline":true,"label":"tutorial","permalink":"/mongodb-rag/blog/tags/tutorial"}],"readingTime":3.92,"hasTruncateMarker":false,"authors":[{"name":"Michael Lynn","title":"Developer Advocate @ MongoDB","url":"https://github.com/mrlynn","imageURL":"https://avatars.githubusercontent.com/u/192552?v=4","key":null,"page":null}],"frontMatter":{"title":"Building an Intelligent Documentation Assistant with MongoDB-RAG","author":"Michael Lynn","author_title":"Developer Advocate @ MongoDB","author_url":"https://github.com/mrlynn","author_image_url":"https://avatars.githubusercontent.com/u/192552?v=4","tags":["mongodb","vector-search","rag","ai","workshop","tutorial"]},"unlisted":false,"prevItem":{"title":"Introducing the MongoDB-RAG Playground","permalink":"/mongodb-rag/blog/2025/02/23/introducing-playground"},"nextItem":{"title":"Simplifying RAG with MongoDB","permalink":"/mongodb-rag/blog/2025/02/01/simplifying"}},"content":"## **\ud83d\udcd6 TL;DR**\\nEver wished your documentation could just *answer questions* directly instead of forcing users to sift through endless pages? That\u2019s exactly what we built with the **MongoDB-RAG Documentation Assistant**. In this article, I\u2019ll walk you through the **why, what, and how** of building a chatbot that retrieves precise, relevant information from MongoDB-RAG\u2019s own documentation.\\n\\n### **\ud83e\udd14 Why Build a Documentation Assistant?**\\nTraditional documentation search is useful, but it often leaves users with *more questions than answers*. Developers need to read through entire pages, infer context, and piece together solutions. Instead, we wanted something:\\n\\n\u2705 **Conversational** \u2013 Answers questions in natural language  \\n\u2705 **Context-aware** \u2013 Finds relevant documentation snippets instead of just keywords  \\n\u2705 **Fast & Accurate** \u2013 Uses vector search to surface precise answers  \\n\u2705 **Transparent** \u2013 Links to original sources so users can verify answers  \\n\u2705 **Scalable** \u2013 Handles multiple LLM providers, including **OpenAI** and **Ollama**  \\n\\nOur solution? **A chatbot powered by MongoDB-RAG**, showcasing exactly what our tool was built for: **retrieval-augmented generation (RAG)** using **MongoDB Atlas Vector Search**.\\n\\n---\\n\\n## **\ud83d\udee0\ufe0f How We Built It**\\nWe structured the assistant around four core components:\\n\\n### **1\ufe0f\u20e3 Document Ingestion**\\nTo make documentation *searchable*, we need to process it into vector embeddings. We use **semantic chunking** to break long docs into meaningful pieces before ingestion.\\n\\n```javascript\\nconst chunker = new Chunker({\\n  strategy: \'semantic\',\\n  maxChunkSize: 500,\\n  overlap: 50\\n});\\n\\nconst documents = await loadMarkdownFiles(\'./docs\');\\nconst chunks = await Promise.all(\\n  documents.map(doc => chunker.chunkDocument(doc))\\n);\\n\\nawait rag.ingestBatch(chunks.flat());\\n```\\n\\n> \ud83d\udcdd **Why Semantic Chunking?** Instead of blindly splitting text, we preserve contextual integrity by overlapping related sections.\\n\\n---\\n\\n### **2\ufe0f\u20e3 Vector Search with MongoDB Atlas**\\nOnce ingested, we use **MongoDB Atlas Vector Search** to find the most relevant documentation snippets based on a user\u2019s query.\\n\\n```javascript\\nconst searchResults = await rag.search(query, { \\n  maxResults: 6,\\n  filter: { \'metadata.type\': \'documentation\' }\\n});\\n```\\n\\nMongoDB\u2019s **$vectorSearch** operator ensures we retrieve the closest matching content, ranked by relevance.\\n\\n---\\n\\n### **3\ufe0f\u20e3 Streaming Responses for a Real Chat Experience**\\nTo improve user experience, we stream responses incrementally as they\u2019re generated.\\n\\n```javascript\\nrouter.post(\'/chat\', async (req, res) => {\\n  const { query, history = [], stream = true } = req.body;\\n  \\n  const context = await ragService.search(query);\\n  \\n  if (stream) {\\n    res.writeHead(200, {\\n      \'Content-Type\': \'text/event-stream\',\\n      \'Cache-Control\': \'no-cache\',\\n      \'Connection\': \'keep-alive\'\\n    });\\n    \\n    await llmService.generateResponse(query, context, history, res);\\n  } else {\\n    const answer = await llmService.generateResponse(query, context, history);\\n    res.json({ answer, sources: context });\\n  }\\n});\\n```\\n\\nWith this approach:\\n- Responses appear **in real-time** instead of waiting for full generation \ud83d\ude80\\n- Developers can get **partial answers** quickly while longer responses load\\n\\n---\\n\\n### **4\ufe0f\u20e3 Multi-Provider LLM Support**\\nThe assistant supports **multiple embedding providers**, including OpenAI and **self-hosted Ollama**.\\n\\n```javascript\\nconst config = {\\n  embedding: {\\n    provider: process.env.EMBEDDING_PROVIDER || \'openai\',\\n    model: process.env.EMBEDDING_MODEL || \'text-embedding-3-small\',\\n    baseUrl: process.env.OLLAMA_BASE_URL // For local deployment\\n  }\\n};\\n```\\n\\nThis allows users to **switch providers** easily, optimizing for performance, privacy, or cost.\\n\\n---\\n\\n## **\ud83d\udca1 Key Features**\\n\\n### \ud83d\udd0d **Real-time Context Retrieval**\\nInstead of guessing, the chatbot **searches first** and then generates answers.\\n\\n### \ud83d\udd17 **Source Attribution**\\nEach response includes a **link to the documentation**, letting users verify answers.\\n\\n### \u23f3 **Streaming Responses**\\nNo waiting! Answers **generate in real-time**, improving responsiveness.\\n\\n### \u2699\ufe0f **Multi-Provider LLM Support**\\nDeploy with **OpenAI for scale** or **Ollama for private, local hosting**.\\n\\n### \ud83e\udd16 **Fallback Handling**\\nIf documentation doesn\u2019t contain an answer, the chatbot **transparently explains the limitation** instead of fabricating responses.\\n\\n---\\n\\n## **\ud83d\ude80 Try It Yourself**\\nWant to build a **MongoDB-RAG-powered assistant**? Here\u2019s how to get started:\\n\\n### **1\ufe0f\u20e3 Install MongoDB-RAG**\\n```bash\\nnpm install mongodb-rag\\n```\\n\\n### **2\ufe0f\u20e3 Configure Your Environment**\\n```env\\nMONGODB_URI=your_atlas_connection_string\\nEMBEDDING_PROVIDER=openai\\nEMBEDDING_API_KEY=your_api_key\\nEMBEDDING_MODEL=text-embedding-3-small\\n```\\n\\n### **3\ufe0f\u20e3 Initialize the Chatbot**\\n```javascript\\nimport { MongoRAG } from \'mongodb-rag\';\\nimport express from \'express\';\\n\\nconst rag = new MongoRAG(config);\\nconst app = express();\\n\\napp.post(\'/api/chat\', async (req, res) => {\\n  const { query } = req.body;\\n  const results = await rag.search(query);\\n  res.json({ answer: results });\\n});\\n```\\n\\n---\\n\\n## **\ud83c\udf29\ufe0f Production Considerations**\\n### **Where to Host?**\\nWe deployed our assistant on **Vercel** for:\\n- **Serverless scalability**\\n- **Fast global CDN**\\n- **Easy Git-based deployments**\\n\\n### **Which LLM for Production?**\\n- **OpenAI** \u2013 Best for reliability & speed\\n- **Ollama** \u2013 Best for **privacy-first** self-hosted setups\\n\\n```env\\nEMBEDDING_PROVIDER=openai\\nEMBEDDING_MODEL=text-embedding-3-small\\n```\\n\\n---\\n\\n## **\ud83d\udd2e What\u2019s Next?**\\nFuture improvements include:\\n- **Better query reformulation** to improve retrieval accuracy\\n- **User feedback integration** to refine responses over time\\n- **Conversation memory** for context-aware follow-ups\\n\\n---\\n\\n## **\ud83c\udfac Conclusion**\\nBy combining **MongoDB Atlas Vector Search** with **modern LLMs**, we built an assistant that **transforms documentation into an interactive experience**. \\n\\nTry it out in our docs, and let us know what you think! \ud83d\ude80\\n\\n### \ud83d\udd17 **Resources**\\n\ud83d\udcd8 [MongoDB-RAG Docs](https://mongodb.github.io/mongo-rag/)  \\n\ud83d\udd17 [GitHub Repository](https://github.com/mongodb-developer/mongodb-rag)  \\n\ud83d\udce6 [NPM Package](https://www.npmjs.com/package/mongodb-rag)"},{"id":"/2025/02/01/simplifying","metadata":{"permalink":"/mongodb-rag/blog/2025/02/01/simplifying","editUrl":"https://github.com/mongodb-developer/mongodb-rag/tree/main/mongodb-rag-docs/blog/blog/2025-02-01-simplifying.md","source":"@site/blog/2025-02-01-simplifying.md","title":"Simplifying RAG with MongoDB","description":"Over the past year, I\\\\\'ve spent a lot of time talking to developers about Retrieval-Augmented Generation (RAG) and how MongoDB Atlas Vector Search enables efficient vector-based retrieval. While the power of MongoDB as a vector database is undeniable, I noticed a recurring theme: developers wanted a simpler way to implement RAG applications.","date":"2025-02-01T00:00:00.000Z","tags":[{"inline":true,"label":"mongodb","permalink":"/mongodb-rag/blog/tags/mongodb"},{"inline":true,"label":"docusaurus","permalink":"/mongodb-rag/blog/tags/docusaurus"},{"inline":true,"label":"blog","permalink":"/mongodb-rag/blog/tags/blog"}],"readingTime":4.435,"hasTruncateMarker":false,"authors":[{"name":"Michael Lynn","title":"Developer Advocate @ MongoDB","url":"https://github.com/mrlynn","imageURL":"https://avatars.githubusercontent.com/u/192552?v=4","key":null,"page":null}],"frontMatter":{"title":"Simplifying RAG with MongoDB","author":"Michael Lynn","author_title":"Developer Advocate @ MongoDB","author_url":"https://github.com/mrlynn","author_image_url":"https://avatars.githubusercontent.com/u/192552?v=4","tags":["mongodb","docusaurus","blog"]},"unlisted":false,"prevItem":{"title":"Building an Intelligent Documentation Assistant with MongoDB-RAG","permalink":"/mongodb-rag/blog/2025/02/22/building-the-docs-chatbot"}},"content":"Over the past year, I\\\\\'ve spent a lot of time talking to developers about Retrieval-Augmented Generation (RAG) and how MongoDB Atlas Vector Search enables efficient vector-based retrieval. While the power of MongoDB as a vector database is undeniable, I noticed a recurring theme: developers wanted a simpler way to implement RAG applications.\\n\\nThat\\\\\'s what inspired me to create MongoDB-RAG, an npm library that abstracts away the complexity of embedding generation, vector search, and document retrieval giving developers a plug-and-play way to build RAG-powered applications with MongoDB.\\n\\nToday, I want to introduce the library and share some of the exciting new features we\\\\\'ve recently added to make RAG with MongoDB even more intuitive and performant.\\n\\n\ud83d\udccc Why I Built MongoDB-RAG\\nWhen I first started experimenting with vector search and large language models (LLMs), I found myself repeatedly writing boilerplate code for:\\n\\n- \u2705 Generating embeddings using OpenAI, DeepSeek, or Ollama\\n- \u2705 Storing embeddings in MongoDB efficiently\\n- \u2705 Building vector indexes with optimal settings\\n- \u2705 Running similarity searches using MongoDB Atlas Vector Search\\n- \u2705 Filtering and retrieving documents with hybrid search\\n\\nEvery RAG application required these steps, but the process felt unnecessarily repetitive. What if we could standardize this flow into a reusable library?\\n\\nMongoDB-RAG does just that\u2014eliminating complexity so that you can go from querying unstructured data to getting intelligent results in just a few lines of code.\\n\\n## \ud83d\ude80 What\\\\\'s New in MongoDB-RAG?\\nSince launching the first version, we\\\\\'ve been working hard to refine and expand the library. Here are some of the latest features that make MongoDB-RAG a must-have for building RAG applications with MongoDB Atlas:\\n\\n### \ud83d\udd39 Dynamic Database & Collection Selection\\nDevelopers can now specify custom databases and collections at query time, allowing more flexible data organization. Previously, all data had to be stored in a predefined database, but now you can run searches dynamically across multiple datasets.\\n\\n```javascript\\n\\nconst results = await rag.search(\\"What is AI?\\", {\\n  database: \\"research_db\\",\\n  collection: \\"ai_papers\\",\\n  maxResults: 5\\n});\\n```\\n### \ud83d\udd39 Intelligent Document Chunking\\nOne of the biggest challenges in RAG is breaking large documents into meaningful chunks. MongoDB-RAG now includes three advanced chunking strategies:\\n\\n1. Sliding Window - Maintains context with overlapping chunks\\n2. Semantic Chunking - Uses sentence boundaries to create more meaningful segments\\n3. Recursive Chunking - Dynamically splits large sections into smaller chunks\\n\\n```\\nconst chunkedDocs = chunker.chunkDocument(myDocument, { strategy: \\"semantic\\" });\\n```\\n\\n### \ud83d\udd39 Multi-Embedding Provider Support\\nMongoDB-RAG now supports multiple embedding providers\u2014so you\\\\\'re not locked into one ecosystem.\\n\\nSupported providers include:\\n- \u2705 OpenAI (text-embedding-3-small, text-embedding-3-large)\\n- \u2705 DeepSeek (high-performance embeddings with affordable pricing)\\n- \u2705 Ollama (local LLM-based embeddings for privacy and cost-efficiency)\\n\\n```\\nconst rag = new MongoRAG({\\n  embedding: { provider: \\"ollama\\", baseUrl: \\"http://localhost:11434\\", model: \\"llama3\\" }\\n});\\n```\\n\\n### \ud83d\udd39 Vector Quantization for Faster Queries\\nWe\\\\\'ve integrated automatic vector quantization, reducing memory footprint and boosting search performance in MongoDB Atlas. You can now enable scalar or binary quantization effortlessly.\\n\\n```\\nconst indexDefinition = {\\n  fields: [\\n    { type: \\"vector\\", path: \\"embedding\\", numDimensions: 1536, similarity: \\"cosine\\", quantization: \\"binary\\" }\\n  ]\\n};\\n```\\n\\n### \ud83d\udd39 Hybrid Search: Combining Vector & Metadata Filters\\nOne of the biggest advantages of MongoDB over other vector databases is the ability to perform hybrid searches\u2014combining vector similarity with traditional filters.\\n\\nMongoDB-RAG makes it seamless:\\n\\n```\\nconst results = await rag.search(\\"Latest AI papers\\", {\\n  database: \\"research_db\\",\\n  collection: \\"papers\\",\\n  filter: { \\"metadata.year\\": { $gte: 2022 } }\\n});\\n```\\n\\nNow, you can refine vector searches using structured metadata like dates, authors, or categories.\\n\\n## \u26a1 How to Get Started\\nSetting up MongoDB-RAG is ridiculously easy. Just install the package and connect it to your MongoDB Atlas cluster:\\n\\n1\ufe0f\u20e3 Install MongoDB-RAG\\n\\n```\\nnpm install mongodb-rag dotenv\\n```\\n\\n2\ufe0f\u20e3 Set Up MongoDB Atlas\\nEnsure you have an Atlas cluster with Vector Search enabled, then store your connection string in .env:\\n\\n```\\nMONGODB_URI=mongodb+srv://your-user:your-password@your-cluster.mongodb.net/\\nEMBEDDING_PROVIDER=openai\\nEMBEDDING_API_KEY=your-openai-api-key\\nEMBEDDING_MODEL=text-embedding-3-small\\n```\\n\\n3\ufe0f\u20e3 Ingest Documents\\n\\n```\\nconst documents = [\\n  { id: \\"doc1\\", content: \\"MongoDB is a NoSQL database.\\", metadata: { source: \\"docs\\" } },\\n  { id: \\"doc2\\", content: \\"Vector search is useful for semantic search.\\", metadata: { source: \\"ai\\" } }\\n];\\n\\nawait rag.ingestBatch(documents, { database: \\"my_db\\", collection: \\"docs\\" });\\n```\\n\\n4\ufe0f\u20e3 Perform a Vector Search\\n\\n```\\nconst results = await rag.search(\\"How does vector search work?\\", {\\n  database: \\"my_db\\",\\n  collection: \\"docs\\",\\n  maxResults: 3\\n});\\nconsole.log(\\"Search Results:\\", results);\\n```\\n\\nAnd just like that, your MongoDB-powered RAG application is up and running!\\n\\n## \ud83d\udd2e What\\\\\'s Next?\\n\\nWe\\\\\'re constantly evolving MongoDB-RAG based on developer feedback. Here\\\\\'s what\\\\\'s coming next:\\n\\n- \u2705 RAG Pipelines: End-to-end orchestration for document retrieval & LLM response generation\\n- \u2705 Integration with LangChain: Seamless connection with AI agent frameworks\\n- \u2705 Built-in UI Dashboard: Visualize vector search performance and document embeddings\\n\\n## \ud83c\udfaf Final Thoughts\\n\\nI built MongoDB-RAG because I wanted an easier, more efficient way to work with vector search in MongoDB. Instead of reinventing the wheel every time I built a RAG system, I wanted a reusable, well-optimized library that handles all the heavy lifting.\\n\\nNow, with dynamic database selection, hybrid search, intelligent chunking, and multi-provider embeddings, I truly believe MongoDB-RAG is the fastest way to build production-ready RAG applications.\\n\\nGive it a try, and let me know what you think! \ud83d\ude80\\n\\n- \ud83d\udccc GitHub Repo: github.com/mongodb-developer/mongodb-rag\\n- \ud83d\udccc NPM Package: npmjs.com/package/mongodb-rag\\n\\nLet\\\\\'s simplify RAG development together! \ud83d\udc4f"}]}}')}}]);