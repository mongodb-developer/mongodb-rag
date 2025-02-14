import debug from 'debug';

const log = debug('mongodb-rag:cache');

/**
 * Manages an in-memory cache with TTL and size limits
 * Provides caching functionality with automatic expiration and eviction
 */
class CacheManager {
  /**
   * Creates a new cache manager instance
   * @param {Object} options - Configuration options
   * @param {number} [options.ttl=3600] - Time-to-live in seconds (default 1 hour)
   * @param {number} [options.maxSize=1000] - Maximum number of entries in cache
   */
  constructor(options = {}) {
    this.options = {
      ttl: options.ttl || 3600, // 1 hour default TTL
      maxSize: options.maxSize || 1000,
      ...options
    };

    this.cache = new Map();
    this.keyTimestamps = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0
    };
  }

  /**
   * Retrieves a value from cache
   * @param {string} key - Cache key to lookup
   * @returns {Promise<*|null>} Cached value or null if not found/expired
   */
  async get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    if (this._isExpired(key)) {
      this.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.value;
  }

  /**
   * Stores a value in cache
   * @param {string} key - Cache key
   * @param {*} value - Value to store
   * @returns {Promise<boolean>} True if value was stored successfully
   */
  async set(key, value) {
    if (this.cache.size >= this.options.maxSize) {
      this._evictOldest();
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });

    this.keyTimestamps.set(key, Date.now());
    return true;
  }

  /**
   * Removes an entry from cache
   * @param {string} key - Cache key to remove
   * @returns {Promise<void>}
   */
  async delete(key) {
    this.cache.delete(key);
    this.keyTimestamps.delete(key);
  }

  /**
   * Clears all entries from cache and resets statistics
   * @returns {Promise<void>}
   */
  async clear() {
    this.cache.clear();
    this.keyTimestamps.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0
    };
  }

  /**
   * Returns current cache statistics
   * @returns {Object} Cache statistics
   * @property {number} hits - Number of cache hits
   * @property {number} misses - Number of cache misses
   * @property {number} evictions - Number of evicted entries
   * @property {number} size - Current number of entries
   * @property {number} maxSize - Maximum allowed entries
   * @property {number} hitRate - Cache hit rate (0-1)
   */
  getStats() {
    return {
      ...this.stats,
      size: this.cache.size,
      maxSize: this.options.maxSize,
      hitRate: this._calculateHitRate()
    };
  }

  /**
   * Checks if a cache entry has expired
   * @private
   * @param {string} key - Cache key to check
   * @returns {boolean} True if entry has expired
   */
  _isExpired(key) {
    const timestamp = this.keyTimestamps.get(key);
    if (!timestamp) return true;
    
    const age = Date.now() - timestamp;
    return age > this.options.ttl * 1000;
  }

  /**
   * Removes the oldest entry from cache
   * @private
   */
  _evictOldest() {
    const oldestKey = Array.from(this.keyTimestamps.entries())
      .sort(([, a], [, b]) => a - b)[0]?.[0];

    if (oldestKey) {
      this.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  /**
   * Calculates the cache hit rate
   * @private
   * @returns {number} Hit rate between 0 and 1
   */
  _calculateHitRate() {
    const total = this.stats.hits + this.stats.misses;
    return total === 0 ? 0 : this.stats.hits / total;
  }

  /**
   * Creates a deterministic cache key from a value
   * @static
   * @param {string} type - Type prefix for the key
   * @param {*} value - Value to create key from
   * @returns {string} Base64-encoded cache key
   */
  static createKey(type, value) {
    const hash = Buffer.from(JSON.stringify(value))
      .toString('base64')
      .replace(/[/+=]/g, '_');
    return `${type}:${hash}`;
  }
}

export default CacheManager;