const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Store temporary USDZ files in memory
let tempUSDZFile = null;

// Endpoint to upload USDZ data
app.post('/api/save-usdz', express.raw({ type: 'application/octet-stream', limit: '50mb' }), (req, res) => {
  try {
    // Store the file data temporarily
    tempUSDZFile = req.body;
    res.json({ success: true, id: 'temp' });
  } catch (err) {
    console.error('Error saving USDZ:', err);
    res.status(500).json({ error: 'Failed to save USDZ' });
  }
});

// Endpoint to download USDZ with proper MIME type
app.get('/api/download-usdz', (req, res) => {
  try {
    if (!tempUSDZFile) {
      return res.status(404).json({ error: 'No file available' });
    }

    // Critical: Set the correct MIME type for iOS AR Quick Look
    res.setHeader('Content-Type', 'model/vnd.usdz+zip');
    res.setHeader('Content-Disposition', 'attachment; filename="box-model.usdz"');
    res.setHeader('Content-Length', tempUSDZFile.length);
    
    // Send the file
    res.send(tempUSDZFile);
    
    // Clear after sending
    tempUSDZFile = null;
  } catch (err) {
    console.error('Error downloading USDZ:', err);
    res.status(500).json({ error: 'Failed to download USDZ' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Box Studio server running on http://localhost:${PORT}`);
  console.log('USDZ files will be served with proper AR Quick Look headers for iOS');
});
