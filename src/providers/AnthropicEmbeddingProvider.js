// src/providers/AnthropicEmbeddingProvider.js
import BaseEmbeddingProvider from './BaseEmbeddingProvider.js';
import axios from 'axios';
import debug from 'debug';

const log = debug('mongodb-rag:embedding:anthropic');

class AnthropicEmbeddingProvider extends BaseEmbeddingProvider {
  constructor(options = {}) {
    super(options);
    
    if (!options.apiKey) {
      throw new Error('Anthropic API key is required');
    }

    this.apiKey = options.apiKey;
    this.model = options.model || 'claude-3';
    this.client = axios.create({
      baseURL: 'https://api.anthropic.com/v1',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json'
      }
    });

    log('Anthropic embedding provider initialized');
  }

  async _embedBatch(texts) {
    try {
      log(`Getting embeddings for batch of ${texts.length} texts`);
      
      const response = await this.client.post('/embeddings', {
        model: this.model,
        input: texts
      });

      const embeddings = response.data.data.map(item => item.embedding);
      return embeddings;
    } catch (error) {
      if (error.response?.data) {
        throw new Error(`Anthropic API error: ${error.response.data.error.message}`);
      }
      throw error;
    }
  }
}

export default AnthropicEmbeddingProvider;
