// src/providers/AnthropicEmbeddingProvider.js
import BaseEmbeddingProvider from './BaseEmbeddingProvider.js';
import axios from 'axios';
import debug from 'debug';

const log = debug('mongodb-rag:embedding:anthropic');

class AnthropicEmbeddingProvider extends BaseEmbeddingProvider {
  constructor(options = {}) {
    super(options);
    
    if (!options.apiKey) {
      throw new Error('Anthropic API key is required');
    }

    this.apiKey = options.apiKey;
    this.model = options.model || 'claude-3';  // Ensure model is supported
    this.client = axios.create({
      baseURL: 'https://api.anthropic.com/v1/messages',  // ✅ Update if necessary
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json'
      }
    });

    log('Anthropic embedding provider initialized');
  }

  async _embedBatch(texts) {
    try {
      log(`Getting embeddings for batch of ${texts.length} texts`);
      
      // ✅ Use Claude to generate a textual embedding-friendly representation
      const response = await this.client.post('', {  
        model: this.model,
        max_tokens: 128,  // Limit the response length
        messages: texts.map(text => ({
          role: "user",
          content: `Summarize this for embedding: "${text}"`
        }))
      });

      if (!response.data || !response.data.content) {
        throw new Error(`Unexpected response from Anthropic API: ${JSON.stringify(response.data)}`);
      }

      // ✅ Convert response text to embeddings using OpenAI
      const openAIResponse = await axios.post('https://api.openai.com/v1/embeddings', {
        model: "text-embedding-3-small",
        input: response.data.content.map(msg => msg.content)
      }, {
        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
      });

      return openAIResponse.data.data.map(item => item.embedding);
    } catch (error) {
      if (error.response?.data) {
        throw new Error(`Anthropic API error: ${error.response.data.error?.message || JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }
}

export default AnthropicEmbeddingProvider;
