// bin/commands/data/search.js
import chalk from 'chalk';
import { isConfigValid } from '../../utils/validation.js';
import MongoRAG from '../../../src/core/MongoRAG.js';
import { formatSearchResults } from '../../utils/formatting.js';

export async function searchDocuments(config, query, options) {
  const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

  // Add debug logging in development
  if (isDevelopment) {
    console.log('Debug: Received config:', config);
  }

  // More specific validation
  if (!config || !config.mongoUrl || !config.database || !config.collection) {
    throw new Error("Invalid configuration. Required fields: mongoUrl, database, collection");
  }

  if (!config.embedding?.dimensions) {
    throw new Error("Configuration missing embedding dimensions");
  }

  if (isDevelopment) {
    console.log(chalk.cyan.bold(`📂 Database: ${options.database || config.database}`));
    console.log(chalk.cyan.bold(`📑 Collection: ${options.collection || config.collection}`));
    console.log(chalk.yellow(`🔍 Performing vector search using index: ${config.indexName}`));
    console.log(chalk.yellow(`📐 Expected embedding dimensions: ${config.embedding.dimensions}`));
  }

  try {
    const rag = new MongoRAG(config);
    await rag.connect();

    // Get a test embedding to verify dimensions
    const testEmbedding = await rag.getEmbedding(query);
    if (testEmbedding.length !== config.embedding.dimensions) {
      throw new Error(
        `Embedding dimension mismatch: Model produces ${testEmbedding.length}-dimensional vectors, ` +
        `but index expects ${config.embedding.dimensions} dimensions. ` +
        `Please update your configuration or recreate the index with correct dimensions.`
      );
    }

    const searchParams = {
      database: options.database || config.database,
      collection: options.collection || config.collection,
      index: config.indexName,
      maxResults: options.maxResults || config.search?.maxResults || 5,
      minScore: options.minScore || config.search?.minScore || 0.7
    };

    const results = await rag.search(query, searchParams);
    return formatSearchResults(results);
  } catch (error) {
    if (isDevelopment) {
      console.error(chalk.red("❌ Search failed:"), error.message);
    }
    throw error;
  }
}
