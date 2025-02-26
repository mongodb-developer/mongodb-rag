import React, { useState } from 'react';

const VectorSearchDemo = () => {
  const [query, setQuery] = useState('What security features does MongoDB Atlas offer?');
  const [filterOptions, setFilterOptions] = useState({ useFilter: false, productName: 'MongoDB Atlas' });
  const [codeView, setCodeView] = useState('pipeline');
  const [searchResults, setSearchResults] = useState(null);
  
  // Sample documents to search through
  const sampleDocuments = [
    {
      content: "MongoDB Atlas provides multiple layers of security for your database: Network isolation with VPC peering, IP whitelisting, Advanced authentication, Field-level encryption, RBAC (Role-Based Access Control), and LDAP integration.",
      score: 0.92,
      metadata: { 
        source: "mongodb-atlas.md",
        productName: "MongoDB Atlas",
        contentType: "Documentation"
      }
    },
    {
      content: "MongoDB Atlas Security Features include advanced authentication methods, network isolation, and encryption at rest and in transit.",
      score: 0.89,
      metadata: { 
        source: "security-overview.md",
        productName: "MongoDB Atlas",
        contentType: "Tutorial" 
      }
    },
    {
      content: "MongoDB Atlas Vector Search enables you to build vector search applications by storing embeddings and performing k-nearest neighbor (k-NN) search.",
      score: 0.72,
      metadata: { 
        source: "mongodb-atlas.md", 
        productName: "MongoDB Atlas",
        contentType: "Documentation" 
      }
    },
    {
      content: "When implementing RAG, several factors must be considered: Knowledge Base Design, Embedding Strategy, Chunking Approach, and Retrieval Algorithms.",
      score: 0.64,
      metadata: { 
        source: "rag-overview.md",
        productName: "RAG Framework",
        contentType: "Documentation" 
      }
    }
  ];
  
  // Generate pipeline code based on filter options
  const generatePipelineCode = () => {
    if (filterOptions.useFilter) {
      return `// Search pipeline with metadata filter
const pipeline = [
  {
    $vectorSearch: {
      index: "${filterOptions.useFilter ? "vector_search_index_with_filter" : "vector_search_index"}",
      queryVector: embedding,
      path: "embedding",
      numCandidates: 100,
      limit: 5,
      filter: {
        "metadata.productName": "${filterOptions.productName}"
      }
    }
  },
  {
    $project: {
      _id: 0,
      content: 1,
      metadata: 1,
      score: { $meta: "vectorSearchScore" }
    }
  }
];`;
    } else {
      return `// Basic vector search pipeline
const pipeline = [
  {
    $vectorSearch: {
      index: "vector_search_index",
      queryVector: embedding,
      path: "embedding",
      numCandidates: 100,
      limit: 5
    }
  },
  {
    $project: {
      _id: 0,
      content: 1,
      metadata: 1,
      score: { $meta: "vectorSearchScore" }
    }
  }
];`;
    }
  };
  
  // Generate function code
  const generateFunctionCode = () => {
    return `async function vectorSearch(query, options = {}) {
  // Generate embedding for query
  const embedding = await getEmbedding(query);
  
  // Create pipeline
  ${generatePipelineCode()}
  
  // Execute aggregation
  const results = await collection.aggregate(pipeline).toArray();
  return results;
}`;
  };
  
  // Handle search execution
  const handleSearch = () => {
    // Simulate search results
    let results;
    
    if (filterOptions.useFilter) {
      // Filter results by productName
      results = sampleDocuments.filter(doc => 
        doc.metadata.productName === filterOptions.productName
      );
    } else {
      // Return all sample documents
      results = [...sampleDocuments];
    }
    
    // Simulate score adjustment based on query relevance
    results = results.map(doc => {
      // Simple keyword match scoring adjustment
      const keywords = query.toLowerCase().split(' ');
      let keywordBoost = 0;
      
      keywords.forEach(keyword => {
        if (doc.content.toLowerCase().includes(keyword)) {
          keywordBoost += 0.05; // Small boost for each keyword match
        }
      });
      
      // Apply the boost, but cap at 0.99
      const adjustedScore = Math.min(doc.score + keywordBoost, 0.99);
      
      return {
        ...doc,
        score: adjustedScore
      };
    });
    
    // Sort by score
    results.sort((a, b) => b.score - a.score);
    
    setSearchResults({
      query,
      results: results.slice(0, 5), // Take top 5
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Interactive Vector Search</h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Query</label>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <input 
            type="checkbox" 
            id="useFilter"
            checked={filterOptions.useFilter}
            onChange={(e) => setFilterOptions({...filterOptions, useFilter: e.target.checked})}
            className="mr-2"
          />
          <label htmlFor="useFilter" className="font-semibold">Apply Metadata Filter</label>
        </div>
        
        {filterOptions.useFilter && (
          <div className="ml-6 mt-2">
            <label className="block mb-1">Product Name</label>
            <select 
              value={filterOptions.productName}
              onChange={(e) => setFilterOptions({...filterOptions, productName: e.target.value})}
              className="p-1 border rounded"
            >
              <option value="MongoDB Atlas">MongoDB Atlas</option>
              <option value="RAG Framework">RAG Framework</option>
            </select>
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <div className="flex space-x-2 mb-2">
          <button 
            onClick={() => setCodeView('pipeline')}
            className={`px-3 py-1 text-sm rounded ${codeView === 'pipeline' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Pipeline View
          </button>
          <button 
            onClick={() => setCodeView('function')}
            className={`px-3 py-1 text-sm rounded ${codeView === 'function' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Function View
          </button>
        </div>
        
        <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm overflow-auto">
          <pre>{codeView === 'pipeline' ? generatePipelineCode() : generateFunctionCode()}</pre>
        </div>
      </div>
      
      <button 
        onClick={handleSearch}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Execute Search
      </button>
      
      {searchResults && (
        <div className="mt-4 border rounded bg-white">
          <div className="p-3 bg-gray-100 border-b">
            <h3 className="font-bold">Search Results</h3>
            <div className="text-sm text-gray-500">Query: "{searchResults.query}"</div>
          </div>
          
          <div className="p-3">
            {searchResults.results.map((result, i) => (
              <div key={i} className="mb-3 p-3 border rounded">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-sm">Result {i+1}</span>
                  <span className="text-sm bg-blue-100 px-2 py-0.5 rounded">
                    Score: {result.score.toFixed(4)}
                  </span>
                </div>
                <p className="text-sm mb-2">{result.content}</p>
                <div className="text-xs text-gray-500">
                  Source: {result.metadata.source} | Product: {result.metadata.productName} | Type: {result.metadata.contentType}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VectorSearchDemo;