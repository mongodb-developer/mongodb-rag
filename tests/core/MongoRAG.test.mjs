// tests/core/MongoRAG.test.js
import { jest, describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import MongoRAG from '../../src/core/MongoRAG.js';

// Setup MongoDB mocks
const mockCollection = {
  insertMany: jest.fn().mockResolvedValue({ insertedCount: 2 }),
  aggregate: jest.fn().mockReturnValue({
    toArray: jest.fn().mockResolvedValue([])
  }),
  createIndex: jest.fn().mockResolvedValue('index-name'),
  listIndexes: jest.fn().mockReturnValue({
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

// Mock mongodb module
jest.unstable_mockModule('mongodb', () => ({
  MongoClient: jest.fn().mockImplementation(() => mockClient)
}));

describe('MongoRAG', () => {
  let rag;
  
  beforeEach(() => {
    jest.clearAllMocks();
    rag = new MongoRAG({
      mongoUrl: 'mongodb://mock:27017',
      database: 'test',
      collection: 'documents',
      embedding: {
        provider: 'openai',
        apiKey: 'test-key',
        dimensions: 1536
      }
    });
  });

  afterEach(async () => {
    if (rag?.client) {
      try {
        await rag.collection.deleteMany({}); // Clear test data

        await rag.close();
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });

  test('should initialize with correct config', () => {
    expect(rag.config.chunking.strategy).toBe('sliding');
    expect(rag.config.embedding.provider).toBe('openai');
    expect(rag.config.embedding.apiKey).toBe('test-key');
  });

  test('should connect to MongoDB', async () => {
    await rag.connect();
    expect(mockClient.connect).toHaveBeenCalled();
    expect(mockClient.db).toHaveBeenCalledWith('test');
  });

  test('should close connection', async () => {
    await rag.connect();
    await rag.close();
    expect(mockClient.close).toHaveBeenCalled();
  });

  test('should ingest documents', async () => {
    await rag.connect();
    const result = await rag.ingestBatch([{
      id: 'doc1',
      content: 'test'
    }]);
    expect(result.processed).toBe(1);
  });
});