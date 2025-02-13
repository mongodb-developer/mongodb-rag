#!/usr/bin/env node
import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import MongoRAG from '../src/core/MongoRAG.js';
import Enquirer from 'enquirer';
import chalk from 'chalk';
import columnify from 'columnify';
import util from 'util';
import { createRagApp } from '../src/cli/createRagApp.js';
import { MongoClient } from 'mongodb';

const isTestMode = process.env.NODE_ENV === 'test';
const isNonInteractive = process.env.NONINTERACTIVE === 'true';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = process.env.NODE_ENV === "test"
    ? path.join(process.cwd(), ".mongodb-rag.test.json")
    : path.join(process.cwd(), ".mongodb-rag.json");

console.log(chalk.blue("🔍 Debug: Using CONFIG_PATH =>"), CONFIG_PATH);

const getMockIndexes = () => [
    {
      name: 'vector_index',
      type: 'search',
      key: { embedding: 'vector' }
    },
    {
      name: '_id_',
      type: 'standard',
      key: { _id: 1 }
    }
  ];

  const getMongoClient = async (url) => {
    if (isTestMode) {
      return {
        db: () => ({
          collection: () => ({
            createSearchIndex: async () => ({ name: 'vector_index' }),
            indexes: async () => getMockIndexes(),
            listSearchIndexes: () => ({
              toArray: async () => getMockIndexes()
            })
          })
        }),
        close: async () => {}
      };
    }
    
    const client = new MongoClient(url);
    await client.connect();
    return client;
  };

const getIndexParams = async (config) => {
    if (isNonInteractive) {
      return {
        indexName: process.env.VECTOR_INDEX || config.indexName || 'vector_index',
        fieldPath: process.env.FIELD_PATH || config.embedding?.path || 'embedding',
        numDimensions: process.env.NUM_DIMENSIONS || String(config.embedding?.dimensions) || '1536',
        similarityFunction: process.env.SIMILARITY_FUNCTION || config.embedding?.similarity || 'cosine'
      };
    }
  
    const enquirer = new Enquirer();
    return enquirer.prompt([
      {
        type: 'input',
        name: 'indexName',
        message: 'Enter the name for your Vector Search Index:',
        initial: config.indexName || 'vector_index'
      },
      {
        type: 'input',
        name: 'fieldPath',
        message: 'Enter the field path where vector embeddings are stored:',
        initial: config.embedding?.path || 'embedding'
      },
      {
        type: 'input',
        name: 'numDimensions',
        message: 'Enter the number of dimensions for embeddings:',
        initial: String(config.embedding?.dimensions || '1536'),
        validate: (input) => !isNaN(input) && Number(input) > 0 ? true : 'Please enter a valid number.'
      },
      {
        type: 'select',
        name: 'similarityFunction',
        message: 'Choose the similarity function:',
        choices: ['cosine', 'dotProduct', 'euclidean'],
        initial: config.embedding?.similarity || 'cosine'
      }
    ]);
  };

// Load Config Safely
let config = {};
try {
    if (fs.existsSync(CONFIG_PATH)) {
        config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    } else {
        console.warn("⚠️ No .mongodb-rag.json found. Run 'npx mongodb-rag init' to set up.");
    }
} catch (e) {
    console.error("❌ Error loading configuration:", e.message);
    process.exit(1);
}

// Function to check if required config values exist
function isConfigValid(config) {
    return (
        config.mongoUrl &&
        config.database &&
        config.collection &&
        config.embedding &&
        config.embedding.apiKey
    );
}

program
  .command('create-rag-app <projectName>')
  .description('Scaffold a new CRUD RAG application with MongoDB and Vector Search')
  .action((projectName) => {
    createRagApp(projectName);
  });


program
    .command('init')
    .description('Initialize MongoRAG configuration')
    .action(async () => {
        console.log(chalk.cyan.bold('🔧 Setting up MongoRAG configuration...\n'));

        const responses = await new Enquirer().prompt([
            {
                type: 'input',
                name: 'mongoUrl',
                message: 'Enter MongoDB Connection String:'
            },
            {
                type: 'input',
                name: 'database',
                message: 'Enter Database Name:'
            },
            {
                type: 'input',
                name: 'collection',
                message: 'Enter Collection Name:'
            },
            {
                type: 'select',
                name: 'provider',
                message: 'Select an Embedding Provider:',
                choices: ['openai', 'deepseek']
            },
            {
                type: 'input',
                name: 'apiKey',
                message: async (answers) => `Enter API Key for ${answers.provider}:`
            },
            {
                type: 'input',
                name: 'indexName',
                message: 'Enter the name for your Vector Search Index:',
                initial: 'vector_index'
            }
        ]);

        const newConfig = {
            mongoUrl: responses.mongoUrl,
            database: responses.database,
            collection: responses.collection,
            embedding: {
                provider: responses.provider,
                apiKey: responses.apiKey,
                model: responses.provider === 'openai' ? 'text-embedding-3-small' : 'deepseek-embedding',
                batchSize: 100,
                dimensions: 1536
            },
            search: {
                maxResults: 5,
                minScore: 0.7
            },
            indexName: responses.indexName
        };

        fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2));
        console.log(chalk.green(`✅ Configuration saved to ${CONFIG_PATH}`));
    });

