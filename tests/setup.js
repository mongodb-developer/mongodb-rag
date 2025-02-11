// tests/setup.js
import { jest, describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import dotenv from "dotenv";
dotenv.config();

// Make jest available globally
global.jest = jest;

// Mock environment variables
// process.env.MONGODB_URI = 'mongodb+srv://...';
// process.env.OPENAI_API_KEY = "sk-proj-...";
// Set a longer timeout for all tests
jest.setTimeout(10000);