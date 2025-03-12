// bin/commands/init.js
import chalk from 'chalk';
import fs from 'fs';
import { validateMongoURI } from '../utils/validation.js';
import { promptWithValidation } from '../utils/prompts.js';
import { getOllamaModels } from '../utils/providers.js';

export async function init(configPath) {
  console.log(chalk.cyan.bold('🔧 Setting up MongoRAG configuration...\n'));

  const responses = {};

  // MongoDB Connection String
  responses.mongoUrl = await promptWithValidation({
    type: 'input',
    name: 'mongoUrl',
    message: 'Enter MongoDB Connection String:',
    validate: (input) => validateMongoURI(input) ? true : 'Invalid MongoDB Atlas connection string.',
    helpMessage: "MongoDB Atlas connection string format:\n" +
      "  mongodb+srv://username:password@cluster.mongodb.net/database\n" +
      "- Must be a MongoDB Atlas cluster (starts with mongodb+srv://)\n" +
      "- Include your username and password\n" +
      "- Should end with your cluster address (.mongodb.net)\n" +
      "- Can include optional parameters"
  });

  // Database Name
  responses.database = await promptWithValidation({
    type: 'input',
    name: 'database',
    message: 'Enter Database Name:',
    validate: (input) => {
      if (!input || input.trim().length === 0) return 'Database name cannot be empty';
      if (input.includes(' ')) return 'Database name cannot contain spaces';
      if (input.length > 63) return 'Database name cannot exceed 63 characters';
      return true;
    },
    helpMessage: "Database name requirements:\n" +
      "- Cannot be empty\n" +
      "- Must not contain spaces\n" +
      "- Maximum length of 63 characters"
  });

  // Collection Name
  responses.collection = await promptWithValidation({
    type: 'input',
    name: 'collection',
    message: 'Enter Collection Name:',
    validate: (input) => {
      if (!input || input.trim().length === 0) return 'Collection name cannot be empty';
      if (input.includes(' ')) return 'Collection name cannot contain spaces';
      if (input.length > 255) return 'Collection name cannot exceed 255 characters';
      return true;
    },
    helpMessage: "Collection name requirements:\n" +
      "- Cannot be empty\n" +
      "- Must not contain spaces\n" +
      "- Maximum length of 255 characters"
  });

  // Embedding Provider
  responses.provider = await promptWithValidation({
    type: 'select',
    name: 'provider',
    message: 'Select an Embedding Provider:',
    choices: ['voyage','openai', 'deepseek', 'ollama'],
    helpMessage: "Available embedding providers:\n" +
      "- Voyage: Best MongoDB compatible, requires API key\n" +
      "- OpenAI: Most popular, requires API key\n" +
      "- DeepSeek: Alternative provider, requires API key\n" +
      "- Ollama: Local deployment, no API key needed"
  });

  // Provider-specific configuration
  if (responses.provider === 'openai' || responses.provider === 'deepseek' || responses.provider === 'voyage') {
    responses.apiKey = await promptWithValidation({
      type: 'password',
      name: 'apiKey',
      message: `Enter your ${responses.provider === 'openai' ? 'OpenAI' : responses.provider === 'voyage' ? 'Voyage' : 'DeepSeek'} API Key:`,
      validate: (input) => input && input.length > 0 ? true : 'API key is required',
      helpMessage: responses.provider === 'openai' 
        ? "OpenAI API key format: sk-....\n- Get your key from: https://platform.openai.com/api-keys"
        : (responses.provider === 'voyage'
          ? "VoyageAI API key format: pa-....\n- Get your key from VoyageAI's platform"
          : "DeepSeek API key format: dk-....\n- Get your key from DeepSeek's platform")
    });
  } else if (responses.provider === 'ollama') {
    const availableModels = getOllamaModels();
    responses.model = await promptWithValidation({
      type: 'input',
      name: 'model',
      message: 'Enter the Ollama model name:',
      initial: 'llama2',
      validate: (input) => input && input.length > 0 ? true : 'Model name is required',
      helpMessage: "Ollama model requirements:\n" +
        "- Must be installed locally via Ollama\n" +
        "- Common models: llama2, codellama, mistral"
    });
  }

  // Build configuration object
  const newConfig = {
    mongoUrl: responses.mongoUrl,
    database: responses.database,
    collection: responses.collection,
    embedding: {
      provider: responses.provider,
      ...(responses.apiKey && { apiKey: responses.apiKey }),
      ...(responses.model && { model: responses.model }),
      dimensions: responses.provider === 'voyage' ? 1024 : 1536,
      batchSize: 100
    },
    search: {
      maxResults: 5,
      minScore: 0.7
    },
    indexName: 'vector_index'
  };

  // Save configuration
  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
  console.log(chalk.green(`✅ Configuration saved to ${configPath}`));

  // Show provider-specific instructions
  if (responses.provider === 'ollama') {
    console.log(chalk.yellow('\n📝 Additional steps for Ollama setup:'));
    console.log(chalk.cyan('1. Ensure Ollama is running (`ollama list`)'));
    console.log(chalk.cyan(`2. Verify model '${responses.model}' is installed`));
    console.log(chalk.cyan('3. Run `npx mongodb-rag test-connection` to validate setup\n'));
  } else {
    console.log(chalk.cyan('\n🔍 Next steps:'));
    console.log(chalk.cyan('1. Run `npx mongodb-rag test-connection` to verify your setup'));
    console.log(chalk.cyan('2. Run `npx mongodb-rag create-index` to create your vector search index'));
  }

  return newConfig;
}