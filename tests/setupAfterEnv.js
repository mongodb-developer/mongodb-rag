import { jest } from '@jest/globals';

// Mock fs module
// jest.mock('fs', () => ({
//     existsSync: jest.fn(),
//     readFileSync: jest.fn(),
//     writeFileSync: jest.fn(),
//     unlinkSync: jest.fn()
//   }));
  
  // Mock MongoDB client
  jest.mock('mongodb', () => ({
    MongoClient: jest.fn().mockImplementation(() => ({
      connect: jest.fn(),
      db: jest.fn(),
      close: jest.fn()
    }))
  }));
  
  // Add global beforeEach
  beforeEach(() => {
    jest.clearAllMocks();
  });