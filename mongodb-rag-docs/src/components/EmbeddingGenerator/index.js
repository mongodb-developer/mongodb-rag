import React, { useState } from 'react';

const EmbeddingGenerator = () => {
  const [texts, setTexts] = useState([
    "MongoDB is a document database with horizontal scaling and high availability.",
    "Vector search enables semantic searches using embedding similarity.",
    "RAG enhances LLM responses with external knowledge retrieval."
  ]);
  const [embeddingModel, setEmbeddingModel] = useState('openai');
  const [dimensions, setDimensions] = useState(embeddingModel === 'openai' ? 1536 : 384);
  const [embeddings, setEmbeddings] = useState(null);
  const [similarities, setSimilarities] = useState(null);
  const [codeEditor, setCodeEditor] = useState(
`// Function to generate embeddings
async function getEmbedding(text) {
  const response = await embeddingModel.embed(text);
  return response.embedding;
}

// Function to get embeddings for multiple texts
async function getEmbeddings(texts) {
  const embeddings = [];
  for (const text of texts) {
    const embedding = await getEmbedding(text);
    embeddings.push(embedding);
  }
  return embeddings;
}
`);

  // Simulate embeddings generation 
  const generateEmbeddings = () => {
    // Create pseudo-random embeddings based on text content
    // In real implementation, this would call an embedding model API
    
    // Helper function to create pseudo embeddings
    const createPseudoEmbedding = (text, dimensions) => {
      const result = [];
      let seed = 0;
      // Use a simple algorithm that creates somewhat consistent vectors for similar texts
      for (let i = 0; i < text.length; i++) {
        seed += text.charCodeAt(i);
      }
      
      for (let i = 0; i < dimensions; i++) {
        // Generate a float between -1 and 1 with some dependence on the text
        const value = (Math.sin(seed * (i + 1) * 0.1) + Math.sin(seed * (i + 2) * 0.2)) / 2;
        result.push(parseFloat(value.toFixed(4)));
      }
      
      return result;
    };
    
    // Generate embeddings for each text
    const generatedEmbeddings = texts.map(text => 
      createPseudoEmbedding(text, dimensions)
    );
    
    setEmbeddings(generatedEmbeddings);
    
    // Calculate cosine similarities between embeddings
    const similarityMatrix = [];
    for (let i = 0; i < generatedEmbeddings.length; i++) {
      const similarities = [];
      for (let j = 0; j < generatedEmbeddings.length; j++) {
        if (i === j) {
          similarities.push(1.0); // Self-similarity is always 1
        } else {
          // Calculate cosine similarity
          const similarity = calculateCosineSimilarity(
            generatedEmbeddings[i],
            generatedEmbeddings[j]
          );
          similarities.push(similarity);
        }
      }
      similarityMatrix.push(similarities);
    }
    
    setSimilarities(similarityMatrix);
  };
  
  // Function to calculate cosine similarity
  const calculateCosineSimilarity = (vecA, vecB) => {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    
    if (normA === 0 || normB === 0) {
      return 0;
    }
    
    return parseFloat((dotProduct / (normA * normB)).toFixed(4));
  };
  
  // Handle changing embedding model
  const handleModelChange = (model) => {
    setEmbeddingModel(model);
    // Update dimensions based on model
    if (model === 'openai') {
      setDimensions(1536);
    } else if (model === 'gte-small') {
      setDimensions(384);
    } else if (model === 'custom') {
      setDimensions(256);
    }
  };
  
  // Handle text changes
  const handleTextChange = (index, value) => {
    const newTexts = [...texts];
    newTexts[index] = value;
    setTexts(newTexts);
  };
  
  // Add a new text field
  const addTextField = () => {
    setTexts([...texts, ""]);
  };
  
  // Remove a text field
  const removeTextField = (index) => {
    const newTexts = [...texts];
    newTexts.splice(index, 1);
    setTexts(newTexts);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Embedding Generator</h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Embedding Model</label>
        <div className="flex space-x-4">
          <button 
            onClick={() => handleModelChange('openai')}
            className={`px-3 py-1 rounded ${embeddingModel === 'openai' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            OpenAI (1536d)
          </button>
          <button 
            onClick={() => handleModelChange('gte-small')}
            className={`px-3 py-1 rounded ${embeddingModel === 'gte-small' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            GTE-Small (384d)
          </button>
          <button 
            onClick={() => handleModelChange('custom')}
            className={`px-3 py-1 rounded ${embeddingModel === 'custom' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Custom (256d)
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="font-semibold">Text Inputs</label>
          <button 
            onClick={addTextField}
            className="text-blue-500 text-sm hover:underline"
          >
            + Add Text
          </button>
        </div>
        
        {texts.map((text, index) => (
          <div key={index} className="flex mb-2">
            <input 
              type="text" 
              value={text}
              onChange={(e) => handleTextChange(index, e.target.value)}
              className="flex-grow p-2 border rounded"
              placeholder="Enter text to embed"
            />
            {texts.length > 1 && (
              <button 
                onClick={() => removeTextField(index)}
                className="ml-2 px-3 bg-red-100 text-red-600 rounded hover:bg-red-200"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Embedding Code</label>
        <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm overflow-auto">
          <pre>{codeEditor}</pre>
        </div>
      </div>
      
      <button 
        onClick={generateEmbeddings}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Generate Embeddings
      </button>
      
      {embeddings && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Generated Embeddings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-left">Text</th>
                  <th className="p-2 border text-left">Embedding Preview</th>
                </tr>
              </thead>
              <tbody>
                {embeddings.map((embedding, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border">{texts[i].substring(0, 30)}{texts[i].length > 30 ? '...' : ''}</td>
                    <td className="p-2 border font-mono">
                      [{embedding.slice(0, 5).join(', ')}, ... {embedding.length - 5} more values]
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {similarities && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">Similarity Matrix</h3>
              <div className="overflow-x-auto bg-white p-2 border rounded">
                <table className="text-sm">
                  <thead>
                    <tr>
                      <th className="p-2"></th>
                      {texts.map((text, i) => (
                        <th key={i} className="p-2 border">Text {i+1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {similarities.map((row, i) => (
                      <tr key={i}>
                        <td className="p-2 border font-medium">Text {i+1}</td>
                        {row.map((similarity, j) => (
                          <td key={j} className={`p-2 border text-center ${i === j ? 'bg-blue-100' : similarity > 0.8 ? 'bg-green-100' : similarity > 0.5 ? 'bg-yellow-100' : 'bg-red-50'}`}>
                            {similarity.toFixed(4)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmbeddingGenerator;