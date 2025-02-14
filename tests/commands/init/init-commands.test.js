// tests/commands/init/init-commands.test.js
import { jest, describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import { init, testConnection } from '../../../bin/commands/init/index.js';
import { testProvider } from '../../../bin/utils/providers.js';

jest.mock('../../../bin/utils/providers.js');

describe('Init Commands', () => {
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
    testProvider.mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('testConnection verifies provider connection', async () => {
    const result = await testConnection(mockConfig);
    expect(result.success).toBe(true);
    expect(testProvider).toHaveBeenCalledWith(mockConfig);
  });
});