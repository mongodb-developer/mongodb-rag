// __tests__/providers.test.js
import { jest } from "@jest/globals";
import dotenv from "dotenv";
dotenv.config();

import OpenAIEmbeddingProvider from "../../src/providers/OpenAIEmbeddingProvider.js";
import DeepSeekEmbeddingProvider from "../../src/providers/DeepSeekEmbeddingProvider.js";

// ✅ Mock `axios` correctly
jest.unstable_mockModule("axios", async () => ({
  default: {
    create: jest.fn(() => ({
      post: jest.fn().mockImplementation(async (url, body) => {
        if (url.includes("openai.com")) {
          return { data: { data: [{ embedding: Array(1536).fill(0.1) }] } };
        } else if (url.includes("deepseek.com")) {
          return { data: { data: [{ embedding: Array(1536).fill(Math.random() * 0.02 - 0.01) }] } }; // ✅ Returns random small floats
        }
        throw new Error("Unknown API endpoint");
      }),
    })),
  },
}));

describe("Embedding Providers", () => {
  let provider;

  beforeEach(() => {
    const providerType = process.env.EMBEDDING_PROVIDER || "openai";
    const apiKey = process.env.EMBEDDING_API_KEY;

    switch (providerType) {
      case "openai":
        provider = new OpenAIEmbeddingProvider({ apiKey });
        break;
      case "deepseek":
        provider = new DeepSeekEmbeddingProvider({ apiKey });
        break;
      default:
        throw new Error(`Unsupported provider for embeddings: ${providerType}`);
    }
  });

  test("should get embeddings from the selected provider", async () => {
    const result = await provider.getEmbeddings(["test"]);
    
    expect(result).toHaveLength(1); // ✅ Ensures a single embedding
    expect(result[0]).toHaveLength(1536); // ✅ Ensures correct vector size

    // ✅ Instead of checking for a fixed number, check for numerical range
    expect(typeof result[0][0]).toBe("number");
    expect(result[0][0]).toBeGreaterThanOrEqual(-1);
    expect(result[0][0]).toBeLessThanOrEqual(1);
  }, 15000);
});
