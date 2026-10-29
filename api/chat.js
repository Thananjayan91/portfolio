/**
 * Vercel Serverless Function: /api/chat
 * Complete RAG (Retrieval-Augmented Generation) Pipeline for Thananjayan's Portfolio
 * 
 * Pipeline:
 * 1. User Query -> OpenAI text-embedding-3-small (Vector Embedding)
 * 2. Cosine Similarity Search against active CV vector index
 * 3. Top-K chunk selection & Context synthesis
 * 4. OpenAI gpt-4o-mini synthesis with strict context grounding
 */

import fs from 'fs';
import path from 'path';

// Cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Fallback keyword scoring when vectors are not yet populated
function keywordScore(text, query) {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const textLower = text.toLowerCase();
  let score = 0;
  for (const word of words) {
    if (textLower.includes(word)) {
      score += 1;
    }
  }
  return score;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'active', message: 'Thananjayan RAG API Endpoint is live.' });
  }

  try {
    const { query, activeIndex, apiKey: clientApiKey } = req.body || {};
    const apiKey = clientApiKey || req.headers['x-api-key'] || process.env.OPENAI_API_KEY;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // 1. Resolve Active Index (client-provided or bundled data/cv_index.json)
    let indexData = null;
    if (activeIndex && Array.isArray(activeIndex.chunks) && activeIndex.chunks.length > 0) {
      indexData = activeIndex;
    } else {
      try {
        const filePath = path.join(process.cwd(), 'data', 'cv_index.json');
        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath, 'utf-8');
          indexData = JSON.parse(raw);
        }
      } catch (err) {
        console.warn('Could not read data/cv_index.json:', err.message);
      }
    }

    const chunks = indexData?.chunks || [];
    if (chunks.length === 0) {
      return res.status(500).json({ error: 'No CV chunks available for RAG search.' });
    }

    // 2. Perform Retrieval
    let scoredChunks = [];

    // If an OpenAI API Key is present, generate vector embedding for the user query
    if (apiKey) {
      try {
        const embedRes = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: query
          })
        });

        if (embedRes.ok) {
          const embedData = await embedRes.json();
          const queryVector = embedData.data?.[0]?.embedding;

          if (queryVector) {
            scoredChunks = chunks.map(chunk => {
              const sim = (chunk.embedding && chunk.embedding.length > 0)
                ? cosineSimilarity(queryVector, chunk.embedding)
                : keywordScore(`${chunk.title} ${chunk.text}`, query) * 0.15;
              return { ...chunk, score: sim };
            });
          }
        }
      } catch (embedErr) {
        console.warn('Vector embedding failed, falling back to keyword similarity:', embedErr.message);
      }
    }

    // Fallback scoring if vector search was not performed
    if (scoredChunks.length === 0) {
      scoredChunks = chunks.map(chunk => ({
        ...chunk,
        score: keywordScore(`${chunk.title} ${chunk.text}`, query)
      }));
    }

    // Sort descending by score
    scoredChunks.sort((a, b) => b.score - a.score);

    // Pick Top-K most relevant chunks (top 3)
    const topChunks = scoredChunks.slice(0, 3);
    const contextText = topChunks.map((c, i) => `[Source ${i + 1}: ${c.title}]\n${c.text}`).join('\n\n');

    // 3. Generate Grounded Answer with LLM (gpt-4o-mini) if API key available
    if (apiKey) {
      try {
        const completionRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are the official AI representative for Thananjayan Aruljothy's portfolio website.\n` +
                         `Answer the visitor's question in a professional, engaging, and accurate manner based strictly on the retrieved CV context below.\n` +
                         `Use concise formatting and bullet points where helpful. Do NOT include any "Source:" citations or chunk IDs in the text.\n` +
                         `If including a note to reach out to Thananjayan directly (thananjayan1991@yahoo.com or +94 77 844 9255), ALWAYS place a clear horizontal rule "---" and line break before that contact sentence so it is neatly separated.\n\n` +
                         `=== RETRIEVED CV CONTEXT ===\n${contextText}`
              },
              { role: 'user', content: query }
            ],
            temperature: 0.25,
            max_tokens: 380
          })
        });

        if (completionRes.ok) {
          const compData = await completionRes.json();
          const aiText = compData.choices?.[0]?.message?.content;
          if (aiText) {
            return res.status(200).json({
              answer: aiText,
              citation: topChunks[0]?.title || 'Verified CV Index',
              sources: topChunks.map(c => ({ title: c.title, category: c.category, score: c.score })),
              mode: 'openai-rag'
            });
          }
        }
      } catch (llmErr) {
        console.warn('OpenAI completion failed, falling back to local synthesis:', llmErr.message);
      }
    }

    // 4. Deterministic Context-Grounded Fallback (if no key or offline)
    const primaryChunk = topChunks[0] || chunks[0];
    return res.status(200).json({
      answer: primaryChunk.text,
      citation: primaryChunk.title,
      sources: topChunks.map(c => ({ title: c.title, category: c.category })),
      mode: 'local-retrieval'
    });

  } catch (error) {
    console.error('RAG Error:', error);
    return res.status(500).json({
      error: 'Failed to process RAG request',
      details: error.message
    });
  }
}
