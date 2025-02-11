// src/core/MongoRAG.test.js
import { jest, describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import { MongoClient } from "mongodb";
import MongoRAG from "./MongoRAG.js";

// Mock MongoDB
jest.mock("mongodb", () => ({
  MongoClient: jest.fn(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    db: jest.fn().mockReturnValue({
      collection: jest.fn(() => ({
        insertMany: jest.fn().mockResolvedValue({ insertedCount: 2 }),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([]),
        }),
        createIndex: jest.fn().mockResolvedValue("index-name"),
        listIndexes: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([]),
        }),
      })),
    }),
    close: jest.fn().mockResolvedValue(undefined),
  })),
}));

describe("MongoRAG", () => {
  let rag;

  beforeEach(() => {
    rag = new MongoRAG({
      mongoUrl: "mongodb://mock:27017",
      database: "test",
      collection: "documents",
      embedding: {
        provider: "openai",
        apiKey: "test-key",
        dimensions: 1536,
      },
    });
  });

  afterEach(async () => {
    await rag.close();
  });

  test("should initialize with correct config", () => {
    expect(rag.config.chunking.strategy).toBe("sliding");
    expect(rag.config.embedding.provider).toBe("openai");
    expect(rag.config.embedding.apiKey).toBe("test-key");
  });

  test("should connect to MongoDB (mocked)", async () => {
    await rag.connect();
    expect(MongoClient).toHaveBeenCalled();
  });

  test("should close connection", async () => {
    await rag.connect();
    await rag.close();
    expect(MongoClient.mock.instances[0].close).toHaveBeenCalled();
  });

  test("should ingest documents", async () => {
    await rag.connect();
    const result = await rag.ingestBatch([{ id: "doc1", content: "test" }]);
    expect(result.processed).toBe(1);
  });
});
