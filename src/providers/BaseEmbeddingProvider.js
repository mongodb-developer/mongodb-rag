// src/providers/BaseEmbeddingProvider.js
import debug from 'debug';

const log = debug('mongodb-rag:embedding');

class BaseEmbeddingProvider {
  constructor(options = {}) {
    this.options = {
      batchSize: options.batchSize || 100,
      maxRetries: options.maxRetries || 3,
      retryDelay: options.retryDelay || 1000,
      ...options
    };
    
    if (!this.options.apiKey) {
      throw new Error('API key is required');
    }
  }

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

  _createBatches(texts) {
    const batches = [];
    for (let i = 0; i < texts.length; i += this.options.batchSize) {
      batches.push(texts.slice(i, i + this.options.batchSize));
    }
    return batches;
  }

  async _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async _embedBatch(texts) {
    throw new Error('_embedBatch must be implemented by the provider');
  }
}

export default BaseEmbeddingProvider;