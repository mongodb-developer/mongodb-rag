"use strict";(self.webpackChunkmongodb_rag_docs=self.webpackChunkmongodb_rag_docs||[]).push([[6882],{2885:function(n,e,o){o.r(e),o.d(e,{assets:function(){return l},contentTitle:function(){return c},default:function(){return g},frontMatter:function(){return s},metadata:function(){return r},toc:function(){return a}});var r=JSON.parse('{"id":"workshop/MongoDB-RAG/install-configure","title":"\ud83d\udee0\ufe0f Install and Configure MongoDB-RAG","description":"Step 1: Initialize Your Project","source":"@site/docs/workshop/40-MongoDB-RAG/2-install-configure.mdx","sourceDirName":"workshop/40-MongoDB-RAG","slug":"/workshop/MongoDB-RAG/install-configure","permalink":"/mongodb-rag/docs/workshop/MongoDB-RAG/install-configure","draft":false,"unlisted":false,"editUrl":"https://github.com/mongodb-developer/mongodb-rag/tree/main/mongodb-rag-docs/docs/workshop/40-MongoDB-RAG/2-install-configure.mdx","tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"id":"install-configure","title":"\ud83d\udee0\ufe0f Install and Configure MongoDB-RAG"},"sidebar":"docs","previous":{"title":"Introduction to MongoDB-RAG","permalink":"/mongodb-rag/docs/workshop/MongoDB-RAG/introduction"},"next":{"title":"\ud83d\udc50 Creating Vector Embeddings","permalink":"/mongodb-rag/docs/workshop/MongoDB-RAG/create-embeddings"}}'),i=o(4848),t=o(8453);const s={id:"install-configure",title:"\ud83d\udee0\ufe0f Install and Configure MongoDB-RAG"},c=void 0,l={},a=[{value:"Step 1: Initialize Your Project",id:"step-1-initialize-your-project",level:2},{value:"Step 2: Install MongoDB-RAG",id:"step-2-install-mongodb-rag",level:2},{value:"Step 3: Configure Environment Variables",id:"step-3-configure-environment-variables",level:2},{value:"Step 4: Create a RAG Application",id:"step-4-create-a-rag-application",level:2},{value:"Conclusion",id:"conclusion",level:2}];function d(n){const e={a:"a",code:"code",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,t.R)(),...n.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(e.h2,{id:"step-1-initialize-your-project",children:"Step 1: Initialize Your Project"}),"\n",(0,i.jsxs)(e.ol,{children:["\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.strong,{children:"Create a New Directory"}),": Start by creating a new directory for your project."]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-bash:mongodb-rag-docs/docs/workshop/40-MongoDB-RAG/2-setup-mongodb.mdx",children:"mkdir my-rag-project\ncd my-rag-project\n"})}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.strong,{children:"Initialize a Node.js Project"}),": Run the following command to initialize a new Node.js project."]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-bash",children:"npm init -y\n"})}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(e.h2,{id:"step-2-install-mongodb-rag",children:"Step 2: Install MongoDB-RAG"}),"\n",(0,i.jsxs)(e.ol,{children:["\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.strong,{children:"Install the Library"}),": Use npm to install the ",(0,i.jsx)(e.code,{children:"mongodb-rag"})," library."]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-bash",children:"npm install mongodb-rag\n"})}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.strong,{children:"Install Additional Dependencies"}),": Depending on your setup, you might need additional packages like ",(0,i.jsx)(e.code,{children:"dotenv"})," for environment variables."]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-bash",children:"npm install dotenv\n"})}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(e.h2,{id:"step-3-configure-environment-variables",children:"Step 3: Configure Environment Variables"}),"\n",(0,i.jsxs)(e.ol,{children:["\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsxs)(e.strong,{children:["Create a ",(0,i.jsx)(e.code,{children:".env"})," File"]}),": In the root of your project, create a ",(0,i.jsx)(e.code,{children:".env"})," file to store your environment variables."]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-plaintext",children:"MONGODB_URI=your_mongodb_connection_string\nOPENAI_API_KEY=your_openai_api_key\n"})}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.strong,{children:"Load Environment Variables"}),": Ensure your application loads these variables. You can do this by requiring ",(0,i.jsx)(e.code,{children:"dotenv"})," at the start of your main file."]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-javascript",children:"require('dotenv').config();\n"})}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(e.h2,{id:"step-4-create-a-rag-application",children:"Step 4: Create a RAG Application"}),"\n",(0,i.jsxs)(e.ol,{children:["\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.strong,{children:"Set Up MongoDB Connection"}),": Use the ",(0,i.jsx)(e.code,{children:"mongodb-rag"})," library to connect to your MongoDB instance."]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-javascript",children:'const { MongoClient } = require(\'mongodb\');\nconst client = new MongoClient(process.env.MONGODB_URI);\n\nasync function connectToDatabase() {\n  try {\n    await client.connect();\n    console.log("Connected to MongoDB");\n  } catch (error) {\n    console.error("Error connecting to MongoDB:", error);\n  }\n}\n'})}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.strong,{children:"Initialize RAG Components"}),": Set up the components needed for RAG, such as vector search and augmentation."]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-javascript",children:"const { RAG } = require('mongodb-rag');\n\nasync function createRAGApp() {\n  const rag = new RAG(client);\n  // Configure your RAG components here\n}\n"})}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.strong,{children:"Run Your Application"}),": Execute your script to ensure everything is set up correctly."]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-bash",children:"node index.js\n"})}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(e.h2,{id:"conclusion",children:"Conclusion"}),"\n",(0,i.jsxs)(e.p,{children:["By following these steps, you will have a basic setup for a RAG application using the ",(0,i.jsx)(e.code,{children:"mongodb-rag"})," library. This setup will allow you to explore the capabilities of RAG and integrate MongoDB with language models effectively. For more advanced configurations and features, refer to the ",(0,i.jsx)(e.a,{href:"#",children:"official documentation"}),"."]})]})}function g(n={}){const{wrapper:e}={...(0,t.R)(),...n.components};return e?(0,i.jsx)(e,{...n,children:(0,i.jsx)(d,{...n})}):d(n)}},8453:function(n,e,o){o.d(e,{R:function(){return s},x:function(){return c}});var r=o(6540);const i={},t=r.createContext(i);function s(n){const e=r.useContext(t);return r.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function c(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(i):n.components||i:s(n.components),r.createElement(t.Provider,{value:e},n.children)}}}]);