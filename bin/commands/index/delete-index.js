// bin/commands/index/delete-index.js
import chalk from 'chalk';
import { getMongoClient } from '../../utils/mongodb.js';
import { isConfigValid } from '../../utils/validation.js';
import { confirmAction } from '../../utils/prompts.js';

export async function deleteIndex(config) {
  if (!isConfigValid(config)) {
    throw new Error("Configuration missing. Run 'npx mongodb-rag init' first.");
  }

  console.log(chalk.cyan.bold(`📂 Database: ${config.database}`));
  console.log(chalk.cyan.bold(`📑 Collection: ${config.collection}`));

  const shouldDelete = await confirmAction(
    `Are you sure you want to delete the Vector Search Index "${config.indexName}"?`,
    false
  );

  if (!shouldDelete) {
    console.log(chalk.yellow("⚠️ Deletion canceled."));
    return { canceled: true };
  }

  const client = await getMongoClient(config.mongoUrl);

  try {
    const collection = client.db(config.database).collection(config.collection);
    console.log(chalk.yellow(`🗑️ Deleting Vector Search Index: ${config.indexName}...`));

    await collection.dropSearchIndex(config.indexName);
    console.log(chalk.green(`✅ Vector Search Index "${config.indexName}" deleted successfully!`));

    return { success: true, indexName: config.indexName };
  } catch (error) {
    console.error(chalk.red("❌ Error deleting index:"), error.message);
    throw error;
  } finally {
    await client.close();
  }
}