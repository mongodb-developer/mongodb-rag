// src/providers/VoyageEmbeddingProvider.js
import BaseEmbeddingProvider from './BaseEmbeddingProvider.js';
import { VoyageAIClient } from 'voyageai';
import debug from 'debug';

const log = debug('mongodb-rag:embedding:voyage');

/**
 * VoyageAI Embedding Provider implementation
 * Generates embeddings using the VoyageAI API
 * @extends BaseEmbeddingProvider
 */
class VoyageEmbeddingProvider extends BaseEmbeddingProvider {
  /**
   * Creates a new VoyageAI embedding provider instance
   * @param {Object} options - Configuration options
   * @param {string} options.apiKey - VoyageAI API key
   * @param {string} [options.model='voyage-3'] - Model to use for embeddings
   *                  Options: voyage-3-large, voyage-3, voyage-3-lite, 
   *                  voyage-code-3, voyage-finance-2, voyage-law-2
   * @throws {Error} If API key is not provided
   */
  constructor(options = {}) {
    super(options);
    
    if (!options.apiKey) {
      throw new Error('VoyageAI API key is required');
    }

    this.apiKey = options.apiKey;
    this.model = options.model || 'voyage-3';
    this.client = new VoyageAIClient({ apiKey: this.apiKey });

    log(`VoyageAI embedding provider initialized with model: ${this.model}`);
  }

  /**
   * Generates an embedding for a single text
   * @param {string} text - Text to generate embedding for
   * @returns {Promise<number[]>} Embedding vector
   * @throws {Error} If the input is invalid or the API request fails
   */
  async getEmbedding(text) {
    if (!text || typeof text !== 'string') {
      throw new Error('Input text must be a non-empty string');
    }

    try {
      log(`Getting embedding for text: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
      
      const response = await this.client.embed({
        input: [text],
        model: this.model
      });

      if (!response || !response.data || !response.data[0]?.embedding) {
        throw new Error(`Unexpected response from VoyageAI API: ${JSON.stringify(response)}`);
      }

      return response.data[0].embedding;
    } catch (error) {
      log('Error getting embedding from VoyageAI:', error);
      if (error instanceof Error) {
        throw new Error(`VoyageAI API error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Generates embeddings for multiple texts
   * @param {string[]} texts - Array of texts to generate embeddings for
   * @returns {Promise<number[][]>} Array of embedding vectors
   * @throws {Error} If the input is invalid or the API request fails
   */
  async getEmbeddings(texts) {
    if (!Array.isArray(texts) || texts.length === 0) {
      return [];
    }

    // Validate all inputs are strings
    if (!texts.every(text => typeof text === 'string' && text.length > 0)) {
      throw new Error('All inputs must be non-empty strings');
    }

    try {
      log(`Getting embeddings for ${texts.length} texts`);
      
      const response = await this.client.embed({
        input: texts,
        model: this.model
      });

      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error(`Unexpected response from VoyageAI API: ${JSON.stringify(response)}`);
      }

      return response.data.map(item => item.embedding);
    } catch (error) {
      log('Error getting embeddings from VoyageAI:', error);
      if (error instanceof Error) {
        throw new Error(`VoyageAI API error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Generates embeddings for a batch of texts using VoyageAI API
   * @protected
   * @param {string[]} texts - Array of texts to embed
   * @returns {Promise<number[][]>} Array of embedding vectors
   * @throws {Error} If the API request fails or returns unexpected response
   */
  async _embedBatch(texts) {
    try {
      log(`Getting embeddings for batch of ${texts.length} texts`);
      
      const response = await this.client.embed({
        input: texts,
        model: this.model
      });

      if (!response || !response.data) {
        throw new Error(`Unexpected response from VoyageAI API: ${JSON.stringify(response)}`);
      }

      return response.data.map(item => item.embedding);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`VoyageAI API error: ${error.message}`);
      }
      throw error;
    }
  }
}

export default VoyageEmbeddingProvider;
