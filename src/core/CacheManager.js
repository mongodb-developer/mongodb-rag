import debug from 'debug';

const log = debug('mongodb-rag:cache');

class CacheManager {
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

  async delete(key) {
    this.cache.delete(key);
    this.keyTimestamps.delete(key);
  }

  async clear() {
    this.cache.clear();
    this.keyTimestamps.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0
    };
  }

  getStats() {
    return {
      ...this.stats,
      size: this.cache.size,
      maxSize: this.options.maxSize,
      hitRate: this._calculateHitRate()
    };
  }

  _isExpired(key) {
    const timestamp = this.keyTimestamps.get(key);
    if (!timestamp) return true;
    
    const age = Date.now() - timestamp;
    return age > this.options.ttl * 1000;
  }

  _evictOldest() {
    const oldestKey = Array.from(this.keyTimestamps.entries())
      .sort(([, a], [, b]) => a - b)[0]?.[0];

    if (oldestKey) {
      this.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  _calculateHitRate() {
    const total = this.stats.hits + this.stats.misses;
    return total === 0 ? 0 : this.stats.hits / total;
  }

  // Helper method to create cache keys
  static createKey(type, value) {
    const hash = Buffer.from(JSON.stringify(value))
      .toString('base64')
      .replace(/[/+=]/g, '_');
    return `${type}:${hash}`;
  }
}

export default CacheManager;