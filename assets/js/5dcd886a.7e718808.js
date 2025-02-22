"use strict";(self.webpackChunkmongodb_rag_docs=self.webpackChunkmongodb_rag_docs||[]).push([[9566],{8233:function(e){e.exports=JSON.parse('{"permalink":"/mongodb-rag/blog/2025/02/01/simplifying","editUrl":"https://github.com/mongodb-developer/mongodb-rag/tree/main/mongodb-rag-docs/blog/blog/2025-02-01-simplifying.md","source":"@site/blog/2025-02-01-simplifying.md","title":"Simplifying RAG with MongoDB","description":"Over the past year, I\\\\\'ve spent a lot of time talking to developers about Retrieval-Augmented Generation (RAG) and how MongoDB Atlas Vector Search enables efficient vector-based retrieval. While the power of MongoDB as a vector database is undeniable, I noticed a recurring theme: developers wanted a simpler way to implement RAG applications.","date":"2025-02-01T00:00:00.000Z","tags":[{"inline":true,"label":"mongodb","permalink":"/mongodb-rag/blog/tags/mongodb"},{"inline":true,"label":"docusaurus","permalink":"/mongodb-rag/blog/tags/docusaurus"},{"inline":true,"label":"blog","permalink":"/mongodb-rag/blog/tags/blog"}],"readingTime":4.435,"hasTruncateMarker":false,"authors":[{"name":"Michael Lynn","title":"Developer Advocate @ MongoDB","url":"https://github.com/mrlynn","imageURL":"https://avatars.githubusercontent.com/u/192552?v=4","key":null,"page":null}],"frontMatter":{"title":"Simplifying RAG with MongoDB","author":"Michael Lynn","author_title":"Developer Advocate @ MongoDB","author_url":"https://github.com/mrlynn","author_image_url":"https://avatars.githubusercontent.com/u/192552?v=4","tags":["mongodb","docusaurus","blog"]},"unlisted":false,"prevItem":{"title":"Building an Intelligent Documentation Assistant with MongoDB-RAG","permalink":"/mongodb-rag/blog/2025/02/22/building-the-docs-chatbot"}}')},8453:function(e,n,t){t.d(n,{R:function(){return r},x:function(){return s}});var i=t(6540);const o={},a=i.createContext(o);function r(e){const n=i.useContext(a);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),i.createElement(a.Provider,{value:n},e.children)}},8622:function(e,n,t){t.r(n),t.d(n,{assets:function(){return l},contentTitle:function(){return s},default:function(){return h},frontMatter:function(){return r},metadata:function(){return i},toc:function(){return c}});var i=t(8233),o=t(4848),a=t(8453);const r={title:"Simplifying RAG with MongoDB",author:"Michael Lynn",author_title:"Developer Advocate @ MongoDB",author_url:"https://github.com/mrlynn",author_image_url:"https://avatars.githubusercontent.com/u/192552?v=4",tags:["mongodb","docusaurus","blog"]},s=void 0,l={authorsImageUrls:[void 0]},c=[{value:"\ud83d\ude80 What&#39;s New in MongoDB-RAG?",id:"-whats-new-in-mongodb-rag",level:2},{value:"\ud83d\udd39 Dynamic Database &amp; Collection Selection",id:"-dynamic-database--collection-selection",level:3},{value:"\ud83d\udd39 Intelligent Document Chunking",id:"-intelligent-document-chunking",level:3},{value:"\ud83d\udd39 Multi-Embedding Provider Support",id:"-multi-embedding-provider-support",level:3},{value:"\ud83d\udd39 Vector Quantization for Faster Queries",id:"-vector-quantization-for-faster-queries",level:3},{value:"\ud83d\udd39 Hybrid Search: Combining Vector &amp; Metadata Filters",id:"-hybrid-search-combining-vector--metadata-filters",level:3},{value:"\u26a1 How to Get Started",id:"-how-to-get-started",level:2},{value:"\ud83d\udd2e What&#39;s Next?",id:"-whats-next",level:2},{value:"\ud83c\udfaf Final Thoughts",id:"-final-thoughts",level:2}];function d(e){const n={code:"code",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,a.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.p,{children:"Over the past year, I've spent a lot of time talking to developers about Retrieval-Augmented Generation (RAG) and how MongoDB Atlas Vector Search enables efficient vector-based retrieval. While the power of MongoDB as a vector database is undeniable, I noticed a recurring theme: developers wanted a simpler way to implement RAG applications."}),"\n",(0,o.jsx)(n.p,{children:"That's what inspired me to create MongoDB-RAG, an npm library that abstracts away the complexity of embedding generation, vector search, and document retrieval giving developers a plug-and-play way to build RAG-powered applications with MongoDB."}),"\n",(0,o.jsx)(n.p,{children:"Today, I want to introduce the library and share some of the exciting new features we've recently added to make RAG with MongoDB even more intuitive and performant."}),"\n",(0,o.jsx)(n.p,{children:"\ud83d\udccc Why I Built MongoDB-RAG\nWhen I first started experimenting with vector search and large language models (LLMs), I found myself repeatedly writing boilerplate code for:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"\u2705 Generating embeddings using OpenAI, DeepSeek, or Ollama"}),"\n",(0,o.jsx)(n.li,{children:"\u2705 Storing embeddings in MongoDB efficiently"}),"\n",(0,o.jsx)(n.li,{children:"\u2705 Building vector indexes with optimal settings"}),"\n",(0,o.jsx)(n.li,{children:"\u2705 Running similarity searches using MongoDB Atlas Vector Search"}),"\n",(0,o.jsx)(n.li,{children:"\u2705 Filtering and retrieving documents with hybrid search"}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"Every RAG application required these steps, but the process felt unnecessarily repetitive. What if we could standardize this flow into a reusable library?"}),"\n",(0,o.jsx)(n.p,{children:"MongoDB-RAG does just that\u2014eliminating complexity so that you can go from querying unstructured data to getting intelligent results in just a few lines of code."}),"\n",(0,o.jsx)(n.h2,{id:"-whats-new-in-mongodb-rag",children:"\ud83d\ude80 What's New in MongoDB-RAG?"}),"\n",(0,o.jsx)(n.p,{children:"Since launching the first version, we've been working hard to refine and expand the library. Here are some of the latest features that make MongoDB-RAG a must-have for building RAG applications with MongoDB Atlas:"}),"\n",(0,o.jsx)(n.h3,{id:"-dynamic-database--collection-selection",children:"\ud83d\udd39 Dynamic Database & Collection Selection"}),"\n",(0,o.jsx)(n.p,{children:"Developers can now specify custom databases and collections at query time, allowing more flexible data organization. Previously, all data had to be stored in a predefined database, but now you can run searches dynamically across multiple datasets."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-javascript",children:'\nconst results = await rag.search("What is AI?", {\n  database: "research_db",\n  collection: "ai_papers",\n  maxResults: 5\n});\n'})}),"\n",(0,o.jsx)(n.h3,{id:"-intelligent-document-chunking",children:"\ud83d\udd39 Intelligent Document Chunking"}),"\n",(0,o.jsx)(n.p,{children:"One of the biggest challenges in RAG is breaking large documents into meaningful chunks. MongoDB-RAG now includes three advanced chunking strategies:"}),"\n",(0,o.jsxs)(n.ol,{children:["\n",(0,o.jsx)(n.li,{children:"Sliding Window - Maintains context with overlapping chunks"}),"\n",(0,o.jsx)(n.li,{children:"Semantic Chunking - Uses sentence boundaries to create more meaningful segments"}),"\n",(0,o.jsx)(n.li,{children:"Recursive Chunking - Dynamically splits large sections into smaller chunks"}),"\n"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:'const chunkedDocs = chunker.chunkDocument(myDocument, { strategy: "semantic" });\n'})}),"\n",(0,o.jsx)(n.h3,{id:"-multi-embedding-provider-support",children:"\ud83d\udd39 Multi-Embedding Provider Support"}),"\n",(0,o.jsx)(n.p,{children:"MongoDB-RAG now supports multiple embedding providers\u2014so you're not locked into one ecosystem."}),"\n",(0,o.jsx)(n.p,{children:"Supported providers include:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"\u2705 OpenAI (text-embedding-3-small, text-embedding-3-large)"}),"\n",(0,o.jsx)(n.li,{children:"\u2705 DeepSeek (high-performance embeddings with affordable pricing)"}),"\n",(0,o.jsx)(n.li,{children:"\u2705 Ollama (local LLM-based embeddings for privacy and cost-efficiency)"}),"\n"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:'const rag = new MongoRAG({\n  embedding: { provider: "ollama", baseUrl: "http://localhost:11434", model: "llama3" }\n});\n'})}),"\n",(0,o.jsx)(n.h3,{id:"-vector-quantization-for-faster-queries",children:"\ud83d\udd39 Vector Quantization for Faster Queries"}),"\n",(0,o.jsx)(n.p,{children:"We've integrated automatic vector quantization, reducing memory footprint and boosting search performance in MongoDB Atlas. You can now enable scalar or binary quantization effortlessly."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:'const indexDefinition = {\n  fields: [\n    { type: "vector", path: "embedding", numDimensions: 1536, similarity: "cosine", quantization: "binary" }\n  ]\n};\n'})}),"\n",(0,o.jsx)(n.h3,{id:"-hybrid-search-combining-vector--metadata-filters",children:"\ud83d\udd39 Hybrid Search: Combining Vector & Metadata Filters"}),"\n",(0,o.jsx)(n.p,{children:"One of the biggest advantages of MongoDB over other vector databases is the ability to perform hybrid searches\u2014combining vector similarity with traditional filters."}),"\n",(0,o.jsx)(n.p,{children:"MongoDB-RAG makes it seamless:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:'const results = await rag.search("Latest AI papers", {\n  database: "research_db",\n  collection: "papers",\n  filter: { "metadata.year": { $gte: 2022 } }\n});\n'})}),"\n",(0,o.jsx)(n.p,{children:"Now, you can refine vector searches using structured metadata like dates, authors, or categories."}),"\n",(0,o.jsx)(n.h2,{id:"-how-to-get-started",children:"\u26a1 How to Get Started"}),"\n",(0,o.jsx)(n.p,{children:"Setting up MongoDB-RAG is ridiculously easy. Just install the package and connect it to your MongoDB Atlas cluster:"}),"\n",(0,o.jsx)(n.p,{children:"1\ufe0f\u20e3 Install MongoDB-RAG"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"npm install mongodb-rag dotenv\n"})}),"\n",(0,o.jsx)(n.p,{children:"2\ufe0f\u20e3 Set Up MongoDB Atlas\nEnsure you have an Atlas cluster with Vector Search enabled, then store your connection string in .env:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"MONGODB_URI=mongodb+srv://your-user:your-password@your-cluster.mongodb.net/\nEMBEDDING_PROVIDER=openai\nEMBEDDING_API_KEY=your-openai-api-key\nEMBEDDING_MODEL=text-embedding-3-small\n"})}),"\n",(0,o.jsx)(n.p,{children:"3\ufe0f\u20e3 Ingest Documents"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:'const documents = [\n  { id: "doc1", content: "MongoDB is a NoSQL database.", metadata: { source: "docs" } },\n  { id: "doc2", content: "Vector search is useful for semantic search.", metadata: { source: "ai" } }\n];\n\nawait rag.ingestBatch(documents, { database: "my_db", collection: "docs" });\n'})}),"\n",(0,o.jsx)(n.p,{children:"4\ufe0f\u20e3 Perform a Vector Search"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:'const results = await rag.search("How does vector search work?", {\n  database: "my_db",\n  collection: "docs",\n  maxResults: 3\n});\nconsole.log("Search Results:", results);\n'})}),"\n",(0,o.jsx)(n.p,{children:"And just like that, your MongoDB-powered RAG application is up and running!"}),"\n",(0,o.jsx)(n.h2,{id:"-whats-next",children:"\ud83d\udd2e What's Next?"}),"\n",(0,o.jsx)(n.p,{children:"We're constantly evolving MongoDB-RAG based on developer feedback. Here's what's coming next:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"\u2705 RAG Pipelines: End-to-end orchestration for document retrieval & LLM response generation"}),"\n",(0,o.jsx)(n.li,{children:"\u2705 Integration with LangChain: Seamless connection with AI agent frameworks"}),"\n",(0,o.jsx)(n.li,{children:"\u2705 Built-in UI Dashboard: Visualize vector search performance and document embeddings"}),"\n"]}),"\n",(0,o.jsx)(n.h2,{id:"-final-thoughts",children:"\ud83c\udfaf Final Thoughts"}),"\n",(0,o.jsx)(n.p,{children:"I built MongoDB-RAG because I wanted an easier, more efficient way to work with vector search in MongoDB. Instead of reinventing the wheel every time I built a RAG system, I wanted a reusable, well-optimized library that handles all the heavy lifting."}),"\n",(0,o.jsx)(n.p,{children:"Now, with dynamic database selection, hybrid search, intelligent chunking, and multi-provider embeddings, I truly believe MongoDB-RAG is the fastest way to build production-ready RAG applications."}),"\n",(0,o.jsx)(n.p,{children:"Give it a try, and let me know what you think! \ud83d\ude80"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"\ud83d\udccc GitHub Repo: github.com/mongodb-developer/mongodb-rag"}),"\n",(0,o.jsx)(n.li,{children:"\ud83d\udccc NPM Package: npmjs.com/package/mongodb-rag"}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"Let's simplify RAG development together! \ud83d\udc4f"})]})}function h(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}}}]);