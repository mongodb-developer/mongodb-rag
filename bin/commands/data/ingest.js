// bin/commands/data/ingest.js
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { isConfigValid } from '../../utils/validation.js';
import MongoRAG from '../../../src/core/MongoRAG.js';
import { parseDocument } from '../../utils/document-parsers.js';
import { MongoClient } from 'mongodb';

export async function ingestData(config, options) {
  const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

  if (!isConfigValid(config)) {
    throw new Error("Invalid configuration. Run 'npx mongodb-rag init' first.");
  }

  // Test MongoDB connection first
  try {
    if (isDevelopment) console.log('Testing MongoDB connection...');
    const testClient = new MongoClient(config.mongoUrl);
    await testClient.connect();
    await testClient.close();
    if (isDevelopment) console.log('MongoDB connection test successful');
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }

  // Initialize MongoRAG
  const rag = new MongoRAG(config);
  
  try {
    // Process documents
    let documents = [];
    
    if (options.directory) {
      if (isDevelopment) console.log(chalk.blue(`📂 Processing directory: ${options.directory}`));
      documents = await processDirectory(options.directory, options);
    } else if (options.file) {
      if (isDevelopment) console.log(chalk.blue(`📄 Processing file: ${options.file}`));
      const doc = await parseDocument(options.file);
      if (doc) documents.push(doc);
    } else {
      throw new Error("Either --file or --directory option must be specified");
    }

    // Validate documents before ingestion
    documents = documents.filter(doc => {
      if (!doc.content || typeof doc.content !== 'string' || !doc.content.trim()) {
        if (isDevelopment) {
          console.warn(chalk.yellow(`⚠️ Skipping document with invalid content: ${doc.id || 'unknown'}`));
        }
        return false;
      }
      return true;
    });

    if (documents.length === 0) {
      throw new Error('No valid documents to process');
    }

    if (isDevelopment) {
      console.log(chalk.blue(`📊 Found ${documents.length} valid documents to process`));
    }

    // Connect and ingest
    await rag.connect();
    const result = await rag.ingestBatch(documents);
    
    if (result.processed > 0) {
      console.log(chalk.green(`✅ Successfully ingested ${result.processed} documents!`));
    } else {
      console.log(chalk.yellow('⚠️ No documents were ingested'));
    }

    if (result.failed > 0) {
      console.log(chalk.yellow(`⚠️ Failed to ingest ${result.failed} documents`));
    }

    return result;
  } catch (error) {
    console.error(chalk.red('❌ Ingestion failed:'), error.message);
    throw error;
  } finally {
    await rag.close();
  }
}

async function processDirectory(dirPath, options) {
  if (!fs.existsSync(dirPath)) {
    throw new Error(`Directory not found: ${dirPath}`);
  }

  const documents = [];
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    try {
      if (stat.isDirectory() && options.recursive) {
        const subDocs = await processDirectory(filePath, options);
        documents.push(...subDocs);
      } else if (stat.isFile()) {
        const doc = await parseDocument(filePath);
        if (doc && doc.content) {
          console.log(chalk.blue(`📄 Processed ${filePath}`));
          documents.push(doc);
        }
      }
    } catch (error) {
      console.warn(chalk.yellow(`⚠️ Warning: Failed to process ${filePath}: ${error.message}`));
    }
  }

  return documents;
}