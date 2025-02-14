// bin/utils/error-handling.js
import chalk from 'chalk';

export function wrapCommand(command) {
  return async (...args) => {
    try {
      return await command(...args);
    } catch (error) {
      console.error(chalk.red("\n❌ Error:"), error.message);
      if (process.env.DEBUG) {
        console.error(chalk.gray("\nDebug Stack Trace:"), error.stack);
      }
      process.exit(1);
    }
  };
}