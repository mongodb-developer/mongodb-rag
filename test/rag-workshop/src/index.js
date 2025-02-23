const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { generateResponse } = require('./generate');
const { searchDocuments } = require('./search');
const config = require('./config');

// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { query, maxResults } = req.query;
    
    if (!query) {
      return res.status(400).json({
        error: 'Missing required parameter: query'
      });
    }
    
    const results = await searchDocuments(query, {
      maxResults: maxResults ? parseInt(maxResults) : undefined
    });
    
    res.json({
      query,
      results
    });
    
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({
      error: 'An error occurred during search',
      message: error.message
    });
  }
});

// RAG endpoint
app.post('/api/rag', async (req, res) => {
  try {
    const { query, options } = req.body;
    
    if (!query) {
      return res.status(400).json({
        error: 'Missing required parameter: query'
      });
    }
    
    const response = await generateResponse(query, options);
    res.json(response);
    
  } catch (error) {
    console.error('RAG API error:', error);
    res.status(500).json({
      error: 'An error occurred during response generation',
      message: error.message
    });
  }
});

// Load and answer test questions
app.get('/api/test', async (req, res) => {
  try {
    const qaFilePath = path.join(__dirname, '../data/qa-pairs.json');
    const qaData = await fs.readJSON(qaFilePath);
    
    const results = [];
    
    for (const qa of qaData) {
      const response = await generateResponse(qa.question);
      
      // Check if the expected source appears in the sources
      const foundExpectedSource = response.sources.some(
        source => source.source.includes(qa.expected_source)
      );
      
      results.push({
        question: qa.question,
        answer: response.answer,
        expected_source: qa.expected_source,
        found_expected_source: foundExpectedSource,
        sources: response.sources
      });
    }
    
    res.json({
      total: qaData.length,
      correct_sources: results.filter(r => r.found_expected_source).length,
      results
    });
    
  } catch (error) {
    console.error('Test API error:', error);
    res.status(500).json({
      error: 'An error occurred during test',
      message: error.message
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 RAG application server running on port ${PORT}`);
  console.log(`📝 API Documentation:`);
  console.log(`   - GET  /healthz             Health check`);
  console.log(`   - GET  /api/search?query=X  Vector search`);
  console.log(`   - POST /api/rag              RAG response generation`);
  console.log(`   - GET  /api/test             Run test suite`);
});
