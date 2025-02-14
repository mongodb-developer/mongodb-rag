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
      throw error; 
    }

    if (!config || !config.embedding || !config.embedding.dimensions) {
      console.error(chalk.red("❌ MongoDB Error: Missing embedding dimensions in config."));
      throw new Error("Missing embedding dimensions in config."); // ✅ Instead of process.exit(1)
    }

    console.log(chalk.blue(`📌 Creating Vector Search Index: ${config.indexName}...`));

    const indexDefinition = {
      name: config.indexName || "vector_index",
      definition: {
        mappings: {
          dynamic: false,  // ✅ Fix: Set dynamic to false to explicitly define the index
          fields: {
            [config.embedding.path || "embedding"]: {
              type: "vector",
              numDimensions: config.embedding.dimensions || 1536,  // ✅ Ensure dimensions are set
              similarity: config.embedding.similarity || "cosine"
            }
          }
        }
      }
    };
    

    console.log(chalk.blue(`🔍 Debug: Index definition: `, JSON.stringify(indexDefinition, null, 2)));

    const indexResult = await collection.createSearchIndexes([indexDefinition]);

    console.log(chalk.green(`✅ Vector Search Index "${config.indexName}" created successfully!`));
    console.log(chalk.blue(`🔍 Index creation result:`), indexResult);
    return indexResult;
    await client.close();
    console.log(chalk.blue("🔍 MongoDB connection closed."));
  } catch (error) {
    console.error(chalk.red(`❌ MongoDB Error: ${error.message}`));
    throw error; 
  }
}
