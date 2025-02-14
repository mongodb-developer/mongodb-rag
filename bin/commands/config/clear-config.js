// bin/commands/config/clear-config.js
import fs from 'fs';
import chalk from 'chalk';

export async function clearConfig(configPath) {
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
    console.log(chalk.green("🗑️ Configuration deleted successfully."));
    return true;
  } else {
    console.warn(chalk.yellow("⚠️ No configuration file found."));
    return false;
  }
}