// src/pages/chatbot.jsx
import React from 'react';
import Layout from '@theme/Layout';
import ChatbotInterface from '../components/ChatbotInterface';
import './chatbot-page.css';

export default function ChatbotPage() {
  return (
    <Layout
      title="MongoDB-RAG Chatbot"
      description="Ask questions about MongoDB-RAG and get instant answers"
      wrapperClassName="chatbot-page-layout"
    >
      <div className="chatbot-page">
        <header className="chatbot-header">
          <h1>MongoDB-RAG Chatbot</h1>
          <p>Ask questions about MongoDB-RAG, implementation details, or how to use the library</p>
        </header>
        
        <ChatbotInterface />
        
        <div className="beta-badge">
          Beta
        </div>
      </div>
    </Layout>
  );
}