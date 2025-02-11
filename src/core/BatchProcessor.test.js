// src/core/BatchProcessor.test.js
import { jest, describe, expect, test, beforeEach } from '@jest/globals';
import BatchProcessor from './BatchProcessor.js';

jest.setTimeout(20000); // Increase timeout


describe('BatchProcessor', () => {
  let processor;

  beforeEach(() => {
    processor = new BatchProcessor({
      batchSize: 2,
      concurrency: 1
    });
  });

  test('should process items in batches', async () => {
    const items = [1, 2, 3, 4, 5];
    const mockProcessor = jest.fn(batch => 
      batch.map(item => ({ item, processed: true }))
    );

    const { results } = await processor.process(items, mockProcessor);

    expect(results).toHaveLength(5);
    expect(mockProcessor).toHaveBeenCalledTimes(3); // 2 + 2 + 1 items
    expect(results.every(r => r.processed)).toBe(true);
  });

  test('should handle batch failures and retries', async () => {
    const items = [1, 2, 3, 4];
    let attempts = 0;
    
    const mockProcessor = jest.fn(batch => {
      if (attempts++ === 0) {
        throw new Error('Temporary failure');
      }
      return batch.map(item => ({ item, processed: true }));
    });

    const { results, errors } = await processor.process(items, mockProcessor);

    expect(results).toHaveLength(4);
    expect(errors).toHaveLength(0);
    expect(processor.stats.retried).toBeGreaterThan(0);
  });

  test("should handle permanent failures", async () => {
  
    const items = [1, 2, 3, 4];
    const mockProcessor = jest.fn(() => {
      throw new Error("Permanent failure");
    });
  
    const { results, errors } = await processor.process(items, mockProcessor);
  
    expect(results.length).toBe(0);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('should provide accurate statistics', async () => {
    const items = [1, 2, 3, 4, 5];
    const mockProcessor = jest.fn(batch => {
      if (batch.includes(3)) {
        throw new Error('Failed batch');
      }
      return batch.map(item => ({ item, processed: true }));
    });

    await processor.process(items, mockProcessor);
    const stats = processor.getStats();

    expect(stats.processed + stats.failed).toBe(5);
    expect(stats.total).toBe(5);
    expect(parseInt(stats.successRate)).toBeLessThan(100);
  });
});