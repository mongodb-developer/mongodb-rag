import BaseEmbeddingProvider from './BaseEmbeddingProvider.js';
import axios from 'axios';
import debug from 'debug';

const log = debug('mongodb-rag:embedding:openai');

class OpenAIEmbeddingProvider extends BaseEmbeddingProvider {
  constructor(options = {}) {
    super(options);
    
    if (!options.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.apiKey = options.apiKey;
    this.model = options.model || 'text-embedding-3-small';
    this.client = axios.create({
      baseURL: 'https://api.openai.com/v1',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    log('OpenAI embedding provider initialized');
  }

  async _embedBatch(texts) {
    try {
      log(`Getting embeddings for batch of ${texts.length} texts`);
      
      const response = await this.client.post('/embeddings', {
        model: this.model,
        input: texts
      });

      const embeddings = response.data.data.map(item => item.embedding);
      
      log(`Successfully got embeddings for batch`);
      return embeddings;
    } catch (error) {
      if (error.response?.data) {
        throw new Error(`OpenAI API error: ${error.response.data.error.message}`);
      }
      throw error;
    }
  }
}

export default OpenAIEmbeddingProvider;