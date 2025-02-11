// src/components/Validator/index.jsx
import React, { useState } from "react";
import { SchemaValidator, ValidationResult } from "./schemaValidator";
import { SCHEMA_SPEC } from "./schemaSpec";
import "./styles.css";

const Validator = () => {
  const [schema, setSchema] = useState("");
  const [results, setResults] = useState([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [error, setError] = useState(null);
  const [debug, setDebug] = useState(null);

  const validateSchema = () => {
    try {
      setError(null);
      setDebug(null);
      
      // Parse the schema
      const parsedSchema = JSON.parse(schema);
      
      // Debug info about schema structure
      const schemaInfo = {
        hasProject: !!parsedSchema.project,
        hasContent: !!parsedSchema.project?.content,
        collections: parsedSchema.project?.content?.collections 
          ? Object.keys(parsedSchema.project.content.collections)
          : [],
        mappings: parsedSchema.project?.content?.mappings
          ? Object.keys(parsedSchema.project.content.mappings)
          : [],
        tables: parsedSchema.project?.content?.tables
          ? Object.keys(parsedSchema.project.content.tables)
          : []
      };
      
      setDebug(schemaInfo);

      const validator = new SchemaValidator(parsedSchema);
      const validationResults = [];

      for (const [ruleKey, spec] of Object.entries(SCHEMA_SPEC)) {
        const result = validator.validateMapping(spec.collection, spec.mapping);
        
        validationResults.push({
          id: ruleKey,
          title: spec.title,
          description: spec.description,
          url: spec.url,
          valid: result.valid,
          message: result.message,
          details: result.details
        });
      }

      setResults(validationResults);
    } catch (err) {
      console.error('Validation error:', err);
      setError({
        message: err.message,
        details: 'Schema parsing or validation failed. Please ensure you\'ve pasted a valid .relmig file.'
      });
      setResults([]);
    }
  };

  const InstructionImage = ({ src, alt, caption }) => (
    <div className="instruction-image-container">
      <img 
        src={`/relational-migrator-lab/img/${src}`} 
        alt={alt} 
        className="instruction-image"
      />
      {caption && (
        <p className="image-caption">{caption}</p>
      )}
    </div>
  );

  return (
    <div className="validator-container">
      <h1 className="validator-title">Relational Migrator Validator</h1>
      
      <div className="instructions-panel">
        <div className="instructions-header">
          <h2 className="instructions-title">How to Export Your Relational Migrator Project</h2>
          <button 
            onClick={() => setShowInstructions(!showInstructions)}
            className="toggle-button"
          >
            {showInstructions ? 'Hide' : 'Show'} Instructions
          </button>
        </div>
        
        {showInstructions && (
          <div className="instructions-content">
            <div className="important-notes">
              <p className="notes-title">Important Notes:</p>
              <ul className="notes-list">
                <li>Relational Migrator only exports .relmig files</li>
                <li>Exported files do not include migration job history or passwords</li>
              </ul>
            </div>

            <div className="export-steps">
              <p className="steps-title">Steps to Export:</p>
              <ol className="steps-list">
                <li>
                  Open your project commands:
                  <div className="step-details">
                    <p className="sub-step-title">From the home page:</p>
                    <InstructionImage 
                      src="80-image-002.png"
                      alt="Export from homepage"
                      caption="Click the ellipses (⋮) next to the project"
                    />
                    
                    <p className="sub-step-title">From your open project page:</p>
                    <InstructionImage 
                      src="80-image-003.png"
                      alt="Export from project page"
                      caption="Click the ellipses (⋮) on the left pane"
                    />
                  </div>
                </li>
                <li>
                  Select "Export" and confirm:
                  <div className="step-details">
                    <InstructionImage 
                      src="80-image-004.png"
                      alt="Export confirmation"
                      caption="Click Export to confirm and download your .relmig file"
                    />
                  </div>
                </li>
              </ol>
            </div>

            <div className="validation-notice">
              <p>
                Once you have your .relmig file, paste its contents in the text area below for validation.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="validator-input-section">
        <textarea
          className="validator-textarea"
          placeholder="Paste your .relmig file contents here"
          value={schema}
          onChange={(e) => setSchema(e.target.value)}
        />
        
        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}
        
        <button 
          onClick={validateSchema}
          className="validate-button"
          disabled={!schema.trim()}
        >
          Validate Schema
        </button>
      </div>

      {results.length > 0 && (
        <div className="validation-results">
          {results.map((result) => (
            <div 
              key={result.id} 
              className={`result-item ${result.valid ? 'result-valid' : 'result-invalid'}`}
            >
              <div className="result-header">
                <h2 className="result-title">
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="result-link"
                  >
                    {result.title}
                  </a>
                </h2>
                <span className={`result-status ${result.valid ? 'status-valid' : 'status-invalid'}`}>
                  {result.valid ? '✓' : '✗'}
                </span>
              </div>
              
              <p className="result-description">{result.description}</p>
              <p className="result-message">{result.message}</p>
              
              {result.details && result.details.length > 0 && (
                <ul className="result-details">
                  {result.details.map((detail, idx) => (
                    <li key={idx} className="detail-item">{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Validator;