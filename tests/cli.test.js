import { jest, describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import { execa } from 'execa';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config();

// Debug function
const debug = (message, ...args) => {
  console.log('\n🔍 Debug:', message, ...args);
};

const TEST_CONFIG_PATH = '.mongodb-rag.test.json';
const CLI_PATH = path.resolve('./bin/mongodb-rag.js');

// Mock Enquirer for CLI prompts
jest.unstable_mockModule('enquirer', () => ({
  default: class {
    async prompt() {
      debug('Mock Enquirer returning values:', {
        indexName: process.env.VECTOR_INDEX,
        fieldPath: 'embedding',
        numDimensions: '1536'
      });
      return Promise.resolve({
        indexName: process.env.VECTOR_INDEX,
        fieldPath: 'embedding',
        numDimensions: '1536',
        similarityFunction: 'cosine',
        confirmDelete: true
      });
    }
  }
}));

const runCLI = async (args = [], options = {}) => {
  debug('Running CLI command:', args.join(' '));
  try {
    const startTime = Date.now();
    const result = await execa('node', [CLI_PATH, ...args], {
      ...options,
      stdio: 'pipe',
      env: { 
        ...process.env, 
        NODE_ENV: 'test',
        FORCE_COLOR: '0'
      }
    });
    const duration = Date.now() - startTime;
    debug(`CLI command completed in ${duration}ms`);
    debug('CLI Output:', result.stdout);
    return result;
  } catch (error) {
    debug('CLI command failed:', error.message);
    debug('Error details:', error);
    throw error;
  }
};

describe('MongoRAG CLI', () => {
  let mongoClient;

  beforeAll(async () => {
    debug('Setting up test environment...');
    
    // Clean up any existing test config
    if (fs.existsSync(TEST_CONFIG_PATH)) {
      debug('Removing existing test config');
      fs.unlinkSync(TEST_CONFIG_PATH);
    }

    // Create test configuration
    const dbName = process.env.MONGODB_URI.split('/').pop().split('?')[0] || 'mongorag';
    debug('Using database:', dbName);

    const testConfig = {
      mongoUrl: process.env.MONGODB_URI,
      database: dbName,
      collection: 'documents',
      embedding: {
        provider: process.env.EMBEDDING_PROVIDER,
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.EMBEDDING_MODEL,
        batchSize: 100,
        dimensions: 1536
      },
      search: {
        maxResults: 5,
        minScore: 0.7
      },
      indexName: process.env.VECTOR_INDEX
    };

    fs.writeFileSync(TEST_CONFIG_PATH, JSON.stringify(testConfig, null, 2));
    debug('Test config created:', testConfig);

    // Initialize MongoDB client
    try {
      debug('Connecting to MongoDB...');
      mongoClient = new MongoClient(process.env.MONGODB_URI);
      await mongoClient.connect();
      debug('Successfully connected to MongoDB');

      // Verify database access
      const db = mongoClient.db(dbName);
      const collections = await db.listCollections().toArray();
      debug('Available collections:', collections.map(c => c.name));
    } catch (error) {
      debug('MongoDB connection error:', error);
      throw error;
    }
  }, 30000);

  afterAll(async () => {
    debug('Starting cleanup...');
    
    if (fs.existsSync(TEST_CONFIG_PATH)) {
      debug('Removing test config file');
      fs.unlinkSync(TEST_CONFIG_PATH);
    }

    if (mongoClient) {
      try {
        const db = mongoClient.db();
        const collection = db.collection('documents');
        
        debug('Checking for existing vector search index...');
        const indexes = await collection.listSearchIndexes().toArray();
        debug('Current search indexes:', indexes);

        if (indexes.some(idx => idx.name === process.env.VECTOR_INDEX)) {
          debug('Dropping vector search index:', process.env.VECTOR_INDEX);
          await collection.dropSearchIndex(process.env.VECTOR_INDEX);
        }
        
        debug('Closing MongoDB connection');
        await mongoClient.close();
      } catch (error) {
        debug('Cleanup error:', error);
      }
    }
    debug('Cleanup completed');
  }, 30000);

  test('should display current config', async () => {
    const { stdout } = await runCLI(['show-config']);
    expect(stdout).toContain('Current Configuration');
  }, 10000);

  test('should create a vector search index', async () => {
    try {
      debug('Starting vector index creation test');
      const result = await runCLI(['create-index']);
      expect(result.stdout).toContain('Creating Vector Search Index');

      // Verify index creation
      const db = mongoClient.db();
      const collection = db.collection('documents');
      
      let indexExists = false;
      let attempts = 0;
      const maxAttempts = 12; // 1 minute total (5s * 12)
      
      while (!indexExists && attempts < maxAttempts) {
        try {
          debug(`Checking for index (attempt ${attempts + 1}/${maxAttempts})`);
          const indexes = await collection.listSearchIndexes().toArray();
          indexExists = indexes.some(idx => idx.name === process.env.VECTOR_INDEX);
          if (indexExists) {
            debug('Vector search index found:', indexes);
            break;
          }
        } catch (error) {
          debug('Error checking indexes:', error.message);
        }
        
        if (!indexExists) {
          debug('Index not found, waiting 5 seconds...');
          await new Promise(resolve => setTimeout(resolve, 5000));
          attempts++;
        }
      }

      expect(indexExists).toBe(true);
    } catch (error) {
      debug('Index creation test failed:', error);
      throw error;
    }
  }, 90000);

  test('should list indexes', async () => {
    const { stdout } = await runCLI(['show-indexes']);
    expect(stdout).toContain('Database:');
    expect(stdout).toContain('Collection: documents');
  }, 10000);

  test('should perform a vector search', async () => {
    try {
      debug('Starting vector search test');
      
      // Verify index exists before searching
      const db = mongoClient.db();
      const collection = db.collection('documents');
      const indexes = await collection.listSearchIndexes().toArray();
      debug('Available search indexes:', indexes);

      const { stdout } = await runCLI(['search', 'test query', '--maxResults', '3']);
      expect(stdout).toContain('Performing vector search');
    } catch (error) {
      debug('Vector search test failed:', error);
      throw error;
    }
  }, 30000);

  test('should handle missing configuration gracefully', async () => {
    debug('Starting missing config test');
    if (fs.existsSync(TEST_CONFIG_PATH)) {
      fs.unlinkSync(TEST_CONFIG_PATH);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const { stdout } = await runCLI(['show-config']);
    expect(stdout).toContain('Debug: Using CONFIG_PATH');
  }, 10000);
});