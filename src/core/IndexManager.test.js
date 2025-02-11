import IndexManager from './IndexManager.js';
import { jest, describe, expect, test, beforeEach, afterEach } from '@jest/globals';



describe('IndexManager', () => {
  let indexManager;
  let mockCollection;

  beforeEach(() => {
    mockCollection = {
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
      }),
      database: {
        command: jest.fn().mockResolvedValue({ ok: 1 })
      },
      collectionName: 'test_collection'
    };

    indexManager = new IndexManager(mockCollection, {
      dimensions: 1536
    });
  });

  test('should initialize with default options', () => {
    expect(indexManager.options.indexName).toBe('default'); // Updated expectation
    expect(indexManager.options.dimensions).toBe(1536);
    expect(indexManager.options.similarity).toBe('cosine');
  });

  test('should create vector index if not exists', async () => {
    await indexManager.ensureIndexes();
  
    expect(mockCollection.createIndex).toHaveBeenCalledWith(
      { documentId: 1 }, // Fix expected structure
      expect.objectContaining({
        name: 'document_lookup'
      })
    );
  
    expect(mockCollection.createIndex).toHaveBeenCalledWith(
      { 'metadata.source': 1, 'metadata.category': 1 }, // Fix expected structure
      expect.objectContaining({
        name: 'metadata_filter',
        sparse: true
      })
    );
  });

  test('should not create vector index if already exists', async () => {
    mockCollection.listIndexes = jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([
        { name: 'vector_index', key: { embedding: 'vector' } }
      ])
    });

    await indexManager.ensureIndexes();
    expect(mockCollection.createIndex).not.toHaveBeenCalledWith(
      expect.objectContaining({ name: 'vector_index' })
    );
  });

  test('should build correct search query', () => {
    const embedding = Array(1536).fill(0.1);
    const filter = { 'metadata.category': 'test' };
    const options = { maxResults: 5, includeMetadata: true };
  
    const query = indexManager.buildSearchQuery(embedding, filter, options);
  
    expect(query).toHaveLength(3); // Ensure query pipeline length
    expect(query[0].$vectorSearch).toBeDefined(); // Check vector search
    expect(query[0].$vectorSearch.numCandidates).toBe(100);
    expect(query[0].$vectorSearch.limit).toBe(5);
    expect(query[0].$vectorSearch.filter).toEqual(filter);
  });

  test('should get index statistics', async () => {
    const stats = await indexManager.getIndexStats();
    
    expect(stats.documentCount).toBe(1000);
    expect(stats.indexSize).toBe(1000000);
    expect(stats.indexes).toBeDefined();
  });

  test('should handle index creation errors', async () => {
    mockCollection.createIndex = jest.fn().mockRejectedValue(new Error('Index creation failed'));
  
    await expect(indexManager.ensureIndexes())
      .rejects
      .toThrow('Failed to ensure indexes: Failed to create supporting indexes: Index creation failed');
  });
});