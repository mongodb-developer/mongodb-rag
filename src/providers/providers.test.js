import { jest } from "@jest/globals";
import axios from "axios";
import OpenAIEmbeddingProvider from "../../src/providers/OpenAIEmbeddingProvider.js";
import dotenv from "dotenv";

dotenv.config();

// ✅ Ensure Jest mocks `axios` properly before importing the provider
jest.unstable_mockModule("axios", async () => ({
    default: {
    create: jest.fn(() => ({
      post: jest.fn().mockResolvedValue({
        data: { data: [{ embedding: Array(1536).fill(0.1) }] },
      }),
    })),
  },
}));

describe("OpenAIEmbeddingProvider", () => {
    let provider;
  
    beforeEach(() => {
      provider = new OpenAIEmbeddingProvider({ apiKey: process.env.OPENAI_API_KEY });
    });
  
    test("should get embeddings", async () => {
        const result = await provider.getEmbeddings(["test"]);
      
        // ✅ Ensure embeddings are of correct length
        expect(result).toHaveLength(1);
      }, 15000);
  });