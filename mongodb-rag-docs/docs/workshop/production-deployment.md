---
id: production-deployment
title: 👐 Production Deployment
---

# Deploying Your RAG Application to Production

In this final section, we'll cover best practices for deploying your MongoDB-RAG application to production, including optimization, monitoring, and scaling strategies.

## Architecture Considerations

When deploying a RAG application to production, consider this reference architecture:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Document       │     │  Search         │     │  LLM            │
│  Processing     │◄────┤  Service        │◄────┤  Service        │
│  Service        │     │                 │     │                 │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  MongoDB Atlas  │     │  Cache          │     │  LLM Provider   │
│  (Vector Store) │     │  (Redis/Memcached)    │  (OpenAI/etc.)  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Microservices Approach

Consider splitting your application into specialized microservices:

1. **Document Processing Service**
   - Handles document ingestion, chunking, and embedding generation
   - Manages the document ingestion pipeline
   - Processes documents asynchronously with a queue

2. **Search Service**
   - Manages vector search and retrieval
   - Implements hybrid search capabilities
   - Caches common search results

3. **LLM Service**
   - Handles prompt construction and LLM interaction
   - Manages prompt templates and response generation
   - Implements retry logic and fallback mechanisms

## Optimizing MongoDB Atlas

### Sizing and Scaling

For production deployments, ensure your MongoDB Atlas cluster is properly sized:

1. **Cluster Tier Selection**
   - M10+ for small production workloads
   - M30+ for medium-sized applications
   - M60+ for larger workloads with high query volumes

2. **Horizontal Scaling**
   - Use sharding for very large vector collections (billions of vectors)
   - Distribute data across multiple shards based on a shard key

3. **Instance Size**
   - Ensure sufficient RAM for vector search operations
   - Consider storage requirements for documents and embeddings

### Index Optimization

Optimize your vector search indexes:

```javascript
const optimizedIndex = {
  name: "production_vector_index",
  type: "vectorSearch",
  definition: {
    fields: [
      {
        type: "vector",
        path: "embedding",
        numDimensions: 1536,
        similarity: "cosine",
        quantization: {
          type: "scalar",
          config: {
            components: { type: "int8" }  // Quantize for better performance
          }
        }
      }
    ],
    indexedFields: [
      "metadata.source",
      "metadata.type",
      "metadata.created"
    ],
    preImageStorage: {
      enabled: false  // Disable for better space utilization
    }
  }
};
```

### Connection Pooling

Implement connection pooling for efficient database connections:

```javascript
// In your MongoDB connection configuration
const client = new MongoClient(uri, {
  maxPoolSize: 50,              // Adjust based on expected concurrency
  minPoolSize: 5,               // Maintain minimum connections
  maxIdleTimeMS: 30000,         // Close idle connections after 30 seconds
  waitQueueTimeoutMS: 10000,    // Timeout for waiting for connection
  connectTimeoutMS: 30000,      // Timeout for initial connection
  socketTimeoutMS: 45000        // Timeout for socket operations
});
```

## Caching Strategies

Implement multi-level caching to improve performance:

### Query Result Caching

Cache common search results:

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

async function cachedSearch(query, options = {}) {
  // Generate cache key based on query and options
  const cacheKey = `search:${JSON.stringify({query, options})}`;
  
  // Check cache first
  const cachedResults = cache.get(cacheKey);
  if (cachedResults) {
    console.log('Cache hit for query:', query);
    return cachedResults;
  }
  
  // If not in cache, perform search
  const results = await rag.search(query, options);
  
  // Cache the results
  cache.set(cacheKey, results);
  
  return results;
}
```

### Embedding Caching

Cache embeddings to avoid regenerating them:

```javascript
const NodeCache = require('node-cache');
const embeddingCache = new NodeCache({ stdTTL: 86400, checkperiod: 600 });

// Extend the embedding provider with caching
class CachedEmbeddingProvider {
  constructor(provider) {
    this.provider = provider;
  }
  
  async getEmbedding(text) {
    const cacheKey = `embed:${text}`;
    
    // Check cache first
    const cachedEmbedding = embeddingCache.get(cacheKey);
    if (cachedEmbedding) {
      return cachedEmbedding;
    }
    
    // Generate embedding if not cached
    const embedding = await this.provider.getEmbedding(text);
    
    // Cache the embedding
    embeddingCache.set(cacheKey, embedding);
    
    return embedding;
  }
  
  async getEmbeddings(texts) {
    // Implement batch caching logic
    // ...
  }
}
```

### LLM Response Caching

Cache LLM responses for repeating queries:

```javascript
const NodeCache = require('node-cache');
const llmCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

