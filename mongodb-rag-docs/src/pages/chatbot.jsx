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
      
        
        <ChatbotInterface />
        
        <div className="beta-badge">
          Beta
        </div>
      </div>
    </Layout>
  );
}