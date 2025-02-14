// bin/commands/config/reset-config.js
import fs from 'fs';
import chalk from 'chalk';
import { init } from '../init.js';

export async function resetConfig(configPath) {
  console.log(chalk.cyan("🔄 Resetting configuration...\n"));
  
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
  }
  
  return await init(configPath);
}