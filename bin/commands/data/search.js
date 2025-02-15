// bin/commands/data/search.js
import chalk from 'chalk';
import { isConfigValid } from '../../utils/validation.js';
import MongoRAG from '../../../src/core/MongoRAG.js';

export async function searchDocuments(config, query, options = {}) {
  if (!isConfigValid(config)) {
    throw new Error("Configuration missing. Run 'npx mongodb-rag init' first.");
  }

  const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

  try {
    if (isDevelopment) {
      console.log('Creating MongoRAG instance...');
    }

    const rag = new MongoRAG(config);

    if (isDevelopment) {
      console.log('Connecting to MongoDB...');
    }

    await rag.connect();

    const searchOptions = {
      database: options.database || config.database,
      collection: options.collection || config.collection,
      maxResults: options.maxResults || config.search?.maxResults || 5,
      minScore: options.minScore || config.search?.minScore || 0.7,
      includeMetadata: true
    };

    if (isDevelopment) {
      console.log(chalk.blue(`🔍 Searching for: "${query}"`));
      console.log(chalk.blue('Search options:'), searchOptions);
    }

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
    throw error;
  }
}