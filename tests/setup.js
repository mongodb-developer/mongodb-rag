// tests/setup.js
import { jest } from '@jest/globals';
import dotenv from "dotenv";
dotenv.config();

// Make jest available globally
global.jest = jest;

// Set default test environment variables if not provided
process.env.EMBEDDING_PROVIDER = process.env.EMBEDDING_PROVIDER || 'openai';
process.env.EMBEDDING_API_KEY = process.env.EMBEDDING_API_KEY || 'test-key-123';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
process.env.NODE_ENV = 'test';
process.env.CONFIG_PATH = '.mongodb-rag.test.json';
process.env.VECTOR_INDEX_NAME = 'vector_index';
process.env.VECTOR_SEARCH_FIELD = 'text';
// Mock MongoDB client
jest.mock('mongodb', () => ({
  MongoClient: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        createSearchIndex: jest.fn().mockResolvedValue({ name: 'vector_index' }),
        indexes: jest.fn().mockResolvedValue([{ name: 'vector_index' }]),
        listSearchIndexes: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([])
        })
      })
    }),
    close: jest.fn().mockResolvedValue(undefined)
  }))
}));

// Mock axios
jest.mock('axios', () => ({
  default: {
    create: jest.fn(() => ({
      post: jest.fn().mockResolvedValue({
        data: {
          data: [{ embedding: Array(1536).fill(0.1) }]
        }
      })
    }))
  }
}));

// Set longer timeout for all tests
jest.setTimeout(30000);

// Clear all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});