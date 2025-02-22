// src/playground-ui/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Container, Typography, Button, TextField, CircularProgress, Snackbar, Alert, Box, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Grid, ThemeProvider, createTheme, Paper, Divider, IconButton, Tooltip, AppBar, Toolbar, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CloudUpload as UploadIcon, Search as SearchIcon, Settings as SettingsIcon, GitHub as GitHubIcon, Refresh as RefreshIcon, Download as DownloadIcon, Storage as StorageIcon, Add as AddIcon } from '@mui/icons-material';
import './App.css';
import logo from './owl.png';
import { DataGrid } from '@mui/x-data-grid';
import ConfigurationBanner from "./components/ConfigurationBanner";

const socket = io('http://localhost:4000');

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00ED64', // MongoDB green
    },
    secondary: {
      main: '#001E2B', // MongoDB dark
    },
    background: {
      default: '#F9FBFA',
      paper: '#FFFFFF',
    }
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [status, setStatus] = useState('');
  const [openWelcome, setOpenWelcome] = useState(!document.cookie.includes("hideWelcomePopup=true"));
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [config, setConfig] = useState({
    mongoUrl: '',
    database: '',
    collection: '',
    provider: '',
    apiKey: '',
    model: '',
    dimensions: 1536,
    batchSize: 100,
    maxResults: 5,
    minScore: 0.7,
    indexName: 'vector_index'
  });
  const [tabValue, setTabValue] = useState(0);
  const [formConfig, setFormConfig] = useState(config);
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [indexes, setIndexes] = useState({ searchIndexes: [], regularIndexes: [] });
  const [loadingIndexes, setLoadingIndexes] = useState(false);
  const [createIndexDialog, setCreateIndexDialog] = useState(false);
  const [newIndexConfig, setNewIndexConfig] = useState({
    name: '',
    dimensions: 1536,
    path: 'embedding',
    similarity: 'cosine'
  });

  useEffect(() => {
    socket.on('update', (data) => {
      setStatus(data.message);
      setOpenSnackbar(true);
    });

    const loadConfig = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/config`);
        const data = await response.json();
        setConfig(data);
        setFormConfig(data);
      } catch (error) {
        console.error('Error loading config:', error);
        setStatus('Failed to load configuration');
        setOpenSnackbar(true);
      }
    };

    const loadInitialDocuments = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/documents`);
        const data = await response.json();
        if (data.documents) {
          setDocuments(data.documents);
        }
      } catch (error) {
        console.error('Error loading documents:', error);
      }
    };

    loadConfig();
    loadInitialDocuments();
    return () => {
      socket.off('update');
    };
  }, []);

  const reloadConfig = async () => {
    const response = await fetch(`${BACKEND_URL}/api/config`);
    const data = await response.json();
    setConfig(data);
    setFormConfig(data);
    setStatus('Configuration reloaded');
    setOpenSnackbar(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${BACKEND_URL}/api/ingest`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setStatus(result.message || 'Upload successful!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error uploading file:', error);
    }

    setUploading(false);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setSearching(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Search results:', data);
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setStatus(`Search failed: ${error.message}`);
      setOpenSnackbar(true);
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleConfigSubmit = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/save-config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formConfig)
      });

      await reloadConfig();

      setStatus('Configuration saved successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error saving config:', error);
      setStatus('Failed to save configuration');
      setOpenSnackbar(true);
    }
  };

  const handleDownload = async (type) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/download/${type}`);
      if (!response.ok) {
        throw new Error(`Failed to download ${type} file`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'config' ? '.mongodb-rag.json' : '.env';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setStatus(`Successfully downloaded ${type === 'config' ? '.mongodb-rag.json' : '.env'} file`);
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Download error:', error);
      setStatus(`Failed to download ${type} file`);
      setOpenSnackbar(true);
    }
  };

  const formatDocumentField = (value) => {
    if (value === undefined) {
      return ''; // Return an empty string or a default message if value is undefined
    }
    if (Array.isArray(value)) {
      return value.slice(0, 10).map(item =>
        typeof item === 'object' ? JSON.stringify(item) : item
      ).join(', ') + (value.length > 10 ? '...' : '');
    }
    if (typeof value === 'object' && value !== null) {
      return Object.keys(value).length > 0 ? '{...}' : '{}';
    }
    return String(value);
  };

  const DocumentCard = ({ document }) => {
    const excludeFields = ['embedding'];
    const fields = Object.entries(document)
      .filter(([key]) => !excludeFields.includes(key));

    return (
      <Card sx={{ mb: 2, width: '100%' }}>
        <CardContent>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {document.title || document.content?.slice(0, 100) || 'Document'}...
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1}>
                {fields.map(([key, value]) => (
                  <Grid item xs={12} key={key}>
                    <Typography variant="body2" color="textSecondary" component="div">
                      <strong>{key}:</strong> {formatDocumentField(value)}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    );
  };

  const loadDocuments = async () => {
    setLoadingDocuments(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/documents`);
      const data = await response.json();
      if (data.documents) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      setStatus('Failed to load documents');
      setOpenSnackbar(true);
    }
    setLoadingDocuments(false);
  };

  const loadIndexes = async () => {
    setLoadingIndexes(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/indexes`);

      if (!response.ok) {
        throw new Error(`Failed to fetch indexes: ${response.statusText}`);
      }

      const data = await response.json();

      setIndexes({
        searchIndexes: Array.isArray(data?.searchIndexes) ? data.searchIndexes : [],
        regularIndexes: Array.isArray(data?.regularIndexes) ? data.regularIndexes : []
      });
    } catch (error) {
      console.error('Error loading indexes:', error);
      setStatus('Failed to load indexes');
      setOpenSnackbar(true);
      setIndexes({ searchIndexes: [], regularIndexes: [] });  // Ensure empty state
    }
    setLoadingIndexes(false);
  };


  const handleCreateIndex = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/indexes/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIndexConfig)
      });

      if (!response.ok) {
        throw new Error(`Failed to create index: ${response.statusText}`);
      }

      const result = await response.json();
      setStatus('Vector search index created successfully!');
      setOpenSnackbar(true);
      setCreateIndexDialog(false);
      loadIndexes(); // Refresh the index list
    } catch (error) {
      console.error('Error creating index:', error);
      setStatus(`Failed to create index: ${error.message}`);
      setOpenSnackbar(true);
    }
  };

  const IndexesView = () => {
    const searchIndexColumns = [
      { field: 'name', headerName: 'Name', flex: 1 },
      { field: 'type', headerName: 'Type', width: 130 },
      { field: 'status', headerName: 'Status', width: 130 },
    ];

    const regularIndexColumns = [
      { field: 'name', headerName: 'Name1', flex: 1 },
      {
        field: 'key',
        headerName: 'Key',
        flex: 1,
        valueGetter: (params) => {
          if (!params || !params.row) return "{}"; // Ensures params is not undefined
          return params.row.key ? JSON.stringify(params.row.key) : "{}";
        }
      },
      {
        field: 'unique',
        headerName: 'Unique',
        width: 130,
        valueGetter: (params) => {
          if (!params || !params.row) return "No"; // Prevents accessing undefined
          return params.row.unique ? "Yes" : "No";
        }
      },
    ];


    // Ensure indexes are always arrays to prevent map errors
    const searchIndexRows = Array.isArray(indexes.searchIndexes) ? indexes.searchIndexes.map((idx, i) => ({
      id: i,
      name: idx.name,
      type: idx.type || 'vector',
      status: idx.status || 'ready'
    })) : [];

    const regularIndexRows = Array.isArray(indexes.regularIndexes) ? indexes.regularIndexes.map((idx, i) => ({
      id: i,
      name: idx.name,
      key: idx.key,
      unique: idx.unique || false
    })) : [];

    return (
      <div>

        <Box sx={{ mt: 4 }}>
          <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Indexes for {indexes.database}/{indexes.collection}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setCreateIndexDialog(true)}
                >
                  Create Vector Index
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={loadIndexes}
                  disabled={loadingIndexes}
                >
                  Refresh
                </Button>
              </Box>
            </Box>

            <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
              Vector Search Indexes
            </Typography>
            <DataGrid
              rows={searchIndexRows}
              columns={searchIndexColumns}
              autoHeight
              hideFooter={searchIndexRows.length <= 10}
              sx={{ mb: 4 }}
            />

            <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
              Regular Indexes
            </Typography>
            <DataGrid
              rows={regularIndexRows}
              columns={regularIndexColumns}
              autoHeight
              hideFooter={regularIndexRows.length <= 10}
            />
          </Paper>

          <Dialog
            open={createIndexDialog}
            onClose={() => setCreateIndexDialog(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Create Vector Search Index</DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Index Name"
                  value={newIndexConfig.name}
                  onChange={(e) => setNewIndexConfig({ ...newIndexConfig, name: e.target.value })}
                  sx={{ mb: 2 }}
                  helperText="Name for the new vector search index"
                />
                <TextField
                  fullWidth
                  label="Dimensions"
                  type="number"
                  value={newIndexConfig.dimensions}
                  onChange={(e) => setNewIndexConfig({ ...newIndexConfig, dimensions: parseInt(e.target.value) })}
                  sx={{ mb: 2 }}
                  helperText="Number of dimensions for the vector field"
                />
                <TextField
                  fullWidth
                  label="Field Path"
                  value={newIndexConfig.path}
                  onChange={(e) => setNewIndexConfig({ ...newIndexConfig, path: e.target.value })}
                  sx={{ mb: 2 }}
                  helperText="Path to the vector field in your documents"
                />
                <TextField
                  fullWidth
                  select
                  label="Similarity Metric"
                  value={newIndexConfig.similarity}
                  onChange={(e) => setNewIndexConfig({ ...newIndexConfig, similarity: e.target.value })}
                  helperText="Similarity metric for vector comparison"
                >
                  <MenuItem value="cosine">Cosine Similarity</MenuItem>
                  <MenuItem value="dotProduct">Dot Product</MenuItem>
                  <MenuItem value="euclidean">Euclidean Distance</MenuItem>
                </TextField>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCreateIndexDialog(false)}>Cancel</Button>
              <Button
                onClick={handleCreateIndex}
                variant="contained"
                color="primary"
                disabled={!newIndexConfig.name || !newIndexConfig.dimensions}
              >
                Create Index
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </div>

    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        pb: 4
      }}>
        <AppBar position="static" color="secondary" elevation={0}>
          <Toolbar>
            <Box display="flex" alignItems="center" sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
              <img src={logo} alt="Playground Logo" style={{ height: '40px', marginRight: '15px' }} />
              <Box flex={1}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  MongoDB-RAG Playground
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                  <a
                    href="https://npmjs.com/package/mongodb-rag"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <img
                      src="https://img.shields.io/npm/v/mongodb-rag?color=blue&label=npm&logo=npm"
                      alt="NPM Version"
                    />
                  </a>
                  <a
                    href="https://github.com/mongodb-developer/mongodb-rag"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <img
                      src="https://img.shields.io/github/stars/mongodb-developer/mongodb-rag?style=social"
                      alt="GitHub Stars"
                    />
                  </a>
                  <a
                    href="https://github.com/mongodb-developer/mongodb-rag"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <img
                      src="https://img.shields.io/github/license/mongodb-developer/mongodb-rag?color=blue"
                      alt="License"
                    />
                  </a>
                </Box>
              </Box>
              <Tooltip title="View on GitHub">
                <IconButton
                  color="inherit"
                  href="https://github.com/mongodb-developer/mongodb-rag"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHubIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ mt: 4 }}>
          <ConfigurationBanner />
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  minWidth: 120,
                  px: 3
                }
              }}
            >
              <Tab icon={<SearchIcon />} iconPosition="start" label="Documents" />
              <Tab icon={<UploadIcon />} iconPosition="start" label="Upload" />
              <Tab icon={<StorageIcon />} iconPosition="start" label="Indexes" />
              <Tab icon={<SettingsIcon />} iconPosition="start" label="Configure" />
            </Tabs>

            {tabValue === 1 && (
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <input
                  type="file"
                  accept=".json, .md, .pdf"
                  onChange={handleUpload}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadIcon />}
                    size="large"
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Choose File'}
                  </Button>
                </label>
              </Box>
            )}

            {tabValue === 0 && (
              <Box sx={{ mt: 4 }}>
                <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Search documents"
                    placeholder="Enter your search query..."
                    variant="outlined"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    InputProps={{
                      endAdornment: (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Search">
                            <IconButton
                              onClick={handleSearch}
                              disabled={searching}
                              color="primary"
                            >
                              <SearchIcon />
                            </IconButton>
                          </Tooltip>
                          <Divider orientation="vertical" flexItem />
                          <Tooltip title="Load All Documents">
                            <IconButton
                              onClick={loadDocuments}
                              disabled={loadingDocuments}
                            >
                              <RefreshIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ),
                    }}
                  />
                </Paper>

                {(results.length > 0 || documents.length > 0) && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {query ? `Found ${results.length} matching documents` : `Showing ${documents.length} documents`}
                    </Typography>
                    <Box sx={{ maxHeight: '600px', overflow: 'auto' }}>
                      {(query ? results : documents).map((doc, index) => (
                        <DocumentCard key={index} document={doc} />
                      ))}
                    </Box>
                  </Box>
                )}

                {query && results.length === 0 && !searching && (
                  <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                    No documents found matching your query
                  </Typography>
                )}

                {!query && documents.length === 0 && !loadingDocuments && (
                  <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                    No documents found. Try uploading some documents first.
                  </Typography>
                )}
              </Box>
            )}


            {tabValue === 2 && <IndexesView />}

            {tabValue === 3 && (
              <Box sx={{ mt: 4 }}>
                <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload('config')}
                    >
                      Download Config
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload('env')}
                    >
                      Download .env
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={reloadConfig}
                    >
                      Refresh
                    </Button>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="MongoDB URI" variant="outlined" value={formConfig.mongoUrl} onChange={(e) => setFormConfig({ ...formConfig, mongoUrl: e.target.value })} sx={{ mt: 2 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Database" variant="outlined" value={formConfig.database} onChange={(e) => setFormConfig({ ...formConfig, database: e.target.value })} sx={{ mt: 2 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Collection" variant="outlined" value={formConfig.collection} onChange={(e) => setFormConfig({ ...formConfig, collection: e.target.value })} sx={{ mt: 2 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Provider" variant="outlined" value={formConfig.provider} onChange={(e) => setFormConfig({ ...formConfig, provider: e.target.value })} sx={{ mt: 2 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="API Key" variant="outlined" value={formConfig.apiKey} onChange={(e) => setFormConfig({ ...formConfig, apiKey: e.target.value })} sx={{ mt: 2 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Model" variant="outlined" value={formConfig.model} onChange={(e) => setFormConfig({ ...formConfig, model: e.target.value })} sx={{ mt: 2 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Dimensions" variant="outlined" type="number" value={formConfig.dimensions} onChange={(e) => setFormConfig({ ...formConfig, dimensions: e.target.value })} sx={{ mt: 2 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Batch Size" variant="outlined" type="number" value={formConfig.batchSize} onChange={(e) => setFormConfig({ ...formConfig, batchSize: e.target.value })} sx={{ mt: 2 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Max Results" variant="outlined" type="number" value={formConfig.maxResults} onChange={(e) => setFormConfig({ ...formConfig, maxResults: e.target.value })} sx={{ mt: 2 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Min Score" variant="outlined" type="number" step="0.1" value={formConfig.minScore} onChange={(e) => setFormConfig({ ...formConfig, minScore: e.target.value })} sx={{ mt: 2 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Index Name" variant="outlined" value={formConfig.indexName} onChange={(e) => setFormConfig({ ...formConfig, indexName: e.target.value })} sx={{ mt: 2 }} />
                    </Grid>
                  </Grid>
                  <Button variant="contained" color="primary" onClick={handleConfigSubmit} sx={{ mt: 2 }}>Save Configuration</Button>
                </Paper>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>

      <Dialog open={openWelcome} onClose={() => setOpenWelcome(false)}>
        <DialogTitle>Welcome to MongoDB-RAG Playground</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This playground allows you to test MongoDB Atlas Vector Search by uploading documents, running searches, and managing your settings.
          </Typography>
          <Typography variant="body2">
            <strong>Current Settings:</strong>
          </Typography>
          <Typography variant="body2">
            MongoDB URI: {config.mongoUrl ? '********' : 'Not Set'}
          </Typography>
          <Typography variant="body2">
            Database: {config.database || 'Not Set'}
          </Typography>
          <Typography variant="body2">
            Collection: {config.collection || 'Not Set'}
          </Typography>
          <Typography variant="body2">
            Provider: {config.provider || 'Not Set'}
          </Typography>
          <Typography variant="body2">
            Model: {config.model || 'Not Set'}
          </Typography>
          <Typography variant="body2">
            Dimensions: {config.dimensions || 1536}
          </Typography>
          <Typography variant="body2">
            Batch Size: {config.batchSize || 100}
          </Typography>
          <Typography variant="body2">
            Max Results: {config.maxResults || 5}
          </Typography>
          <Typography variant="body2">
            Min Score: {config.minScore || 0.7}
          </Typography>
          <Typography variant="body2">
            Index Name: {config.indexName || 'Not Set'}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            You can update these settings in the Configuration tab.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <input type="checkbox" id="dontShowAgain" onChange={(e) => {
              if (e.target.checked) {
                document.cookie = "hideWelcomePopup=true; path=/; max-age=" + 60 * 60 * 24 * 30; // 30 days
              }
            }} />
            <label htmlFor="dontShowAgain" style={{ marginLeft: "8px" }}>Don't show this again</label>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenWelcome(false)} variant="contained" color="primary">Got it</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="info">
          {status}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
