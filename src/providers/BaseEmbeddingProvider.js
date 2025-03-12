// src/providers/BaseEmbeddingProvider.js
import debug from 'debug';

const log = debug('mongodb-rag:embedding');

/**
 * Base class for embedding providers that handles common functionality
 * like batching, retries, and error handling.
 * @class BaseEmbeddingProvider
 */
class BaseEmbeddingProvider {
  /**
   * Creates a new embedding provider instance
   * @param {Object} options - Configuration options
   * @param {number} [options.batchSize=100] - Number of texts to process in each batch
   * @param {number} [options.maxRetries=3] - Maximum number of retry attempts
   * @param {number} [options.retryDelay=1000] - Delay between retries in milliseconds
   * @param {string} [options.provider] - Provider name ('voyage','openai', 'ollama', etc.)
   * @param {string} [options.apiKey] - API key for the provider (required except for Ollama)
   * @throws {Error} If API key is missing for non-Ollama providers
   */
  constructor(options = {}) {
    this.options = {
      batchSize: options.batchSize || 100,
      maxRetries: options.maxRetries || 3,
      retryDelay: options.retryDelay || 1000,
      ...options
    };
    
    if (options.provider !== 'ollama' && !options.apiKey) {
        throw new Error('API key is required');
    }
  }

  /**
   * Generates embeddings for one or more texts
   * @param {string|string[]} texts - Text(s) to generate embeddings for
   * @returns {Promise<number[][]>} Array of embedding vectors
   */
  async getEmbeddings(texts) {
    if (!Array.isArray(texts)) {
      texts = [texts];
    }

    if (texts.length === 0) {
      return [];
    }

    const batches = this._createBatches(texts);
    const results = [];

    for (const batch of batches) {
      let embeddings = await this._processWithRetry(batch);
      results.push(...embeddings);
    }

    return results;
  }

  /**
   * Processes a batch of texts with retry logic
   * @private
   * @param {string[]} batch - Batch of texts to process
   * @returns {Promise<number[][]>} Embeddings for the batch
   * @throws {Error} If all retry attempts fail
   */
  async _processWithRetry(batch) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.options.maxRetries; attempt++) {
      try {
        return await this._embedBatch(batch);
      } catch (error) {
        lastError = error;
        if (attempt === this.options.maxRetries) {
          log(`Failed after ${attempt} attempts: ${error.message}`);
          throw error;
        }
        log(`Retry ${attempt}/${this.options.maxRetries} after error: ${error.message}`);
        await this._sleep(this.options.retryDelay * attempt);
      }
    }
  }

  /**
   * Splits an array of texts into batches
   * @private
   * @param {string[]} texts - Array of texts to batch
   * @returns {string[][]} Array of text batches
   */
  _createBatches(texts) {
    const batches = [];
    for (let i = 0; i < texts.length; i += this.options.batchSize) {
      batches.push(texts.slice(i, i + this.options.batchSize));
    }
    return batches;
  }

  /**
   * Utility function to pause execution
   * @private
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  async _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Abstract method to be implemented by provider classes
   * @abstract
   * @protected
   * @param {string[]} texts - Batch of texts to embed
   * @returns {Promise<number[][]>} Array of embedding vectors
   * @throws {Error} If not implemented by provider class
   */
  async _embedBatch(texts) {
    throw new Error('_embedBatch must be implemented by the provider');
  }
}

export default BaseEmbeddingProvider;