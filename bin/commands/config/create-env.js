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

    // Create .env content with correct property mappings
    const envContent = [
      `MONGODB_URI="${config.mongoUrl}"`,
      `EMBEDDING_PROVIDER="${config.embedding?.provider || config.provider}"`,
      `EMBEDDING_API_KEY="${config.apiKey}"`,
      `EMBEDDING_MODEL="${config.embedding?.model || config.model}"`,
      `VECTOR_INDEX="${config.indexName}"`,
      `MONGODB_DATABASE="${config.database}"`,
      `MONGODB_COLLECTION="${config.collection}"`,
    ].join('\n');

    // Write to .env file
    const envPath = path.join(process.cwd(), '.env');
    fs.writeFileSync(envPath, envContent);

    console.log(formatSuccess('.env file created successfully!'));
  } catch (error) {
    handleError(error);
  }
} 