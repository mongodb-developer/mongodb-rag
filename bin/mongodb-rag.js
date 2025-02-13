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
import { execSync } from 'child_process';

const isTestMode = process.env.NODE_ENV === 'test';
const isNonInteractive = process.env.NONINTERACTIVE === 'true';
const enquirer = new Enquirer(); 

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isValidMongoURI = (uri) => {
    const atlasPattern = new RegExp(
        /^mongodb\+srv:\/\/([^:@]+):([^@]+)@([\w.-]+)\.mongodb\.net(\/[\w-]*)?(\?.*)?$/
    );
    return atlasPattern.test(uri);
};

const promptWithValidation = async (promptConfig) => {
    while (true) {
        const response = await enquirer.prompt(promptConfig);
        const userInput = response[promptConfig.name];

        if (userInput === '?') {
            console.log(chalk.yellow(`ℹ️ Help: ${promptConfig.helpMessage}\n`));
            continue;
        }
        if (promptConfig.validate && promptConfig.validate(userInput) !== true) {
            console.log(chalk.red(`❌ ${promptConfig.validate(userInput)}`));
            continue;
        }
        return userInput;
    }
};


const CONFIG_PATH = process.env.NODE_ENV === "test"
    ? path.join(process.cwd(), ".mongodb-rag.test.json")
    : path.join(process.cwd(), ".mongodb-rag.json");

console.log(chalk.blue("🔍 Debug: Using CONFIG_PATH =>"), CONFIG_PATH);

function getOllamaModels() {
    try {
        const output = execSync('ollama list', { encoding: 'utf-8' });
        return output.split('\n').filter(line => line.trim()).map(line => line.split(' ')[0]);
    } catch (error) {
        return [];
    }
}

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
            close: async () => { }
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
    const hasBasicConfig = config.mongoUrl && 
                          config.database && 
                          config.collection && 
                          config.embedding;

    if (!hasBasicConfig) return false;

    // For Ollama provider
    if (config.embedding.provider === 'ollama') {
        return config.embedding.baseUrl && 
               config.embedding.model;
    }

    // For other providers (OpenAI, DeepSeek)
    return config.embedding.apiKey;
}

program
    .command('create-rag-app <projectName>')
    .description('Scaffold a new CRUD RAG application with MongoDB and Vector Search')
    .action((projectName) => {
        createRagApp(projectName);
    });


