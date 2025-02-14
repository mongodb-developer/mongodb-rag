// src/providers/OllamaEmbeddingProvider.js
import fetch from 'node-fetch';
import debug from 'debug';

const log = debug('mongodb-rag:ollama');

/**
 * Ollama Embedding Provider implementation
 * Generates embeddings using a local Ollama instance
 */
class OllamaEmbeddingProvider {
  /**
   * Creates a new Ollama embedding provider instance
   * @param {Object} config - Configuration options
   * @param {string} config.baseUrl - Base URL of the Ollama instance
   * @param {string} config.model - Name of the Ollama model to use
   * @throws {Error} If baseUrl or model is not provided
   */
  constructor(config) {
    this.baseUrl = config.baseUrl || 'http://localhost:11434';
    this.model = config.model || 'llama2';
    log(`Initialized Ollama provider with model: ${this.model}`);
  }

  /**
   * Retrieves an embedding for a single text using Ollama API
   * @param {string} text - The text to embed
   * @returns {Promise<number[]>} The embedding vector
   * @throws {Error} If the API request fails
   */
  async getEmbedding(text) {
    try {
      const response = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt: text
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Ollama API error: ${error}`);
      }

      const data = await response.json();
      return data.embedding;
    } catch (error) {
      log('Error getting embedding from Ollama:', error);
      throw error;
    }
  }

  /**
   * Retrieves embeddings for a batch of texts using Ollama API
   * @param {string[]} texts - Array of texts to embed
   * @returns {Promise<number[][]>} Array of embedding vectors
   * @throws {Error} If the API request fails
   */
  async getEmbeddings(texts) {
    return Promise.all(texts.map(text => this.getEmbedding(text)));
  }

  /**
   * Retrieves list of available models from Ollama instance
   * @returns {Promise<Array<Object>>} Array of available models
   * @throws {Error} If unable to fetch model list
   */
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

  /**
   * Verifies if the configured model is available in the Ollama instance
   * @returns {Promise<boolean>} True if model is available, false otherwise
   * @throws {Error} If unable to verify model availability
   */
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