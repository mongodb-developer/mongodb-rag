// bin/commands/data/ask.js
import chalk from 'chalk';
import { isConfigValid } from '../../utils/validation.js';
import MongoRAG from '../../../src/core/MongoRAG.js';
import OpenAI from 'openai';
import fetch from 'node-fetch';

// Helper for controlled logging
const debug = (message, data) => {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG) {
      console.log(chalk.blue(`🔍 DEBUG: ${message}`), data ? data : '');
    }
  };
  
  export async function askQuestion(config, query, options = {}) {
    if (!isConfigValid(config)) {
      throw new Error("Configuration missing. Run 'npx mongodb-rag init' first.");
    }
  
    try {
      // Initialize RAG
      const rag = new MongoRAG(config);
      
      // Step 1: Connect to MongoDB
      await rag.connect();
      
      console.log(chalk.cyan(`🔍 Searching for relevant information about: "${query}"`));
      
      // Debug info in development only
      debug('Using configuration', {
        database: config.database,
        collection: config.collection,
        indexName: config.indexName,
        embeddingFieldPath: config.embeddingFieldPath || 'embedding'
      });
      
      // Step 2: Search for relevant documents
      const searchOptions = {
        maxResults: options.maxResults || config.search?.maxResults || 5,
        minScore: options.minScore || config.search?.minScore || 0.7,
        indexName: config.indexName, // Explicitly include the index name
        skipIndexCreation: false // Allow index creation if needed
      };
      
      debug('Search options', searchOptions);
      
      // Try direct search approach if configured
      let searchResults;
      
      try {
        // Standard search approach
        searchResults = await rag.search(query, searchOptions);
      } catch (error) {
        // If the standard search fails, try a direct approach in development
        if (process.env.NODE_ENV === 'development' || process.env.DEBUG) {
          console.log(chalk.yellow(`⚠️ Standard search failed: ${error.message}`));
          console.log(chalk.yellow("Attempting direct search approach..."));
          
          // Get collection
          const col = await rag._getCollection();
          
          // Get embedding
          const embedding = await rag.getEmbedding(query);
          
          // Build search pipeline
          const searchPipeline = [
            {
              $vectorSearch: {
                index: config.indexName,
                path: config.embeddingFieldPath || "embedding",
                queryVector: embedding,
                numCandidates: 100,
                limit: searchOptions.maxResults || 5
              }
            },
            {
              $project: {
                _id: 0,
                documentId: 1,
                content: 1,
                metadata: 1,
                score: { $meta: "vectorSearchScore" }
              }
            }
          ];
          
          debug('Direct search pipeline', searchPipeline);
          
          // Execute direct search
          searchResults = await col.aggregate(searchPipeline).toArray();
        } else {
          // In production, just re-throw the error
          throw error;
        }
      }
      
      if (searchResults.length === 0) {
        console.log(chalk.yellow("⚠️ No relevant information found."));
        if (!options.fallbackToGeneral) {
          return { answer: "I couldn't find any relevant information to answer your question." };
        }
        console.log(chalk.blue("Attempting to answer based on general knowledge..."));
      } else {
        console.log(chalk.green(`✅ Found ${searchResults.length} relevant documents.`));
      }
      
      // Step 3: Format context
      const formattedContext = formatContext(searchResults);
      
      // Step 4: Generate response using the embedding provider
      console.log(chalk.cyan("🧠 Generating response..."));
      
      // Get chat response based on provider
      const response = await generateResponse(
        config, 
        formattedContext, 
        query, 
        options
      );
      
      // Display the response
      console.log(chalk.bold("\n🤖 Response:"));
      console.log(response.answer);
      
      // Show sources if requested
      if (options.showSources && searchResults.length > 0) {
        console.log(chalk.bold("\n📚 Sources:"));
        searchResults.forEach((doc, i) => {
          const sourceText = doc.metadata && doc.metadata.source 
            ? doc.metadata.source 
            : `Document ${i+1}`;
          console.log(chalk.yellow(`${i+1}. ${sourceText} (Score: ${doc.score.toFixed(3)})`));
        });
      }
      
      await rag.close();
      return response;
      
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
      if (process.env.NODE_ENV === 'development' || process.env.DEBUG) {
        console.error(chalk.gray(error.stack));
      }
      throw error;
    }
  }
  

function formatContext(documents) {
  return documents.map((doc, index) => {
    const sourceInfo = doc.metadata?.source ? `Source: ${doc.metadata.source}` : '';
    return `[Document ${index + 1}]\n${doc.content}\n${sourceInfo}\n---`;
  }).join('\n\n');
}

async function generateResponse(config, context, query, options) {
  const provider = config.embedding?.provider?.toLowerCase() || 'openai';
  const systemPrompt = createSystemPrompt(context, options);
  
  switch (provider) {
    case 'openai':
      return await generateOpenAIResponse(
        config.embedding.apiKey, 
        systemPrompt, 
        query, 
        options.model || 'gpt-4o'
      );
    case 'ollama':
      return await generateOllamaResponse(
        config.embedding.baseUrl || 'http://localhost:11434',
        config.embedding.model || 'llama3',
        systemPrompt,
        query
      );
    default:
      throw new Error(`Provider ${provider} is not supported for chat responses.`);
  }
}

async function generateOpenAIResponse(apiKey, systemPrompt, query, model) {
  try {
    const openai = new OpenAI({ apiKey });
    
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      temperature: 0.7
    });
    
    return {
      answer: response.choices[0].message.content,
      model
    };
  } catch (error) {
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

async function generateOllamaResponse(baseUrl, model, systemPrompt, query) {
  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        stream: false
      })
    });
    
    if (!response.ok) {
      throw new Error(`Ollama API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      answer: data.message?.content || "Failed to generate a response.",
      model
    };
  } catch (error) {
    throw new Error(`Ollama API error: ${error.message}`);
  }
}

function createSystemPrompt(context, options) {
  const citeSources = options.citeSources === true;
  
  return `You are a helpful assistant that answers questions based on the provided context.
  
CONTEXT:
${context || "No specific context available for this query."}

INSTRUCTIONS:
1. Use ONLY the information from the provided documents to answer the user's question.
2. If the context doesn't contain enough information to provide a complete answer, state what you know from the context and indicate where information is missing.
3. Do not make up information or use your own knowledge beyond what's in the context.
4. If the answer can be found in multiple documents, synthesize the information.
5. Keep your answer concise but thorough.
${citeSources ? '6. Cite your sources by referring to the document numbers ([Document X]).' : ''}

If the provided context doesn't help with the user's question at all, respond with: "I don't have enough information to answer that question."`;
}