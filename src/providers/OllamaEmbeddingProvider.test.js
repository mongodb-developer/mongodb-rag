import { jest, describe, expect, test, beforeEach } from '@jest/globals';
import OllamaEmbeddingProvider from './OllamaEmbeddingProvider.js';

global.fetch = jest.fn();

describe('OllamaEmbeddingProvider', () => {
  let provider;

  beforeEach(() => {
    jest.clearAllMocks();
    
    provider = new OllamaEmbeddingProvider({
      baseUrl: 'http://localhost:11434',
      model: 'llama3',
    });

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ embedding: Array(1536).fill(0.1) })
    });
  });

  test('should fetch embeddings from Ollama', async () => {
    const texts = ['test query'];
    const embeddings = await provider.getEmbeddings(texts);

    expect(global.fetch).toHaveBeenCalled();
    expect(embeddings[0]).toHaveLength(1536);
  });

  test('should handle API errors', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, statusText: 'Error' });
    await expect(provider.getEmbeddings(['test'])).rejects.toThrow('Ollama API error: Error');
  });
});
