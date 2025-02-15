import fs from 'fs';
import path from 'path';
import { formatSuccess } from '../../utils/formatting.js';
import { handleError } from '../../utils/error-handling.js';

export async function createEnvFile() {
  try {
    // Check if .mongodb-rag.json exists
    const configPath = path.join(process.cwd(), '.mongodb-rag.json');
    if (!fs.existsSync(configPath)) {
      throw new Error('Configuration file .mongodb-rag.json not found. Please run "npx mongodb-rag init" first.');
    }

    // Read the config file
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Create .env content
    const envContent = [
      `MONGODB_URI="${config.mongodbUri}"`,
      `EMBEDDING_PROVIDER="${config.embeddingProvider}"`,
      `EMBEDDING_API_KEY="${config.embeddingApiKey}"`,
      `EMBEDDING_MODEL="${config.embeddingModel}"`,
      `VECTOR_INDEX="${config.vectorSearchIndex}"`,
      `MONGODB_DATABASE_NAME="${config.databaseName}"`,
      `MONGODB_COLLECTION_NAME="${config.collectionName}"`,
    ].join('\n');

    // Write to .env file
    const envPath = path.join(process.cwd(), '.env');
    fs.writeFileSync(envPath, envContent);

    console.log(formatSuccess('.env file created successfully!'));
  } catch (error) {
    handleError(error);
  }
} 