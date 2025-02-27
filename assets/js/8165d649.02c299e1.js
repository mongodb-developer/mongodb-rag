"use strict";(self.webpackChunkmongodb_rag_docs=self.webpackChunkmongodb_rag_docs||[]).push([[2726],{5393:function(e,n,o){o.d(n,{A:function(){return c}});o(6540);var t=o(9382),s=o(9030),r=o(4848);function c(e){return(0,r.jsx)(t.A,{...e,children:(0,r.jsx)("img",{src:(0,s.Ay)(e.src),alt:e.alt})})}},6258:function(e,n,o){o.r(n),o.d(n,{assets:function(){return l},contentTitle:function(){return a},default:function(){return h},frontMatter:function(){return i},metadata:function(){return t},toc:function(){return d}});var t=JSON.parse('{"id":"workshop/mongodb-atlas/setup-mongodb","title":"\ud83d\udc50 Creating a Cluster","description":"Deploying a MongoDB Atlas Cluster","source":"@site/docs/workshop/20-mongodb-atlas/3-create-cluster.mdx","sourceDirName":"workshop/20-mongodb-atlas","slug":"/workshop/mongodb-atlas/setup-mongodb","permalink":"/mongodb-rag/docs/workshop/mongodb-atlas/setup-mongodb","draft":false,"unlisted":false,"editUrl":"https://github.com/mongodb-developer/mongodb-rag/tree/main/mongodb-rag-docs/docs/workshop/20-mongodb-atlas/3-create-cluster.mdx","tags":[],"version":"current","sidebarPosition":3,"frontMatter":{"id":"setup-mongodb","title":"\ud83d\udc50 Creating a Cluster"},"sidebar":"docs","previous":{"title":"\ud83d\udc50 Create Account","permalink":"/mongodb-rag/docs/workshop/mongodb-atlas/2-create-account"},"next":{"title":"\ud83d\udcd7 Understanding RAG Concepts","permalink":"/mongodb-rag/docs/workshop/RAG-Concepts/rag-introduction"}}'),s=o(4848),r=o(8453),c=(o(9382),o(5393));const i={id:"setup-mongodb",title:"\ud83d\udc50 Creating a Cluster"},a=void 0,l={},d=[{value:"Deploying a MongoDB Atlas Cluster",id:"deploying-a-mongodb-atlas-cluster",level:2},{value:"Configuring Database Access",id:"configuring-database-access",level:2},{value:"Configuring Network Access",id:"configuring-network-access",level:2},{value:"Loading Sample Data (Optional)",id:"loading-sample-data-optional",level:2},{value:"Getting Your Connection String",id:"getting-your-connection-string",level:2},{value:"Creating a .env File",id:"creating-a-env-file",level:2},{value:"For the CLI Gurus",id:"for-the-cli-gurus",level:3},{value:"Testing Your Connection",id:"testing-your-connection",level:2},{value:"Next Steps",id:"next-steps",level:2}];function u(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h2,{id:"deploying-a-mongodb-atlas-cluster",children:"Deploying a MongoDB Atlas Cluster"}),"\n",(0,s.jsx)(n.p,{children:"Once you have an account, follow these steps to create a new cluster:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["Log in to your ",(0,s.jsx)(n.a,{href:"https://cloud.mongodb.com",children:"MongoDB Atlas account"})]}),"\n",(0,s.jsx)(n.li,{children:'Click the "Build a Database" button'}),"\n",(0,s.jsx)(n.li,{children:"Choose your preferred cloud provider (AWS, GCP, or Azure)"}),"\n",(0,s.jsx)(n.li,{children:'Select the "M0 Free Tier" cluster for this workshop'}),"\n",(0,s.jsx)(n.li,{children:"Choose a region close to your location"}),"\n",(0,s.jsx)(n.li,{children:'Click "Create" to deploy your cluster'}),"\n"]}),"\n",(0,s.jsx)(c.A,{url:"https://cloud.mongodb.com",src:"img/screenshots/20-mongodb-atlas/cluster-overview.png",alt:"Account creation form"}),"\n",(0,s.jsx)(n.p,{children:"While your cluster is being created (which takes a few minutes), let's configure access settings."}),"\n",(0,s.jsx)(n.h2,{id:"configuring-database-access",children:"Configuring Database Access"}),"\n",(0,s.jsx)(n.p,{children:"You'll need to create a database user to connect to your cluster:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:'In the sidebar, click "Database Access" under SECURITY'}),"\n",(0,s.jsx)(n.li,{children:'Click "Add New Database User"'}),"\n",(0,s.jsx)(n.li,{children:"Enter a username and password (save these credentials!)"}),"\n",(0,s.jsx)(n.li,{children:'Select "Built-in Role" and choose "Read and write to any database"'}),"\n",(0,s.jsx)(n.li,{children:'Click "Add User"'}),"\n"]}),"\n",(0,s.jsx)(n.admonition,{type:"caution",children:(0,s.jsx)(n.p,{children:"Store your database credentials securely. You'll need them to connect to your cluster."})}),"\n",(0,s.jsx)(n.h2,{id:"configuring-network-access",children:"Configuring Network Access"}),"\n",(0,s.jsx)(n.p,{children:"Next, configure network access to allow connections from your development environment:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:'In the sidebar, click "Network Access" under SECURITY'}),"\n",(0,s.jsx)(n.li,{children:'Click "Add IP Address"'}),"\n",(0,s.jsx)(n.li,{children:'For this workshop, select "Allow Access from Anywhere" (not recommended for production)'}),"\n",(0,s.jsx)(n.li,{children:'Click "Confirm"'}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"loading-sample-data-optional",children:"Loading Sample Data (Optional)"}),"\n",(0,s.jsx)(n.p,{children:"MongoDB Atlas provides sample datasets that you can use for this workshop:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:'On your cluster\'s overview page, click "Browse Collections"'}),"\n",(0,s.jsx)(n.li,{children:'Click "Load Sample Dataset"'}),"\n",(0,s.jsx)(n.li,{children:"Wait for the sample data to be loaded"}),"\n"]}),"\n",(0,s.jsx)(c.A,{url:"https://cloud.mongodb.com",src:"img/screenshots/20-mongodb-atlas/load-sample-data.png",alt:"Account creation form"}),"\n",(0,s.jsx)(n.h2,{id:"getting-your-connection-string",children:"Getting Your Connection String"}),"\n",(0,s.jsx)(c.A,{url:"https://cloud.mongodb.com",src:"img/screenshots/20-mongodb-atlas/connect.gif",alt:"Connection"}),"\n",(0,s.jsx)(n.p,{children:"To connect to your cluster from your application, you'll need your connection string:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:'On your cluster\'s overview page, click "Connect"'}),"\n",(0,s.jsx)(n.li,{children:'Select "Connect your application"'}),"\n",(0,s.jsx)(n.li,{children:'Choose "Node.js" as your driver and the appropriate version'}),"\n",(0,s.jsx)(n.li,{children:"Copy the connection string"}),"\n",(0,s.jsxs)(n.li,{children:["Replace ",(0,s.jsx)(n.code,{children:"<password>"})," with your database user's password"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Save this connection string - you'll use it in the next sections."}),"\n",(0,s.jsx)(n.h2,{id:"creating-a-env-file",children:"Creating a .env File"}),"\n",(0,s.jsxs)(n.p,{children:["Let's create a ",(0,s.jsx)(n.code,{children:".env"})," file to store your configuration. Create a new file named ",(0,s.jsx)(n.code,{children:".env"})," in your project directory with the following content:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"MONGODB_URI=mongodb+srv://username:password@clustername.mongodb.net/\nEMBEDDING_PROVIDER=openai  # Can be openai, ollama, etc.\nEMBEDDING_API_KEY=your-api-key-here  # Your OpenAI API key or leave empty for Ollama\nEMBEDDING_MODEL=text-embedding-3-small  # For OpenAI or your preferred model\n"})}),"\n",(0,s.jsx)(n.p,{children:"Replace the placeholder values with your actual credentials."}),"\n",(0,s.jsx)(n.h3,{id:"for-the-cli-gurus",children:"For the CLI Gurus"}),"\n",(0,s.jsxs)(n.p,{children:["If you're a CLI guru, you can use the ",(0,s.jsx)(n.code,{children:"mdb"})," CLI to create a new cluster and connect to it."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"npx mongodb-rag init\n"})}),"\n",(0,s.jsx)(n.p,{children:"This will prompt you for all of the variables required to build a RAG App."}),"\n",(0,s.jsx)(n.p,{children:"Once you have the .mongodb-rag.json file created, you can also create a .env from the same values using the following:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"npx mongodb-rag create-env\n"})}),"\n",(0,s.jsx)(n.h2,{id:"testing-your-connection",children:"Testing Your Connection"}),"\n",(0,s.jsxs)(n.p,{children:["Let's verify that your connection is working. Create a file named ",(0,s.jsx)(n.code,{children:"test-connection.js"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"const { MongoClient } = require('mongodb');\nrequire('dotenv').config();\n\nasync function testConnection() {\n  const uri = process.env.MONGODB_URI;\n  const client = new MongoClient(uri);\n  \n  try {\n    await client.connect();\n    console.log('\u2705 Successfully connected to MongoDB Atlas');\n    \n    const databases = await client.db().admin().listDatabases();\n    console.log('Available databases:');\n    databases.databases.forEach(db => console.log(` - ${db.name}`));\n    \n  } catch (error) {\n    console.error('\u274c Connection failed:', error);\n  } finally {\n    await client.close();\n  }\n}\n\ntestConnection();\n"})}),"\n",(0,s.jsx)(n.p,{children:"Run the script with:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"node test-connection.js\n"})}),"\n",(0,s.jsx)(n.p,{children:'If you see "Successfully connected to MongoDB Atlas" and a list of databases, your connection is working correctly!'}),"\n",(0,s.jsx)(n.h2,{id:"next-steps",children:"Next Steps"}),"\n",(0,s.jsx)(n.p,{children:"Now that you have set up MongoDB Atlas with Vector Search capabilities, you're ready to create vector embeddings and store them in your cluster."})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(u,{...e})}):u(e)}},8453:function(e,n,o){o.d(n,{R:function(){return c},x:function(){return i}});var t=o(6540);const s={},r=t.createContext(s);function c(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:c(e.components),t.createElement(r.Provider,{value:n},e.children)}},9382:function(e,n,o){o.d(n,{A:function(){return s}});o(6540);var t=o(4848);function s(e){const n=e.url||"http://localhost:3000";return(0,t.jsxs)("div",{className:"browser container",children:[(0,t.jsxs)("div",{className:"row",children:[(0,t.jsxs)("div",{className:"column left",children:[(0,t.jsx)("span",{className:"dot",style:{background:"#ED594A"}}),(0,t.jsx)("span",{className:"dot",style:{background:"#FDD800"}}),(0,t.jsx)("span",{className:"dot",style:{background:"#5AC05A"}})]}),(0,t.jsx)("div",{className:"column middle",children:(0,t.jsx)("input",{type:"text",value:n})}),(0,t.jsx)("div",{className:"column right",children:(0,t.jsxs)("div",{style:{float:"right"},children:[(0,t.jsx)("span",{className:"bar"}),(0,t.jsx)("span",{className:"bar"}),(0,t.jsx)("span",{className:"bar"})]})})]}),(0,t.jsx)("div",{className:"content",children:e.children})]})}}}]);