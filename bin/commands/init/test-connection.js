// bin/commands/init/test-connection.js
import chalk from 'chalk';
import { isConfigValid } from '../../utils/validation.js';
import MongoRAG from '../../../src/core/MongoRAG.js';

export async function testConnection(config) {
  const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

  if (isDevelopment) {
    console.log('Debug: Testing connection with config:', JSON.stringify(config, null, 2));
  }

  if (!isConfigValid(config)) {
    throw new Error("Invalid configuration. Please run 'npx mongodb-rag init' to set up your configuration properly.");
  }

  try {
    // First test MongoDB connection
    console.log(chalk.cyan('\n🔄 Testing MongoDB connection...'));
    const rag = new MongoRAG(config);
    await rag.connect();
    console.log(chalk.green('✅ Successfully connected to MongoDB'));

    // Now test the embedding provider
    console.log(chalk.cyan(`\n🔄 Testing ${config.embedding.provider} connection...`));
    
    // Test the embedding service with a simple query
    const testText = 'This is a test of the embedding service.';
    const embedding = await rag.getEmbedding(testText);

    // Validate the embedding response
    if (Array.isArray(embedding) && embedding.length === config.embedding.dimensions) {
      console.log(chalk.green(`✅ Successfully connected to ${config.embedding.provider}`));
      console.log(chalk.green(`✅ Model '${config.embedding.model}' is working`));
      console.log(chalk.gray(`   Received embedding vector of length ${embedding.length}`));

      // Additional provider-specific validation
      if (config.embedding.provider === 'ollama') {
        // Try to verify if the model is available
        try {
          const provider = rag.provider;
          const modelAvailable = await provider.verifyModel();
          if (modelAvailable) {
            console.log(chalk.green(`✅ Model '${config.embedding.model}' is available locally`));
          } else {
            console.log(chalk.yellow(`⚠️ Model '${config.embedding.model}' not found locally`));
            console.log(chalk.cyan(`   Run 'ollama pull ${config.embedding.model}' to download it`));
          }
        } catch (error) {
          console.log(chalk.yellow(`⚠️ Could not verify model availability: ${error.message}`));
        }
      }
    } else {
      throw new Error('Invalid embedding response from provider');
    }

    // Clean up
    await rag.close();

    return {
      success: true,
      message: 'All connections successful',
      mongoConnected: true,
      providerConnected: true,
      embedding: {
        provider: config.embedding.provider,
        model: config.embedding.model,
        dimensions: embedding.length
      }
    };

  } catch (error) {
    let troubleshooting = '';

    // Provider-specific troubleshooting tips
    if (config.embedding.provider === 'ollama') {
      troubleshooting = chalk.yellow('\nTroubleshooting steps:') +
        '\n' + chalk.cyan('1. Ensure Ollama is running (ollama serve)') +
        '\n' + chalk.cyan(`2. Check if Ollama is accessible at ${config.embedding.baseUrl}`) +
        '\n' + chalk.cyan('3. Verify available models with `ollama list`') +
        '\n' + chalk.cyan(`4. Try pulling the model: ollama pull ${config.embedding.model}`);
    } else if (config.embedding.provider === 'openai') {
      troubleshooting = chalk.yellow('\nTroubleshooting steps:') +
        '\n' + chalk.cyan('1. Verify your API key is correct') +
        '\n' + chalk.cyan('2. Check for any API usage limits or restrictions') +
        '\n' + chalk.cyan('3. Verify the model name is correct') +
        '\n' + chalk.cyan('4. Check OpenAI service status: https://status.openai.com');
    }

    console.error(chalk.red(`\n❌ Connection test failed: ${error.message}`));
    if (troubleshooting) {
      console.log(troubleshooting);
    }
    
    throw error;
  }
}