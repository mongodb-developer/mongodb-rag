// bin/commands/init/test-connection.js
import chalk from 'chalk';
import { isConfigValid } from '../../utils/validation.js';
import { testProvider } from '../../utils/providers.js';
import MongoRAG from '../../../src/core/MongoRAG.js';

export async function testConnection(config) {
  const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

  if (isDevelopment) {
    console.log('Debug: Testing connection with config:', JSON.stringify(config, null, 2));
  }

  // Clean up any duplicate configuration
  const cleanConfig = {
    ...config,
    // Remove any root-level embedding properties
    provider: undefined,
    apiKey: undefined,
    model: undefined,
    dimensions: undefined,
    baseUrl: undefined
  };

  if (!isConfigValid(cleanConfig)) {
    throw new Error("Invalid configuration. Please run 'npx mongodb-rag init' to set up your configuration properly.");
  }

  try {
    console.log(chalk.cyan(`🔄 Testing ${config.embedding.provider} connection...`));
    
    const result = await testProvider(cleanConfig);
    
    if (result.success) {
      console.log(chalk.green(`✅ Successfully connected to ${config.embedding.provider}`));
      if (result.modelAvailable) {
        console.log(chalk.green(`✅ Model '${config.embedding.model}' is available`));
      }
    } else {
      console.log(chalk.yellow(`⚠️ ${result.message}`));
      if (result.availableModels) {
        console.log(chalk.cyan('Available models:'), result.availableModels.join(', '));
      }
    }

    return result;
  } catch (error) {
    console.error(chalk.red(`❌ Failed to connect to ${config.embedding.provider}:`), error.message);
    
    if (config.embedding.provider === 'ollama') {
      console.log(chalk.yellow('\nTroubleshooting:'));
      console.log(chalk.cyan('1. Ensure Ollama is running'));
      console.log(chalk.cyan(`2. Check if Ollama is accessible at ${config.embedding.baseUrl}`));
      console.log(chalk.cyan('3. Check available models with `ollama list`'));
    }
    
    throw error;
  }
}