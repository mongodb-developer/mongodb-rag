// src/providers/providers.test.js
import { jest, describe, expect, test, beforeEach } from '@jest/globals';
import OpenAIEmbeddingProvider from '../../src/providers/OpenAIEmbeddingProvider.js';

// Mock the axios module
jest.mock('axios', () => {
  const mockPost = jest.fn().mockResolvedValue({
    data: {
      data: [{ embedding: Array(1536).fill(0.1) }]
    }
  });

  return {
    default: {
      create: jest.fn(() => ({
        post: mockPost,
        defaults: {
          headers: {
            common: {}
          }
        }
      }))
    }
  };
});

// Import axios after mocking
import axios from 'axios';

describe('Embedding Providers', () => {
  let provider;
  const mockApiKey = 'test-key-123';
  let mockAxiosPost;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create new provider instance
    provider = new OpenAIEmbeddingProvider({
      apiKey: mockApiKey,
      model: 'text-embedding-3-small',
      dimensions: 1536
    });

    // Get reference to the mock post function
    mockAxiosPost = axios.create().post;
  });

  test('should initialize with proper configuration', () => {
    expect(provider.apiKey).toBe(mockApiKey);
    expect(provider.model).toBe('text-embedding-3-small');
  });

  test('should get embeddings from the OpenAI provider', async () => {
    // Set up mock response for single text
    mockAxiosPost.mockResolvedValueOnce({
      data: {
        data: [{ embedding: Array(1536).fill(0.1) }]
      }
    });

    const texts = ['test text'];
    const result = await provider.getEmbeddings(texts);
    
    expect(mockAxiosPost).toHaveBeenCalledWith('/embeddings', {
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
    expect(mockAxiosPost).not.toHaveBeenCalled();
  });

  test('should handle batch processing', async () => {
    // Set up mock response for batch
    mockAxiosPost.mockResolvedValueOnce({
      data: {
        data: Array(5).fill({ embedding: Array(1536).fill(0.1) })
      }
    });

    const texts = Array(5).fill('test text');
    const result = await provider.getEmbeddings(texts);
    
    expect(mockAxiosPost).toHaveBeenCalledWith('/embeddings', {
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
    mockAxiosPost
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
    expect(mockAxiosPost).toHaveBeenCalledTimes(3); // Should be called three times for batches of 2,2,1
  });

  test('should handle API errors', async () => {
    mockAxiosPost.mockRejectedValueOnce({
      response: {
        data: {
          error: {
            message: 'Test API error'
          }
        }
      }
    });

    await expect(provider.getEmbeddings(['test'])).rejects.toThrow('Test API error');
  });
});