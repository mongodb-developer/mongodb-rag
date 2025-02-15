// src/providers/OpenAIEmbeddingProvider.js
import OpenAI from 'openai';
import debug from 'debug';

const log = debug('mongodb-rag:openai');

class OpenAIEmbeddingProvider {
    constructor(config) {
        if (!config.apiKey) {
            throw new Error('OpenAI API key is required');
        }

        this.client = new OpenAI({ apiKey: config.apiKey });
        this.model = config.model || 'text-embedding-3-small';
        this.dimensions = config.dimensions || 1536;
        
        log(`Initialized OpenAI provider with model: ${this.model}`);
    }

    async getEmbedding(text) {
        if (!text || typeof text !== 'string') {
            throw new Error('Input text must be a non-empty string');
        }

        try {
            const response = await this.client.embeddings.create({
                model: this.model,
                input: text
            });

            if (!response.data || !response.data[0]?.embedding) {
                throw new Error('Invalid response from OpenAI API');
            }

            return response.data[0].embedding;
        } catch (error) {
            log('Error getting embedding from OpenAI:', error);
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

        try {
            const response = await this.client.embeddings.create({
                model: this.model,
                input: texts
            });

            if (!response.data || !Array.isArray(response.data)) {
                throw new Error('Invalid response from OpenAI API');
            }

            return response.data.map(item => item.embedding);
        } catch (error) {
            log('Error getting embeddings from OpenAI:', error);
            throw error;
        }
    }
}

export default OpenAIEmbeddingProvider;