// tests/commands/config/config-commands.test.js
import { jest, describe, expect, test, beforeEach } from '@jest/globals';
import { showConfig, editConfig, clearConfig, resetConfig } from '../../../bin/commands/config/index.js';

// Mock fs using ES modules approach
const mockFs = {
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  unlinkSync: jest.fn()
};

await jest.unstable_mockModule('fs', () => mockFs);

describe('Config Commands', () => {
  const mockConfig = {
    mongoUrl: 'mongodb+srv://test:test@cluster.mongodb.net',
    database: 'test_db',
    collection: 'test_collection',
    embedding: {
      provider: 'openai',
      apiKey: 'test-key'
    }
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup default mock responses
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockConfig));
  });

  test('showConfig displays configuration correctly', async () => {
    const result = await showConfig('test-path');
    expect(result).toEqual(mockConfig);
    expect(mockFs.readFileSync).toHaveBeenCalledWith('test-path', 'utf-8');
  });

  test('clearConfig removes configuration file', async () => {
    const result = await clearConfig('test-path');
    expect(result).toBe(true);
    expect(mockFs.unlinkSync).toHaveBeenCalledWith('test-path');
  });
});