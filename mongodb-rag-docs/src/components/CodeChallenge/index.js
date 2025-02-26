// CodeChallenge.jsx
import React, { useState } from 'react';

// Inline styles to ensure proper rendering
const styles = {
  container: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    margin: '20px 0',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
  },
  header: {
    backgroundColor: '#f5f7fa',
    padding: '16px',
    borderBottom: '1px solid #e0e0e0'
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: 0,
    marginBottom: '8px'
  },
  description: {
    fontSize: '14px',
    color: '#666',
    margin: 0
  },
  editorSection: {
    padding: '16px'
  },
  label: {
    display: 'block',
    fontWeight: '500',
    marginBottom: '8px'
  },
  codeEditor: {
    width: '100%',
    height: '240px',
    fontFamily: 'monospace',
    fontSize: '14px',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#f8f9fa',
    resize: 'vertical'
  },
  feedback: {
    margin: '0 16px',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '16px'
  },
  successFeedback: {
    backgroundColor: '#d4edda',
    color: '#155724'
  },
  errorFeedback: {
    backgroundColor: '#f8d7da',
    color: '#721c24'
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#f8f9fa'
  },
  solutionLink: {
    color: '#3182ce',
    cursor: 'pointer',
    textDecoration: 'none'
  },
  submitButton: {
    padding: '8px 16px',
    backgroundColor: '#3182ce',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  solutionSection: {
    padding: '16px',
    borderTop: '1px solid #e0e0e0'
  },
  solutionHeader: {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '8px'
  },
  solutionCode: {
    backgroundColor: '#f5f7fa',
    padding: '12px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '14px',
    overflowX: 'auto',
    marginBottom: 0
  }
};

const CodeChallenge = ({ 
  title = "Complete the Code Challenge", 
  description = "Fill in the missing code to complete the function", 
  initialCode = "", 
  solution = "", 
  placeholders = ["// Your code here"], 
  language = "javascript" 
}) => {
  const [code, setCode] = useState(initialCode);
  const [showSolution, setShowSolution] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  // Function to check if all placeholders have been replaced
  const checkCompleteness = () => {
    for (const placeholder of placeholders) {
      if (code.includes(placeholder)) {
        return false;
      }
    }
    return true;
  };
  
  // Handle submission
  const handleSubmit = () => {
    // Check if all placeholders have been filled
    if (!checkCompleteness()) {
      setFeedback({
        type: 'error',
        message: 'Please replace all placeholder comments with your code.'
      });
      return;
    }
    
    // In a real application, we would run tests or check the solution more thoroughly
    // For this demo, we'll just set positive feedback
    setFeedback({
      type: 'success',
      message: 'Great job! Your solution has been submitted.'
    });
    setHasSubmitted(true);
  };
  
  // Toggle solution visibility
  const toggleSolution = () => {
    setShowSolution(!showSolution);
  };
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.description}>{description}</p>
      </div>
      
      {/* Code Editor */}
      <div style={styles.editorSection}>
        <label style={styles.label}>Your Code:</label>
        <textarea
          style={styles.codeEditor}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck="false"
        />
      </div>
      
      {/* Feedback */}
      {feedback && (
        <div 
          style={{
            ...styles.feedback,
            ...(feedback.type === 'success' ? styles.successFeedback : styles.errorFeedback)
          }}
        >
          {feedback.message}
        </div>
      )}
      
      {/* Actions */}
      <div style={styles.actions}>
        <div>
          {hasSubmitted && (
            <button
              onClick={toggleSolution}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                ...styles.solutionLink
              }}
            >
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </button>
          )}
        </div>
        <button
          onClick={handleSubmit}
          style={styles.submitButton}
        >
          Submit
        </button>
      </div>
      
      {/* Solution */}
      {showSolution && (
        <div style={styles.solutionSection}>
          <h4 style={styles.solutionHeader}>Solution:</h4>
          <pre style={styles.solutionCode}>{solution}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeChallenge;