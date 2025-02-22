"use strict";(self.webpackChunkmongodb_rag_docs=self.webpackChunkmongodb_rag_docs||[]).push([[7522],{9947:function(e,s,t){t.r(s),t.d(s,{default:function(){return m}});var n=t(6540),a=t(1410),o=t(8746),r=t(7522),c=t(3081),i=t(2976),l=(t(5531),t(4848));const u=()=>{const[e,s]=(0,n.useState)(!0);return(0,n.useEffect)((()=>{const e=document.querySelector(".chat-input");if(!e)return;const t=()=>{e.value.length>0?s(!1):s(!0)};return e.addEventListener("input",t),()=>{e.removeEventListener("input",t)}}),[]),e?(0,l.jsxs)("div",{className:"sample-questions",children:[(0,l.jsx)("div",{className:"sample-questions-label",children:"Suggested questions:"}),(0,l.jsx)("div",{className:"sample-questions-buttons",children:["How do I configure MongoDB RAG with Ollama?","What's the difference between OpenAI and Ollama embeddings?","Can you fix my config file structure?","How do I troubleshoot connection issues?"].map(((e,t)=>(0,l.jsx)("button",{onClick:()=>(e=>{const t=document.querySelector(".chat-input");if(t){t.value=e;const n=new Event("input",{bubbles:!0});t.dispatchEvent(n),t.focus(),s(!1)}})(e),className:"sample-question-button",children:e},t)))})]}):null};function d(){const[e,s]=(0,n.useState)([{role:"assistant",content:"Hi! I'm the MongoDB-RAG chatbot. Ask me anything about using MongoDB-RAG!"}]),[t,a]=(0,n.useState)(""),[d,m]=(0,n.useState)(!1),[h,g]=(0,n.useState)(null),p=(0,n.useRef)(null),b=(0,n.useRef)(null);(0,n.useEffect)((()=>{p.current?.scrollIntoView({behavior:"smooth"})}),[e]),(0,n.useEffect)((()=>{b.current?.focus()}),[]),(0,n.useEffect)((()=>{const e=localStorage.getItem("mongodbRagChatSession");if(e)try{const{sid:t,msgs:n}=JSON.parse(e);t&&Array.isArray(n)&&(g(t),s(n))}catch(t){console.error("Error loading saved session",t)}}),[]),(0,n.useEffect)((()=>{h&&localStorage.setItem("mongodbRagChatSession",JSON.stringify({sid:h,msgs:e}))}),[h,e]);return(0,l.jsxs)("div",{className:"chatbot-container",children:[(0,l.jsx)("div",{className:"messages-area",children:(0,l.jsxs)("div",{className:"messages-container",children:[e.map(((e,s)=>(0,l.jsxs)("div",{className:`message ${e.role}`,children:[(0,l.jsx)("div",{className:"message-avatar",children:"assistant"===e.role?"\ud83e\udd16":"\ud83d\udc64"}),(0,l.jsx)("div",{className:"message-content",children:"assistant"===e.role?(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(o.oz,{rehypePlugins:[r.A,c.A],remarkPlugins:[i.A],children:e.content}),e.sources&&e.sources.length>0&&(0,l.jsx)("div",{className:"sources",children:(0,l.jsxs)("details",{children:[(0,l.jsx)("summary",{children:"Sources"}),(0,l.jsx)("ul",{children:e.sources.map(((e,s)=>(0,l.jsxs)("li",{children:[e.metadata?.title||"Document",(0,l.jsxs)("span",{className:"score",children:[Math.round(100*e.score),"% match"]})]},s)))})]})})]}):(0,l.jsx)("div",{children:e.content})})]},s))),d&&(0,l.jsxs)("div",{className:"message assistant",children:[(0,l.jsx)("div",{className:"message-avatar",children:"\ud83e\udd16"}),(0,l.jsx)("div",{className:"message-content",children:(0,l.jsxs)("div",{className:"loading-indicator",children:[(0,l.jsx)("span",{}),(0,l.jsx)("span",{}),(0,l.jsx)("span",{})]})})]}),(0,l.jsx)("div",{ref:p})]})}),(0,l.jsx)("div",{className:"input-area",children:(0,l.jsxs)("div",{className:"input-container",children:[(0,l.jsx)("button",{onClick:()=>{s([{role:"assistant",content:"Hi! I'm the MongoDB-RAG chatbot. Ask me anything about using MongoDB-RAG!"}]),g(null),localStorage.removeItem("mongodbRagChatSession"),b.current?.focus()},className:"clear-button",children:"Clear Chat"}),(0,l.jsx)(u,{}),(0,l.jsxs)("form",{onSubmit:async n=>{if(n.preventDefault(),!t.trim())return;const o={role:"user",content:t};s((e=>[...e,o])),a(""),m(!0);try{const n=await fetch("https://mongodb-rag-docs-backend.vercel.app/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:t,sessionId:h,history:h?void 0:e})}),a=await n.json();a.sessionId&&!h&&g(a.sessionId),s((e=>[...e,{role:"assistant",content:a.answer,sources:a.sources}]))}catch(r){console.error("Error:",r),s((e=>[...e,{role:"assistant",content:"Sorry, I encountered an error. Please try again later."}]))}finally{m(!1)}},className:"input-form",children:[(0,l.jsx)("input",{ref:b,type:"text",value:t,onChange:e=>a(e.target.value),placeholder:"Ask about MongoDB-RAG...",className:"chat-input",disabled:d}),(0,l.jsx)("button",{type:"submit",className:"send-button",disabled:d||!t.trim(),children:"Send"})]})]})})]})}function m(){return(0,l.jsx)(a.A,{title:"MongoDB-RAG Chatbot",description:"Ask questions about MongoDB-RAG and get instant answers",wrapperClassName:"chatbot-page-layout",children:(0,l.jsxs)("div",{className:"chatbot-page",children:[(0,l.jsx)(d,{}),(0,l.jsx)("div",{className:"beta-badge",children:"Beta"})]})})}}}]);