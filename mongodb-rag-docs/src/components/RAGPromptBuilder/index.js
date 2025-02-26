import React, { useState } from 'react';

const RAGPromptBuilder = () => {
  const [userQuery, setUserQuery] = useState('What are the security features of MongoDB Atlas?');
  const [retrievedDocs, setRetrievedDocs] = useState([
    {
      content: "MongoDB Atlas provides multiple layers of security for your database: Network isolation with VPC peering, IP whitelisting, Advanced authentication, Field-level encryption, RBAC (Role-Based Access Control), and LDAP integration.",
      score: 0.92,
      source: "mongodb-atlas.md"
    },
    {
      content: "MongoDB Atlas Security Features include advanced authentication methods, network isolation, and encryption at rest and in transit.",
      score: 0.89,
      source: "security-overview.md"
    }
  ]);
  
  const [promptType, setPromptType] = useState('basic');
  const [promptSettings, setPromptSettings] = useState({
    includeScores: true,
    instructToUseContext: true,
    instructToCite: true,
    instructToSayIDK: true
  });
  
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [generatedAnswer, setGeneratedAnswer] = useState('');
  
  // Generate basic prompt
  const generateBasicPrompt = () => {
    // Combine retrieved documents into context
    const context = retrievedDocs.map(doc => {
      if (promptSettings.includeScores) {
        return `Source: ${doc.source} (Score: ${doc.score.toFixed(2)})\nContent: ${doc.content}`;
      } else {
        return `Source: ${doc.source}\nContent: ${doc.content}`;
      }
    }).join('\n\n');
    
    // Build system instruction
    let systemInstruction = "You are a helpful assistant.";
    
    if (promptSettings.instructToUseContext) {
      systemInstruction += " Answer the user's question based ONLY on the provided context.";
    }
    
    if (promptSettings.instructToSayIDK) {
      systemInstruction += " If the context doesn't contain relevant information, say \"I don't have enough information to answer that question.\"";
    }
    
    if (promptSettings.instructToCite) {
      systemInstruction += " Always cite your sources at the end of your answer.";
    }
    
    // Format the entire prompt
    const prompt = `${systemInstruction}\n\nContext:\n${context}\n\nQuestion: ${userQuery}`;
    
    return prompt;
  };
  
  // Generate chat format prompt
  const generateChatPrompt = () => {
    // Combine retrieved documents into context
    const context = retrievedDocs.map(doc => {
      if (promptSettings.includeScores) {
        return `Source: ${doc.source} (Score: ${doc.score.toFixed(2)})\nContent: ${doc.content}`;
      } else {
        return `Source: ${doc.source}\nContent: ${doc.content}`;
      }
    }).join('\n\n');
    
    // Build system message
    let systemContent = "You are a helpful assistant.";
    
    if (promptSettings.instructToUseContext) {
      systemContent += " Answer the user's question based ONLY on the provided context.";
    }
    
    if (promptSettings.instructToSayIDK) {
      systemContent += " If the context doesn't contain relevant information, say \"I don't have enough information to answer that question.\"";
    }
    
    if (promptSettings.instructToCite) {
      systemContent += " Always cite your sources at the end of your answer.";
    }
    
    // Format as chat messages
    const messages = [
      {
        role: "system",
        content: systemContent
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion: ${userQuery}`
      }
    ];
    
    return JSON.stringify(messages, null, 2);
  };
  
  // Handle generation of prompt
  const handleGeneratePrompt = () => {
    const prompt = promptType === 'basic' ? generateBasicPrompt() : generateChatPrompt();
    setGeneratedPrompt(prompt);
    
    // Simulate LLM response
    const simulatedResponses = {
      'What are the security features of MongoDB Atlas?': 
        "Based on the provided context, MongoDB Atlas offers several security features:\n\n1. Network isolation with VPC peering\n2. IP whitelisting\n3. Advanced authentication\n4. Field-level encryption\n5. Role-Based Access Control (RBAC)\n6. LDAP integration\n7. Encryption at rest and in transit\n\nThese features provide multiple layers of security for your database in MongoDB Atlas.\n\nSources: mongodb-atlas.md, security-overview.md",
      
      'How does RAG reduce hallucinations?': 
        "I don't have enough information in the provided context to answer this question about how RAG reduces hallucinations."
    };
    
    // Get a matching response or default
    const answer = simulatedResponses[userQuery] || 
      "Based on the provided context, I can tell you that MongoDB Atlas provides comprehensive security features including network isolation, authentication methods, and encryption options to protect your data.\n\nSources: mongodb-atlas.md, security-overview.md";
    
    setGeneratedAnswer(answer);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-bold mb-4">RAG Prompt Builder</h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">User Query</label>
        <input 
          type="text" 
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Retrieved Documents</label>
        <div className="bg-white border rounded p-2 max-h-40 overflow-y-auto">
          {retrievedDocs.map((doc, i) => (
            <div key={i} className="mb-2 p-2 border-b last:border-b-0">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Source: {doc.source}</span>
                <span className="text-blue-600">Score: {doc.score.toFixed(2)}</span>
              </div>
              <p className="text-sm">{doc.content}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center mb-3">
          <span className="mr-3 font-semibold">Prompt Format:</span>
          <div className="space-x-3">
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                checked={promptType === 'basic'}
                onChange={() => setPromptType('basic')}
                className="mr-1"
              />
              Basic
            </label>
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                checked={promptType === 'chat'}
                onChange={() => setPromptType('chat')}
                className="mr-1"
              />
              Chat Messages
            </label>
          </div>
        </div>
        
        <div className="ml-2 space-y-2">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={promptSettings.includeScores}
              onChange={(e) => setPromptSettings({...promptSettings, includeScores: e.target.checked})}
              className="mr-2"
            />
            Include relevance scores
          </label>
          
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={promptSettings.instructToUseContext}
              onChange={(e) => setPromptSettings({...promptSettings, instructToUseContext: e.target.checked})}
              className="mr-2"
            />
            Instruct to use only provided context
          </label>
          
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={promptSettings.instructToCite}
              onChange={(e) => setPromptSettings({...promptSettings, instructToCite: e.target.checked})}
              className="mr-2"
            />
            Instruct to cite sources
          </label>
          
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={promptSettings.instructToSayIDK}
              onChange={(e) => setPromptSettings({...promptSettings, instructToSayIDK: e.target.checked})}
              className="mr-2"
            />
            Instruct to admit when information is missing
          </label>
        </div>
      </div>
      
      <button 
        onClick={handleGeneratePrompt}
        className="px-4 py-2 mb-4 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Generate Prompt
      </button>
      
      {generatedPrompt && (
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Generated Prompt</label>
          <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm overflow-auto max-h-60">
            <pre>{generatedPrompt}</pre>
          </div>
        </div>
      )}
      
      {generatedAnswer && (
        <div>
          <label className="block mb-2 font-semibold">Simulated LLM Response</label>
          <div className="bg-white border p-3 rounded">
            <p className="whitespace-pre-line">{generatedAnswer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RAGPromptBuilder;