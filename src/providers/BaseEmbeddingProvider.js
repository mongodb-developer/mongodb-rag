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
    
    this.rateLimiter = {
      tokens: 60,
      refillRate: 60, // tokens per minute
      lastRefill: Date.now()
    };
  }

  async getEmbeddings(texts) {
    if (!Array.isArray(texts)) {
      texts = [texts];
    }

    const batches = this._createBatches(texts);
    const results = [];

    for (const batch of batches) {
      await this._waitForRateLimit();
      
      let retries = 0;
      while (retries < this.options.maxRetries) {
        try {
          const embeddings = await this._embedBatch(batch);
          results.push(...embeddings);
          break;
        } catch (error) {
          retries++;
          if (retries === this.options.maxRetries) {
            throw new Error(`Failed to get embeddings after ${retries} retries: ${error.message}`);
          }
          log(`Retry ${retries} after error: ${error.message}`);
          await this._sleep(this.options.retryDelay * retries);
        }
      }
    }

    return results;
  }

  _createBatches(texts) {
    const batches = [];
    for (let i = 0; i < texts.length; i += this.options.batchSize) {
      batches.push(texts.slice(i, i + this.options.batchSize));
    }
    return batches;
  }

  async _waitForRateLimit() {
    const now = Date.now();
    const timePassed = now - this.rateLimiter.lastRefill;
    const tokensToAdd = Math.floor(timePassed / 60000 * this.rateLimiter.refillRate);
    
    if (tokensToAdd > 0) {
      this.rateLimiter.tokens = Math.min(60, this.rateLimiter.tokens + tokensToAdd);
      this.rateLimiter.lastRefill = now;
    }

    if (this.rateLimiter.tokens < 1) {
      const waitTime = Math.ceil(60000 / this.rateLimiter.refillRate);
      log(`Rate limit reached, waiting ${waitTime}ms`);
      await this._sleep(waitTime);
      return this._waitForRateLimit();
    }

    this.rateLimiter.tokens--;
  }

  async _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async _embedBatch(texts) {
    throw new Error('_embedBatch must be implemented by the provider');
  }
}

export default BaseEmbeddingProvider;