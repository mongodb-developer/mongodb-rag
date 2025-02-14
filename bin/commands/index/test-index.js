// bin/commands/index/test-index.js
import chalk from 'chalk';
import { getMongoClient } from '../../utils/mongodb.js';
import { isConfigValid } from '../../utils/validation.js';

export async function testIndex(config) {
  if (!isConfigValid(config)) {
    throw new Error("Configuration missing. Run 'npx mongodb-rag init' first.");
  }

  const client = await getMongoClient(config.mongoUrl);

  try {
    const collection = client.db(config.database).collection(config.collection);
    const indexes = await collection.indexes();

    if (indexes.some(idx => idx.name === config.indexName)) {
      console.log(chalk.green(`✅ Vector Index "${config.indexName}" exists and is ready for search.`));
      return { exists: true, indexName: config.indexName };
    } else {
      console.warn(chalk.yellow(`⚠️ Vector Index "${config.indexName}" not found! Run 'npx mongodb-rag create-index' first.`));
      return { exists: false, indexName: config.indexName };
    }
  } catch (error) {
    console.error(chalk.red("❌ Error testing index:"), error.message);
    throw error;
  } finally {
    await client.close();
  }
}