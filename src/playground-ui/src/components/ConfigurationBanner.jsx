// src/components/ConfigurationBanner.jsx

import React, { useState, useEffect } from "react";

const ConfigurationBanner = () => {
  const [config, setConfig] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedConfig, setUpdatedConfig] = useState({});

  useEffect(() => {
    fetch("http://localhost:4000/api/config")
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch((err) => console.error("Error fetching config:", err));
  }, []);

  const handleEditClick = () => {
    setEditing(true);
    setUpdatedConfig(config);
  };

  const handleSave = () => {
    fetch("http://localhost:4000/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedConfig),
    })
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
        setEditing(false);
      })
      .catch((err) => console.error("Error saving config:", err));
  };

  const handleCancel = () => {
    setEditing(false); // Exit edit mode without saving
  };

  if (!config) return <p>Loading config...</p>;

  return (
    <div style={styles.banner}>
      {editing ? (
        <div style={styles.formContainer}>
          <label style={styles.label}>Database:</label>
          <input 
            style={styles.input}
            value={updatedConfig.database} 
            onChange={(e) => setUpdatedConfig({ ...updatedConfig, database: e.target.value })} 
          />
          <label style={styles.label}>Collection:</label>
          <input 
            style={styles.input}
            value={updatedConfig.collection} 
            onChange={(e) => setUpdatedConfig({ ...updatedConfig, collection: e.target.value })} 
          />
          <label style={styles.label}>Embedding Field:</label>
          <input 
            style={styles.input}
            value={updatedConfig.embeddingFieldPath || "embedding"} 
            onChange={(e) => setUpdatedConfig({ ...updatedConfig, embeddingFieldPath: e.target.value })} 
          />
          <label style={styles.label}>Index Name:</label>
          <input 
            style={styles.input}
            value={updatedConfig.indexName} 
            onChange={(e) => setUpdatedConfig({ ...updatedConfig, indexName: e.target.value })} 
          />
          <div style={styles.buttonGroup}>
            <button style={styles.saveButton} onClick={handleSave}>Save</button>
            <button style={styles.cancelButton} onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={styles.displayContainer}>
          <span><strong>Database:</strong> {config.database}</span>
          <span><strong>Collection:</strong> {config.collection}</span>
          <span><strong>Embedding Field:</strong> {config.embeddingFieldPath || "embedding"}</span>
          <span><strong>Index Name:</strong> {config.indexName}</span>
          <button style={styles.editButton} onClick={handleEditClick}>Edit</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  banner: {
    background: "#f4f4f4",
    padding: "12px 20px",
    borderBottom: "2px solid #ccc",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  },
  displayContainer: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  formContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    marginRight: "5px",
  },
  input: {
    padding: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    minWidth: "150px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginLeft: "10px",
  },
  editButton: {
    background: "#007bff",
    color: "white",
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  saveButton: {
    background: "#28a745",
    color: "white",
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    background: "#dc3545",
    color: "white",
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default ConfigurationBanner;
