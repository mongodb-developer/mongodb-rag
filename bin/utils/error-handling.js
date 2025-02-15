// bin/utils/error-handling.js
import chalk from 'chalk';

/**
 * Wraps a command function with error handling
 * @param {Function} commandFn The command function to wrap
 * @returns {Function} Wrapped command function with error handling
 */
export const wrapCommand = (commandFn) => {
  return async (...args) => {
    try {
      await commandFn(...args);
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', 'Error:', error.message);
      process.exit(1);
    }
  };
};

/**
 * Generic error handler for async operations
 * @param {Error} error The error to handle
 */
export const handleError = (error) => {
  console.error('\x1b[31m%s\x1b[0m', 'Error:', error.message);
  process.exit(1);
};

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