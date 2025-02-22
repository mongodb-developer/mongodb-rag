"use strict";(self.webpackChunkmongodb_rag_docs=self.webpackChunkmongodb_rag_docs||[]).push([[7998],{390:function(e,n,i){n.A=i.p+"assets/images/rag-app-screenshot-320291d2d5f0eebff1816f03d9ec5e75.png"},4149:function(e,n,i){i.r(n),i.d(n,{assets:function(){return o},contentTitle:function(){return s},default:function(){return p},frontMatter:function(){return c},metadata:function(){return r},toc:function(){return d}});var r=JSON.parse('{"id":"create-rag-app","title":"Creating a RAG Application","description":"The MongoDB RAG CLI provides a powerful create-rag-app command that helps you quickly scaffold a complete RAG (Retrieval Augmented Generation) application with both frontend and backend components.","source":"@site/docs/create-rag-app.md","sourceDirName":".","slug":"/create-rag-app","permalink":"/mongodb-rag/docs/create-rag-app","draft":false,"unlisted":false,"editUrl":"https://github.com/mongodb-developer/mongodb-rag/tree/main/mongodb-rag-docs/docs/create-rag-app.md","tags":[],"version":"current","frontMatter":{"id":"create-rag-app","title":"Creating a RAG Application","sidebar_label":"Create RAG App"},"sidebar":"docs","previous":{"title":"Advanced Example","permalink":"/mongodb-rag/docs/examples/advanced-example"},"next":{"title":"API Reference","permalink":"/mongodb-rag/docs/api-reference"}}'),t=i(4848),a=i(8453);const c={id:"create-rag-app",title:"Creating a RAG Application",sidebar_label:"Create RAG App"},s="Creating a MongoDB RAG Application",o={},d=[{value:"Quick Start",id:"quick-start",level:2},{value:"Project Structure",id:"project-structure",level:2},{value:"Setup",id:"setup",level:2},{value:"Features",id:"features",level:2},{value:"Backend",id:"backend",level:3},{value:"Frontend",id:"frontend",level:3},{value:"API Endpoints",id:"api-endpoints",level:2},{value:"Customization",id:"customization",level:2},{value:"Next Steps",id:"next-steps",level:2}];function l(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,a.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"creating-a-mongodb-rag-application",children:"Creating a MongoDB RAG Application"})}),"\n",(0,t.jsxs)(n.p,{children:["The MongoDB RAG CLI provides a powerful ",(0,t.jsx)(n.code,{children:"create-rag-app"})," command that helps you quickly scaffold a complete RAG (Retrieval Augmented Generation) application with both frontend and backend components."]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"MongoDB RAG Application Interface",src:i(390).A+"",width:"680",height:"552"})}),"\n",(0,t.jsx)(n.h2,{id:"quick-start",children:"Quick Start"}),"\n",(0,t.jsxs)(n.p,{children:["This command creates a new directory ",(0,t.jsx)(n.code,{children:"my-rag-app"})," with a fully configured RAG application."]}),"\n",(0,t.jsx)(n.h2,{id:"project-structure",children:"Project Structure"}),"\n",(0,t.jsx)(n.p,{children:"The generated application includes:"}),"\n",(0,t.jsx)(n.h2,{id:"setup",children:"Setup"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"Navigate to your project directory:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"cd my-rag-app\n"})}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["Configure your environment variables in ",(0,t.jsx)(n.code,{children:"backend/.env"}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"MONGODB_URI=your_mongodb_uri\nOPENAI_API_KEY=your_openai_key\n"})}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"Install dependencies and start the application:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"# Install backend dependencies\ncd backend && npm install\n\n# Install frontend dependencies\ncd ../frontend && npm install\n\n# Start both frontend and backend (from root directory)\nnpm run dev\n"})}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"features",children:"Features"}),"\n",(0,t.jsx)(n.h3,{id:"backend",children:"Backend"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Express.js server with MongoDB integration"}),"\n",(0,t.jsx)(n.li,{children:"Pre-configured RAG endpoints"}),"\n",(0,t.jsx)(n.li,{children:"Document processing and vector storage"}),"\n",(0,t.jsx)(n.li,{children:"Streaming chat responses"}),"\n",(0,t.jsx)(n.li,{children:"Error handling middleware"}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"frontend",children:"Frontend"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Modern React UI with Material-UI"}),"\n",(0,t.jsx)(n.li,{children:"Interactive chat interface"}),"\n",(0,t.jsx)(n.li,{children:"Document upload and management"}),"\n",(0,t.jsx)(n.li,{children:"Real-time search results"}),"\n",(0,t.jsx)(n.li,{children:"Mobile-responsive design"}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"api-endpoints",children:"API Endpoints"}),"\n",(0,t.jsx)(n.p,{children:"The backend exposes these REST API endpoints:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"POST /api/documents"})," - Upload and process documents"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"POST /api/chat"})," - Send questions and receive AI-generated responses"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"GET /api/search"})," - Perform vector similarity search"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"GET /api/documents"})," - Retrieve processed documents"]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"customization",children:"Customization"}),"\n",(0,t.jsx)(n.p,{children:"You can customize the application by:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["Adjusting vector search parameters in ",(0,t.jsx)(n.code,{children:"backend/src/config/ragConfig.js"})]}),"\n",(0,t.jsx)(n.li,{children:"Modifying UI components in the frontend"}),"\n",(0,t.jsx)(n.li,{children:"Adding authentication and authorization"}),"\n",(0,t.jsx)(n.li,{children:"Implementing domain-specific features"}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"next-steps",children:"Next Steps"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"Deploy your application"}),"\n",(0,t.jsx)(n.li,{children:"Add your documents to the system"}),"\n",(0,t.jsx)(n.li,{children:"Customize the UI to match your brand"}),"\n",(0,t.jsx)(n.li,{children:"Implement user authentication"}),"\n",(0,t.jsx)(n.li,{children:"Add features specific to your use case"}),"\n"]})]})}function p(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(l,{...e})}):l(e)}},8453:function(e,n,i){i.d(n,{R:function(){return c},x:function(){return s}});var r=i(6540);const t={},a=r.createContext(t);function c(e){const n=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:c(e.components),r.createElement(a.Provider,{value:n},e.children)}}}]);