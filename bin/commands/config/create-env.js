export async function createEnvFile() {
  try {
    // Check if .mongodb-rag.json exists
    const configPath = path.join(process.cwd(), '.mongodb-rag.json');
    if (!fs.existsSync(configPath)) {
      throw new Error('Configuration file .mongodb-rag.json not found. Please run "npx mongodb-rag init" first.');
    }

    // Read the config file
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Create .env content with correct property mappings
    const envContent = [
      `MONGODB_URI="${config.mongoUrl}"`,
      `EMBEDDING_PROVIDER="${config.embedding.provider}"`,
      `EMBEDDING_API_KEY="${config.embedding.apiKey || ''}"`,
      `EMBEDDING_MODEL="${config.embedding.model || 'text-embedding-3-small'}"`,
      `VECTOR_INDEX="${config.indexName || 'vector_index'}"`,
      `MONGODB_DATABASE="${config.database}"`,
      `MONGODB_COLLECTION="${config.collection}"`,
      `EMBEDDING_DIMENSIONS="${config.embedding.dimensions}"`,
      `EMBEDDING_BATCH_SIZE="${config.embedding.batchSize}"`,
      `SEARCH_MAX_RESULTS="${config.search.maxResults}"`,
      `SEARCH_MIN_SCORE="${config.search.minScore}"`
    ].join('\n');

    // Write to .env file
    const envPath = path.join(process.cwd(), '.env');
    fs.writeFileSync(envPath, envContent);

    console.log(formatSuccess('.env file created successfully!'));
  } catch (error) {
    console.error(error);
  }
}