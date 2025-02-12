// src/providers/providers.test.js
import { jest, describe, expect, test, beforeEach } from '@jest/globals';

// Mock axios using ES modules style
const mockPost = jest.fn();
const mockAxiosCreate = jest.fn(() => ({
  post: mockPost
}));

// Mock the axios module before importing any modules that use it
await jest.unstable_mockModule('axios', () => ({
  default: {
    create: mockAxiosCreate
  }
}));

// Import modules after mocking
const { default: OpenAIEmbeddingProvider } = await import('./OpenAIEmbeddingProvider.js');

describe('Embedding Providers', () => {
  let provider;
  const mockApiKey = 'test-key-123';

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Set up default successful response
    mockPost.mockReset().mockResolvedValue({
      data: {
        data: [{ embedding: Array(1536).fill(0.1) }]
      }
    });

    // Create new provider instance
    provider = new OpenAIEmbeddingProvider({
      apiKey: mockApiKey,
      model: 'text-embedding-3-small',
      dimensions: 1536,
      maxRetries: 1 // Reduce retries for faster tests
    });
  });

  test('should initialize with proper configuration', () => {
    expect(provider.apiKey).toBe(mockApiKey);
    expect(provider.model).toBe('text-embedding-3-small');
    expect(mockAxiosCreate).toHaveBeenCalledWith({
      baseURL: 'https://api.openai.com/v1',
      headers: {
        'Authorization': 'Bearer test-key-123',
        'Content-Type': 'application/json'
      }
    });
  });

  test('should get embeddings from the OpenAI provider', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        data: [{ embedding: Array(1536).fill(0.1) }]
      }
    });

    const texts = ['test text'];
    const result = await provider.getEmbeddings(texts);
    
    expect(mockPost).toHaveBeenCalledWith('/embeddings', {
      model: 'text-embedding-3-small',
      input: texts
    });
    
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(1536);
  });

  test('should handle empty input', async () => {
    const result = await provider.getEmbeddings([]);
    expect(result).toHaveLength(0);
    expect(mockPost).not.toHaveBeenCalled();
  });

  test('should handle batch processing', async () => {
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
  });

  test('should respect batch size limits', async () => {
    provider = new OpenAIEmbeddingProvider({
      apiKey: mockApiKey,
      batchSize: 2,
      maxRetries: 1
    });

    // Mock responses for each batch
    mockPost
      .mockResolvedValueOnce({
        data: { data: Array(2).fill({ embedding: Array(1536).fill(0.1) }) }
      })
      .mockResolvedValueOnce({
        data: { data: Array(2).fill({ embedding: Array(1536).fill(0.1) }) }
      })
      .mockResolvedValueOnce({
        data: { data: Array(1).fill({ embedding: Array(1536).fill(0.1) }) }
      });

    const texts = Array(5).fill('test text');
    const result = await provider.getEmbeddings(texts);
    
    expect(result).toHaveLength(5);
    expect(mockPost).toHaveBeenCalledTimes(3);
  });

  test('should handle API errors', async () => {
    // Clear any previous mock implementations
    mockPost.mockReset();
    
    // Mock a failed API call
    mockPost.mockRejectedValue({
      response: {
        data: {
          error: {
            message: 'Test API error'
          }
        }
      }
    });

    // Expect the error to be thrown
    await expect(
      provider.getEmbeddings(['test'])
    ).rejects.toThrow('Test API error');

    // Verify the API was called
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  test('should handle unexpected API responses', async () => {
    mockPost.mockResolvedValueOnce({
      data: {} // Missing data array
    });

    await expect(
      provider.getEmbeddings(['test'])
    ).rejects.toThrow('Unexpected response format from OpenAI API');
  });
});