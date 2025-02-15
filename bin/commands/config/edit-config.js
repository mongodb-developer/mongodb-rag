// bin/commands/config/edit-config.js
import fs from 'fs';
import chalk from 'chalk';
import { promptForMongoConfig, promptForProviderConfig } from '../../utils/prompts.js';

export async function editConfig(configPath) {
  console.log(chalk.cyan('🔧 Editing MongoRAG configuration...\n'));

  try {
    // Load existing config
    let config = {};
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }

    // Get updated MongoDB configuration
    const mongoConfig = await promptForMongoConfig(config);

    // Get updated provider configuration
    const embeddingConfig = await promptForProviderConfig(config.embedding || {});

    // Build updated configuration
    const updatedConfig = {
      mongoUrl: mongoConfig.mongoUrl,
      database: mongoConfig.database,
      collection: mongoConfig.collection,
      embedding: {
        provider: embeddingConfig.provider,
        apiKey: embeddingConfig.apiKey,
        model: embeddingConfig.model,
        dimensions: embeddingConfig.dimensions,
        batchSize: embeddingConfig.batchSize || 100,
        ...(embeddingConfig.baseUrl && { baseUrl: embeddingConfig.baseUrl })
      },
      search: {
        maxResults: config.search?.maxResults || 5,
        minScore: config.search?.minScore || 0.7
      },
      indexName: config.indexName || 'vector_index'
    };

    // Save updated configuration
    fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2));
    console.log(chalk.green('✅ Configuration updated successfully!'));

    return updatedConfig;
  } catch (error) {
    console.error(chalk.red('❌ Failed to update configuration:'), error.message);
    throw error;
  }
}