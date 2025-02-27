// bin/commands/data/chat.js
import chalk from 'chalk';
import readline from 'readline';
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

export async function startChatSession(config, options = {}) {
  if (!isConfigValid(config)) {
    throw new Error("Configuration missing. Run 'npx mongodb-rag init' first.");
  }

  // Initialize RAG and chat history
  const rag = new MongoRAG(config);
  const chatHistory = [];
  
  // Connect to MongoDB
  await rag.connect();
  
  console.log(chalk.cyan('🤖 Starting MongoDB RAG Chat Session'));
  console.log(chalk.cyan('----------------------------------------'));
  console.log(chalk.cyan('Type your questions or:'));
  console.log(chalk.cyan('- Type "exit" or "quit" to end the session'));
  console.log(chalk.cyan('- Type "clear" to reset the conversation history'));
  console.log(chalk.cyan('- Type "history" to see previous messages'));
  console.log(chalk.cyan('----------------------------------------'));

  // Create readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.green('You: ')
  });

  // Start the prompt
  rl.prompt();

  // Handle each line of input
  rl.on('line', async (line) => {
    const query = line.trim();
    
    // Handle special commands
    if (query.toLowerCase() === 'exit' || query.toLowerCase() === 'quit') {
      console.log(chalk.cyan('Ending chat session...'));
      await rag.close();
      rl.close();
      return;
    } else if (query.toLowerCase() === 'clear') {
      chatHistory.length = 0;
      console.log(chalk.cyan('Conversation history cleared.'));
      rl.prompt();
      return;
    } else if (query.toLowerCase() === 'history') {
      console.log(chalk.cyan('Conversation History:'));
      chatHistory.forEach((msg, i) => {
        const role = msg.role === 'user' ? chalk.green('You: ') : chalk.blue('Assistant: ');
        console.log(`${role}${msg.content}`);
      });
      rl.prompt();
      return;
    } else if (query === '') {
      rl.prompt();
      return;
    }

    // Add user message to history
    chatHistory.push({ role: 'user', content: query });

    // Search for relevant context
    try {
      console.log(chalk.cyan(`\n🔍 Searching for relevant information...`));
      
      // Search options
      const searchOptions = {
        maxResults: options.maxResults || config.search?.maxResults || 5,
        minScore: options.minScore || config.search?.minScore || 0.7
      };
      
      // First try standard search
      let searchResults;
      try {
        searchResults = await rag.search(query, searchOptions);
      } catch (error) {
        debug('Standard search failed', error.message);
        
        // Try direct search approach
        const col = await rag._getCollection();
        const embedding = await rag.getEmbedding(query);
        
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
        
        searchResults = await col.aggregate(searchPipeline).toArray();
      }

      // Format the context
      const formattedContext = formatContext(searchResults);
      
      // Generate system message with context
      const systemPrompt = createSystemPrompt(formattedContext, options, true);
      
      // Format the conversation history for the API call
      const messages = [
        { role: 'system', content: systemPrompt },
        ...chatHistory.slice(-10) // Limit to last 10 messages to avoid token limits
      ];
      
      // Generate response
      console.log(chalk.cyan(`\n🧠 Generating response...`));
      
      // Get response from the appropriate provider
      const response = await generateChatResponse(config, messages, options);
      
      // Display response
      console.log(chalk.blue(`\nAssistant: ${response.answer}\n`));
      
      // Add assistant response to history
      chatHistory.push({ role: 'assistant', content: response.answer });
      
      // Optional: Show sources
      if (options.showSources && searchResults.length > 0) {
        console.log(chalk.bold("\n📚 Sources:"));
        searchResults.forEach((doc, i) => {
          const sourceText = doc.metadata?.source ? doc.metadata.source : `Document ${i+1}`;
          console.log(chalk.yellow(`${i+1}. ${sourceText} (Score: ${doc.score.toFixed(3)})`));
        });
        console.log('');
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      if (process.env.NODE_ENV === 'development' || process.env.DEBUG) {
        console.error(chalk.gray(error.stack));
      }
    }

    // Continue the conversation
    rl.prompt();
  });

  // Handle CTRL+C
  rl.on('SIGINT', async () => {
    console.log(chalk.cyan('\nEnding chat session...'));
    await rag.close();
    rl.close();
  });

  // Handle close
  rl.on('close', () => {
    console.log(chalk.cyan('Chat session ended.'));
    process.exit(0);
  });
}

// Helper functions (same as in ask.js)
function formatContext(documents) {
  return documents.map((doc, index) => {
    const sourceInfo = doc.metadata?.source ? `Source: ${doc.metadata.source}` : '';
    return `[Document ${index + 1}]\n${doc.content}\n${sourceInfo}\n---`;
  }).join('\n\n');
}

function createSystemPrompt(context, options, isChat = false) {
  const citeSources = options.citeSources === true;
  
  return `You are a helpful assistant that answers questions based on the provided context.
  
CONTEXT:
${context || "No specific context available for this query."}

INSTRUCTIONS:
1. Use the information from the provided documents to answer the user's question when relevant.
2. If the context doesn't contain enough information to provide a complete answer, use your general knowledge but clearly indicate when you're doing so.
3. If the answer can be found in multiple documents, synthesize the information.
4. Keep your answer concise but thorough.
${citeSources ? '5. Cite your sources by referring to the document numbers ([Document X]).' : ''}
${isChat ? '6. Remember this is a conversation, so maintain continuity with the chat history.' : ''}

If the provided context doesn't help with the user's question at all, respond naturally without explicitly mentioning the lack of context.`;
}

async function generateChatResponse(config, messages, options) {
  const provider = config.embedding?.provider?.toLowerCase() || 'openai';
  
  switch (provider) {
    case 'openai':
      return await generateOpenAIChatResponse(
        config.embedding.apiKey, 
        messages, 
        options.model || 'gpt-4o'
      );
    case 'ollama':
      return await generateOllamaChatResponse(
        config.embedding.baseUrl || 'http://localhost:11434',
        config.embedding.model || 'llama3',
        messages
      );
    default:
      throw new Error(`Provider ${provider} is not supported for chat responses.`);
  }
}

async function generateOpenAIChatResponse(apiKey, messages, model) {
  try {
    const openai = new OpenAI({ apiKey });
    
    const response = await openai.chat.completions.create({
      model,
      messages,
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

async function generateOllamaChatResponse(baseUrl, model, messages) {
  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
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