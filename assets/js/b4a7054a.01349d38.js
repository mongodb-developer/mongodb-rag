"use strict";(self.webpackChunkmongodb_rag_docs=self.webpackChunkmongodb_rag_docs||[]).push([[129],{197:function(e,n,t){t.r(n),t.d(n,{assets:function(){return l},contentTitle:function(){return a},default:function(){return u},frontMatter:function(){return r},metadata:function(){return i},toc:function(){return c}});var i=JSON.parse('{"id":"examples/basic-example","title":"Basic Example","description":"This example demonstrates how to set up a simple RAG system using MongoDB-RAG for document retrieval and question answering.","source":"@site/docs/examples/basic-example.md","sourceDirName":"examples","slug":"/examples/basic-example","permalink":"/mongodb-rag/docs/examples/basic-example","draft":false,"unlisted":false,"editUrl":"https://github.com/mongodb-developer/mongodb-rag/tree/main/mongodb-rag-docs/docs/examples/basic-example.md","tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"id":"basic-example","title":"Basic Example","sidebar_position":1},"sidebar":"docs","previous":{"title":"CLI Reference","permalink":"/mongodb-rag/docs/cli-reference"},"next":{"title":"Advanced Example","permalink":"/mongodb-rag/docs/examples/advanced-example"}}'),s=t(4848),o=t(8453);const r={id:"basic-example",title:"Basic Example",sidebar_position:1},a="Basic RAG Example",l={},c=[{value:"Setup",id:"setup",level:2},{value:"Code Example",id:"code-example",level:2},{value:"Step-by-Step Explanation",id:"step-by-step-explanation",level:2},{value:"Expected Output",id:"expected-output",level:2},{value:"Additional Tips",id:"additional-tips",level:2}];function d(e){const n={code:"code",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"basic-rag-example",children:"Basic RAG Example"})}),"\n",(0,s.jsx)(n.p,{children:"This example demonstrates how to set up a simple RAG system using MongoDB-RAG for document retrieval and question answering."}),"\n",(0,s.jsx)(n.h2,{id:"setup",children:"Setup"}),"\n",(0,s.jsx)(n.p,{children:"First, install the required dependencies:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"npm install mongodb-rag dotenv\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Create a ",(0,s.jsx)(n.code,{children:".env"})," file with your configuration:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-env",children:"MONGODB_URI=your_mongodb_uri\nOPENAI_API_KEY=your_openai_api_key\n"})}),"\n",(0,s.jsx)(n.h2,{id:"code-example",children:"Code Example"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"import { MongoRAG } from 'mongodb-rag';\nimport dotenv from 'dotenv';\n\ndotenv.config();\n\nasync function main() {\n  // Initialize MongoRAG\n  const rag = new MongoRAG({\n    mongoUrl: process.env.MONGODB_URI,\n    database: 'ragExample',\n    collection: 'documents',\n    embedding: {\n      provider: 'openai',\n      apiKey: process.env.OPENAI_API_KEY,\n      model: 'text-embedding-ada-002' // OpenAI embedding model\n    }\n  });\n\n  // Connect to MongoDB\n  await rag.connect();\n\n  // Sample documents to ingest\n  const documents = [\n    {\n      title: 'MongoDB Overview',\n      content: 'MongoDB is a document database with the scalability and flexibility that you want with the querying and indexing that you need.'\n    },\n    {\n      title: 'Vector Search',\n      content: 'MongoDB Atlas Vector Search enables you to build vector search applications by storing embeddings and performing k-nearest neighbor (k-NN) search.'\n    }\n  ];\n\n  // Ingest documents\n  await rag.ingestBatch(documents);\n\n  // Perform a search\n  const searchResult = await rag.search('What is MongoDB?');\n  console.log('Search Results:', searchResult);\n}\n\nmain().catch(console.error);\n"})}),"\n",(0,s.jsx)(n.h2,{id:"step-by-step-explanation",children:"Step-by-Step Explanation"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Installation and Setup"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Install the required packages"}),"\n",(0,s.jsx)(n.li,{children:"Set up environment variables for MongoDB and OpenAI"}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Initialize MongoRAG"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Create a new instance with your configuration"}),"\n",(0,s.jsx)(n.li,{children:"Connect to MongoDB"}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Ingest Documents"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Prepare your documents in a simple format"}),"\n",(0,s.jsxs)(n.li,{children:["Use ",(0,s.jsx)(n.code,{children:"ingestBatch"})," to process and store documents"]}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Perform Search"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["Use the ",(0,s.jsx)(n.code,{children:"search"})," method to find relevant documents"]}),"\n",(0,s.jsx)(n.li,{children:"Results include similarity scores and document content"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"expected-output",children:"Expected Output"}),"\n",(0,s.jsx)(n.p,{children:"The search results will include:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Relevant document matches"}),"\n",(0,s.jsx)(n.li,{children:"Similarity scores"}),"\n",(0,s.jsx)(n.li,{children:"Original document content"}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"additional-tips",children:"Additional Tips"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Ensure your MongoDB Atlas cluster has Vector Search enabled"}),"\n",(0,s.jsx)(n.li,{children:"Index creation is handled automatically by the library"}),"\n",(0,s.jsx)(n.li,{children:"Use batched ingestion for large document sets"}),"\n",(0,s.jsx)(n.li,{children:"Monitor memory usage when processing large documents"}),"\n"]})]})}function u(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},8453:function(e,n,t){t.d(n,{R:function(){return r},x:function(){return a}});var i=t(6540);const s={},o=i.createContext(s);function r(e){const n=i.useContext(o);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),i.createElement(o.Provider,{value:n},e.children)}}}]);