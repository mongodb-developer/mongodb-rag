// tests/globalSetup.js
export default async function() {
    process.env.NODE_ENV = 'test';
    process.env.OPENAI_API_KEY = 'test-key';
    process.env.MONGODB_URI = 'mongodb://mock:27017';
    
    // Increase Jest timeout
    jest.setTimeout(30000);
  }