async function cachedLLMGeneration(messages, options = {}) {
  // Generate cache key based on messages
  const cacheKey = `llm:${JSON.stringify(messages)}`;
  
  // Check cache first
  const cachedResponse = llmCache.get(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Generate response if not cached
  const response = await openai.chat.completions.create({
    model: options.model || config.llm.model,
    messages,
    temperature: options.temperature || 0.3
  });
  
  // Cache the response
  llmCache.set(cacheKey, response);
  
  return response;
}
```

## Rate Limiting and Queueing

Implement rate limiting and job queueing for robust production applications:

### Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL);

// Apply rate limiting middleware
app.use('/api/rag', rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args)
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  standardHeaders: true,
  message: {
    error: 'Too many requests, please try again later.'
  }
}));
```

### Job Queueing

Use a job queue for background processing:

```javascript
const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');

// Create Redis connection
const connection = new Redis(process.env.REDIS_URL);

// Create document processing queue
const documentQueue = new Queue('document-processing', { connection });

// Add document to processing queue
async function queueDocumentForProcessing(document) {
  await documentQueue.add('process-document', {
    document,
    timestamp: Date.now()
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  });
  
  return { status: 'queued', documentId: document.id };
}

// Process documents from queue
const processingWorker = new Worker('document-processing', async (job) => {
  const { document } = job.data;
  
  try {
    // Step 1: Chunk document
    const chunks = await chunker.chunkDocument(document);
    
    // Step 2: Generate embeddings and store in MongoDB
    const result = await rag.ingestBatch(chunks);
    
    return { processed: result.processed };
  } catch (error) {
    console.error('Document processing error:', error);
    throw error;
  }
}, { connection });
```

## Monitoring and Observability

Implement comprehensive monitoring for your production RAG application:

### Prometheus Metrics

```javascript
const client = require('prom-client');
const register = new client.Registry();

// Add default metrics
client.collectDefaultMetrics({ register });

// Create custom metrics
const searchLatency = new client.Histogram({
  name: 'rag_search_latency_seconds',
  help: 'RAG search latency in seconds',
  labelNames: ['status'],
  buckets: [0.1, 0.5, 1, 2, 5, 10]
});

const llmLatency = new client.Histogram({
  name: 'llm_request_latency_seconds',
  help: 'LLM request latency in seconds',
  labelNames: ['model', 'status'],
  buckets: [0.5, 1, 3, 5, 10, 30]
});

const searchCounter = new client.Counter({
  name: 'rag_search_total',
  help: 'Total number of RAG searches',
  labelNames: ['status']
});

// Register metrics
register.registerMetric(searchLatency);
register.registerMetric(llmLatency);
register.registerMetric(searchCounter);

// Add metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Instrument search function
async function instrumentedSearch(query, options = {}) {
  const end = searchLatency.startTimer();
  searchCounter.inc({ status: 'started' });
  
  try {
    const results = await rag.search(query, options);
    end({ status: 'success' });
    searchCounter.inc({ status: 'success' });
    return results;
  } catch (error) {
    end({ status: 'error' });
    searchCounter.inc({ status: 'error' });
    throw error;
  }
}
```

### Logging

Implement structured logging for better observability:

```javascript
const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'rag-service' },
  transports: [
    new winston.transports.Console(),
    new ElasticsearchTransport({
      level: 'info',
      clientOpts: { node: process.env.ELASTICSEARCH_URL },
      indexPrefix: 'rag-logs'
    })
  ]
});

// Log search events
async function loggedSearch(query, options = {}) {
  logger.info('Search initiated', {
    query,
    options,
    userId: options.userId,
    requestId: options.requestId
  });
  
  try {
    const results = await rag.search(query, options);
    
    logger.info('Search completed', {
      query,
      resultCount: results.length,
      topScore: results[0]?.score,
      durationMs: Date.now() - startTime,
      requestId: options.requestId
    });
    
    return results;
  } catch (error) {
    logger.error('Search failed', {
      query,
      error: error.message,
      stack: error.stack,
      requestId: options.requestId
    });
    
    throw error;
  }
}
```

## Deployment Options

### Docker Containerization

Create a `Dockerfile` for your application:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "src/index.js"]
```

### Kubernetes Deployment

Create a Kubernetes deployment manifest:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rag-application
  labels:
    app: rag-application
spec:
  replicas: 3
  selector:
    matchLabels:
      app: rag-application
  template:
    metadata:
      labels:
        app: rag-application
    spec:
      containers:
      - name: rag-application
        image: your-registry/rag-application:latest
        ports:
        - containerPort: 3000
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: mongodb-credentials
              key: uri
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: openai-credentials
              key: api-key
        resources:
          requests:
            memory: "512Mi"
            cpu: "200m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        readinessProbe:
          httpGet:
            path: /healthz
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /healthz
            port: 3000
          initialDelaySeconds: 20
          periodSeconds: 15
```

