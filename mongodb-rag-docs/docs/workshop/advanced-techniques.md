---
id: advanced-techniques
title: 👐 Advanced RAG Techniques
---

# Advanced RAG Techniques

Now that you've built a basic RAG application, let's explore advanced techniques to enhance its performance, relevance, and efficiency.

## Hybrid Search: Combining Vector and Keyword Search

MongoDB Atlas supports hybrid search, which combines the strengths of vector search with traditional keyword search.

### Implementation

Update your search function to use hybrid search:

```javascript
async function hybridSearch(query, options = {}) {
  try {
    await rag.connect();
    
    // Get the embedding for the query
    const embedding = await rag.provider.getEmbedding(query);
    
    // Build the aggregation pipeline
    const collection = await rag._getCollection();
    const pipeline = [
      {
        $search: {
          compound: {
            should: [
              {
                vectorSearch: {
                  queryVector: embedding,
                  path: "embedding",
                  numCandidates: 100,
                  limit: 10
                }
              },
              {
                text: {
                  query: query,
                  path: "content"
                }
              }
            ]
          }
        }
      },
      {
        $project: {
          documentId: 1,
          content: 1,
          metadata: 1,
          score: { $meta: "searchScore" }
        }
      },
      {
        $limit: options.maxResults || 5
      }
    ];
    
    // Execute the search
    const results = await collection.aggregate(pipeline).toArray();
    
    return results.map(r => ({
      documentId: r.documentId,
      content: r.content,
      metadata: r.metadata,
      score: r.score
    }));
    
  } catch (error) {
    console.error('Hybrid search error:', error);
    throw error;
  } finally {
    await rag.close();
  }
}
```

### Benefits of Hybrid Search

- **Improved recall**: Finds relevant documents that might be missed by vector search alone
- **Better handling of specialized terms**: Exact keyword matching for technical terms, product names, etc.
- **Reduced sensitivity to embedding quality**: Less dependent on embedding model quality
- **Multi-language support**: Works well across languages and specialized domains

## Advanced Document Chunking

Let's implement a more sophisticated chunking strategy that respects document structure:

```javascript
const { MongoRAG } = require('mongodb-rag');
const natural = require('natural');

class AdvancedChunker {
  constructor(options = {}) {
    this.options = {
      maxChunkSize: options.maxChunkSize || 500,
      minChunkSize: options.minChunkSize || 100,
      overlap: options.overlap || 50,
      ...options
    };
    
    this.sentenceTokenizer = new natural.SentenceTokenizer();
  }
  
  async chunkDocument(document) {
    const chunks = [];
    const content = document.content;
    
    // Step 1: Split content by headings
    const sections = this._splitByHeadings(content);
    
    // Step 2: Process each section
    for (const section of sections) {
      // If section is already small enough, keep it as is
      if (section.length <= this.options.maxChunkSize) {
        chunks.push(this._createChunk(document, section));
        continue;
      }
      
      // Step 3: Split large sections into paragraphs
      const paragraphs = section.split(/\n\s*\n/);
      let currentChunk = '';
      
      for (const paragraph of paragraphs) {
        // If paragraph fits in current chunk, add it
        if (currentChunk.length + paragraph.length <= this.options.maxChunkSize) {
          currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
        } else {
          // If current chunk is not empty, save it
          if (currentChunk) {
            chunks.push(this._createChunk(document, currentChunk));
          }
          
          // If paragraph is too large, split into sentences
          if (paragraph.length > this.options.maxChunkSize) {
            const sentenceChunks = this._chunkBySentences(paragraph);
            chunks.push(...sentenceChunks.map(c => this._createChunk(document, c)));
          } else {
            currentChunk = paragraph;
          }
        }
      }
      
      // Save the last chunk if not empty
      if (currentChunk) {
        chunks.push(this._createChunk(document, currentChunk));
      }
    }
    
    return chunks;
  }
  
  _splitByHeadings(content) {
    // Split by markdown headings (##, ###, etc.)
    return content.split(/\n#{1,6}\s+[^\n]+/);
  }
  
  _chunkBySentences(text) {
    const sentences = this.sentenceTokenizer.tokenize(text);
    const chunks = [];
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length <= this.options.maxChunkSize) {
        currentChunk += (currentChunk ? ' ' : '') + sentence;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk);
        }
        currentChunk = sentence;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk);
    }
    
    return chunks;
  }
  
  _createChunk(document, content) {
    return {
      documentId: document.id,
      content: content,
      metadata: {
        ...document.metadata,
        chunkIndex: Date.now(),
        chunkLength: content.length
      }
    };
  }
}

module.exports = AdvancedChunker;
```

