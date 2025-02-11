import CacheManager from './CacheManager.js';
// Add this to the top of each test file
import { jest, describe, expect, test, beforeEach, afterEach } from '@jest/globals';

describe('CacheManager', () => {
  let cache;

  beforeEach(() => {
    cache = new CacheManager({ ttl: 1, maxSize: 3 });
  });

  test('should store and retrieve values', async () => {
    await cache.set('key1', 'value1');
    const value = await cache.get('key1');
    expect(value).toBe('value1');
  });

  test('should handle cache misses', async () => {
    const value = await cache.get('nonexistent');
    expect(value).toBeNull();
    expect(cache.getStats().misses).toBe(1);
  });

  test('should respect TTL', async () => {
    await cache.set('key1', 'value1');
    
    // Wait for TTL to expire
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    const value = await cache.get('key1');
    expect(value).toBeNull();
    expect(cache.getStats().misses).toBe(1);
  });

  test('should respect max size and evict oldest', async () => {
    await cache.set('key1', 'value1');
    await cache.set('key2', 'value2');
    await cache.set('key3', 'value3');
    await cache.set('key4', 'value4');

    expect(await cache.get('key1')).toBeNull();
    expect(await cache.get('key4')).toBe('value4');
    expect(cache.getStats().evictions).toBe(1);
  });

  test('should track hit rate', async () => {
    await cache.set('key1', 'value1');
    await cache.get('key1'); // hit
    await cache.get('key2'); // miss

    const stats = cache.getStats();
    expect(stats.hits).toBe(1);
    expect(stats.misses).toBe(1);
    expect(stats.hitRate).toBe(0.5);
  });

  test('should create consistent cache keys', () => {
    const value = { query: 'test', filter: { category: 'docs' } };
    const key1 = CacheManager.createKey('search', value);
    const key2 = CacheManager.createKey('search', value);
    
    expect(key1).toBe(key2);
    expect(key1).toMatch(/^search:/);
  });

  test('should clear cache', async () => {
    await cache.set('key1', 'value1');
    await cache.set('key2', 'value2');
    
    await cache.clear();
    
    expect(await cache.get('key1')).toBeNull();
    expect(await cache.get('key2')).toBeNull();
    expect(cache.getStats().size).toBe(0);
  });
});