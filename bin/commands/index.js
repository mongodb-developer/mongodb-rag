// bin/commands/index.js
// Configuration commands
export {
    showConfig,
    editConfig,
    clearConfig,
    resetConfig,
    setIndexName
  } from './config/index.js';
  
  // Index commands
  export {
    createIndex,
    showIndexes,
    deleteIndex,
    testIndex
  } from './index/index.js';
  
  // Data manipulation commands
  export {
    searchDocuments,
    ingestData,
    generateEmbedding
  } from './data/index.js';
  
  // Initialization commands
  export {
    init,
    testConnection
  } from './init/index.js';