## Metadata Filtering

Metadata filtering allows you to narrow down search results based on document metadata:

```javascript
async function searchWithMetadata(query, metadata = {}, options = {}) {
  try {
    await rag.connect();
    
    // Build metadata filter
    const filter = {};
    Object.entries(metadata).forEach(([key, value]) => {
      filter[`metadata.${key}`] = value;
    });
    
    // Perform search with filter
    const results = await rag.search(query, {
      filter: filter,
      maxResults: options.maxResults || 5
    });
    
    return results;
    
  } catch (error) {
    console.error('Metadata search error:', error);
    throw error;
  } finally {
    await rag.close();
  }
}

// Example usage
const results = await searchWithMetadata(
  "What is MongoDB Atlas?",
  { type: "markdown", source: "mongodb-atlas.md" }
);
```

## Re-ranking Search Results

Improve search relevance by re-ranking results:

```javascript
const { MongoRAG } = require('mongodb-rag');
const { OpenAI } = require('openai');
const config = require('./config');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.llm.apiKey
});

async function searchWithReranking(query, options = {}) {
  try {
    // Step 1: Get initial results (more than needed)
    const initialResults = await rag.search(query, {
      maxResults: (options.maxResults || 5) * 3
    });
    
    if (initialResults.length === 0) {
      return [];
    }
    
    // Step 2: Re-rank results using the LLM
    const rerankerPrompt = `
Query: "${query}"

I'll show you ${initialResults.length} text passages. Rank them based on relevance to the query.
For each passage, assign a score from 0-10 where:
- 10: Perfect match, directly answers the query
- 7-9: Highly relevant, contains most of the answer
- 4-6: Somewhat relevant, contains partial information
- 1-3: Slightly relevant, mentions related concepts
- 0: Not relevant at all

For each passage, output only the score followed by brief explanation.

${initialResults.map((result, i) => 
  `PASSAGE ${i+1}: "${result.content.substring(0, 300)}..."`
).join('\n\n')}
`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that ranks search results based on relevance." },
        { role: "user", content: rerankerPrompt }
      ],
      temperature: 0.3
    });
    
    // Step 3: Parse LLM response to get scores
    const scores = parseRerankerResponse(completion.choices[0].message.content);
    
    // Step 4: Combine original results with new scores
    const scoredResults = initialResults.map((result, i) => ({
      ...result,
      reranked_score: scores[i] || 0
    }));
    
    // Step 5: Sort by new scores and return top results
    const rerankedResults = scoredResults
      .sort((a, b) => b.reranked_score - a.reranked_score)
      .slice(0, options.maxResults || 5);
    
    return rerankedResults;
    
  } catch (error) {
    console.error('Reranking error:', error);
    throw error;
  }
}

// Helper function to parse reranker response
function parseRerankerResponse(response) {
  const scores = [];
  const regex = /PASSAGE\s*(\d+)[^0-9]*(\d+)/gi;
  let match;
  
  while ((match = regex.exec(response)) !== null) {
    const passageNum = parseInt(match[1]) - 1;
    const score = parseInt(match[2]);
    scores[passageNum] = score;
  }
  
  return scores;
}

## Query Expansion

Another technique to improve search results is query expansion. This involves generating multiple related queries to capture different ways of expressing the same information need:

```javascript
const { OpenAI } = require('openai');
const config = require('./config');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.llm.apiKey
});

async function expandQuery(query) {
  // Use LLM to generate query variations
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a search expert. Generate 3-5 variations of the query that express the same information need in different ways. Return ONLY the variations, one per line.'
      },
      {
        role: 'user',
        content: `Original query: "${query}"`
      }
    ],
    temperature: 0.7
  });
  
  // Parse the response to get query variations
  const variations = completion.choices[0].message.content
    .split('\n')
    .map(v => v.trim())
    .filter(v => v && !v.startsWith('Original') && !v.startsWith('-'));
  
  return [query, ...variations];
}

async function searchWithQueryExpansion(query, options = {}) {
  try {
    // Step 1: Generate query variations
    const expandedQueries = await expandQuery(query);
    console.log('Expanded queries:', expandedQueries);
    
    // Step 2: Search with each variation
    const allResults = [];
    for (const q of expandedQueries) {
      const results = await rag.search(q, {
        maxResults: options.maxResults || 3
      });
      allResults.push(...results);
    }
    
    // Step 3: Deduplicate results based on documentId
    const uniqueResults = [];
    const seenIds = new Set();
    
    for (const result of allResults) {
      if (!seenIds.has(result.documentId)) {
        seenIds.add(result.documentId);
        uniqueResults.push(result);
      }
    }
    
    // Step 4: Sort by score and return top results
    return uniqueResults
      .sort((a, b) => b.score - a.score)
      .slice(0, options.maxResults || 5);
    
  } catch (error) {
    console.error('Query expansion error:', error);
    throw error;
  }
}
```

## Vector Quantization

MongoDB Atlas supports vector quantization to improve search performance with minimal impact on quality:

```javascript
const { MongoClient } = require('mongodb');
const config = require('./config');

