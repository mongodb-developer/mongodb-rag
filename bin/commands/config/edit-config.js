// bin/commands/config/edit-config.js
import fs from 'fs';
import chalk from 'chalk';
import { promptForConfigEdits } from '../../utils/prompts.js';

export async function editConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    console.warn(chalk.yellow("⚠️ No configuration found. Run 'npx mongodb-rag init' first."));
    return;
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const updatedConfig = await promptForConfigEdits(config);
  
  fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2));
  console.log(chalk.green("✅ Configuration updated successfully!"));
  
  return updatedConfig;
}