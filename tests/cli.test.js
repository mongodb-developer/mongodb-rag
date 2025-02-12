// tests/cli.test.js
import { jest, describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execa } from 'execa';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_CONFIG_PATH = '.mongodb-rag.test.json';
const CLI_PATH = path.resolve('./bin/mongodb-rag.js');

// Debug function
const debug = (message, ...args) => {
  console.log('\n🔍 Debug:', message, ...args);
};

await jest.unstable_mockModule('mongodb', () => ({
  MongoClient: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        createSearchIndex: jest.fn().mockResolvedValue({ name: 'vector_index' }),
        indexes: jest.fn().mockResolvedValue([{ name: 'vector_index' }]),
        listSearchIndexes: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([])
        })
      })
    }),
    close: jest.fn().mockResolvedValue(undefined)
  }))
}));

await jest.unstable_mockModule('commander', () => ({
  program: {
    parse: jest.fn(),
    command: jest.fn().mockReturnThis(),
    description: jest.fn().mockReturnThis(),
    action: jest.fn().mockReturnThis()
  }
}));

const runCLI = async (command, options = {}) => {
  debug(`Running CLI command: ${command}`);
  
  const env = {
    ...process.env,
    NODE_ENV: 'test',
    FORCE_COLOR: '0',
    NONINTERACTIVE: 'true',
    // Add auto-response environment variables
    VECTOR_INDEX: 'vector_index',
    FIELD_PATH: 'embedding',
    NUM_DIMENSIONS: '1536',
    SIMILARITY_FUNCTION: 'cosine',
    // Add mock MongoDB responses
    MOCK_MONGODB: 'true'
  };

  try {
    const result = await execa('node', [CLI_PATH, command], {
      ...options,
      env,
      timeout: 5000 // Reduced timeout since we're mocking everything
    });
    return result;
  } catch (error) {
    debug('CLI command failed:', error);
    throw error;
  }
};

describe('MongoRAG CLI', () => {
  beforeAll(() => {
    debug('Setting up test environment...');
    
    if (fs.existsSync(TEST_CONFIG_PATH)) {
      fs.unlinkSync(TEST_CONFIG_PATH);
    }

    const testConfig = {
      mongoUrl: 'mongodb://test:27017',
      database: 'test_db',
      collection: 'documents',
      embedding: {
        provider: 'openai',
        apiKey: 'test-key',
        model: 'text-embedding-3-small',
        dimensions: 1536
      },
      indexName: 'vector_index'
    };

    fs.writeFileSync(TEST_CONFIG_PATH, JSON.stringify(testConfig, null, 2));
  });

  afterAll(() => {
    if (fs.existsSync(TEST_CONFIG_PATH)) {
      fs.unlinkSync(TEST_CONFIG_PATH);
    }
  });

  test('create-index command executes successfully', async () => {
    debug('Running create-index command test');
    
    const result = await runCLI('create-index');
    expect(result.stdout).toContain('Creating Vector Search Index');
  }, 10000);

  test('show-indexes command executes successfully', async () => {
    const result = await runCLI('show-indexes');
    expect(result.stdout).toContain('Collection: documents');
  }, 10000);
});