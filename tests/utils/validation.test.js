import { describe, test, expect } from '@jest/globals';
import { validateMongoURI, isConfigValid, validateIndexName } from '../../bin/utils/validation.js';

describe('Validation Utils', () => {
  
  test('validateMongoURI returns true for valid MongoDB Atlas URI', () => {
    const validURI = "mongodb+srv://user:password@cluster.mongodb.net/testDB?retryWrites=true&w=majority";
    expect(validateMongoURI(validURI)).toBe(true);
  });

  test('validateMongoURI returns false for invalid URI', () => {
    const invalidURI = "mongodb://localhost:27017/testDB";
    expect(validateMongoURI(invalidURI)).toBe(false);
  });

  test('isConfigValid returns true for valid config', () => {
    const validConfig = {
      mongoUrl: "mongodb+srv://user:password@cluster.mongodb.net/testDB",
      database: "testDB",
      collection: "testCollection",
      embedding: {
        provider: "openai",
        apiKey: "test-key"
      }
    };
    expect(isConfigValid(validConfig)).toBe(true);
  });

  test('isConfigValid returns false for missing fields', () => {
    const invalidConfig = {
      mongoUrl: "mongodb+srv://user:password@cluster.mongodb.net/testDB",
      database: "testDB"
    };
    expect(isConfigValid(invalidConfig)).toBe(false);
  });

  test('validateIndexName returns true for valid index names', () => {
    expect(validateIndexName("vector_index")).toBe(true);
    expect(validateIndexName("searchIndex")).toBe(true);
  });

  test('validateIndexName returns false for invalid index names', () => {
    expect(validateIndexName("")).toBe(false);
    expect(validateIndexName(" ")).toBe(false);
    expect(validateIndexName("vector index")).toBe(false); // contains space
  });

});
