import BaseEmbeddingProvider from './BaseEmbeddingProvider.js';
import fetch from 'node-fetch';
import debug from 'debug';

const log = debug('mongodb-rag:embedding:ollama');

class OllamaEmbeddingProvider extends BaseEmbeddingProvider {
  constructor(options = {}) {
    super({}); 

    if (!options.baseUrl) {
      throw new Error('Ollama base URL is required (e.g., http://localhost:11434)');
    }
    if (!options.model) {
      throw new Error('Ollama model name is required (e.g., llama3)');
    }

    this.baseUrl = options.baseUrl;
    this.model = options.model;
  }

  async _embedBatch(texts) {
    try {
      log(`Fetching embeddings from Ollama (${this.model})...`);
      
      const responses = await Promise.all(texts.map(async (text) => {
        const response = await fetch(`${this.baseUrl}/api/embeddings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: this.model, prompt: text }),
        });

        if (!response.ok) {
          throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.embedding;
      }));

      log(`Successfully retrieved ${responses.length} embeddings`);
      return responses;
    } catch (error) {
      throw new Error(`Ollama embedding error: ${error.message}`);
    }
  }
}

export default OllamaEmbeddingProvider;
