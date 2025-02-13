// src/providers/OllamaEmbeddingProvider.js
import BaseEmbeddingProvider from './BaseEmbeddingProvider.js';
import { Ollama } from "@langchain/community/llms/ollama";
import debug from 'debug';

const log = debug('mongodb-rag:embedding:ollama');

class OllamaEmbeddingProvider extends BaseEmbeddingProvider {
  constructor(options = {}) {
    super(options);
    
    // Validate required options
    if (!options.baseUrl) {
      throw new Error('Ollama base URL is required (e.g., http://localhost:11434)');
    }
    if (!options.model) {
      throw new Error('Ollama model name is required (e.g., llama3)');
    }

    this.baseUrl = options.baseUrl;
    this.model = options.model;
    
    // Initialize Ollama client
    this.client = new Ollama({
      baseUrl: this.baseUrl,
      model: this.model
    });

    log('Ollama embedding provider initialized with model:', this.model);
  }

  async _embedBatch(texts) {
    try {
      log(`Getting embeddings for batch of ${texts.length} texts using Ollama`);
      
      // Process texts in sequence since we're dealing with a local LLM
      const embeddings = await Promise.all(
        texts.map(async (text) => {
          try {
            // Use Ollama's embedding endpoint
            const response = await fetch(`${this.baseUrl}/api/embeddings`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: this.model,
                prompt: text,
              }),
            });

            if (!response.ok) {
              throw new Error(`Ollama API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.embedding;
          } catch (error) {
            log(`Error embedding text: ${error.message}`);
            throw error;
          }
        })
      );

      log(`Successfully generated ${embeddings.length} embeddings`);
      return embeddings;
    } catch (error) {
      throw new Error(`Ollama embedding error: ${error.message}`);
    }
  }

  // Optional: Add methods for model management
  async listModels() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error(`Failed to list models: ${response.statusText}`);
      }
      const data = await response.json();
      return data.models;
    } catch (error) {
      throw new Error(`Failed to list Ollama models: ${error.message}`);
    }
  }

  // Method to verify model availability
  async verifyModel() {
    try {
      const models = await this.listModels();
      return models.some(model => model.name === this.model);
    } catch (error) {
      throw new Error(`Failed to verify model ${this.model}: ${error.message}`);
    }
  }
}

export default OllamaEmbeddingProvider;