// jest-setup.js
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Silence console output during tests
console.log = jest.fn();
console.error = jest.fn();
console.warn = jest.fn();
