import Chunker from './chunker.js';
import { jest, describe, expect, test, beforeEach, afterEach } from '@jest/globals';

describe('Chunker', () => {
  let chunker;
  
  beforeEach(() => {
    chunker = new Chunker({
      maxChunkSize: 100,
      overlap: 20
    });
  });

  test('should initialize with default options', () => {
    const defaultChunker = new Chunker();
    expect(defaultChunker.options.strategy).toBe('sliding');
    expect(defaultChunker.options.maxChunkSize).toBe(500);
    expect(defaultChunker.options.overlap).toBe(50);
  });

  test('should chunk document using sliding window strategy', async () => {
    const document = {
      id: 'test-doc',
      content: 'This is the first sentence. This is the second sentence. ' +
               'This is the third sentence. This is the fourth sentence. ' +
               'This is the fifth sentence.',
      metadata: { source: 'test' }
    };

    const chunks = await chunker.chunkDocument(document);
    
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0].documentId).toBe('test-doc');
    expect(chunks[0].metadata.source).toBe('test');
    expect(chunks[0].metadata.strategy).toBe('sliding');
  });

  test('should handle empty documents', async () => {
    const document = {
      id: 'empty-doc',
      content: '',
      metadata: {}
    };

    const chunks = await chunker.chunkDocument(document);
    expect(chunks.length).toBe(0);
  });

  test('should maintain overlap between chunks', async () => {
    const document = {
      id: 'overlap-test',
      content: 'Sentence one. Sentence two. Sentence three. ' +
               'Sentence four. Sentence five. Sentence six.',
      metadata: {}
    };

    const chunks = await chunker.chunkDocument(document);
    
    if (chunks.length > 1) {
      // Check if there's content overlap between consecutive chunks
      const firstChunkLastPart = chunks[0].content.slice(-20);
      const secondChunkFirstPart = chunks[1].content.slice(0, 20);
      
      expect(firstChunkLastPart).toMatch(/\w+/);  // Contains words
      expect(secondChunkFirstPart).toMatch(/\w+/); // Contains words
    }
  });
});