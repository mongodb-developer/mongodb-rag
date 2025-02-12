// tests/core/IndexManager.test.js
import { jest, describe, expect, test, beforeEach } from '@jest/globals';
import IndexManager from '../../src/core/IndexManager.js';

// We need to explicitly mock the modules in ES modules
const mockCollection = {
    createSearchIndex: jest.fn().mockResolvedValue({ name: 'vector_index' }),
    createIndex: jest.fn().mockResolvedValue('index_created'),
    listIndexes: jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([])
    }),
    stats: jest.fn().mockResolvedValue({
      count: 1000,
      totalIndexSize: 1000000,
      indexSizes: {
        'vector_index': 500000,
        'document_lookup': 250000
      }
    })
  };

  describe('IndexManager', () => {
    let indexManager;
  
    beforeEach(() => {
      jest.clearAllMocks();
      indexManager = new IndexManager(mockCollection, {
        indexName: 'vector_index',
        dimensions: 1536,
        similarity: 'cosine'
      });
    });
  
    test('should create vector search index if it does not exist', async () => {
      // Simulate no existing index
      mockCollection.listIndexes.mockReturnValueOnce({
        toArray: jest.fn().mockResolvedValue([])
      });
  
      await indexManager.ensureIndexes();
  
      // Verify createSearchIndex was called with the correct definition
      expect(mockCollection.createSearchIndex).toHaveBeenCalledWith({
        name: 'vector_index',
        type: 'vectorSearch',
        definition: {
          fields: [
            {
              type: 'vector',
              path: 'embedding',
              numDimensions: 1536,
              similarity: 'cosine',
              quantization: 'none'
            }
          ]
        }
      });
  
      // Ensure supporting indexes were also created
      expect(mockCollection.createIndex).toHaveBeenCalledWith(
        { documentId: 1 },
        expect.any(Object)
      );
      expect(mockCollection.createIndex).toHaveBeenCalledWith(
        { 'metadata.source': 1, 'metadata.category': 1 },
        expect.any(Object)
      );
    });
  
    test('should not create vector search index if it already exists', async () => {
      // Simulate existing index
      mockCollection.listIndexes.mockReturnValueOnce({
        toArray: jest.fn().mockResolvedValue([
          { name: 'vector_index', key: { embedding: 'vector' } }
        ])
      });
  
      await indexManager.ensureIndexes();
  
      // Ensure createSearchIndex was NOT called
      expect(mockCollection.createSearchIndex).not.toHaveBeenCalled();
  
      // Ensure supporting indexes were still created
      expect(mockCollection.createIndex).toHaveBeenCalledTimes(2);
    });
  
    test('should throw an error if index creation fails', async () => {
      mockCollection.createSearchIndex.mockRejectedValueOnce(new Error('Index creation failed'));
  
      await expect(indexManager.ensureIndexes()).rejects.toThrow('Failed to ensure indexes');
  
      // Ensure it attempted to create the index
      expect(mockCollection.createSearchIndex).toHaveBeenCalled();
    });
  });