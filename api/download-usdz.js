// Vercel Serverless Function for USDZ downloads
// Serves USDZ data with correct MIME type for iOS AR Quick Look

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const { data } = req.query;
    
    if (!data) {
      return res.status(400).json({ error: 'No data provided' });
    }

    // Decode base64 to binary
    const buffer = Buffer.from(decodeURIComponent(data), 'base64');
    
    // Critical: Set correct MIME type for iOS AR Quick Look
    res.setHeader('Content-Type', 'model/vnd.usdz+zip');
    res.setHeader('Content-Disposition', 'attachment; filename="box-model.usdz"');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    // Send binary data
    res.send(buffer);
  } catch (err) {
    console.error('Error downloading USDZ:', err);
    res.status(500).json({ error: 'Failed to download USDZ' });
  }
}
