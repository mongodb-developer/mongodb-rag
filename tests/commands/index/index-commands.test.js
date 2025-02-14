import { jest, describe, expect, test, beforeEach } from '@jest/globals';
import { createIndex } from '../../../bin/commands/index/create-index.js';

// Mock environment variable
process.env.NONINTERACTIVE = 'true';

// Mock the MongoDB collection
const mockCollection = {
  createSearchIndexes: jest.fn().mockResolvedValue([{ name: 'vector_index' }]), // ✅ Fix: Correct function
  listSearchIndexes: jest.fn().mockReturnValue({
    toArray: jest.fn().mockResolvedValue([]) // ✅ Ensure empty list for new index creation
  })
};

const mockDb = {
  collection: jest.fn().mockReturnValue(mockCollection)
};

const mockClient = {
  db: jest.fn().mockReturnValue(mockDb),
  close: jest.fn()
};

// ✅ Fix: Use `jest.unstable_mockModule()` for ES modules
await jest.unstable_mockModule('../../../bin/utils/mongodb.js', () => ({
  getMongoClient: jest.fn().mockResolvedValue(mockClient)
}));

// ✅ Import mock after mocking
const { getMongoClient } = await import('../../../bin/utils/mongodb.js');

describe('Index Commands', () => {
  const mockConfig = {
    mongoUrl: "mongodb+srv://test:test@cluster.mongodb.net",
    database: "test_db",
    collection: "test_collection",
    indexName: "vector_index",
    embedding: {
      path: "embedding", 
      dimensions: 1536, 
      similarity: "cosine"
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create vector search index successfully', async () => {
    const result = await createIndex(mockConfig);
    expect(result).toEqual([{ name: "vector_index" }]); // ✅ Ensure test expects correct result
  });

  test('should fail when config is missing embedding dimensions', async () => {
    const invalidConfig = {
      mongoUrl: "mongodb+srv://test:test@cluster.mongodb.net",
      database: "test_db",
      collection: "test_collection",
      indexName: "vector_index",
      embedding: { similarity: "cosine" } // ❌ Missing `dimensions`
    };
    await expect(createIndex(invalidConfig)).rejects.toThrow("Missing embedding dimensions in config.");
  });

  test('should throw error for invalid configuration', async () => {
    const invalidConfig = { mongoUrl: 'invalid' };
    await expect(createIndex(invalidConfig)).rejects.toThrow(/Configuration missing/);
  });

  test('should handle index creation errors', async () => {
    mockCollection.createSearchIndexes.mockRejectedValueOnce(new Error('Failed to create index'));
    await expect(createIndex(mockConfig)).rejects.toThrow('Failed to create index');
  });
});
