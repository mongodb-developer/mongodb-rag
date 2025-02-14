// bin/commands/config/set-index-name.js
import fs from 'fs';
import chalk from 'chalk';
import { promptForIndexName } from '../../utils/prompts.js';

export async function setIndexName(configPath) {
  if (!fs.existsSync(configPath)) {
    console.warn(chalk.yellow("⚠️ No configuration found. Run 'npx mongodb-rag init' first."));
    return;
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const indexName = await promptForIndexName(config.indexName || 'vector_index');
  
  config.indexName = indexName;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(chalk.green(`✅ Vector Index Name updated to "${indexName}"`));
  
  return config;
}