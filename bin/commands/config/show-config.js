// bin/commands/config/show-config.js
import chalk from 'chalk';
import fs from 'fs';

export function showConfig(configPath) {
  try {
    if (!fs.existsSync(configPath)) {
      console.log(chalk.yellow('⚠️ No configuration file found.'));
      console.log(chalk.cyan("Run 'npx mongodb-rag init' to create one."));
      return;
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    
    console.log(chalk.cyan('\n📝 Current Configuration:\n'));
    
    // MongoDB settings
    console.log(chalk.yellow('MongoDB Settings:'));
    console.log(chalk.gray('URL:'), maskSensitiveInfo(config.mongoUrl));
    console.log(chalk.gray('Database:'), config.database);
    console.log(chalk.gray('Collection:'), config.collection);
    console.log(chalk.gray('Index:'), config.indexName);
    
    // Embedding settings
    console.log(chalk.yellow('\nEmbedding Settings:'));
    console.log(chalk.gray('Provider:'), config.embedding.provider);
    console.log(chalk.gray('Model:'), config.embedding.model);
    if (config.embedding.apiKey) {
      console.log(chalk.gray('API Key:'), maskSensitiveInfo(config.embedding.apiKey));
    }
    if (config.embedding.baseUrl) {
      console.log(chalk.gray('Base URL:'), config.embedding.baseUrl);
    }
    console.log(chalk.gray('Dimensions:'), config.embedding.dimensions);
    
    // Search settings
    console.log(chalk.yellow('\nSearch Settings:'));
    console.log(chalk.gray('Max Results:'), config.search.maxResults);
    console.log(chalk.gray('Min Score:'), config.search.minScore);
    console.log(chalk.gray('Index Name:'), config.indexName);
    
  } catch (error) {
    console.error(chalk.red('❌ Error reading configuration:'), error.message);
    throw error;
  }
}

function maskSensitiveInfo(text) {
  if (!text) return '';
  if (text.includes('@')) {
    // Mask MongoDB URI
    return text.replace(/:\/\/[^@]+@/, '://****:****@');
  } else {
    // Mask API keys
    return text.substring(0, 6) + '...' + text.substring(text.length - 4);
  }
}