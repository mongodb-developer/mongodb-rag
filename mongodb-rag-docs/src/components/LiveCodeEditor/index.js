// src/components/LiveCodeEditor.js
import React from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { Box, Button, Typography } from "@mui/material";
// import { MongoRAG } from "mongodb-rag"; // ✅ Import at the top (outside LiveProvider)

const initialCode = `
const rag = new MongoRAG({
  mongoUrl: 'mongodb+srv://your_user:your_password@your-cluster.mongodb.net/',
  database: 'test_db',
  collection: 'documents',
  embedding: {
    provider: 'openai',
    apiKey: 'your-openai-key',
    model: 'text-embedding-3-small',
    dimensions: 1536
  }
});

console.log("✅ MongoRAG instance created!");
render(<p>✅ MongoRAG instance created! Check console for details.</p>);
`;

export default function LiveCodeEditor() {
  return (
    <LiveProvider code={initialCode} scope={{ MongoRAG, console }} noInline={true}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        <Typography variant="h6">Live MongoDB-RAG Playground</Typography>
        <LiveEditor style={{ border: "1px solid #ccc", borderRadius: 5, padding: 10 }} />
        <Button variant="contained" color="primary" onClick={() => console.log("Running Code")}>
          Run Code
        </Button>
        <Box sx={{ background: "#f5f5f5", padding: 2, borderRadius: 5 }}>
          <Typography variant="subtitle1">Output:</Typography>
          <LiveError />
          <LivePreview />
        </Box>
      </Box>
    </LiveProvider>
  );
}
