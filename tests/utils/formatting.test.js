// tests/utils/formatting.test.js
import { jest, describe, expect, test } from '@jest/globals';
import { formatSearchResults, formatDocument } from '../../bin/utils/formatting.js';

describe('Formatting Utils', () => {
  test('formats search results correctly', () => {
    const mockResults = [{
      score: 0.95,
      content: 'Test content',
      metadata: { source: 'test' }
    }];

    const formatted = formatSearchResults(mockResults);
    expect(formatted.results).toBeDefined();
    expect(formatted.results[0].score).toBe(0.95);
  });

  test('formats document with long arrays correctly', () => {
    const doc = {
      id: 'test',
      array: Array(20).fill('item')
    };

    const formatted = formatDocument(doc);
    expect(formatted.array.preview).toHaveLength(10);
    expect(formatted.array.remaining).toBe(10);
  });
});