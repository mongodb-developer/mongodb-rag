// bin/utils/mongodb.js
import { MongoClient } from 'mongodb';

const isTestMode = process.env.NODE_ENV === 'test';

export async function getMongoClient(url) {
    if (isTestMode) {
      console.log("✅ Jest is in test mode - using mock MongoDB client.");
      const mockModule = await import('../../tests/mocks/mongodbMock.js');
      return mockModule.mockClient;  // ✅ Correctly import mock client
    }
  
    const client = new MongoClient(url);
    await client.connect();
    return client;
  }