// **Test MongoDB Connection**
program
    .command('test-index')
    .description('Test the MongoDB Vector Search Index')
    .action(async () => {
        if (!isConfigValid(config)) {
            console.error(chalk.red("❌ Configuration missing. Run 'npx mongodb-rag init' first."));
            process.exit(1);
        }

        const rag = new MongoRAG(config);
        await rag.connect();

        try {
            const collection = await rag._getCollection();
            const indexes = await collection.indexes();

            if (indexes.some(idx => idx.name === config.indexName)) {
                console.log(chalk.green(`✅ Vector Index "${config.indexName}" exists and is ready for search.`));
            } else {
                console.warn(chalk.yellow(`⚠️ Vector Index "${config.indexName}" not found! Run 'npx mongodb-rag create-index' first.`));
            }
        } catch (error) {
            console.error(chalk.red("❌ Error testing index:"), error.message);
        } finally {
            await rag.close();
        }
    });


// **Ingest JSON Data**
program
    .command('ingest')
    .requiredOption('--file <path>', 'Path to JSON file containing documents')
    .option('--database <name>', 'Override database name')
    .option('--collection <name>', 'Override collection name')
    .description('Ingest a JSON file into MongoDB')
    .action(async (options) => {
        if (!isConfigValid(config)) {
            console.error("❌ Configuration missing. Run 'npx mongodb-rag init' first.");
            process.exit(1);
        }
        try {
            const data = JSON.parse(fs.readFileSync(options.file, 'utf-8'));
            const rag = new MongoRAG(config);
            await rag.connect();
            const result = await rag.ingestBatch(data, {
                database: options.database,
                collection: options.collection
            });
            console.log(`✅ Successfully ingested ${result.processed} documents!`);
            await rag.close();
        } catch (error) {
            console.error('❌ Ingestion failed:', error.message);
        }
    });

    program
    .command('create-index')
    .description('Create a MongoDB Atlas Vector Search Index')
    .action(async () => {
        if (!isConfigValid(config)) {
            console.error(chalk.red("❌ Configuration missing. Run 'npx mongodb-rag init' first."));
            process.exit(1);
        }

        console.log(chalk.cyan.bold(`📂 Database: ${config.database}`));
        console.log(chalk.cyan.bold(`📑 Collection: ${config.collection}`));

        const indexParams = isNonInteractive ? {
            indexName: process.env.VECTOR_INDEX || config.indexName || 'vector_index',
            fieldPath: process.env.FIELD_PATH || config.embedding?.path || 'embedding',
            numDimensions: process.env.NUM_DIMENSIONS || String(config.embedding?.dimensions) || '1536',
            similarityFunction: process.env.SIMILARITY_FUNCTION || config.embedding?.similarity || 'cosine'
        } : await getIndexParams(config);

        config.indexName = indexParams.indexName;
        config.embedding.path = indexParams.fieldPath;
        config.embedding.dimensions = Number(indexParams.numDimensions);
        config.embedding.similarity = indexParams.similarityFunction;

        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));

        console.log(chalk.yellow(`📌 Creating Vector Search Index: ${indexParams.indexName}...`));

        const client = await getMongoClient(config.mongoUrl);

        try {
            const collection = client.db(config.database).collection(config.collection);
            const indexDefinition = {
                name: indexParams.indexName,
                type: "vectorSearch",
                definition: {
                    fields: [
                        {
                            type: "vector",
                            numDimensions: config.embedding.dimensions,
                            path: config.embedding.path,
                            similarity: config.embedding.similarity
                        }
                    ]
                }
            };

            await collection.createSearchIndex(indexDefinition);
            console.log(chalk.green(`✅ Vector Search Index "${indexParams.indexName}" created successfully!`));
        } catch (error) {
            console.error(chalk.red("❌ Error creating index:"), error.message);
            process.exit(1);
        } finally {
            await client.close();
        }
    });

