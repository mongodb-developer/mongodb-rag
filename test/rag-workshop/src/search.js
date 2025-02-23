const { MongoRAG } = require('mongodb-rag');
const config = require('./config');

// Initialize MongoRAG
const rag = new MongoRAG({
  mongoUrl: config.mongodb.uri,
  database: config.mongodb.database,
  collection: config.mongodb.collection,
  embedding: config.embedding,
  search: {
    maxResults: config.search.maxResults,
    minScore: config.search.minScore
  }
});

/**
 * Search for documents relevant to a query
 * @param {string} query - The search query
 * @param {Object} options - Search options
 * @returns {Promise<Array>} - Search results
 */
async function searchDocuments(query, options = {}) {
  try {
    await rag.connect();
    
    console.log(`Searching for: "${query}"`);
    const results = await rag.search(query, {
      maxResults: options.maxResults || config.search.maxResults,
      filter: options.filter || {}
    });
    
    // Post-process results if needed
    const processedResults = results.map(result => {
      // Add source document if returnSources is enabled
      if (config.search.returnSources) {
        return {
          ...result,
          source: result.metadata?.filename || 'unknown'
        };
      }
      return result;
    });
    
    return processedResults;
    
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  } finally {
    await rag.close();
  }
}

// Export for use in other modules
module.exports = {
  searchDocuments
};

// If run directly, perform a test search
if (require.main === module) {
  const testQuery = process.argv[2] || 'What is MongoDB Atlas?';
  
  searchDocuments(testQuery)
    .then(results => {
      console.log(`Found ${results.length} results:`);
      results.forEach((result, i) => {
        console.log(`\nResult ${i+1} (score: ${result.score.toFixed(4)}):`);
        console.log(`Source: ${result.source}`);
        console.log(`Content: ${result.content.substring(0, 150)}...`);
      });
    })
    .catch(console.error);
}
