// src/providers/providers.test.js
import { jest, describe, expect, test, beforeEach } from '@jest/globals';
import OpenAIEmbeddingProvider from '../../src/providers/OpenAIEmbeddingProvider.js';

// Mock axios using ES modules style
const mockPost = jest.fn().mockResolvedValue({
  data: {
    data: [{ embedding: Array(1536).fill(0.1) }]
  }
});

const mockAxiosCreate = jest.fn().mockReturnValue({
  post: mockPost,
  defaults: {
    headers: {
      common: {}
    }
  }
});

await jest.unstable_mockModule('axios', () => ({
  default: {
    create: mockAxiosCreate
  }
}));

describe('Embedding Providers', () => {
  let provider;
  const mockApiKey = 'test-key-123';

  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();
    mockPost.mockClear();
    mockAxiosCreate.mockClear();
    
    // Create new provider instance
    provider = new OpenAIEmbeddingProvider({
      apiKey: mockApiKey,
      model: 'text-embedding-3-small',
      dimensions: 1536
    });
  });

  test('should initialize with proper configuration', () => {
    expect(provider.apiKey).toBe(mockApiKey);
    expect(provider.model).toBe('text-embedding-3-small');
    expect(mockAxiosCreate).toHaveBeenCalledWith(expect.objectContaining({
      baseURL: 'https://api.openai.com/v1',
      headers: {
        'Authorization': `Bearer ${mockApiKey}`,
        'Content-Type': 'application/json'
      }
    }));
  });

  test('should get embeddings from the OpenAI provider', async () => {
    const texts = ['test text'];
    const result = await provider.getEmbeddings(texts);
    
    expect(mockPost).toHaveBeenCalledWith('/embeddings', {
      model: 'text-embedding-3-small',
      input: texts
    });
    
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(1536);
    expect(typeof result[0][0]).toBe('number');
    expect(result[0][0]).toBeGreaterThanOrEqual(-1);
    expect(result[0][0]).toBeLessThanOrEqual(1);
  });

  test('should handle empty input', async () => {
    const result = await provider.getEmbeddings([]);
    expect(result).toHaveLength(0);
    expect(mockPost).not.toHaveBeenCalled();
  });

  test('should handle batch processing', async () => {
    // Update mock for batch processing
    mockPost.mockResolvedValueOnce({
      data: {
        data: Array(5).fill({ embedding: Array(1536).fill(0.1) })
      }
    });

    const texts = Array(5).fill('test text');
    const result = await provider.getEmbeddings(texts);
    
    expect(mockPost).toHaveBeenCalledWith('/embeddings', {
      model: 'text-embedding-3-small',
      input: texts
    });
    
    expect(result).toHaveLength(5);
    expect(result[0]).toHaveLength(1536);
  });

  test('should respect batch size limits', async () => {
    // Create provider with small batch size
    const smallBatchProvider = new OpenAIEmbeddingProvider({
      apiKey: mockApiKey,
      batchSize: 2
    });

    // Set up mock responses for each batch
    mockPost
      .mockResolvedValueOnce({
        data: {
          data: Array(2).fill({ embedding: Array(1536).fill(0.1) })
        }
      })
      .mockResolvedValueOnce({
        data: {
          data: Array(2).fill({ embedding: Array(1536).fill(0.1) })
        }
      })
      .mockResolvedValueOnce({
        data: {
          data: Array(1).fill({ embedding: Array(1536).fill(0.1) })
        }
      });

    const texts = Array(5).fill('test text');
    const result = await smallBatchProvider.getEmbeddings(texts);
    
    expect(result).toHaveLength(5);
    expect(mockPost).toHaveBeenCalledTimes(3); // Should be called three times for batches of 2,2,1
  });

  test('should handle API errors', async () => {
    mockPost.mockRejectedValueOnce({
      response: {
        data: {
          error: {
            message: 'Test API error'
          }
        }
      }
    });

    await expect(provider.getEmbeddings(['test'])).rejects.toThrow('OpenAI API error: Test API error');
  });
});