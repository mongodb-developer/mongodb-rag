// bin/utils/validation.js
export function validateMongoURI(uri) {
    const atlasPattern = new RegExp(
      /^mongodb\+srv:\/\/([^:@]+):([^@]+)@([\w.-]+)\.mongodb\.net(\/[\w-]*)?(\?.*)?$/
    );
    return atlasPattern.test(uri);
  }
  
  export function isConfigValid(config) {
    if (!config || typeof config !== 'object') {
      console.error('Configuration is invalid: - not object - ', config);

      return false;
    }
    
    // Check MongoDB configuration
    if (!config.mongoUrl || !config.database || !config.collection) return false;
    
    // Check embedding configuration
    if (!config.embedding || 
        !config.embedding.provider || 
        !config.embedding.model || 
        !config.embedding.dimensions) return false;
        
    // Check provider-specific requirements
    if (config.embedding.provider === 'ollama' && !config.embedding.baseUrl) {
      return false;
    }
    
    return true;
  }
  
  export function validateIndexName(name) {
    if (!name || name.trim().length === 0) return false;
    if (name.includes(' ')) return false;
    return true;
  }