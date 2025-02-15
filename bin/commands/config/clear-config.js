// bin/commands/config/clear-config.js
import fs from 'fs';
import chalk from 'chalk';

export async function clearConfig(configPath) {
  try {
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
      return true;
    }
    console.warn(chalk.yellow("⚠️ No configuration file found."));
    return true; // Changed to return true even when file doesn't exist
  } catch (error) {
    console.error(chalk.red(`❌ Error clearing config: ${error.message}`));
    return false;
  }
}