// Update the init command to support Ollama
program
    .command('init')
    .description('Initialize MongoRAG configuration')
    .action(async () => {
        console.log(chalk.cyan.bold('🔧 Setting up MongoRAG configuration...\n'));

        const responses = {};

        // MongoDB Connection String
        responses.mongoUrl = await promptWithValidation({
            type: 'input',
            name: 'mongoUrl',
            message: 'Enter MongoDB Connection String:',
            validate: (input) => isValidMongoURI(input) ? true : 'Invalid MongoDB Atlas connection string.',
            helpMessage: "MongoDB Atlas connection string format:\n" +
                "  mongodb+srv://username:password@cluster.mongodb.net/database\n" +
                "- Must be a MongoDB Atlas cluster (starts with mongodb+srv://)\n" +
                "- Include your username and password\n" +
                "- Should end with your cluster address (.mongodb.net)\n" +
                "- Can include optional parameters (e.g. ?retryWrites=true&w=majority)"
        });

        // Database Name
        responses.database = await promptWithValidation({
            type: 'input',
            name: 'database',
            message: 'Enter Database Name:',
            validate: (input) => {
                if (!input || input.trim().length === 0) return 'Database name cannot be empty';
                if (input.includes(' ')) return 'Database name cannot contain spaces';
                if (input.length > 63) return 'Database name cannot exceed 63 characters';
                return true;
            },
            helpMessage: "Database name requirements:\n" +
                "- Cannot be empty\n" +
                "- Must not contain spaces\n" +
                "- Maximum length of 63 characters\n" +
                "- Will be created if it doesn't exist\n" +
                "- Common names: 'vectordb', 'ragstore', 'embeddings'"
        });

        // Collection Name
        responses.collection = await promptWithValidation({
            type: 'input',
            name: 'collection',
            message: 'Enter Collection Name:',
            validate: (input) => {
                if (!input || input.trim().length === 0) return 'Collection name cannot be empty';
                if (input.includes(' ')) return 'Collection name cannot contain spaces';
                if (input.length > 255) return 'Collection name cannot exceed 255 characters';
                return true;
            },
            helpMessage: "Collection name requirements:\n" +
                "- Cannot be empty\n" +
                "- Must not contain spaces\n" +
                "- Maximum length of 255 characters\n" +
                "- Will store your embedded documents\n" +
                "- Common names: 'documents', 'embeddings', 'vectors'"
        });

        // Embedding Provider
        responses.provider = await promptWithValidation({
            type: 'select',
            name: 'provider',
            message: 'Select an Embedding Provider:',
            choices: ['openai', 'deepseek', 'ollama'],
            helpMessage: "Available embedding providers:\n" +
                "- OpenAI: Most popular, requires API key, uses text-embedding-3-small\n" +
                "- DeepSeek: Alternative provider, requires API key\n" +
                "- Ollama: Local deployment, no API key needed, requires Ollama installation\n" +
                "\nConsiderations:\n" +
                "- OpenAI provides consistent, high-quality embeddings\n" +
                "- DeepSeek offers competitive pricing\n" +
                "- Ollama allows for local processing without API costs"
        });

        // Get provider-specific configuration
        if (responses.provider === 'openai' || responses.provider === 'deepseek') {
            responses.apiKey = await promptWithValidation({
                type: 'password',
                name: 'apiKey',
                message: `Enter your ${responses.provider === 'openai' ? 'OpenAI' : 'DeepSeek'} API Key:`,
                validate: (input) => input && input.length > 0 ? true : 'API key is required',
                helpMessage: responses.provider === 'openai' 
                    ? "OpenAI API key format: sk-....\n- Get your key from: https://platform.openai.com/api-keys"
                    : "DeepSeek API key format: dk-....\n- Get your key from DeepSeek's platform"
            });
        } else if (responses.provider === 'ollama') {
            responses.model = await promptWithValidation({
                type: 'input',
                name: 'model',
                message: 'Enter the Ollama model name:',
                initial: 'llama2',
                validate: (input) => input && input.length > 0 ? true : 'Model name is required',
                helpMessage: "Ollama model requirements:\n" +
                    "- Must be installed locally via Ollama\n" +
                    "- Common models: llama2, codellama, mistral\n" +
                    "- Check available models with: ollama list"
            });
        }

        // Vector Search Index Configuration
        const indexParams = await getIndexParams({
            type: 'input',
            name: 'indexName',
            message: 'Enter the name for your Vector Search Index:',
            initial: 'vector_index',
            validate: (input) => {
                if (!input || input.trim().length === 0) return 'Index name cannot be empty';
                if (input.includes(' ')) return 'Index name cannot contain spaces';
                return true;
            },
            helpMessage: "Vector Search Index requirements:\n" +
                "- Cannot be empty or contain spaces\n" +
                "- Will be created automatically\n" +
                "- Used for similarity search operations\n" +
                "- Default name 'vector_index' is recommended"
        });

        // Build the configuration object
        const newConfig = {
            mongoUrl: responses.mongoUrl,
            database: responses.database,
            collection: responses.collection,
            embedding: {
                provider: responses.provider,
                ...(responses.apiKey && { apiKey: responses.apiKey }),
                ...(responses.model && { model: responses.model }),
                dimensions: 1536,
                batchSize: 100
            },
            search: { maxResults: 5, minScore: 0.7 },
            indexName: indexParams.indexName
        };

        // Save the configuration
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2));
        console.log(chalk.green(`✅ Configuration saved to ${CONFIG_PATH}`));

        // Provider-specific follow-up instructions
        if (responses.provider === 'ollama') {
            console.log(chalk.yellow('\n📝 Additional steps for Ollama setup:'));
            console.log(chalk.cyan('1. Ensure Ollama is running (`ollama list`)'));
            console.log(chalk.cyan(`2. Verify model '${responses.model}' is installed`));
            console.log(chalk.cyan('3. Run `npx mongodb-rag test-connection` to validate setup\n'));
        } else {
            console.log(chalk.cyan('\n🔍 Next steps:'));
            console.log(chalk.cyan('1. Run `npx mongodb-rag test-connection` to verify your setup'));
            console.log(chalk.cyan('2. Run `npx mongodb-rag create-index` to create your vector search index'));
        }
    });

    program
    .command('test-connection')
    .description('Test the connection to the embedding provider')
    .action(async () => {
        if (!isConfigValid(config)) {
            console.error(chalk.red("❌ Configuration missing. Run 'npx mongodb-rag init' first."));
            process.exit(1);
        }

        if (config.embedding.provider === 'ollama') {
            try {
                console.log(chalk.cyan('🔄 Testing Ollama connection...'));
                const response = await fetch(`${config.embedding.baseUrl}/api/tags`);
                if (!response.ok) throw new Error(`Failed to connect: ${response.statusText}`);

                const data = await response.json();
                const models = data.models || [];
                const modelExists = models.some(model => model.name === config.embedding.model);

                if (modelExists) {
                    console.log(chalk.green(`✅ Successfully connected to Ollama and model '${config.embedding.model}' is available`));
                } else {
                    console.log(chalk.yellow(`⚠️ Ollama model '${config.embedding.model}' not found`));
                }
            } catch (error) {
                console.error(chalk.red('❌ Ollama connection failed:'), error.message);
                console.log(chalk.yellow('\nTroubleshooting:'));
                console.log(chalk.cyan('1. Ensure Ollama is running'));
                console.log(chalk.cyan(`2. Verify the base URL: ${config.embedding.baseUrl}`));
                console.log(chalk.cyan('3. Check available models with `ollama list`'));
                process.exit(1);
            }
        } else {
            try {
                const rag = new MongoRAG(config);
                await rag._initializeEmbeddingProvider();
                console.log(chalk.green(`✅ Successfully connected to ${config.embedding.provider}`));
            } catch (error) {
                console.error(chalk.red(`❌ Failed to connect to ${config.embedding.provider}:`), error.message);
                process.exit(1);
            }
        }
    });

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
    .description('Display all Vector Search indexes for the configured MongoDB collection')
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

            // Use $listSearchIndexes aggregation stage to get vector search indexes
            const searchIndexes = await collection.aggregate([
                { $listSearchIndexes: {} }
            ]).toArray();

            // Get regular indexes as well for completeness
            const regularIndexes = await collection.indexes();

            if (searchIndexes.length === 0 && regularIndexes.length === 0) {
                console.log(chalk.yellow("⚠️ No indexes found in this collection."));
                return;
            }

            // Display Vector Search Indexes
            if (searchIndexes.length > 0) {
                console.log(chalk.bold("\n🔍 Vector Search Indexes:"));
                searchIndexes.forEach((index, i) => {
                    console.log(chalk.green(`${i + 1}. 🔹 Index Name: ${index.name}`));
                    console.log(`   📌 Type: ${chalk.magenta('Vector Search')}`);
                    console.log(`   🎯 Latest Definition: ${chalk.yellow(JSON.stringify(index.latestDefinition, null, 2))}`);
                    console.log(`   📅 Created At: ${chalk.blue(new Date(index.latestDefinitionVersion.createdAt).toLocaleString())}`);
                    console.log(`   ✅ Status: ${chalk.green(index.status)}`);
                    console.log(`   🎯 Queryable: ${index.queryable ? chalk.green('Yes') : chalk.yellow('No')}`);

                    // Display shard status if available
                    if (index.statusDetail && index.statusDetail.length > 0) {
                        console.log(`   📊 Shard Status:`);
                        index.statusDetail.forEach(shard => {
                            console.log(`     ${chalk.blue(shard.hostname)}: ${chalk.green(shard.status)}`);
                        });
                    }

                    console.log(chalk.gray("---------------------------------------------------"));
                });
            }

            // Display Regular Indexes
            if (regularIndexes.length > 0) {
                console.log(chalk.bold("\n📄 Regular Indexes:"));
                regularIndexes.forEach((index, i) => {
                    // Skip _id_ index as it's created by default
                    if (index.name === '_id_') return;

                    console.log(chalk.green(`${i + 1}. 🔹 Index Name: ${index.name}`));
                    console.log(`   📌 Type: ${chalk.magenta('Standard')}`);
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
