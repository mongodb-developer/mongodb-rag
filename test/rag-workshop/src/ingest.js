const fs = require('fs-extra');
const path = require('path');
const { MongoRAG, Chunker } = require('mongodb-rag');
const config = require('./config');

// Initialize MongoRAG
const rag = new MongoRAG({
  mongoUrl: config.mongodb.uri,
  database: config.mongodb.database,
  collection: config.mongodb.collection,
  embedding: config.embedding
});

// Create a chunker
const chunker = new Chunker({
  strategy: config.chunking.strategy,
  maxChunkSize: config.chunking.maxChunkSize,
  overlap: config.chunking.overlap
});

// Function to read and process markdown files
async function ingestMarkdownFiles(directory) {
  try {
    // Get all markdown files
    const files = await fs.readdir(directory);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    console.log(`Found ${markdownFiles.length} markdown files to process`);
    
    // Process each file
    for (const filename of markdownFiles) {
      const filePath = path.join(directory, filename);
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Create document object
      const document = {
        id: path.basename(filename, '.md'),
        content: content,
        metadata: {
          source: filename,
          type: 'markdown',
          created: new Date().toISOString(),
          filename: filename
        }
      };
      
      console.log(`Processing ${filename}...`);
      
      // Chunk the document
      const chunks = await chunker.chunkDocument(document);
      console.log(`Created ${chunks.length} chunks from ${filename}`);
      
      // Ingest the chunks
      const result = await rag.ingestBatch(chunks);
      console.log(`Ingested ${result.processed} chunks from ${filename}`);
    }
    
    console.log('Document ingestion complete!');
    
  } catch (error) {
    console.error('Error ingesting documents:', error);
  } finally {
    await rag.close();
  }
}

// Main function
async function main() {
  const articlesDir = path.join(__dirname, '../data/articles');
  
  console.log('Starting document ingestion...');
  console.log(`Using ${config.chunking.strategy} chunking strategy`);
  console.log(`Max chunk size: ${config.chunking.maxChunkSize} characters`);
  console.log(`Chunk overlap: ${config.chunking.overlap} characters`);
  
  await rag.connect();
  await ingestMarkdownFiles(articlesDir);
}

// Run the ingestion process
main().catch(console.error);
