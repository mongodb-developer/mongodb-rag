// src/providers/OpenAIEmbeddingProvider.js
import OpenAI from 'openai';
import debug from 'debug';

const log = debug('mongodb-rag:openai');

class OpenAIEmbeddingProvider {
    constructor(config) {
        this.client = new OpenAI({ apiKey: config.apiKey });
        this.model = config.model || 'text-embedding-3-small';
        log(`Initialized OpenAI provider with model: ${this.model}`);
    }

    async getEmbedding(text) {
        try {
            const response = await this.client.embeddings.create({
                model: this.model,
                input: text
            });

            return response.data[0].embedding;
        } catch (error) {
            log('Error getting embedding from OpenAI:', error);
            throw error;
        }
    }

    async getEmbeddings(texts) {
        const response = await this.client.embeddings.create({
            model: this.model,
            input: texts
        });

        return response.data.map(item => item.embedding);
    }
}

export default OpenAIEmbeddingProvider;