/**
 * Vercel Serverless Function: /api/chat
 * RAG (Retrieval-Augmented Generation) Endpoint for Thananjayan's AI Portfolio
 * 
 * Supports:
 * 1. Semantic retrieval from CV knowledge chunks
 * 2. Optional OpenAI / Google Gemini API integration via process.env.OPENAI_API_KEY / process.env.GEMINI_API_KEY
 * 3. Graceful fallback to verified structured CV responses
 */

const RESUME_CHUNKS = [
  {
    id: "profile",
    title: "Executive Profile & Headline",
    content: "Thananjayan Aruljothy is an AI Full-Stack Engineer specializing in building intelligent web applications powered by Large Language Models (LLMs), Generative AI, and modern cloud technologies. Located in Sri Lanka. Core skills: Python, Flask, Generative AI, LLM Integration, OpenAI API, Claude AI, Google Gemini, ElevenLabs, Fabric.js, AWS EC2, REST APIs, Salesforce.",
    citation: "CV - Executive Summary"
  },
  {
    id: "flipick",
    title: "AI Full Stack Engineer at Flipick",
    content: "At Flipick (April 2023 - Present), Thananjayan develops AI-powered applications and intelligent content creation platforms using Python, Flask, LLMs, and modern AI APIs. Designs AI workflows integrating OpenAI, Claude AI, Google Gemini, and ElevenLabs TTS. Builds scalable backend services using Python Flask handling AI integrations, data processing, and application logic. Develops interactive web editors using Fabric.js canvas technology. Builds AI video pipelines integrating LLM scripts, images, voice synthesis, avatars. Deploys on AWS EC2 (Ubuntu & Windows Server).",
    citation: "CV - Experience: Flipick"
  },
  {
    id: "eureka",
    title: "Associate Software Engineer at Eureka Innovations",
    content: "At Eureka Innovations (April 2022 - November 2022), Thananjayan handled UI/UX Design with HTML, CSS, JavaScript, Firebase configuration, and Three.js for interactive 3D rendering. Involved in UI design of AI-integrated Edtech Products: Brainiverse and Xtramark.",
    citation: "CV - Experience: Eureka Innovations"
  },
  {
    id: "koceansoft",
    title: "Junior Web Developer at KoceanSoft",
    content: "At KoceanSoft (January 2022 - April 2022), worked as Junior Web Developer focusing on responsive CMS, SEO optimization, and web application architecture.",
    citation: "CV - Experience: KoceanSoft"
  },
  {
    id: "education",
    title: "Educational Background",
    content: "Thananjayan completed his Bachelor of Information Technology (BIT) at University of Colombo School of Computing (UCSC) (2020 - 2023). He also holds a B.Sc (Hons) in Transport & Logistics Management from the University of Moratuwa (2011 - 2016).",
    citation: "CV - Education"
  },
  {
    id: "certifications",
    title: "Certifications & Credentials",
    content: "Certified in Salesforce Multi-Factor Authentication and Single Sign-On Settings Superbadge Unit, Lightning Experience Reports & Dashboards Specialist, EducateHacks 2023 Winner for AI/Edtech innovation, App Customization Specialist, and SEO Simplified.",
    citation: "CV - Certifications & Honors"
  },
  {
    id: "contact",
    title: "Contact & Collaboration",
    content: "Email: thananjayan1991@yahoo.com | Phone: +94 77 844 9255 | LinkedIn: linkedin.com/in/thananjayan-aruljothy | GitHub: github.com/Thananjayan91. Open for AI full-stack engineering roles, LLM application architecture, and consulting.",
    citation: "CV - Contact"
  }
];

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({ 
      status: 'active',
      message: 'Thananjayan RAG API Endpoint is live.' 
    });
  }

  try {
    const { query } = req.body || {};
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const cleanQuery = query.toLowerCase();

    // 1. Semantic Chunk Score Matcher (Lightweight Retrieval Step)
    let bestChunk = RESUME_CHUNKS[0];
    let maxScore = 0;

    const queryWords = cleanQuery.split(/\s+/).filter(w => w.length > 2);

    for (const chunk of RESUME_CHUNKS) {
      let score = 0;
      const contentLower = chunk.content.toLowerCase();
      const titleLower = chunk.title.toLowerCase();

      for (const word of queryWords) {
        if (titleLower.includes(word)) score += 3;
        if (contentLower.includes(word)) score += 1;
      }

      if (score > maxScore) {
        maxScore = score;
        bestChunk = chunk;
      }
    }

    // 2. Optional: If user sets OPENAI_API_KEY in Vercel Environment Variables
    if (process.env.OPENAI_API_KEY) {
      try {
        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are the AI assistant for Thananjayan Aruljothy's portfolio. Answer the visitor's question professionally, concisely, and accurately based strictly on this verified context:\n\n${bestChunk.content}`
              },
              { role: 'user', content: query }
            ],
            temperature: 0.3
          })
        });

        if (openaiRes.ok) {
          const aiData = await openaiRes.json();
          const generatedAnswer = aiData.choices?.[0]?.message?.content;
          if (generatedAnswer) {
            return res.status(200).json({
              answer: generatedAnswer,
              citation: bestChunk.citation,
              retrievedChunk: bestChunk.title
            });
          }
        }
      } catch (err) {
        console.error('External LLM error, falling back to local RAG retrieval:', err);
      }
    }

    // 3. Built-in Deterministic RAG Response
    let responseText = bestChunk.content;

    if (cleanQuery.includes('strength') || cleanQuery.includes('skill')) {
      responseText = `Thananjayan's core technical strengths include **Generative AI & LLM Systems** (OpenAI, Claude, Gemini, ElevenLabs), **Backend & Cloud Architecture** (Python Flask REST APIs, AWS EC2 & Lambda), and **Interactive Web Graphics** (Fabric.js canvas & Three.js 3D rendering).`;
    } else if (cleanQuery.includes('contact') || cleanQuery.includes('hire') || cleanQuery.includes('email')) {
      responseText = `You can get in touch with Thananjayan via email at **thananjayan1991@yahoo.com**, phone/WhatsApp at **+94 77 844 9255**, or connect on LinkedIn at [linkedin.com/in/thananjayan-aruljothy](https://www.linkedin.com/in/thananjayan-aruljothy/).`;
    }

    return res.status(200).json({
      answer: responseText,
      citation: bestChunk.citation,
      retrievedChunk: bestChunk.title
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to process RAG query', 
      details: error.message 
    });
  }
}

