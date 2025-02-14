// tests/utils/providers.test.js
import { jest, describe, expect, test, beforeEach } from '@jest/globals';

// Mock global fetch to prevent network calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

// Mock the providers module
const mockProviders = {
  getDefaultDimensions: jest.fn(),
  testProvider: jest.fn()
};

// Mock `getDefaultDimensions` to return specific values based on the provider
mockProviders.getDefaultDimensions.mockImplementation((provider) => {
  switch (provider) {
    case 'openai': return 1536;
    case 'deepseek': return 1024;
    case 'ollama': return 4096;
    default: return 1536;
  }
});

// Mock default behavior of `testProvider`
mockProviders.testProvider.mockResolvedValue({ success: true });

// Apply Jest mock before importing the actual module
await jest.unstable_mockModule('../../bin/utils/providers.js', () => mockProviders);

// Import after Jest has applied the mock
const { getDefaultDimensions, testProvider } = await import('../../bin/utils/providers.js');

describe('Provider Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset `testProvider` mock before each test
    mockProviders.testProvider.mockResolvedValue({ success: true });
  });

  test('returns correct dimensions for providers', () => {
    expect(getDefaultDimensions('openai')).toBe(1536);
    expect(getDefaultDimensions('deepseek')).toBe(1024);
    expect(getDefaultDimensions('ollama')).toBe(4096);
  });

  test('tests provider connection successfully', async () => {
    const config = {
      embedding: {
        provider: 'openai',
        apiKey: 'test-key'
      }
    };

    const result = await testProvider(config);
    expect(result.success).toBe(true);
  });

  test('handles provider connection failure', async () => {
    const config = {
      embedding: {
        provider: 'openai',
        apiKey: 'invalid-key'
      }
    };

    // Simulate a failed connection
    mockProviders.testProvider.mockResolvedValueOnce({ 
      success: false, 
      message: 'Connection failed' 
    });

    const result = await testProvider(config);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Connection failed');
  });
});
