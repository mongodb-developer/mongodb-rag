// tests/core/IndexManager.test.js
import { jest, describe, expect, test, beforeEach } from '@jest/globals';
import IndexManager from '../../src/core/IndexManager.js';

// We need to explicitly mock the modules in ES modules
const mockCollection = {
  createIndex: null,
  listIndexes: null,
  stats: null
};

describe('IndexManager', () => {
  let indexManager;

  beforeEach(() => {
    // Reset all mocks
    mockCollection.createIndex = jest.fn().mockResolvedValue('index_created');
    mockCollection.listIndexes = jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([])
    });
    mockCollection.stats = jest.fn().mockResolvedValue({
      count: 1000,
      totalIndexSize: 1000000,
      indexSizes: {
        'vector_index': 500000,
        'document_lookup': 250000
      }
    });

    indexManager = new IndexManager(mockCollection, {
      dimensions: 1536,
      similarity: 'cosine'
    });
  });

  test('should create supporting indexes', async () => {
    await indexManager.ensureIndexes();
    
    expect(mockCollection.createIndex).toHaveBeenCalledWith(
      { documentId: 1 },
      expect.any(Object)
    );
    
    expect(mockCollection.createIndex).toHaveBeenCalledWith(
      { 'metadata.source': 1, 'metadata.category': 1 },
      expect.any(Object)
    );
  });

  test('should handle index creation errors', async () => {
    mockCollection.createIndex.mockRejectedValueOnce(new Error('Index creation failed'));
    
    await expect(indexManager.ensureIndexes())
      .rejects
      .toThrow('Failed to ensure indexes');
  });

  test('should build search query correctly', () => {
    const embedding = Array(1536).fill(0.1);
    const query = indexManager.buildSearchQuery(embedding);

    expect(query[0].$vectorSearch).toBeDefined();
    expect(query[0].$vectorSearch.queryVector).toEqual(embedding);
    expect(query[0].$vectorSearch.path).toBe('embedding');
  });

  test('should include filter in search query', () => {
    const embedding = Array(1536).fill(0.1);
    const filter = { 'metadata.source': 'test' };
    const query = indexManager.buildSearchQuery(embedding, filter);

    expect(query[0].$vectorSearch.filter).toEqual(filter);
  });
});