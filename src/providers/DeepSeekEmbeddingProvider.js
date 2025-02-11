// src/providers/DeepSeekEmbeddingProvider.js
import BaseEmbeddingProvider from './BaseEmbeddingProvider.js';
import axios from 'axios';
import debug from 'debug';

const log = debug('mongodb-rag:embedding:deepseek');

class DeepSeekEmbeddingProvider extends BaseEmbeddingProvider {
  constructor(options = {}) {
    super(options);
    
    if (!options.apiKey) {
      throw new Error('DeepSeek API key is required');
    }

    this.apiKey = options.apiKey;
    this.model = options.model || 'deepseek-embedding';
    this.client = axios.create({
      baseURL: 'https://api.deepseek.com/v1',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    log('DeepSeek embedding provider initialized');
  }

  async _embedBatch(texts) {
    try {
      log(`Getting embeddings for batch of ${texts.length} texts`);
      
      const response = await this.client.post('/embeddings', {
        model: this.model,
        input: texts
      });

      if (!response.data || !response.data.data) {
        throw new Error(`Unexpected response from DeepSeek API: ${JSON.stringify(response.data)}`);
      }

      return response.data.data.map(item => item.embedding);
    } catch (error) {
      if (error.response?.data) {
        throw new Error(`DeepSeek API error: ${error.response.data.error?.message || JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }
}

// ✅ Ensure the class is properly exported as default
export default DeepSeekEmbeddingProvider;
