import { jest, describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import { execa } from 'execa';
import path from 'path';
import fs from 'fs';

const CLI_PATH = path.resolve('./bin/mongodb-rag.js');
console.log(`🔍 Jest is running in: ${process.cwd()}`);
console.log(`🔍 Checking for .mongodb-rag.json at: ${process.cwd()}/.mongodb-rag.json`);
console.log(`🔍 File exists?`, fs.existsSync(`${process.cwd()}/.mongodb-rag.json`));

const isAtlasTest = process.env.ATLAS_TEST === 'true';

// ✅ Mock MongoDB Client for Jest
const mockCollection = {
  createSearchIndexes: jest.fn().mockImplementation(() => {
    console.log("✅ Mocked `createSearchIndexes()` called.");
    return Promise.resolve([{ name: 'vector_index' }]);
  }),
  listSearchIndexes: jest.fn().mockImplementation(() => {
    console.log("✅ Mocked `listSearchIndexes()` called.");
    return { toArray: jest.fn().mockResolvedValue([]) };
  }),
  aggregate: jest.fn().mockReturnValue({ toArray: jest.fn().mockResolvedValue([]) }),
  indexes: jest.fn().mockResolvedValue([]),
  dropSearchIndex: jest.fn().mockResolvedValue(true)
};

const mockClient = {
  connect: jest.fn().mockResolvedValue(undefined),
  db: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue(mockCollection)
  }),
  close: jest.fn()
};

// ✅ Ensure Jest is mocking MongoDB properly
await jest.unstable_mockModule('mongodb', () => {
  console.log("✅ Mocked MongoDB `MongoClient` is being used.");
  return {
    MongoClient: jest.fn().mockImplementation(() => mockClient)
  };
});

describe('MongoRAG CLI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.CONFIG_PATH = '.mongodb-rag.test.json';
  });

  afterEach(() => {
    delete process.env.CONFIG_PATH;
  });

  async function runCLI(command, options = {}) {
    const env = {
      ...process.env,
      NODE_ENV: 'test'
    };

    try {
      const result = await execa('node', [CLI_PATH, command], {
        ...options,
        env,
        timeout: 5000
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  if (isAtlasTest) {
    test('create-index command executes successfully', async () => {
      const result = await runCLI('create-index');
      expect(result.exitCode).toBe(0);
    });
  } else {
    test.skip('create-index command (skipped in non-Atlas environments)', () => {
      console.warn('⚠️ Skipping create-index test in non-Atlas environments.');
    });
  }

  test('show-indexes command executes successfully', async () => {
    const result = await runCLI('show-indexes');
    expect(result.exitCode).toBe(0);
  });
});
