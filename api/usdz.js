// Vercel Serverless Function for USDZ handling
// Store USDZ temporarily in memory (note: will be cleared on function end)
let usdz_storage = {};

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    // Save USDZ file
    try {
      const id = Date.now().toString();
      usdz_storage[id] = req.body;
      
      res.status(200).json({ success: true, id });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save USDZ' });
    }
  } 
  else if (req.method === 'GET') {
    // Download USDZ with proper headers
    const { id } = req.query;
    
    if (!id || !usdz_storage[id]) {
      return res.status(404).json({ error: 'File not found' });
    }

    try {
      const fileData = usdz_storage[id];
      
      // Critical: Set correct MIME type for iOS AR Quick Look
      res.setHeader('Content-Type', 'model/vnd.usdz+zip');
      res.setHeader('Content-Disposition', 'attachment; filename="box-model.usdz"');
      res.setHeader('Content-Length', fileData.length);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      
      res.send(fileData);
      
      // Clean up after sending
      delete usdz_storage[id];
    } catch (err) {
      res.status(500).json({ error: 'Failed to download USDZ' });
    }
  } 
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
