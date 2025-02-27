#!/usr/bin/env node

/**
 * MongoDB RAG CLI Tool
 * Command-line interface for managing MongoDB vector search and RAG operations.
 */

import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { startPlayground } from '../src/cli/playground.js';
import {
  createIndex,
  showIndexes,
  init,
  testConnection,
  deleteIndex,
  generateEmbedding,
  ingestData,
  searchDocuments,
  showConfig,
  editConfig,
  clearConfig,
  resetConfig,
  askQuestion,
  startChatSession,
  setIndexName
} from './commands/index.js';
import { createRagApp } from './commands/init/createRagApp.js';
import { createEnvFile } from './commands/config/create-env.js';
import { isConfigValid } from './utils/validation.js';
import { wrapCommand } from './utils/error-handling.js';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8'));

// Configuration setup
const CONFIG_PATH = process.env.CONFIG_PATH || (
  process.env.NODE_ENV === "test"
    ? path.join(process.cwd(), ".mongodb-rag.test.json")
    : path.join(process.cwd(), ".mongodb-rag.json")
);

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

// Load configuration
let config = {};
try {
  if (fs.existsSync(CONFIG_PATH)) {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    if (isDevelopment) {
      console.log(chalk.green("✅ Loaded configuration from:"), path.resolve(CONFIG_PATH));
      console.log(chalk.blue("🔍 Config contents:"), config);
    }
  } else {
    if (isDevelopment) {
      console.warn(chalk.yellow(`⚠️ No config file found at: ${path.resolve(CONFIG_PATH)}`));
      console.warn(chalk.yellow("⚠️ Run 'npx mongodb-rag init' to set up configuration."));
    }
  }
} catch (e) {
  console.error(chalk.red("❌ Error loading configuration:"), e.message);
  process.exit(1);
}

// Initialize CLI
program
  .name('mongodb-rag')
  .description('MongoDB RAG CLI for managing vector search and RAG operations')
  .version(packageJson.version);

// Wrap your commands with error handling
const wrappedCreateRagApp = wrapCommand(createRagApp);

// Use the wrapped version in your command handling
program
  .command('create-rag-app <projectName>')
  .description('Scaffold a new CRUD RAG application with MongoDB and Vector Search')
  .action(wrappedCreateRagApp);

// Initialize configuration
program
  .command('init')
  .description('Initialize MongoRAG configuration')
  .action(wrapCommand(async () => await init(CONFIG_PATH)));

// Test connection
program
  .command('test-connection')
  .description('Test the connection to the embedding provider')
  .action(wrapCommand(async () => await testConnection(config)));

// Create index
program
  .command('create-index')
  .description('Create a MongoDB Atlas Vector Search Index')
  .action(wrapCommand(async () => await createIndex(config)));

// Show indexes
program
  .command('show-indexes')
  .description('Display all Vector Search indexes')
  .action(wrapCommand(async () => await showIndexes(config)));

// Delete index
program
  .command('delete-index')
  .description('Delete a MongoDB Atlas Vector Search Index')
  .action(wrapCommand(async () => await deleteIndex(config)));

// Generate embedding
program
  .command('generate-embedding <text>')
  .description('Generate a vector embedding for the given text')
  .action(wrapCommand(async (text) => await generateEmbedding(config, text)));

// Ingest data
program
  .command('ingest')
  .description('Ingest documents into MongoDB')
  .option('-f, --file <path>', 'Path to file to ingest')
  .option('-d, --directory <path>', 'Directory containing files to ingest')
  .option('-r, --recursive', 'Recursively process directories', false)
  .option('--database <name>', 'Override database name')
  .option('--collection <name>', 'Override collection name')
  .option('--chunk-size <number>', 'Number of tokens per chunk', parseInt)
  .option('--chunk-overlap <number>', 'Number of tokens to overlap between chunks', parseInt)
  .option('--chunk-method <method>', 'Chunking method (fixed, recursive, or semantic)', 'fixed')
  .action(wrapCommand(async (options) => {
    await ingestData(config, options);
  }));

