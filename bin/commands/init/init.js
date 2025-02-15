// bin/commands/init/init.js
import chalk from 'chalk';
import fs from 'fs';
import { promptForMongoConfig, promptForProviderConfig } from '../../utils/prompts.js';
import { getDefaultDimensions } from '../../utils/providers.js';

export async function init(configPath) {
  console.log(chalk.cyan.bold('🔧 Setting up MongoRAG configuration...\n'));

  // Get MongoDB configuration
  const mongoConfig = await promptForMongoConfig();

  // Get provider configuration - this now returns the complete embedding config
  const embeddingConfig = await promptForProviderConfig();

  // Build configuration object in the correct format
  const config = {
    mongoUrl: mongoConfig.mongoUrl,
    database: mongoConfig.database,
    collection: mongoConfig.collection,
    embedding: {
      provider: embeddingConfig.provider,
      apiKey: embeddingConfig.apiKey,
      model: embeddingConfig.model,
      dimensions: embeddingConfig.dimensions,
      batchSize: 100,
      ...(embeddingConfig.baseUrl && { baseUrl: embeddingConfig.baseUrl })
    },
    search: {
      maxResults: 5,
      minScore: 0.7
    },
    indexName: 'vector_index'
  };

  // Save configuration
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(chalk.green(`✅ Configuration saved to ${configPath}`));

  // Show provider-specific instructions
  if (config.embedding.provider === 'ollama') {
    console.log(chalk.yellow('\n📝 Additional steps for Ollama setup:'));
    console.log(chalk.cyan('1. Ensure Ollama is running (`ollama list`)'));
    console.log(chalk.cyan(`2. Verify model '${config.embedding.model}' is installed`));
    console.log(chalk.cyan(`3. Check if Ollama is accessible at ${config.embedding.baseUrl}`));
    console.log(chalk.cyan('4. Run `npx mongodb-rag test-connection` to validate setup\n'));
  } else {
    console.log(chalk.cyan('\n🔍 Next steps:'));
    console.log(chalk.cyan('1. Run `npx mongodb-rag test-connection` to verify your setup'));
    console.log(chalk.cyan('2. Run `npx mongodb-rag create-index` to create your vector search index'));
  }

  return config;
}