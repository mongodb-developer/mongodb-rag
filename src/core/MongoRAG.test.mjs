import { jest, describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import MongoRAG from '../../src/core/MongoRAG.js';

// Mock MongoDB client
const mockCollection = {
  insertMany: jest.fn().mockResolvedValue({ insertedCount: 2 }),
  aggregate: jest.fn().mockReturnValue({
    toArray: jest.fn().mockResolvedValue([])
  })
};

const mockDb = {
  collection: jest.fn().mockReturnValue(mockCollection)
};

const mockClient = {
  connect: jest.fn().mockResolvedValue(undefined),
  db: jest.fn().mockReturnValue(mockDb),
  close: jest.fn().mockResolvedValue(undefined)
};

// Mock MongoClient
jest.unstable_mockModule('mongodb', () => ({
  MongoClient: jest.fn().mockImplementation(() => mockClient)
}));

describe('MongoRAG', () => {
  let rag;
  
  beforeEach(() => {
    jest.clearAllMocks();
    rag = new MongoRAG({
      mongoUrl: 'mongodb://mock:27017',
      database: 'defaultDB',
      collection: 'defaultCollection',
      embedding: {
        provider: 'openai',
        apiKey: 'test-key',
        dimensions: 1536
      }
    });
  });

  afterEach(async () => {
    await rag.close();
  });

  test('should use default database and collection when not provided', async () => {
    await rag.connect();
    await rag.ingestBatch([{ id: 'doc1', content: 'test' }]);

    expect(mockClient.db).toHaveBeenCalledWith('defaultDB');
    expect(mockDb.collection).toHaveBeenCalledWith('defaultCollection');
  });

  test('should allow overriding database and collection', async () => {
    await rag.ingestBatch([{ id: 'doc1', content: 'test' }], {
      database: 'customDB',
      collection: 'customCollection'
    });

    expect(mockClient.db).toHaveBeenCalledWith('customDB');
    expect(mockDb.collection).toHaveBeenCalledWith('customCollection');
  });

  test('should throw error if database/collection missing', async () => {
    rag.config.defaultDatabase = null;
    rag.config.defaultCollection = null;

    await expect(rag.ingestBatch([{ id: 'doc1', content: 'test' }]))
      .rejects.toThrow('Database and collection must be specified');
  });
});