program
    .command('delete-index')
    .description('Delete a MongoDB Atlas Vector Search Index')
    .action(async () => {
        if (!isConfigValid(config)) {
            console.error(chalk.red("❌ Configuration missing. Run 'npx mongodb-rag init' first."));
            process.exit(1);
        }

        console.log(chalk.cyan.bold(`📂 Database: ${config.database}`));
        console.log(chalk.cyan.bold(`📑 Collection: ${config.collection}`));

        const enquirer = new Enquirer();
        const { confirmDelete } = await enquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmDelete',
                message: `Are you sure you want to delete the Vector Search Index "${config.indexName}"?`,
                initial: false
            }
        ]);

        if (!confirmDelete) {
            console.log(chalk.yellow("⚠️ Deletion canceled."));
            return;
        }

        const rag = new MongoRAG(config);
        await rag.connect();

        try {
            const collection = await rag._getCollection();

            console.log(chalk.yellow(`🗑️ Deleting Vector Search Index: ${config.indexName}...`));

            await collection.dropSearchIndex(config.indexName); // ✅ Correct function

            console.log(chalk.green(`✅ Vector Search Index "${config.indexName}" deleted successfully!`));
        } catch (error) {
            console.error(chalk.red("❌ Error deleting index:"), error.message);
        } finally {
            await rag.close();
        }
    });


program
    .command('generate-embedding <text>')
    .description('Generate a vector embedding for the given text')
    .action(async (text) => {
        if (!isConfigValid(config)) {
            console.error("❌ Configuration missing. Run 'npx mongodb-rag init' first.");
            process.exit(1);
        }

        const rag = new MongoRAG(config);
        try {
            const embedding = await rag.generateEmbedding(text);
            console.log("🔢 Generated Embedding:", embedding);
        } catch (error) {
            console.error("❌ Error generating embedding:", error.message);
        }
    });

program
    .command('test-index')
    .description('Test the MongoDB Vector Search Index')
    .action(async () => {
        if (!isConfigValid(config)) {
            console.error("❌ Configuration missing. Run 'npx mongodb-rag init' first.");
            process.exit(1);
        }

        const rag = new MongoRAG(config);
        await rag.connect();

        try {
            const indexes = await rag.listIndexes();
            if (indexes.some(idx => idx.name === "vector_index")) {
                console.log("✅ Vector Index exists and is ready for search.");
            } else {
                console.warn("⚠️ Vector Index not found! Run 'npx mongodb-rag create-index' first.");
            }
        } catch (error) {
            console.error("❌ Error testing index:", error.message);
        } finally {
            await rag.close();
        }
    });

program
    .command('set-index-name')
    .description('Set the name for the MongoDB Vector Search Index')
    .action(async () => {
        if (!fs.existsSync(CONFIG_PATH)) {
            console.warn("⚠️ No configuration found. Run 'npx mongodb-rag init' first.");
            return;
        }

        const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
        const response = await new Enquirer().prompt([
            {
                type: 'input',
                name: 'indexName',
                message: 'Enter the new name for your Vector Search Index:',
                initial: config.indexName || 'vector_index'
            }
        ]);

        config.indexName = response.indexName;
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
        console.log(`✅ Vector Index Name updated to "${config.indexName}"`);
    });

