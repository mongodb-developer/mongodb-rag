// bin/commands/data/ingest.js
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { isConfigValid } from '../../utils/validation.js';
import MongoRAG from '../../../src/core/MongoRAG.js';
import { parseDocument } from '../../utils/document-parsers.js';
import { DocumentChunker } from '../../utils/chunking.js';
import { MongoClient } from 'mongodb';

export async function ingestData(config, options) {
  if (!isConfigValid(config)) {
    throw new Error("Configuration missing. Run 'npx mongodb-rag init' first.");
  }

  const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

  // Test MongoDB connection before proceeding
  try {
    if (isDevelopment) {
      console.log('Testing MongoDB connection...');
    }
    const testClient = new MongoClient(config.mongoUrl);
    await testClient.connect();
    await testClient.close();
    if (isDevelopment) {
      console.log('MongoDB connection test successful');
    }
  } catch (error) {
    throw new Error(`MongoDB connection test failed: ${error.message}`);
  }

  // Create the RAG configuration using the exact structure expected by MongoRAG
  const ragConfig = {
    mongoUrl: config.mongoUrl,
    database: config.database,
    collection: config.collection,
    embedding: {
      provider: config.embedding.provider,
      apiKey: config.apiKey,
      model: config.embedding.model,
      dimensions: config.embedding.dimensions,
      baseUrl: config.embedding.baseUrl,
      batchSize: config.embedding.batchSize
    },
    indexName: config.indexName
  };

  try {
    if (isDevelopment) {
      console.log('Creating MongoRAG instance...');
    }
    
    const rag = new MongoRAG(ragConfig);
    
    if (isDevelopment) {
      console.log('Connecting to MongoDB...');
    }
    
    await rag.connect();

    let documents = [];

    // Handle directory ingestion
    if (options.directory) {
      if (isDevelopment) console.log(chalk.blue(`📂 Processing directory: ${options.directory}`));
      documents = await processDirectory(options.directory, options);
    }
    // Handle single file ingestion
    else if (options.file) {
      if (isDevelopment) console.log(chalk.blue(`📄 Processing file: ${options.file}`));
      documents = await processFile(options.file, options);
    }
    else {
      throw new Error("Either --file or --directory option must be specified");
    }

    // Initialize chunker if chunking is enabled
    if (options.chunkSize) {
      const chunker = new DocumentChunker({
        chunkSize: options.chunkSize,
        chunkOverlap: options.chunkOverlap,
        method: options.chunkMethod
      });

      // Chunk each document
      const chunkedDocs = [];
      for (const doc of documents) {
        if (isDevelopment) {
          console.log(chalk.blue(`📄 Chunking document: ${doc.metadata?.filename}`));
        }
        const chunks = chunker.chunkDocument(doc);
        chunkedDocs.push(...chunks);

        if (isDevelopment) {
          console.log(chalk.green(`✅ Created ${chunks.length} chunks`));
        }
      }
      documents = chunkedDocs;
    }

    if (isDevelopment) {
      console.log(chalk.blue(`📊 Found ${documents.length} documents to process`));
    }

    const result = await rag.ingestBatch(documents, {
      database: options.database || config.database,
      collection: options.collection || config.collection
    });

    console.log(chalk.green(`✅ Successfully ingested ${result.processed} documents!`));
    await rag.close();
    return result;
  } catch (error) {
    console.error(chalk.red('❌ Ingestion failed:'), error.message);
    throw error;
  }
}

async function processDirectory(dirPath, options) {
  const documents = [];
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && options.recursive) {
      const subDocs = await processDirectory(filePath, options);
      documents.push(...subDocs);
    } else if (stat.isFile()) {
      try {
        const docs = await processFile(filePath, options);
        documents.push(...docs);
      } catch (error) {
        console.warn(chalk.yellow(`⚠️ Warning: Failed to process ${filePath}: ${error.message}`));
      }
    }
  }

  return documents;
}

async function processFile(filePath, options) {
  const ext = path.extname(filePath).toLowerCase();
  const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
  
  try {
    // If it's a JSON file, parse it directly
    if (ext === '.json') {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      return Array.isArray(data) ? data : [data];
    }

    // For other file types, use the document parser
    const doc = await parseDocument(filePath, null, options);
    
    if (isDevelopment) {
      console.log(chalk.blue(`📄 Processed ${filePath}`));
      if (doc.metadata?.processingFailed) {
        console.warn(chalk.yellow(`⚠️ Warning: ${doc.metadata.error}`));
      }
    }
    
    return [doc];
  } catch (error) {
    if (isDevelopment) {
      console.error(chalk.red(`❌ Failed to process ${filePath}:`), error.message);
    }
    return [];  // Skip failed files
  }
}