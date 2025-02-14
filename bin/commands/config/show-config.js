// bin/commands/config/show-config.js
import fs from 'fs';
import debug from 'debug';

const log = debug('mongodb-rag:cli:config');

export async function showConfig(configPath = '.mongodb-rag.json') {
  try {
    if (!fs.existsSync(configPath)) {
      throw new Error(`Configuration file not found: ${configPath}`);
    }
    const content = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to show config: ${error.message}`);
  }
}