// Search
program
  .command('search <query>')
  .option('--database <name>', 'Override database name')
  .option('--collection <name>', 'Override collection name')
  .option('--maxResults <number>', 'Set max search results', parseInt, 5)
  .option('--minScore <number>', 'Set minimum similarity score', parseFloat, 0.7)
  .description('Perform a vector search on stored documents')
  .action(wrapCommand(async (query, options) => {
    if (!config || Object.keys(config).length === 0) {
      throw new Error('No configuration found. Run "npx mongodb-rag init" first.');
    }
    await searchDocuments(config, query, options);
  }));

// Configuration management commands
program
  .command('show-config')
  .description('Display the current MongoRAG configuration')
  .action(wrapCommand(() => showConfig(CONFIG_PATH)));

program
  .command('edit-config')
  .description('Edit the MongoRAG configuration')
  .action(wrapCommand(async () => await editConfig(CONFIG_PATH)));

program
  .command('clear-config')
  .description('Delete the MongoRAG configuration')
  .action(wrapCommand(() => clearConfig(CONFIG_PATH)));

program
  .command('reset-config')
  .description('Reset the MongoRAG configuration')
  .action(wrapCommand(async () => await resetConfig(CONFIG_PATH)));

program
  .command('set-index-name')
  .description('Set the name for the MongoDB Vector Search Index')
  .action(wrapCommand(async () => await setIndexName(CONFIG_PATH)));

// Add this new command after the other command definitions
program
  .command('create-env')
  .description('Create a .env file from your MongoDB RAG configuration')
  .action(wrapCommand(async () => await createEnvFile()));

// Add global options
program
  .option('--debug', 'Enable debug output')
  .option('--non-interactive', 'Disable interactive prompts')
  .hook('preAction', (thisCommand) => {
    if (thisCommand.opts().debug) {
      process.env.DEBUG = 'true';
    }
    if (thisCommand.opts().nonInteractive) {
      process.env.NONINTERACTIVE = 'true';
    }
  });

// Error handling for unknown commands
program.on('command:*', () => {
  console.error(chalk.red('\n❌ Invalid command'));
  console.log(chalk.yellow('\nAvailable commands:'));
  program.commands.forEach((cmd) => {
    console.log(chalk.cyan(`  ${cmd.name()}`), '-', cmd.description());
  });
  console.log('\nRun', chalk.cyan('npx mongodb-rag --help'), 'for usage information.');
  process.exit(1);
});

program
  .command('playground')
  .description('Launch the MongoDB-RAG playground')
  .action(() => {
    console.log("Starting MongoDB-RAG Playground...");
    startPlayground();
  });

program
  .command('ask <query>')
  .description('Ask a question and get an answer using RAG')
  .option('--model <name>', 'Language model to use (provider-specific)')
  .option('--max-results <number>', 'Maximum documents to retrieve', parseInt, 5)
  .option('--min-score <number>', 'Minimum similarity score (0.0-1.0)', parseFloat, 0.7)
  .option('--show-sources', 'Display source documents', false)
  .option('--cite-sources', 'Include citations in the response', false)
  .option('--fallback-to-general', 'Use general knowledge if no documents match', false)
  .action(wrapCommand(async (query, options) => {
    await askQuestion(config, query, options);
  }));

  program
  .command('chat')
  .description('Start an interactive RAG-powered chat session')
  .option('--model <name>', 'Language model to use (provider-specific)')
  .option('--max-results <number>', 'Maximum documents to retrieve per message', parseInt, 5)
  .option('--min-score <number>', 'Minimum similarity score (0.0-1.0)', parseFloat, 0.7)
  .option('--show-sources', 'Display source documents after each response', false)
  .option('--cite-sources', 'Include citations in responses', false)
  .action(wrapCommand(async (options) => {
    await startChatSession(config, options);
  }));

// Parse command line arguments
program.parse();
