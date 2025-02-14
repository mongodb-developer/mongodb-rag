import debug from 'debug';
import EventEmitter from 'events';

const log = debug('mongodb-rag:batch');

/**
 * Handles batch processing of items with retry logic and concurrency control
 * @extends EventEmitter
 * @fires BatchProcessor#progress
 * @fires BatchProcessor#batchError
 */
class BatchProcessor extends EventEmitter {
  /**
   * Creates a new batch processor instance
   * @param {Object} options - Configuration options
   * @param {number} [options.batchSize=100] - Number of items to process in each batch
   * @param {number} [options.concurrency=2] - Number of batches to process concurrently
   * @param {number} [options.retryAttempts=3] - Maximum number of retry attempts per batch
   * @param {number} [options.retryDelay=1000] - Delay between retries in milliseconds
   */
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

  /**
   * Processes a single batch of items with retry logic
   * @param {Array} items - Items to process in this batch
   * @param {Function} processor - Function to process the items
   * @returns {Promise<{results: Array, errors: Array}>} Results and errors from processing
   * @fires BatchProcessor#batchError
   */
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

  /**
   * Processes all items in batches with concurrency control
   * @param {Array} items - All items to process
   * @param {Function} processor - Function to process each batch
   * @returns {Promise<{results: Array, errors: Array}>} Combined results and errors from all batches
   * @fires BatchProcessor#progress
   */
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

      /**
       * Progress event
       * @event BatchProcessor#progress
       * @type {Object}
       * @property {number} processed - Number of successfully processed items
       * @property {number} failed - Number of failed items
       * @property {number} total - Total number of items
       * @property {number} percent - Percentage of completion
       */
      this.emit('progress', {
        processed: this.stats.processed,
        failed: this.stats.failed,
        total: this.stats.total,
        percent: Math.round((this.stats.processed + this.stats.failed) / this.stats.total * 100)
      });
    }

    return { results, errors };
  }

  /**
   * Splits array of items into batches
   * @private
   * @param {Array} items - Items to split into batches
   * @returns {Array<Array>} Array of batches
   */
  _createBatches(items) {
    const batches = [];
    for (let i = 0; i < items.length; i += this.options.batchSize) {
      batches.push(items.slice(i, i + this.options.batchSize));
    }
    return batches;
  }

  /**
   * Utility function to pause execution
   * @private
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Returns current processing statistics
   * @returns {Object} Current processing stats including success rate
   * @property {number} processed - Number of successfully processed items
   * @property {number} failed - Number of failed items
   * @property {number} retried - Number of retried items
   * @property {number} total - Total number of items
   * @property {string} successRate - Percentage of successful processing
   */
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