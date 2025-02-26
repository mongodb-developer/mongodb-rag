// InteractiveChunking.jsx
import React, { useState } from 'react';

// Inline styles to ensure proper rendering
const styles = {
  container: {
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    marginBottom: '20px',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
  },
  header: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#333'
  },
  strategySelector: {
    marginBottom: '16px'
  },
  button: {
    padding: '8px 16px',
    marginRight: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  activeButton: {
    backgroundColor: '#3182ce',
    color: 'white'
  },
  inactiveButton: {
    backgroundColor: '#e2e8f0',
    color: '#333'
  },
  controlRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px'
  },
  controlGroup: {
    flex: 1
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  textarea: {
    width: '100%',
    height: '150px',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '14px',
    marginBottom: '16px'
  },
  runButton: {
    padding: '10px 20px',
    backgroundColor: '#38a169',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  results: {
    marginTop: '20px',
    padding: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: 'white'
  },
  resultHeader: {
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  chunkList: {
    marginTop: '16px'
  },
  chunk: {
    padding: '12px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    marginBottom: '8px',
    backgroundColor: '#f5f5f5'
  },
  chunkHeader: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '4px'
  },
  chunkContent: {
    fontFamily: 'monospace',
    fontSize: '13px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
};

const InteractiveChunking = () => {
  const [strategy, setStrategy] = useState('sliding');
  const [maxChunkSize, setMaxChunkSize] = useState(500);
  const [overlap, setOverlap] = useState(50);
  const [result, setResult] = useState(null);

  const sampleDocument = {
    id: 'sample-doc',
    content: `# MongoDB Atlas Vector Search

MongoDB Atlas Vector Search is a fully managed service that helps developers build vector search into their applications.

## Key Features

Vector search in MongoDB Atlas provides several key capabilities:

1. Integration with Atlas: Seamlessly works with your existing MongoDB Atlas deployment.
2. Multiple similarity metrics: Supports cosine similarity, dot product, and Euclidean distance.
3. Approximate nearest neighbor algorithms: Uses efficient indexing for fast searches.
4. Hybrid search capabilities: Combine vector search with traditional MongoDB queries.`,
    metadata: {
      source: 'documentation',
      type: 'markdown'
    }
  };

  const [document, setDocument] = useState(JSON.stringify(sampleDocument, null, 2));

  const handleRun = () => {
    // Simulated chunking results based on strategy
    let chunkCount;
    let chunks = [];
    
    const parsedDoc = JSON.parse(document);
    const content = parsedDoc.content;
    const contentLength = content.length;
    
    if (strategy === 'sliding') {
      // Simple sliding window simulation
      chunkCount = Math.ceil((contentLength - overlap) / (maxChunkSize - overlap));
      for (let i = 0; i < chunkCount; i++) {
        const start = i * (maxChunkSize - overlap);
        const end = Math.min(start + maxChunkSize, contentLength);
        chunks.push({
          content: content.substring(start, end),
          metadata: { ...parsedDoc.metadata, chunkIndex: i }
        });
      }
    } else if (strategy === 'semantic') {
      // Semantic chunking simulation (paragraph-based)
      const paragraphs = content.split('\n\n');
      let currentChunk = '';
      
      for (const para of paragraphs) {
        if (currentChunk.length + para.length <= maxChunkSize) {
          currentChunk += (currentChunk ? '\n\n' : '') + para;
        } else {
          chunks.push({
            content: currentChunk,
            metadata: { ...parsedDoc.metadata }
          });
          currentChunk = para;
        }
      }
      
      if (currentChunk) {
        chunks.push({
          content: currentChunk,
          metadata: { ...parsedDoc.metadata }
        });
      }
    }
    
    setResult({
      chunkCount: chunks.length,
      chunks: chunks,
      strategy: strategy
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Interactive Document Chunking</h2>
      
      <div style={styles.strategySelector}>
        <label style={styles.label}>Chunking Strategy</label>
        <div>
          <button 
            onClick={() => setStrategy('sliding')}
            style={{
              ...styles.button,
              ...(strategy === 'sliding' ? styles.activeButton : styles.inactiveButton)
            }}
          >
            Sliding Window
          </button>
          <button 
            onClick={() => setStrategy('semantic')}
            style={{
              ...styles.button,
              ...(strategy === 'semantic' ? styles.activeButton : styles.inactiveButton)
            }}
          >
            Semantic
          </button>
        </div>
      </div>
      
      <div style={styles.controlRow}>
        <div style={styles.controlGroup}>
          <label style={styles.label}>Max Chunk Size (chars)</label>
          <input 
            type="number" 
            value={maxChunkSize}
            onChange={(e) => setMaxChunkSize(parseInt(e.target.value))}
            style={styles.input}
          />
        </div>
        <div style={styles.controlGroup}>
          <label style={styles.label}>Chunk Overlap (chars)</label>
          <input 
            type="number" 
            value={overlap}
            onChange={(e) => setOverlap(parseInt(e.target.value))}
            style={styles.input}
          />
        </div>
      </div>
      
      <div>
        <label style={styles.label}>Sample Document</label>
        <textarea 
          value={document}
          onChange={(e) => setDocument(e.target.value)}
          style={styles.textarea}
        />
      </div>
      
      <button 
        onClick={handleRun}
        style={styles.runButton}
      >
        Run Chunking
      </button>
      
      {result && (
        <div style={styles.results}>
          <h3 style={styles.resultHeader}>Results</h3>
          <p>Strategy: <strong>{result.strategy}</strong></p>
          <p>Generated <strong>{result.chunkCount}</strong> chunks</p>
          
          <div style={styles.chunkList}>
            <h4 style={styles.resultHeader}>Chunks Preview:</h4>
            {result.chunks.map((chunk, i) => (
              <div key={i} style={styles.chunk}>
                <div style={styles.chunkHeader}>Chunk {i+1} ({chunk.content.length} chars)</div>
                <div style={styles.chunkContent}>
                  {chunk.content.substring(0, 100)}
                  {chunk.content.length > 100 ? '...' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveChunking;