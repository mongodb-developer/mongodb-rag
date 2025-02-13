// src/providers/OllamaEmbeddingProvider.test.js
import { jest, describe, expect, test, beforeEach } from '@jest/globals';
import OllamaEmbeddingProvider from './OllamaEmbeddingProvider.js';

// Mock fetch globally
global.fetch = jest.fn();

describe('OllamaEmbeddingProvider', () => {
  let provider;
  const mockBaseUrl = 'http://localhost:11434';
  const mockModel = 'llama3';

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create new provider instance
    provider = new OllamaEmbeddingProvider({
      baseUrl: mockBaseUrl,
      model: mockModel,
      maxRetries: 1
    });

    // Set up default successful response for embeddings
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        embedding: Array(1536).fill(0.1)
      })
    });
  });

  test('should initialize with proper configuration', () => {
    expect(provider.baseUrl).toBe(mockBaseUrl);
    expect(provider.model).toBe(mockModel);
  });

  test('should throw error if baseUrl is missing', () => {
    expect(() => new OllamaEmbeddingProvider({ model: mockModel }))
      .toThrow('Ollama base URL is required');
  });

  test('should throw error if model is missing', () => {
    expect(() => new OllamaEmbeddingProvider({ baseUrl: mockBaseUrl }))
      .toThrow('Ollama model name is required');
  });

  test('should get embeddings from Ollama', async () => {
    const texts = ['test text'];
    const result = await provider.getEmbeddings(texts);
    
    expect(global.fetch).toHaveBeenCalledWith(
      `${mockBaseUrl}/api/embeddings`,
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining(texts[0])
      })
    );
    
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(1536);
  });

  test('should handle API errors', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Model not found'
    });

    await expect(provider.getEmbeddings(['test']))
      .rejects.toThrow('Ollama API error: Model not found');
  });

  test('should verify model availability', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        models: [{ name: mockModel }]
      })
    });

    const isAvailable = await provider.verifyModel();
    expect(isAvailable).toBe(true);
  });
});