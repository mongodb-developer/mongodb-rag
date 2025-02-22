// src/components/ChatbotInterface.jsx
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github.css';
import './ChatbotInterface.css'; // Using regular CSS instead of CSS modules for easier integration

// Sample Questions component as a proper React component
const SampleQuestions = ({ onSelectQuestion }) => {
  const [visible, setVisible] = useState(true);
  
  // Sample questions that will appear as clickable buttons
  const questions = [
    "How do I configure MongoDB RAG with Ollama?",
    "What's the difference between OpenAI and Ollama embeddings?",
    "Can you fix my config file structure?",
    "How do I troubleshoot connection issues?"
  ];
  
  // Function to handle clicking a question
  const handleQuestionClick = (question) => {
    // Call the callback with the selected question
    onSelectQuestion(question);
    // Hide suggestions
    setVisible(false);
  };
  
  if (!visible) return null;
  
  return (
    <div className="sample-questions">
      <div className="sample-questions-label">Suggested questions:</div>
      <div className="sample-questions-buttons">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleQuestionClick(question)}
            className="sample-question-button"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function ChatbotInterface() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m the MongoDB-RAG chatbot. Ask me anything about using MongoDB-RAG!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showSampleQuestions, setShowSampleQuestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Load session from localStorage on initial render
  useEffect(() => {
    const savedSession = localStorage.getItem('mongodbRagChatSession');
    if (savedSession) {
      try {
        const { sid, msgs } = JSON.parse(savedSession);
        if (sid && Array.isArray(msgs)) {
          setSessionId(sid);
          setMessages(msgs);
        }
      } catch (e) {
        console.error('Error loading saved session', e);
        // Invalid saved session, ignore it
      }
    }
  }, []);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('mongodbRagChatSession', JSON.stringify({
        sid: sessionId,
        msgs: messages
      }));
    }
  }, [sessionId, messages]);

  // Handle input changes and control sample questions visibility
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    
    // Show sample questions only when input is empty
    setShowSampleQuestions(value.length === 0);
  };

  // Handle selection of a sample question
  const handleSelectQuestion = (question) => {
    setInput(question);
    setShowSampleQuestions(false);
    // Focus the input field
    inputRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowSampleQuestions(true); // Show sample questions after sending

    try {
      // Call API with session support
      const response = await fetch('https://mongodb-rag-docs-backend.vercel.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: input,
          sessionId: sessionId,
          history: !sessionId ? messages : undefined // Only send history if no sessionId
        })
      });

      const data = await response.json();
      
      // Store the session ID if this is a new session
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }
      
      // Add bot response with sources
      setMessages((msgs) => [
        ...msgs, 
        { 
          role: 'assistant', 
          content: data.answer,
          sources: data.sources 
        }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((msgs) => [
        ...msgs,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again later.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    // Reset the chat
    setMessages([
      {
        role: 'assistant',
        content: 'Hi! I\'m the MongoDB-RAG chatbot. Ask me anything about using MongoDB-RAG!'
      }
    ]);
    
    // Clear the session ID to start a new session
    setSessionId(null);
    
    // Clear localStorage
    localStorage.removeItem('mongodbRagChatSession');
    
    // Clear input and show sample questions
    setInput('');
    setShowSampleQuestions(true);
    
    // Focus the input field
    inputRef.current?.focus();
  };

  return (
    <div className="chatbot-container">
      <div className="messages-area">
        <div className="messages-container">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.role}`}
            >
              <div className="message-avatar">
                {message.role === 'assistant' ? ' 🦉' : '👤'}
              </div>
              <div className="message-content">
                {message.role === 'assistant' ? (
                  <>
                    <ReactMarkdown
                      rehypePlugins={[rehypeHighlight, rehypeRaw]}
                      remarkPlugins={[remarkGfm]}
                    >
                      {message.content}
                    </ReactMarkdown>
                    
                    {message.sources && message.sources.length > 0 && (
                      <div className="sources">
                        <details>
                          <summary>Sources</summary>
                          <ul>
                            {message.sources.map((source, idx) => (
                              <li key={idx}>
                                {source.metadata?.title || 'Document'} 
                                <span className="score">
                                  {Math.round(source.score * 100)}% match
                                </span>
                              </li>
                            ))}
                          </ul>
                        </details>
                      </div>
                    )}
                  </>
                ) : (
                  <div>{message.content}</div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="loading-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="input-area">
        <div className="input-container">
          <button onClick={clearChat} className="clear-button">
            Clear Chat
          </button>
          
          {/* Show sample questions only when the flag is true */}
          {showSampleQuestions && (
            <SampleQuestions onSelectQuestion={handleSelectQuestion} />
          )}
          
          <form onSubmit={handleSubmit} className="input-form">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about MongoDB-RAG..."
              className="chat-input"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="send-button"
              disabled={isLoading || !input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}