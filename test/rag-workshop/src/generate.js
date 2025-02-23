const { OpenAI } = require('openai');
const config = require('./config');
const { searchDocuments } = require('./search');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.llm.apiKey
});

/**
 * Generate a response using RAG
 * @param {string} query - User query
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} - Generated response and metadata
 */
async function generateResponse(query, options = {}) {
  try {
    // Step 1: Retrieve relevant documents
    const searchResults = await searchDocuments(query, {
      maxResults: options.maxResults || 3
    });
    
    if (searchResults.length === 0) {
      return {
        answer: "I couldn't find any relevant information to answer your question.",
        sources: []
      };
    }
    
    // Step 2: Format context from retrieved documents
    const context = searchResults
      .map(result => `Source: ${result.source}\nContent: ${result.content}`)
      .join('\n\n');
    
    // Step 3: Create prompt with context
    const messages = [
      {
        role: 'system',
        content: `You are a helpful assistant. Answer the user's question based ONLY on the provided context. 
                 If the context doesn't contain relevant information, say "I don't have enough information to answer that question."
                 Always cite your sources at the end of your answer.`
      },
      {
        role: 'user',
        content: `Context:\n${context}\n\nQuestion: ${query}`
      }
    ];
    
    // Step 4: Generate response using LLM
    const completion = await openai.chat.completions.create({
      model: config.llm.model,
      messages: messages,
      temperature: options.temperature || 0.3,
      max_tokens: options.maxTokens || 500
    });
    
    // Step 5: Return formatted response with sources
    return {
      answer: completion.choices[0].message.content,
      sources: searchResults.map(result => ({
        source: result.source,
        score: result.score
      }))
    };
    
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

// Export for use in other modules
module.exports = {
  generateResponse
};

// If run directly, perform a test generation
if (require.main === module) {
  const testQuery = process.argv[2] || 'What are the security features of MongoDB Atlas?';
  
  generateResponse(testQuery)
    .then(response => {
      console.log('\n🤖 Generated Answer:');
      console.log(response.answer);
      
      console.log('\n📚 Sources:');
      response.sources.forEach((source, i) => {
        console.log(`${i+1}. ${source.source} (relevance: ${source.score.toFixed(4)})`);
      });
    })
    .catch(console.error);
}
