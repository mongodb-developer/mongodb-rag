// bin/utils/providers.js
import { execSync } from 'child_process';
import MongoRAG from '../../src/core/MongoRAG.js';

export function getOllamaModels() {
  try {
    const output = execSync('ollama list', { encoding: 'utf-8' });
    return output
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.split(' ')[0]);
  } catch (error) {
    return [];
  }
}

export async function testProvider(config) {
  switch (config.embedding.provider) {
    case 'ollama':
      return await testOllamaProvider(config);
    case 'openai':
    case 'deepseek':
    case 'voyage':
      return await testApiProvider(config);
    default:
      throw new Error(`Unknown provider: ${config.embedding.provider}`);
  }
}

async function testOllamaProvider(config) {
  try {
    const response = await fetch(`${config.embedding.baseUrl}/api/tags`);
    if (!response.ok) {
      throw new Error(`Failed to connect: ${response.statusText}`);
    }

    const data = await response.json();
    const models = data.models || [];
    const modelExists = models.some(model => model.name === config.embedding.model);

    return {
      success: true,
      modelAvailable: modelExists,
      availableModels: models.map(m => m.name),
      message: modelExists ? 
        `Model '${config.embedding.model}' is available` : 
        `Model '${config.embedding.model}' not found`
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

async function testApiProvider(config) {
  try {
    const rag = new MongoRAG(config);
    await rag._initializeEmbeddingProvider();
    
    // Test embedding generation
    const testEmbed = await rag._getEmbedding('Test connection');
    
    return {
      success: true,
      dimensions: testEmbed.length,
      message: `Successfully connected to ${config.embedding.provider}`
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

export function getDefaultDimensions(provider) {
  switch (provider) {
    case 'openai':
      return 1536;  // For text-embedding-3-small
    case 'deepseek':
      return 1024;
    case 'voyage':
      return 1024;  // For voyage models
    case 'ollama':
      return 4096;  // For llama2 models
    default:
      return 1536;
  }
}

export function getProviderModels(provider) {
  switch (provider) {
    case 'openai':
      return ['text-embedding-3-small', 'text-embedding-3-large'];
    case 'deepseek':
      return ['deepseek-embedding'];
    case 'voyage':
      return ['voyage-3', 'voyage-3-large', 'voyage-3-lite', 'voyage-code-3', 'voyage-finance-2', 'voyage-law-2'];
    case 'ollama':
      return getOllamaModels();
    default:
      return [];
  }
}
