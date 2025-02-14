// bin/utils/prompts.js
import Enquirer from 'enquirer';
import chalk from 'chalk';
import { validateMongoURI } from './validation.js';

const enquirer = new Enquirer();

export async function promptWithValidation(promptConfig) {
  while (true) {
    try {
      const response = await enquirer.prompt(promptConfig);
      const userInput = response[promptConfig.name];

      if (userInput === '?') {
        console.log(chalk.yellow(`ℹ️ Help: ${promptConfig.helpMessage}\n`));
        continue;
      }

      if (promptConfig.validate) {
        const validationResult = await promptConfig.validate(userInput);
        if (validationResult !== true) {
          console.log(chalk.red(`❌ ${validationResult}`));
          continue;
        }
      }

      return userInput;
    } catch (error) {
      if (error.isCanceled) {
        console.log(chalk.yellow('\n⚠️ Operation cancelled'));
        process.exit(0);
      }
      throw error;
    }
  }
}

export async function confirmAction(message, defaultValue = false) {
    const response = await enquirer.prompt({
      type: 'confirm',
      name: 'confirmed',
      message,
      initial: defaultValue
    });
  
    return response.confirmed;
  }

export async function promptForConfigEdits(currentConfig) {
  const responses = await enquirer.prompt([
    {
      type: 'input',
      name: 'mongoUrl',
      message: 'Enter MongoDB Connection String:',
      initial: currentConfig.mongoUrl,
      validate: validateMongoURI
    },
    {
      type: 'input',
      name: 'database',
      message: 'Enter Database Name:',
      initial: currentConfig.database
    },
    {
      type: 'input',
      name: 'collection',
      message: 'Enter Collection Name:',
      initial: currentConfig.collection
    },
    {
      type: 'select',
      name: 'provider',
      message: 'Select an Embedding Provider:',
      choices: ['openai', 'deepseek', 'ollama'],
      initial: currentConfig.embedding.provider
    }
  ]);

  return {
    ...currentConfig,
    mongoUrl: responses.mongoUrl,
    database: responses.database,
    collection: responses.collection,
    embedding: {
      ...currentConfig.embedding,
      provider: responses.provider
    }
  };
}

export async function promptForIndexName(currentName) {
  const { indexName } = await enquirer.prompt({
    type: 'input',
    name: 'indexName',
    message: 'Enter the new name for your Vector Search Index:',
    initial: currentName,
    validate: input => {
      if (!input || input.trim().length === 0) return 'Index name cannot be empty';
      if (input.includes(' ')) return 'Index name cannot contain spaces';
      return true;
    }
  });

  return indexName;
}

/**
 * Prompts the user for MongoDB configuration details.
 * @returns {Promise<Object>} The MongoDB configuration object.
 */
export async function promptForMongoConfig() {
    return enquirer.prompt([
      {
        type: 'input',
        name: 'mongoUrl',
        message: 'Enter your MongoDB connection string:',
        validate: input => input.startsWith('mongodb') ? true : 'Must be a valid MongoDB URI'
      },
      {
        type: 'input',
        name: 'database',
        message: 'Enter the database name:',
        initial: 'mongodb-rag'
      },
      {
        type: 'input',
        name: 'collection',
        message: 'Enter the collection name:',
        initial: 'documents'
      }
    ]);
}
  
/**
 * Prompts the user for embedding provider configuration.
 * @returns {Promise<Object>} The embedding provider configuration object.
 */
export async function promptForProviderConfig() {
    const providerResponse = await enquirer.prompt({
      type: 'select',
      name: 'provider',
      message: 'Select an embedding provider:',
      choices: ['openai', 'ollama', 'anthropic', 'deepseek'],
      initial: 'openai'
    });

    let modelChoices;
    let defaultModel;
    
    if (providerResponse.provider === 'ollama') {
      try {
        // You might want to implement this function to fetch available models from Ollama
        const availableModels = await fetch('http://localhost:11434/api/tags')
          .then(res => res.json())
          .then(data => data.models || [])
          .catch(() => ['llama2', 'llama2-uncensored', 'codellama', 'mistral', 'mixtral']);
        
        modelChoices = availableModels;
        defaultModel = 'llama2';
      } catch (error) {
        modelChoices = ['llama2', 'llama2-uncensored', 'codellama', 'mistral', 'mixtral'];
        defaultModel = 'llama2';
      }
    } else {
      modelChoices = {
        'openai': ['text-embedding-3-small', 'text-embedding-3-large'],
        'anthropic': ['claude-3-opus-20240229', 'claude-3-sonnet-20240229'],
        'deepseek': ['deepseek-coder', 'deepseek-chat']
      }[providerResponse.provider] || [];
      defaultModel = modelChoices[0];
    }

    const config = await enquirer.prompt([
      {
        type: 'input',
        name: 'apiKey',
        message: 'Enter your API key (skip if using Ollama):',
        skip: () => providerResponse.provider === 'ollama',
        validate: (input) => 
          providerResponse.provider === 'ollama' || input.length > 0 ? true : 'API key is required for this provider'
      },
      {
        type: 'input',
        name: 'baseUrl',
        message: 'Enter the Ollama API URL:',
        initial: 'http://localhost:11434',
        skip: () => providerResponse.provider !== 'ollama'
      },
      {
        type: providerResponse.provider === 'ollama' ? 'input' : 'select',
        name: 'model',
        message: 'Enter the model name:',
        choices: modelChoices,
        initial: defaultModel
      },
      {
        type: 'input',
        name: 'dimensions',
        message: 'Enter the embedding dimensions:',
        initial: (answers) => {
          const dims = {
            'text-embedding-3-small': '1536',
            'text-embedding-3-large': '3072',
            'llama2': '4096',
            'mistral': '4096',
            'mixtral': '4096',
            'codellama': '4096'
          }[answers.model] || '4096';
          return dims.toString();
        },
        validate: (input) => {
          const num = parseInt(input);
          if (isNaN(num) || num <= 0) {
            return 'Dimensions must be a positive number';
          }
          return true;
        },
        result: (value) => parseInt(value)
      }
    ]);

    // Return only the embedding configuration
    return {
      provider: providerResponse.provider,
      model: config.model,
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
      dimensions: config.dimensions
    };
}