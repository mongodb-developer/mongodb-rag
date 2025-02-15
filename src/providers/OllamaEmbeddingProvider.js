// src/providers/OllamaEmbeddingProvider.js
import fetch from 'node-fetch';
import debug from 'debug';

const log = debug('mongodb-rag:ollama');

class OllamaEmbeddingProvider {
    constructor(config) {
        if (!config.baseUrl) {
            throw new Error('Ollama base URL is required');
        }
        if (!config.model) {
            throw new Error('Ollama model name is required');
        }

        this.baseUrl = config.baseUrl;
        this.model = config.model;
        this.dimensions = config.dimensions || 1536;

        log(`Initialized Ollama provider with model: ${this.model}`);
    }

    async getEmbedding(text) {
        if (!text || typeof text !== 'string') {
            throw new Error('Input text must be a non-empty string');
        }

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
            
            if (!data.embedding || !Array.isArray(data.embedding)) {
                throw new Error('Invalid response from Ollama API');
            }

            return data.embedding;
        } catch (error) {
            log('Error getting embedding from Ollama:', error);
            throw error;
        }
    }

    async getEmbeddings(texts) {
        if (!Array.isArray(texts) || texts.length === 0) {
            return [];
        }

        // Validate all inputs are strings
        if (!texts.every(text => typeof text === 'string' && text.length > 0)) {
            throw new Error('All inputs must be non-empty strings');
        }

        // Ollama doesn't support batch processing, so we need to process sequentially
        try {
            const embeddings = await Promise.all(texts.map(text => this.getEmbedding(text)));
            return embeddings;
        } catch (error) {
            log('Error getting embeddings from Ollama:', error);
            throw error;
        }
    }

    async verifyModel() {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`);
            if (!response.ok) {
                throw new Error(`Failed to list models: ${response.statusText}`);
            }
            const data = await response.json();
            return data.models?.some(model => model.name === this.model) || false;
        } catch (error) {
            throw new Error(`Failed to verify model ${this.model}: ${error.message}`);
        }
    }
}

export default OllamaEmbeddingProvider;