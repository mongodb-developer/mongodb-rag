// bin/utils/error-handling.js
import chalk from 'chalk';

export function withErrorHandling(command) {
  return async (...args) => {
    try {
      return await command(...args);
    } catch (error) {
      console.error(chalk.red("\n❌ Error:"), error.message);
      if (process.env.DEBUG) {
        console.error(chalk.gray("\nDebug Stack Trace:"), error.stack);
      }
      // Don't exit if we're in a test environment
      if (process.env.NODE_ENV !== 'test') {
        process.exit(1);
      }
      throw error; // Re-throw for test environments
    }
  };
}