async function createQuantizedIndex() {
  const client = new MongoClient(config.mongodb.uri);
  
  try {
    await client.connect();
    const database = client.db(config.mongodb.database);
    const collection = database.collection(config.mongodb.collection);
    
    // Define scalar quantization index
    const scalarQuantizationIndex = {
      name: "vector_quantized_index",
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            path: "embedding",
            numDimensions: config.embedding.dimensions,
            similarity: "cosine",
            quantization: {
              type: "scalar",
              config: {
                components: { type: "int8" }
              }
            }
          }
        ]
      }
    };
    
    // Create the quantized index
    console.log('Creating quantized vector search index...');
    const result = await collection.createSearchIndex(scalarQuantizationIndex);
    console.log('Quantized index creation initiated:', result);
    
  } catch (error) {
    console.error('Error creating quantized index:', error);
    throw error;
  } finally {
    await client.close();
  }
}
```

Vector quantization offers these benefits:
- Reduced storage requirements
- Improved search performance
- Minimal impact on recall/precision
- Better scaling for large collections

## Multi-stage RAG Pipeline

Implement a multi-stage RAG pipeline that combines multiple retrieval and filtering techniques:

```javascript
async function advancedRAGPipeline(query, options = {}) {
  try {
    // Step 1: Extract entities and intent from query
    const queryAnalysis = await analyzeQuery(query);
    
    // Step 2: Expand query with variations
    const expandedQueries = await expandQuery(query);
    
    // Step 3: Initial retrieval from multiple sources
    const initialResults = await retrieveFromMultipleSources(expandedQueries, queryAnalysis);
    
    // Step 4: Filter by metadata based on query intent
    const filteredResults = filterByMetadata(initialResults, queryAnalysis.metadata);
    
    // Step 5: Rerank results
    const rerankedResults = await rerankResults(filteredResults, query, queryAnalysis);
    
    // Step 6: Dynamic prompt construction based on retrieved context
    const prompt = constructPrompt(query, rerankedResults, queryAnalysis);
    
    // Step 7: Generate response with the LLM
    const response = await generateLLMResponse(prompt);
    
    return {
      answer: response,
      sources: rerankedResults.map(r => ({
        documentId: r.documentId,
        source: r.metadata?.source,
        score: r.reranked_score || r.score
      }))
    };
    
  } catch (error) {
    console.error('Advanced RAG pipeline error:', error);
    throw error;
  }
}
```

## Self-Critique and Refinement

Enhance response quality through self-critique and refinement:

```javascript
async function generateWithSelfCritique(query, context) {
  // Step 1: Generate initial response
  const initialResponse = await openai.chat.completions.create({
    model: config.llm.model,
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant. Answer based only on the provided context.'
      },
      {
        role: 'user',
        content: `Context:\n${context}\n\nQuestion: ${query}`
      }
    ]
  });
  
  // Step 2: Self-critique the response
  const critique = await openai.chat.completions.create({
    model: config.llm.model,
    messages: [
      {
        role: 'system',
        content: `You are a critical evaluator. Assess the following answer for:
1. Factual accuracy based on the context
2. Completeness of information
3. Logical coherence
4. Possible hallucinations or unsupported claims
Provide specific suggestions for improvement.`
      },
      {
        role: 'user',
        content: `Context:\n${context}\n\nQuestion: ${query}\n\nAnswer: ${initialResponse.choices[0].message.content}`
      }
    ]
  });
  
  // Step 3: Refine the response based on critique
  const refinedResponse = await openai.chat.completions.create({
    model: config.llm.model,
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant. Answer based only on the provided context. Incorporate the critique to provide the most accurate response possible.'
      },
      {
        role: 'user',
        content: `Context:\n${context}\n\nQuestion: ${query}\n\nInitial answer: ${initialResponse.choices[0].message.content}\n\nCritique: ${critique.choices[0].message.content}\n\nProvide an improved answer that addresses the critique.`
      }
    ]
  });
  
  return refinedResponse.choices[0].message.content;
}
```

## Next Steps

You've now learned several advanced techniques to enhance your RAG application. In the next section, we'll explore how to deploy your application to production and optimize it for scale.