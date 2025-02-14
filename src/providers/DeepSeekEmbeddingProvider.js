// src/providers/DeepSeekEmbeddingProvider.js
import BaseEmbeddingProvider from './BaseEmbeddingProvider.js';
import axios from 'axios';
import debug from 'debug';

const log = debug('mongodb-rag:embedding:deepseek');

/**
 * DeepSeek Embedding Provider implementation
 * Generates embeddings using the DeepSeek API
 * @extends BaseEmbeddingProvider
 */
class DeepSeekEmbeddingProvider extends BaseEmbeddingProvider {
  /**
   * Creates a new DeepSeek embedding provider instance
   * @param {Object} options - Configuration options
   * @param {string} options.apiKey - DeepSeek API key
   * @param {string} [options.model='deepseek-embedding'] - Model to use for embeddings
   * @throws {Error} If API key is not provided
   */
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

  /**
   * Generates embeddings for a batch of texts using DeepSeek API
   * @protected
   * @param {string[]} texts - Array of texts to embed
   * @returns {Promise<number[][]>} Array of embedding vectors
   * @throws {Error} If the API request fails or returns unexpected response
   */
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
