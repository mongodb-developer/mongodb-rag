import chalk from 'chalk';
import { getMongoClient } from '../../utils/mongodb.js';
import { isConfigValid } from '../../utils/validation.js';

export async function createIndex(config) {
  console.log(chalk.blue(`🔍 Debug: Checking config...`), config);

  try {
    console.log(chalk.blue(`🔍 Debug: Connecting to MongoDB at ${config.mongoUrl}`));
    const client = await getMongoClient(config.mongoUrl);
    console.log(chalk.green(`✅ Debug: client obtained: Yes`));

    const db = client.db(config.database);
    const collection = db.collection(config.collection);

    console.log(chalk.blue(`📂 Database: ${config.database}`));
    console.log(chalk.blue(`📑 Collection: ${config.collection}`));

    // Verify if the function exists
    if (!collection.createSearchIndexes) {
      console.error(chalk.red("❌ Error: `createSearchIndexes()` is not available in this MongoDB version."));
      console.log(chalk.blue("🔍 Debug: Checking for existing search indexes..."));
      
      const existingIndexes = await collection.listSearchIndexes().toArray();
      console.log(chalk.blue("🔍 Existing indexes:"), existingIndexes);

      await client.close();
      throw new Error("createSearchIndexes() is not available"); 
    }

    if (!config || !config.embedding || !config.embedding.dimensions) {
      console.error(chalk.red("❌ MongoDB Error: Missing embedding dimensions in config."));
      throw new Error("Missing embedding dimensions in config.");
    }

    console.log(chalk.blue(`📌 Creating Vector Search Index: ${config.indexName}...`));

    const indexConfig = {
      name: config.indexName || "vector_index",
      type: "vectorSearch",
      definition: {
        fields: [{
          type: "vector",
          path: config.embedding.path || "embedding",
          numDimensions: config.embedding.dimensions,
          similarity: config.embedding.similarity || "cosine"
        }]
      }
    };

    console.log(chalk.blue(`🔍 Debug: Index definition: `), JSON.stringify(indexConfig, null, 2));

    try {
      const indexResult = await collection.createSearchIndex(indexConfig);
      console.log(chalk.green(`✅ Vector Search Index "${indexConfig.name}" created successfully!`));
      console.log(chalk.blue(`🔍 Index creation result:`), indexResult);
      
      await client.close();
      console.log(chalk.blue("🔍 MongoDB connection closed."));
      
      return {
        success: true,
        message: "Vector search index created successfully",
        indexName: indexConfig.name,
        result: indexResult
      };
    } catch (error) {
      console.error(chalk.red(`❌ Error creating search index: ${error.message}`));
      await client.close();
      throw error;
    }

  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error.message}`));
    throw error;
  }
}