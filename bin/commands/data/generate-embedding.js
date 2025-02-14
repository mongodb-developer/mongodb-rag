// bin/commands/data/generate-embedding.js
import chalk from 'chalk';
import { isConfigValid } from '../../utils/validation.js';
import MongoRAG from '../../../src/core/MongoRAG.js';

export async function generateEmbedding(config, text) {
  const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

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

  const rag = new MongoRAG(cleanConfig);
  try {
    if (isDevelopment) {
      console.log(chalk.blue('🔄 Getting embedding for text:'), text);
    }

    await rag.connect();
    const embedding = await rag.createEmbedding(text);
    
    if (isDevelopment) {
      console.log(chalk.cyan("🔢 Generated Embedding:"), embedding);
      console.log(chalk.green(`✅ Successfully generated ${embedding.length}-dimensional embedding`));
    } else {
      console.log(chalk.green('✅ Successfully generated embedding'));
    }
    
    return embedding;
  } catch (error) {
    console.error(chalk.red("❌ Error generating embedding:"), error.message);
    
    if (config.embedding.provider === 'ollama') {
      console.log(chalk.yellow('\nTroubleshooting:'));
      console.log(chalk.cyan('1. Ensure Ollama is running'));
      console.log(chalk.cyan(`2. Check if Ollama is accessible at ${config.embedding.baseUrl}`));
      console.log(chalk.cyan('3. Check if the model is installed with `ollama list`'));
    }
    
    throw error;
  } finally {
    await rag.client?.close();
  }
}