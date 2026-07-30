// Vercel Serverless Function for USDZ handling
// Note: This uses URL-based blob transfer instead of server storage

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      // Receive binary USDZ data
      const buffer = Buffer.from(req.body);
      
      // Convert to base64 for safe URL transmission
      const base64 = buffer.toString('base64');
      
      // Return download URL that includes the data
      res.status(200).json({ 
        success: true,
        downloadUrl: `/api/download-usdz?data=${encodeURIComponent(base64)}`
      });
    } catch (err) {
      console.error('Error processing USDZ:', err);
      res.status(500).json({ error: 'Failed to process USDZ' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

