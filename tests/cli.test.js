// tests/cli.test.js
const { execSync } = require('child_process');
const { describe, test, expect } = require('@jest/globals');

describe('MongoDB RAG CLI Commands', () => {
  test('mongodb-rag init should create configuration', () => {
    const result = execSync('npx mongodb-rag init').toString();
    expect(result).toContain('Initialized mongodb-rag configuration');
  });

  test('mongodb-rag create-env should create environment file', () => {
    const result = execSync('npx mongodb-rag create-env').toString();
    expect(result).toContain('Created .env file');
  });

  test('mongodb-rag create-index should create vector search index', () => {
    const result = execSync('npx mongodb-rag create-index').toString();
    expect(result).toContain('Created vector search index');
  });

  test('mongodb-rag create-rag-app should scaffold new application', () => {
    const result = execSync('npx mongodb-rag create-rag-app my-app').toString();
    expect(result).toContain('Created RAG application');
  });

  test('should handle errors gracefully', () => {
    expect(() => {
      execSync('npx mongodb-rag create-rag-app existing-app');
    }).toThrow();
  });
});