program
    .command('search <query>')
    .option('--database <name>', 'Override database name')
    .option('--collection <name>', 'Override collection name')
    .option('--maxResults <number>', 'Set max search results', parseInt, 5)
    .option('--minScore <number>', 'Set minimum similarity score', parseFloat, 0.7)
    .description('Perform a vector search on stored documents')
    .action(async (query, options) => {
        if (!isConfigValid(config)) {
            console.error(chalk.red("❌ Configuration missing. Run 'npx mongodb-rag init' first."));
            process.exit(1);
        }

        console.log(chalk.cyan.bold(`📂 Database: ${config.database}`));
        console.log(chalk.cyan.bold(`📑 Collection: ${config.collection}`));
        console.log(chalk.yellow(`🔍 Performing vector search using index: ${config.indexName}`));

        try {
            const rag = new MongoRAG(config);
            await rag.connect();

            const searchParams = {
                database: options.database || config.database,
                collection: options.collection || config.collection,
                index: config.indexName, // ✅ Use stored index name
                maxResults: options.maxResults || config.search.maxResults,
                minScore: options.minScore || config.search.minScore
            };

            const results = await rag.search(query, searchParams);

            if (results.length === 0) {
                console.log(chalk.yellow("⚠️ No results found."));
                return;
            }

            console.log(chalk.bold("\n🔍 Search Results:\n"));

            // Format and display each result
            results.forEach((result, i) => {
                console.log(chalk.green(`Result ${i + 1}:`));
                console.log(chalk.yellow(`  Score: ${result.score.toFixed(2)}`));

                // Format the result content
                Object.keys(result).forEach(key => {
                    if (key !== "score") {
                        let value = result[key];

                        // Limit arrays with more than 10 elements
                        if (Array.isArray(value) && value.length > 10) {
                            value = `${JSON.stringify(value.slice(0, 10))} ... (${value.length - 10} more items)`;
                        }

                        console.log(chalk.cyan(`  ${key}: `) + chalk.whiteBright(value));
                    }
                });

                console.log(chalk.gray("---------------------------------------------------"));
            });

            await rag.close();
        } catch (error) {
            console.error(chalk.red("❌ Search failed:"), error.message);
        }
    });


    program
    .command('show-indexes')
    .description('Display all indexes for the configured MongoDB collection')
    .action(async () => {
        if (!isConfigValid(config)) {
            console.error(chalk.red("❌ Configuration missing. Run 'npx mongodb-rag init' first."));
            process.exit(1);
        }

        console.log(chalk.cyan.bold(`📂 Database: ${config.database}`));
        console.log(chalk.cyan.bold(`📑 Collection: ${config.collection}`));

        const client = await getMongoClient(config.mongoUrl);

        try {
            const collection = client.db(config.database).collection(config.collection);
            
            // Use the indexes() method to get all indexes
            const indexes = await collection.indexes();

            if (indexes.length === 0) {
                console.log(chalk.yellow("⚠️ No indexes found in this collection."));
            } else {
                console.log(chalk.bold("\n📄 List of Indexes:"));
                indexes.forEach((index, i) => {
                    console.log(chalk.green(`${i + 1}. 🔹 Index Name: ${index.name}`));
                    console.log(`   📌 Type: ${chalk.magenta(index.type || 'Standard')}`);
                    console.log(`   🔍 Fields: ${chalk.yellow(JSON.stringify(index.key, null, 2))}`);
                    console.log(chalk.gray("---------------------------------------------------"));
                });
            }
        } catch (error) {
            console.error(chalk.red("❌ Error retrieving indexes:"), error.message);
            process.exit(1);
        } finally {
            await client.close();
        }
    });


program
    .command('show-config')
    .description('Display the current MongoRAG configuration')
    .action(() => {
        if (!fs.existsSync(CONFIG_PATH)) {
            console.warn("⚠️ No configuration found. Run 'npx mongodb-rag init' to set up.");
            return;
        }

        const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
        console.log("📄 Current Configuration:\n", JSON.stringify(config, null, 2));
    });

program
    .command('edit-config')
    .description('Edit the MongoRAG configuration')
    .action(async () => {
        if (!fs.existsSync(CONFIG_PATH)) {
            console.warn("⚠️ No configuration found. Run 'npx mongodb-rag init' first.");
            return;
        }

        const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

        const responses = await enquirer.prompt([
            {
                type: 'input',
                name: 'mongoUrl',
                message: 'Enter MongoDB Connection String:',
                initial: config.mongoUrl
            },
            {
                type: 'input',
                name: 'database',
                message: 'Enter Database Name:',
                initial: config.database
            },
            {
                type: 'input',
                name: 'collection',
                message: 'Enter Collection Name:',
                initial: config.collection
            },
            {
                type: 'select',
                name: 'provider',
                message: 'Select an Embedding Provider:',
                choices: ['openai', 'deepseek'],
                initial: config.embedding.provider
            },
            {
                type: 'input',
                name: 'apiKey',
                message: 'Enter API Key:',
                initial: config.embedding.apiKey
            }
        ]);

        config.mongoUrl = responses.mongoUrl;
        config.database = responses.database;
        config.collection = responses.collection;
        config.embedding.provider = responses.provider;
        config.embedding.apiKey = responses.apiKey;

        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
        console.log("✅ Configuration updated successfully!");
    });

program
    .command('clear-config')
    .description('Delete the MongoRAG configuration')
    .action(() => {
        if (fs.existsSync(CONFIG_PATH)) {
            fs.unlinkSync(CONFIG_PATH);
            console.log("🗑️ Configuration deleted successfully.");
        } else {
            console.warn("⚠️ No configuration file found.");
        }
    });

program
    .command('reset-config')
    .description('Reset the MongoRAG configuration by re-running setup')
    .action(async () => {
        console.log("🔄 Resetting configuration...\n");
        if (fs.existsSync(CONFIG_PATH)) {
            fs.unlinkSync(CONFIG_PATH);
        }
        await program.commands.find(cmd => cmd._name === 'init').action();
    });

/**
 * ✅ Formats document fields and limits large arrays
 */
function formatDocument(doc) {
    const formatted = {};
    for (const key in doc) {
        if (Array.isArray(doc[key]) && doc[key].length > 10) {
            formatted[key] = [...doc[key].slice(0, 10), `... +${doc[key].length - 10} more`];
        } else {
            formatted[key] = doc[key];
        }
    }
    return formatted;
}

program.parse();
