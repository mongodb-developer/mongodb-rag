// src/providers/providers.test.js
import { jest, describe, expect, test, beforeEach } from '@jest/globals';
import OpenAIEmbeddingProvider from '../../src/providers/OpenAIEmbeddingProvider.js';

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

describe('Embedding Providers', () => {
  let provider;
  const mockApiKey = 'test-key-123';

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    provider = new OpenAIEmbeddingProvider({
      apiKey: mockApiKey,
      model: 'text-embedding-3-small',
      dimensions: 1536
    });
  });

  test('should initialize with proper configuration', () => {
    expect(provider.apiKey).toBe(mockApiKey);
    expect(provider.model).toBe('text-embedding-3-small');
  });

  test('should get embeddings from the OpenAI provider', async () => {
    const texts = ['test text'];
    const result = await provider.getEmbeddings(texts);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(1536);
    expect(typeof result[0][0]).toBe('number');
    expect(result[0][0]).toBeGreaterThanOrEqual(-1);
    expect(result[0][0]).toBeLessThanOrEqual(1);
  });

  test('should handle empty input', async () => {
    const result = await provider.getEmbeddings([]);
    expect(result).toHaveLength(0);
  });

  test('should handle batch processing', async () => {
    const texts = Array(5).fill('test text');
    const result = await provider.getEmbeddings(texts);
    expect(result).toHaveLength(5);
    expect(result[0]).toHaveLength(1536);
  });

  test('should respect batch size limits', async () => {
    const provider = new OpenAIEmbeddingProvider({
      apiKey: mockApiKey,
      batchSize: 2
    });

    const texts = Array(5).fill('test text');
    const result = await provider.getEmbeddings(texts);
    expect(result).toHaveLength(5);
  });
});