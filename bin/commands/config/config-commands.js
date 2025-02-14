// tests/commands/config/config-commands.test.js
import { jest, describe, expect, test, beforeEach } from '@jest/globals';
import chalk from 'chalk';

// Create mock fs functions
const mockFsImpl = {
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  unlinkSync: jest.fn()
};

// Mock fs module
await jest.unstable_mockModule('fs', () => mockFsImpl);

// Import after mocking
const { showConfig } = await import('../../../bin/commands/config/show-config.js');
const { clearConfig } = await import('../../../bin/commands/config/clear-config.js');

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
    jest.clearAllMocks();
    mockFsImpl.existsSync.mockReturnValue(true);
    mockFsImpl.readFileSync.mockReturnValue(JSON.stringify(mockConfig));
  });

  test('showConfig displays configuration correctly', async () => {
    mockFsImpl.existsSync.mockReturnValue(true);
    mockFsImpl.readFileSync.mockReturnValue(JSON.stringify(mockConfig));
    
    const result = await showConfig('test-path');
    expect(result).toEqual(mockConfig);
    expect(mockFsImpl.readFileSync).toHaveBeenCalledWith('test-path', 'utf-8');
  });

  test('clearConfig removes configuration file', async () => {
    mockFsImpl.existsSync.mockReturnValue(true);
    
    const result = await clearConfig('test-path');
    expect(result).toBe(true);
    expect(mockFsImpl.unlinkSync).toHaveBeenCalledWith('test-path');
  });

  test('clearConfig handles missing file', async () => {
    mockFsImpl.existsSync.mockReturnValue(false);
    
    const result = await clearConfig('test-path');
    expect(result).toBe(false);
    expect(mockFsImpl.unlinkSync).not.toHaveBeenCalled();
  });
});