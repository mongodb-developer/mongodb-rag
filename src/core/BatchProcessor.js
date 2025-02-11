import debug from 'debug';
import EventEmitter from 'events';

const log = debug('mongodb-rag:batch');

class BatchProcessor extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.options = {
      batchSize: options.batchSize || 100,
      concurrency: options.concurrency || 2,
      retryAttempts: options.retryAttempts || 3,
      retryDelay: options.retryDelay || 1000,
      ...options
    };

    this.stats = {
      processed: 0,
      failed: 0,
      retried: 0,
      total: 0
    };
  }

  async processBatch(items, processor) {
    const results = [];
    const errors = [];

    try {
      log(`Processing batch of ${items.length} items`);
      
      for (let attempt = 1; attempt <= this.options.retryAttempts; attempt++) {
        try {
          const batchResults = await processor(items);
          results.push(...batchResults);
          this.stats.processed += items.length;
          break;
        } catch (error) {
          if (attempt === this.options.retryAttempts) {
            log(`Batch failed after ${attempt} attempts`);
            this.stats.failed += items.length;
            errors.push({ items, error });
            throw error;
          }
          
          this.stats.retried += items.length;
          log(`Retry attempt ${attempt} after error: ${error.message}`);
          await this._sleep(this.options.retryDelay * attempt);
        }
      }
    } catch (error) {
      this.emit('batchError', { items, error });
    }

    return { results, errors };
  }

  async process(items, processor) {
    this.stats.total = items.length;
    const batches = this._createBatches(items);
    const results = [];
    const errors = [];

    // Process batches with concurrency control
    for (let i = 0; i < batches.length; i += this.options.concurrency) {
      const batchPromises = batches
        .slice(i, i + this.options.concurrency)
        .map(batch => this.processBatch(batch, processor));

      const batchResults = await Promise.allSettled(batchPromises);

      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(...result.value.results);
          errors.push(...result.value.errors);
        } else {
          const failedBatch = batches[i + index];
          errors.push({
            items: failedBatch,
            error: result.reason
          });
        }
      });

      // Emit progress event
      this.emit('progress', {
        processed: this.stats.processed,
        failed: this.stats.failed,
        total: this.stats.total,
        percent: Math.round((this.stats.processed + this.stats.failed) / this.stats.total * 100)
      });
    }

    return { results, errors };
  }

  _createBatches(items) {
    const batches = [];
    for (let i = 0; i < items.length; i += this.options.batchSize) {
      batches.push(items.slice(i, i + this.options.batchSize));
    }
    return batches;
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStats() {
    return {
      ...this.stats,
      successRate: this.stats.total ? 
        (this.stats.processed / this.stats.total * 100).toFixed(2) + '%' : 
        '0%'
    };
  }
}

export default BatchProcessor;