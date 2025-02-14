// bin/commands/show-indexes.js
import chalk from 'chalk';
import { getMongoClient } from '../../utils/mongodb.js';
import { isConfigValid } from '../../utils/validation.js';
import { formatIndexOutput } from '../../utils/formatting.js';

export async function showIndexes(config) {
  if (!isConfigValid(config)) {
    throw new Error("Configuration missing. Run 'npx mongodb-rag init' first.");
  }

  console.log(chalk.cyan.bold(`📂 Database: ${config.database}`));
  console.log(chalk.cyan.bold(`📑 Collection: ${config.collection}`));

  const client = await getMongoClient(config.mongoUrl);

  try {
    const collection = client.db(config.database).collection(config.collection);

    // Get vector search indexes
    const searchIndexes = await collection.aggregate([
      { $listSearchIndexes: {} }
    ]).toArray();

    // Get regular indexes
    const regularIndexes = await collection.indexes();

    if (searchIndexes.length === 0 && regularIndexes.length === 0) {
      console.log(chalk.yellow("⚠️ No indexes found in this collection."));
      return { searchIndexes: [], regularIndexes: [] };
    }

    // Format and display the results
    return formatIndexOutput(searchIndexes, regularIndexes);
  } catch (error) {
    console.error(chalk.red("❌ Error retrieving indexes:"), error.message);
    throw error;
  } finally {
    await client.close();
  }
}