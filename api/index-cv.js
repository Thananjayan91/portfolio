/**
 * Vercel Serverless Function: /api/index-cv
 * Generates vector embeddings for CV chunks using OpenAI's text-embedding-3-small
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'ready', message: 'CV indexing endpoint is live.' });
  }

  try {
    const { chunks, fullText, apiKey: clientApiKey, documentTitle } = req.body || {};
    const apiKey = clientApiKey || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ 
        error: 'OpenAI API Key is required. Please provide it in the request or set OPENAI_API_KEY in Vercel environment variables.' 
      });
    }

    let chunksToIndex = [];

    // If already pre-chunked
    if (Array.isArray(chunks) && chunks.length > 0) {
      chunksToIndex = chunks;
    } else if (fullText && typeof fullText === 'string') {
      // Automatic semantic chunking
      const rawParagraphs = fullText.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 30);
      chunksToIndex = rawParagraphs.map((para, idx) => ({
        id: `chunk_${idx}`,
        title: `Section ${idx + 1}`,
        category: 'CV Section',
        text: para
      }));
    } else {
      return res.status(400).json({ error: 'Either "chunks" array or "fullText" string is required.' });
    }

    // Call OpenAI Embeddings API (model: text-embedding-3-small)
    const texts = chunksToIndex.map(c => `${c.title || ''}: ${c.text}`);

    const embedResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: texts
      })
    });

    if (!embedResponse.ok) {
      const errData = await embedResponse.json().catch(() => ({}));
      return res.status(embedResponse.status).json({
        error: 'OpenAI Embeddings API error',
        details: errData.error?.message || embedResponse.statusText
      });
    }

    const embedData = await embedResponse.json();

    // Attach embedding vectors to chunks
    const indexedChunks = chunksToIndex.map((chunk, index) => ({
      ...chunk,
      embedding: embedData.data[index].embedding
    }));

    const resultIndex = {
      lastIndexed: new Date().toISOString(),
      documentTitle: documentTitle || 'Uploaded_CV.pdf',
      embeddingModel: 'text-embedding-3-small',
      totalChunks: indexedChunks.length,
      chunks: indexedChunks
    };

    return res.status(200).json({
      success: true,
      message: `Successfully generated embeddings for ${indexedChunks.length} chunks.`,
      index: resultIndex
    });

  } catch (error) {
    console.error('Error during indexing:', error);
    return res.status(500).json({
      error: 'Failed to index CV',
      details: error.message
    });
  }
}

