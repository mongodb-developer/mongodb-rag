---
id: setup-mongodb
title: 👐 Setting up MongoDB Atlas
---

import BrowserWindow from '@site/src/components/BrowserWindow';
import Screenshot from '@site/src/components/Screenshot';

# Setting up MongoDB Atlas for Vector Search

In this section, you'll create and configure a MongoDB Atlas cluster with Vector Search capabilities to serve as the foundation for your RAG application.

## Creating a MongoDB Atlas Account

If you don't already have a MongoDB Atlas account, you'll need to create one:

1. Go to [MongoDB Atlas](https://mdb.link/rag-signup)
2. Sign up for a free account
3. Complete the initial setup process

## Deploying a MongoDB Atlas Cluster

Once you have an account, follow these steps to create a new cluster:

1. Log in to your [MongoDB Atlas account](https://cloud.mongodb.com)
2. Click the "Build a Database" button
3. Choose your preferred cloud provider (AWS, GCP, or Azure)
4. Select the "M0 Free Tier" cluster for this workshop
5. Choose a region close to your location
6. Click "Create" to deploy your cluster

insert screenshot here

While your cluster is being created (which takes a few minutes), let's configure access settings.

## Configuring Database Access

You'll need to create a database user to connect to your cluster:

1. In the sidebar, click "Database Access" under SECURITY
2. Click "Add New Database User"
3. Enter a username and password (save these credentials!)
4. Select "Built-in Role" and choose "Read and write to any database"
5. Click "Add User"

:::caution
Store your database credentials securely. You'll need them to connect to your cluster.
:::

## Configuring Network Access

Next, configure network access to allow connections from your development environment:

1. In the sidebar, click "Network Access" under SECURITY
2. Click "Add IP Address"
3. For this workshop, select "Allow Access from Anywhere" (not recommended for production)
4. Click "Confirm"

## Loading Sample Data (Optional)

MongoDB Atlas provides sample datasets that you can use for this workshop:

1. On your cluster's overview page, click "Browse Collections"
2. Click "Load Sample Dataset"
3. Wait for the sample data to be loaded

insert screenshot here

## Getting Your Connection String

To connect to your cluster from your application, you'll need your connection string:

1. On your cluster's overview page, click "Connect"
2. Select "Connect your application"
3. Choose "Node.js" as your driver and the appropriate version
4. Copy the connection string
5. Replace `<password>` with your database user's password

Save this connection string - you'll use it in the next sections.

## Creating a .env File

Let's create a `.env` file to store your configuration. Create a new file named `.env` in your project directory with the following content:

```bash
MONGODB_URI=mongodb+srv://username:password@clustername.mongodb.net/
EMBEDDING_PROVIDER=openai  # Can be openai, ollama, etc.
EMBEDDING_API_KEY=your-api-key-here  # Your OpenAI API key or leave empty for Ollama
EMBEDDING_MODEL=text-embedding-3-small  # For OpenAI or your preferred model
```

Replace the placeholder values with your actual credentials.

### For the CLI Gurus

If you're a CLI guru, you can use the `mdb` CLI to create a new cluster and connect to it.

```bash
npx mongodb-rag init
```

This will prompt you for all of the variables required to build a RAG App.

Once you have the .mongodb-rag.json file created, you can also create a .env from the same values using the following:

```bash
npx mongodb-rag create-env
```

## Testing Your Connection

Let's verify that your connection is working. Create a file named `test-connection.js`:

```javascript
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas');
    
    const databases = await client.db().admin().listDatabases();
    console.log('Available databases:');
    databases.databases.forEach(db => console.log(` - ${db.name}`));
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    await client.close();
  }
}

testConnection();
```

Run the script with:

```bash
node test-connection.js
```

If you see "Successfully connected to MongoDB Atlas" and a list of databases, your connection is working correctly!

## Next Steps

Now that you have set up MongoDB Atlas with Vector Search capabilities, you're ready to create vector embeddings and store them in your cluster.
