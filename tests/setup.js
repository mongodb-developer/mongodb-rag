// tests/setup.js
import { jest } from '@jest/globals';
import dotenv from "dotenv";
dotenv.config();

// Make jest available globally
global.jest = jest;

// Mock MongoDB operations
const mockCollection = {
  createSearchIndex: jest.fn().mockImplementation(async () => ({ name: 'vector_index' })),
  indexes: jest.fn().mockImplementation(async () => [{ name: 'vector_index', type: 'search' }]),
  listSearchIndexes: jest.fn().mockImplementation(() => ({
    toArray: async () => []
  })),
  createIndex: jest.fn().mockImplementation(async () => 'index_created'),
  listIndexes: jest.fn().mockImplementation(() => ({
    toArray: async () => []
  })),
  deleteMany: jest.fn().mockImplementation(async () => ({ deletedCount: 0 }))
};

const mockDb = {
  collection: jest.fn().mockReturnValue(mockCollection)
};

const mockClient = {
  connect: jest.fn().mockImplementation(async () => undefined),
  db: jest.fn().mockReturnValue(mockDb),
  close: jest.fn().mockImplementation(async () => undefined),
  topology: {
    isConnected: jest.fn().mockReturnValue(true)
  }
};

jest.mock('mongodb', () => ({
  MongoClient: jest.fn().mockImplementation(() => mockClient)
}));

// Mock chalk for cleaner test output
jest.mock('chalk', () => ({
  cyan: { bold: jest.fn(str => str) },
  yellow: jest.fn(str => str),
  red: jest.fn(str => str),
  green: jest.fn(str => str),
  blue: jest.fn(str => str),
  gray: jest.fn(str => str),
  bold: jest.fn(str => str),
  whiteBright: jest.fn(str => str),
  magenta: jest.fn(str => str)
}));

// Set a longer default timeout for all tests
jest.setTimeout(30000);

// Clear all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});