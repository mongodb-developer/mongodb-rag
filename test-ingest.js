import { MongoRAG } from 'mongodb-rag';
import dotenv from 'dotenv';

dotenv.config();

const rag = new MongoRAG({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/ragtest',
    database: 'ragtest',
    collection: 'documents',
    embedding: {
        provider: 'ollama',
        baseUrl: 'http://localhost:11434',
        model: 'llama3'
    }
});

const documents = [
    { id: 'doc1', content: 'MongoDB Atlas Vector Search enables semantic search.' },
    { id: 'doc2', content: 'Vector similarity search uses embeddings to find related content.' }
];

(async () => {
    await rag.connect();
    const result = await rag.ingestBatch(documents);
    console.log('Ingestion Result:', result);
    await rag.close();
})();