## Security Considerations

### API Key Management

Use environment variables and secrets management:

```javascript
// Load environment variables from a secure source
require('dotenv').config();

// Access keys securely
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const rag = new MongoRAG({
  mongoUrl: process.env.MONGODB_URI,
  // ...other config
  embedding: {
    provider: process.env.EMBEDDING_PROVIDER,
    apiKey: process.env.EMBEDDING_API_KEY
  }
});
```

### MongoDB Atlas Security

1. **Network Security**
   - Use IP allowlists or private endpoints
   - Enable VPC peering for cloud deployments
   - Configure TLS/SSL for all connections

2. **Authentication**
   - Use strong, unique passwords
   - Implement database users with least privilege
   - Consider SCRAM authentication

3. **Encryption**
   - Enable encryption at rest
   - Use TLS/SSL for data in transit
   - Consider client-side field level encryption for sensitive data

## Cost Optimization

### Embedding Generation Cost

Optimize embedding generation costs:

1. **Batch Processing**
   - Process documents in batches
   - Use the lowest-cost embedding model that meets quality requirements
   - Cache embeddings to avoid regeneration

2. **Selective Updates**
   - Only regenerate embeddings when content changes
   - Implement delta updates for document changes

### LLM Usage Optimization

Reduce LLM API costs:

1. **Context Trimming**
   - Send only the most relevant context to the LLM
   - Implement intelligent context selection

2. **Response Caching**
   - Cache common LLM responses
   - Implement semantic caching based on query similarity

3. **Model Selection**
   - Use smaller models for simpler tasks
   - Implement model cascading (try smaller models first)

## Continuous Improvement

### A/B Testing Framework

Implement A/B testing to evaluate RAG improvements:

```javascript
async function abTestSearch(query, options = {}) {
  // Determine which variant to use
  const variant = Math.random() < 0.5 ? 'A' : 'B';
  
  // Execute the appropriate search method
  let results;
  const startTime = Date.now();
  
  if (variant === 'A') {
    // Control: Standard search
    results = await rag.search(query, options);
  } else {
    // Treatment: New search algorithm
    results = await advancedSearch(query, options);
  }
  
  // Record metrics
  const duration = Date.now() - startTime;
  
  // Log experiment data
  logger.info('Search experiment', {
    variant,
    query,
    resultCount: results.length,
    topScore: results[0]?.score,
    duration,
    experimentId: 'search-algorithm-v2'
  });
  
  return results;
}
```

### Feedback Collection

Implement user feedback collection:

```javascript
async function recordSearchFeedback(searchId, feedback) {
  await feedbackCollection.insertOne({
    searchId,
    query: feedback.query,
    results: feedback.results,
    rating: feedback.rating,
    comments: feedback.comments,
    timestamp: new Date()
  });
  
  // Track relevance metrics
  if (feedback.rating >= 4) {
    relevanceMetrics.inc({ status: 'good' });
  } else if (feedback.rating <= 2) {
    relevanceMetrics.inc({ status: 'poor' });
  }
}
```

## Conclusion

Congratulations! You've completed the MongoDB-RAG Workshop. You now have the knowledge and skills to:

1. Set up MongoDB Atlas with Vector Search
2. Create and manage vector embeddings
3. Build a complete RAG application with MongoDB
4. Implement advanced retrieval techniques
5. Deploy and optimize your application for production

## Next Steps

To continue your RAG journey:

1. **Explore Advanced Features**
   - Try different embedding models
   - Experiment with hybrid search approaches
   - Implement multi-modal RAG (text, images, etc.)

2. **Integrate with Your Systems**
   - Connect your RAG system to your existing data sources
   - Build domain-specific knowledge bases
   - Implement custom workflows

3. **Stay Updated**
   - Follow the [MongoDB Developer Blog](https://www.mongodb.com/developer/languages/javascript/)
   - Join the [MongoDB Community Forums](https://www.mongodb.com/community/forums/)
   - Check for updates to the mongodb-rag library

We hope you found this workshop valuable and look forward to seeing what you build with MongoDB-RAG!