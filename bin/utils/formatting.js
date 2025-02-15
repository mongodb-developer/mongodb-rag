// bin/utils/formatting.js
import chalk from 'chalk';

/**
 * Format a success message with a green checkmark
 * @param {string} message - The message to format
 * @returns {string} The formatted message
 */
export const formatSuccess = (message) => {
  return `${chalk.green('✅')} ${message}`;
};

/**
 * Format an error message with a red X
 * @param {string} message - The message to format
 * @returns {string} The formatted message
 */
export const formatError = (message) => {
  return `${chalk.red('❌')} ${message}`;
};

/**
 * Format a warning message with a yellow warning symbol
 * @param {string} message - The message to format
 * @returns {string} The formatted message
 */
export const formatWarning = (message) => {
  return `${chalk.yellow('⚠️')} ${message}`;
};

/**
 * Format an info message with a blue info symbol
 * @param {string} message - The message to format
 * @returns {string} The formatted message
 */
export const formatInfo = (message) => {
  return `${chalk.blue('ℹ️')} ${message}`;
};

export function formatSearchResults(results) {
  if (results.length === 0) {
    console.log(chalk.yellow("⚠️ No results found."));
    return { results: [] };
  }

  console.log(chalk.bold("\n🔍 Search Results:\n"));
  return {
    results: results.map((result, i) => {
      const formatted = formatResult(result, i);
      displayResult(formatted, i);
      return formatted;
    })
  };
}

export function formatIndexOutput(searchIndexes, regularIndexes) {
  const output = {
    searchIndexes: [],
    regularIndexes: []
  };

  // Format and display Vector Search Indexes
  if (searchIndexes.length > 0) {
    console.log(chalk.bold("\n🔍 Vector Search Indexes:"));
    searchIndexes.forEach((index, i) => {
      const formattedIndex = {
        name: index.name,
        type: 'Vector Search',
        definition: index.latestDefinition,
        createdAt: new Date(index.latestDefinitionVersion?.createdAt || Date.now()).toLocaleString(),
        status: index.status,
        queryable: index.queryable
      };

      output.searchIndexes.push(formattedIndex);

      // Display formatted output
      console.log(chalk.green(`${i + 1}. 🔹 Index Name: ${index.name}`));
      console.log(`   📌 Type: ${chalk.magenta('Vector Search')}`);
      console.log(`   🎯 Definition: ${chalk.yellow(JSON.stringify(index.latestDefinition, null, 2))}`);
      console.log(`   📅 Created At: ${chalk.blue(formattedIndex.createdAt)}`);
      console.log(`   ✅ Status: ${chalk.green(index.status)}`);
      console.log(`   🎯 Queryable: ${index.queryable ? chalk.green('Yes') : chalk.yellow('No')}`);
      console.log(chalk.gray("---------------------------------------------------"));
    });
  }

  // Format and display Regular Indexes
  if (regularIndexes.length > 0) {
    console.log(chalk.bold("\n📄 Regular Indexes:"));
    regularIndexes.forEach((index, i) => {
      if (index.name === '_id_') return;

      const formattedIndex = {
        name: index.name,
        type: 'Standard',
        fields: index.key
      };

      output.regularIndexes.push(formattedIndex);

      console.log(chalk.green(`${i + 1}. 🔹 Index Name: ${index.name}`));
      console.log(`   📌 Type: ${chalk.magenta('Standard')}`);
      console.log(`   🔍 Fields: ${chalk.yellow(JSON.stringify(index.key, null, 2))}`);
      console.log(chalk.gray("---------------------------------------------------"));
    });
  }

  return output;
}

function formatResult(result, index) {
  return {
    index: index + 1,
    score: result.score,
    content: result.content,
    metadata: result.metadata
  };
}

function displayResult(result, index) {
  console.log(chalk.green(`Result ${index + 1}:`));
  console.log(chalk.yellow(`  Score: ${result.score.toFixed(3)}`));
  console.log(`  content: ${result.content}`);
  console.log(`  metadata: ${JSON.stringify(result.metadata)}`);
  console.log(chalk.gray("---------------------------------------------------"));
}

export function formatDocument(doc) {
  const formatted = { ...doc };
  
  // Handle arrays with preview
  Object.keys(formatted).forEach(key => {
    if (Array.isArray(formatted[key])) {
      const array = formatted[key];
      formatted[key] = {
        preview: array.slice(0, 10),
        remaining: Math.max(0, array.length - 10)
      };
    }
  });
  
  return formatted;
}