// bin/commands/data/search.js
import chalk from 'chalk';
import { isConfigValid } from '../../utils/validation.js';
import MongoRAG from '../../../src/core/MongoRAG.js';
import IndexManager from '../../../src/core/IndexManager.js';

export async function searchDocuments(config, query, options = {}) {
  if (!isConfigValid(config)) {
    throw new Error("Configuration missing. Run 'npx mongodb-rag init' first.");
  }

  // Check for development mode more explicitly
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                       process.env.NODE_ENV === 'test' || 
                       process.env.DEBUG === 'true';
  
  console.log(`Environment: NODE_ENV=${process.env.NODE_ENV}, DEBUG=${process.env.DEBUG}`);
  console.log(`Running in ${isDevelopment ? 'development' : 'production'} mode`);

  try {
    if (isDevelopment) {
      console.log('Creating MongoRAG instance...');
      console.log('MongoRAG config:', JSON.stringify(config, null, 2));
    }

    const rag = new MongoRAG(config);

    if (isDevelopment) {
      console.log('Connecting to MongoDB...');
    }

    await rag.connect();

    if (isDevelopment) {
      console.log('Connection successful');
      console.log('MongoRAG instance methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(rag)));
      console.log('MongoRAG instance properties:', Object.keys(rag));
      console.log('Provider information:', rag.provider ? 'Initialized' : 'Not initialized');
    }

    // We'll skip the direct index check since we don't have access to the collection
    // and let the search method handle index verification
    const indexName = config.indexName || 'vector_index';

    const searchOptions = {
      database: options.database || config.database,
      collection: options.collection || config.collection,
      maxResults: options.maxResults || config.search?.maxResults || 5,
      minScore: options.minScore || config.search?.minScore || 0.7,
      includeMetadata: true,
      indexName,
      skipIndexCreation: true
    };

    if (isDevelopment) {
      console.log(chalk.blue(`🔍 Searching for: "${query}"`));
      console.log(chalk.blue('Search options:'), searchOptions);
    }

    // Monkey patch the search method to skip index creation
    const originalSearch = rag.search;
    rag.search = async function(query, options) {
      try {
        if (isDevelopment) {
          console.log('Executing monkey-patched search method');
          console.log('this.client exists:', !!this.client);
          console.log('this.provider exists:', !!this.provider);
          console.log('Query:', query);
          console.log('Options:', options);
        }
        
        const db = this.client.db(options.database || this.config.database);
        const collection = db.collection(options.collection || this.config.collection);
        
        if (isDevelopment) {
          console.log(`Using database: ${options.database || this.config.database}`);
          console.log(`Using collection: ${options.collection || this.config.collection}`);
          console.log('Generating embedding...');
        }
        
        // Generate the embedding using the correct method
        const embedding = await this.getEmbedding(query);
        
        if (isDevelopment) {
          console.log('Embedding generated successfully');
          console.log('Embedding dimensions:', embedding.length);
          console.log('Building search pipeline...');
        }
        
        // Use the IndexManager just for the search query building
        const indexManager = new IndexManager(collection, this.config);
        const searchPipeline = indexManager.buildSearchQuery(embedding, {}, options);
        
        if (isDevelopment) {
          console.log('Search pipeline:', JSON.stringify(searchPipeline, null, 2));
          console.log('Executing search...');
        }
        
        // Execute the search directly
        const results = await collection.aggregate(searchPipeline).toArray();
        
        if (isDevelopment) {
          console.log(`Search returned ${results.length} results`);
          if (results.length > 0) {
            console.log('Scores before filtering:');
            results.forEach(doc => console.log(`- Score: ${doc.score.toFixed(4)} - ${doc.content.substring(0, 50)}...`));
          }
        }
        
        // Filter results by score
        const filteredResults = results.filter(doc => 
          doc.score >= (options.minScore || this.config.search?.minScore || 0.7)
        );
        
        if (isDevelopment) {
          console.log(`After filtering by score, ${filteredResults.length} results remain`);
        }
        
        return filteredResults;
      } catch (error) {
        console.error('Error in monkey-patched search function:', error);
        throw error;
      }
    };

    const results = await rag.search(query, searchOptions);

    if (isDevelopment) {
      console.log(chalk.green(`\n✨ Found ${results.length} results:`));
    }

    // Format and display results
    results.forEach((result, index) => {
      console.log(chalk.yellow(`\n${index + 1}. Score: ${result.score.toFixed(3)}`));
      console.log(chalk.white(result.content));
      
      if (result.metadata) {
        console.log(chalk.gray('Metadata:'), result.metadata);
      }
    });

    await rag.close();
    return results;
  } catch (error) {
    console.error(chalk.red('❌ Search failed:'), error.message);
    console.error(chalk.red('Stack trace:'), error.stack);
    throw error;
  }
}