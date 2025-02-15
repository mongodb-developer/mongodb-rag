// src/core/IndexManager.test.js
import IndexManager from './IndexManager.js';
import { jest, describe, expect, test, beforeEach } from '@jest/globals';

describe('IndexManager', () => {
  let indexManager;
  let mockCollection;

  beforeEach(() => {
    mockCollection = {
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
      }),
      database: {
        command: jest.fn().mockResolvedValue({ ok: 1 })
      },
      collectionName: 'test_collection'
    };

    // Create with the new config structure
    const testConfig = {
      indexName: 'vector_index',
      embedding: {
        dimensions: 1536
      },
      search: {
        similarity: 'cosine'
      },
      embeddingFieldPath: 'embedding'
    };

    indexManager = new IndexManager(mockCollection, testConfig);
  });

  test('should initialize with default options', () => {
    // Test with no config
    const defaultManager = new IndexManager(mockCollection);
    expect(defaultManager.options.indexName).toBe('vector_index');
    expect(defaultManager.options.dimensions).toBe(1536);
    expect(defaultManager.options.similarity).toBe('cosine');
    expect(defaultManager.options.embeddingPath).toBe('embedding');
  });

  test('should initialize with provided config', () => {
    const customConfig = {
      indexName: 'custom_index',
      embedding: {
        dimensions: 768
      },
      search: {
        similarity: 'dotProduct'
      },
      embeddingFieldPath: 'embeddings.vector'
    };

    const customManager = new IndexManager(mockCollection, customConfig);
    expect(customManager.options.indexName).toBe('custom_index');
    expect(customManager.options.dimensions).toBe(768);
    expect(customManager.options.similarity).toBe('dotProduct');
    expect(customManager.options.embeddingPath).toBe('embeddings.vector');
  });

  test('should create vector index if not exists', async () => {
    await indexManager.ensureIndexes();
  
    expect(mockCollection.createSearchIndex).toHaveBeenCalledWith({
      name: 'vector_index',
      type: 'vectorSearch',
      definition: {
        fields: [{
          type: 'vector',
          path: 'embedding',
          numDimensions: 1536,
          similarity: 'cosine',
          quantization: 'none'
        }]
      }
    });
  
    expect(mockCollection.createIndex).toHaveBeenCalledWith(
      { documentId: 1 },
      { name: 'document_lookup' }
    );

    expect(mockCollection.createIndex).toHaveBeenCalledWith(
      { 'metadata.source': 1, 'metadata.category': 1 },
      { name: 'metadata_filter', sparse: true }
    );
  });

  test('should not create vector index if already exists', async () => {
    mockCollection.listIndexes = jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([
        { name: 'vector_index', key: { embedding: 'vector' } }
      ])
    });

    await indexManager.ensureIndexes();

    expect(mockCollection.createSearchIndex).not.toHaveBeenCalled();
  });

  test('should build correct search query with default options', () => {
    const embedding = Array(1536).fill(0.1);
    const query = indexManager.buildSearchQuery(embedding);

    expect(query).toHaveLength(2);
    expect(query[0].$vectorSearch).toEqual({
      index: 'vector_index',
      path: 'embedding',
      queryVector: embedding,
      limit: 10,
      numCandidates: 100,
      exact: false
    });
  });

  test('should build correct search query with custom options', () => {
    const embedding = Array(1536).fill(0.1);
    const filter = { 'metadata.category': 'test' };
    const options = { 
      maxResults: 5, 
      includeMetadata: true,
      exact: true
    };

    const query = indexManager.buildSearchQuery(embedding, filter, options);

    expect(query).toHaveLength(2);
    expect(query[0].$vectorSearch).toEqual({
      index: 'vector_index',
      path: 'embedding',
      queryVector: embedding,
      limit: 5,
      filter,
      exact: true
    });
    expect(query[1].$project).toBeDefined();
  });

  test('should get index statistics', async () => {
    const stats = await indexManager.getIndexStats();

    expect(stats.documentCount).toBe(1000);
    expect(stats.indexSize).toBe(1000000);
    expect(stats.indexes).toBeDefined();
    expect(Array.isArray(stats.indexes)).toBe(true);
  });

  test('should handle index creation errors', async () => {
    mockCollection.createSearchIndex.mockRejectedValue(new Error('Index creation failed'));

    await expect(indexManager.ensureIndexes()).rejects.toThrow(
      'Failed to ensure indexes: Index creation failed'
    );
  });

  test('should handle stats retrieval errors', async () => {
    mockCollection.stats.mockRejectedValue(new Error('Stats retrieval failed'));

    await expect(indexManager.getIndexStats()).rejects.toThrow(
      'Failed to get index stats: Stats retrieval failed'
    );
  });
});