/**
 * Vercel Serverless Function: /api/generate-cv
 * Tailored CV Generator Pipeline using RAG + OpenAI JSON Output
 * 
 * Takes:
 * - jobDescription (string, required)
 * - jobTitle (string, optional)
 * - companyName (string, optional)
 * - apiKey (string, optional client override)
 * 
 * Returns pure JSON containing only the dynamic/tailored CV sections:
 * - targetTitle
 * - summary
 * - coreSkills (categorized array)
 * - tailoredFlipickExperience (tailored bullet points for Flipick)
 * - tailoredProjects (tailored bullet points for key projects)
 * - growingInto (domain alignment points)
 * - matchAnalysis (matchScore, matchedKeywords, keyStrengths, customPitch)
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

// Fallback keyword scoring
function keywordScore(text, query) {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const textLower = text.toLowerCase();
  let score = 0;
  for (const word of words) {
    if (textLower.includes(word)) score += 1;
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
    return res.status(200).json({ status: 'active', message: 'Tailored CV Generator RAG API is live.' });
  }

  try {
    const { jobDescription, jobTitle = '', companyName = '', apiKey: clientApiKey } = req.body || {};
    const apiKey = clientApiKey || req.headers['x-api-key'] || process.env.OPENAI_API_KEY;

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide a valid Job Description (minimum 20 characters).' });
    }

    if (!apiKey) {
      return res.status(400).json({
        error: 'OpenAI API key missing. Please provide your OpenAI API key or configure OPENAI_API_KEY in Vercel environment variables.'
      });
    }

    // 1. Load active CV vector knowledge base
    let indexData = null;
    const possiblePaths = [
      path.join(process.cwd(), 'data', 'cv_index.json'),
      path.join(process.cwd(), 'public', 'data', 'cv_index.json'),
      path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..', 'data', 'cv_index.json')
    ];

    for (const p of possiblePaths) {
      try {
        if (fs.existsSync(p)) {
          indexData = JSON.parse(fs.readFileSync(p, 'utf-8'));
          break;
        }
      } catch (e) {
        // Continue searching
      }
    }

    const chunks = indexData?.chunks || [];

    // 2. Perform RAG Retrieval against the JD
    let topContext = '';
    const query = `${jobTitle} ${companyName} ${jobDescription}`.slice(0, 1500);

    if (chunks.length > 0) {
      let scoredChunks = [];

      try {
        // Query embedding with text-embedding-3-small
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
            scoredChunks = chunks.map(chunk => ({
              ...chunk,
              score: (chunk.embedding && chunk.embedding.length > 0)
                ? cosineSimilarity(queryVector, chunk.embedding)
                : keywordScore(`${chunk.title} ${chunk.text}`, query) * 0.1
            }));
          }
        }
      } catch (err) {
        console.warn('Embedding retrieval fallback:', err.message);
      }

      if (scoredChunks.length === 0) {
        scoredChunks = chunks.map(chunk => ({
          ...chunk,
          score: keywordScore(`${chunk.title} ${chunk.text}`, query)
        }));
      }

      scoredChunks.sort((a, b) => b.score - a.score);
      topContext = scoredChunks.slice(0, 4).map(c => `[${c.title}]\n${c.text}`).join('\n\n');
    }

    // 3. Prompt OpenAI LLM for Pure JSON Output
    const systemPrompt = `You are an elite Executive Tech Career Architect and ATS Optimization Specialist tailoring Thananjayan Aruljothy's CV for a specific Job Description (JD).

=== STRICT FACTUAL GUARDRAILS (NEVER VIOLATE OR HALLUCINATE) ===
1. Candidate: Thananjayan Aruljothy
2. Primary Professional Role: Flipick (April 2023 – Present), AI Full Stack Engineer / AI Developer (India — Remote).
   STRICT TITLE RULE: Thananjayan has ~3+ years of professional engineering experience. DO NOT label him "Senior Software Engineer" (SSE), "Senior Developer", or "Lead" in his title or headline. Even if the target JD is for a Senior role, his own headline (targetTitle) MUST authentically choose between:
   - "FULLSTACK AI ENGINEER" (if the JD emphasizes LLMs, RAG, GenAI apps, AI agents)
   - "PYTHON ENGINEER" or "PYTHON BACKEND ENGINEER" (if the JD emphasizes Python, Flask, REST APIs, microservices)
   - "FULLSTACK ENGINEER" (if the JD emphasizes full-stack web application development)
   - "AI BUILDER" (if the JD emphasizes hands-on shipping of AI tools and automations)
   followed by a domain specialization matching the JD (e.g. "FULLSTACK AI ENGINEER | AI-POWERED SOLUTIONS & CLOUD ARCHITECTURE" or "PYTHON ENGINEER | RAG PIPELINES, REST APIS & BACKEND SYSTEMS").
3. Previous Experience:
   - Eureka Innovations (Jan 2022 – Apr 2022): Associate Software Engineer (JavaScript, Three.js, EdTech features).
   - KoceanSoft (Apr 2022 – Nov 2022): Junior Web Developer (HTML, CSS, JS, WordPress, Firebase).
   - INSEE Cement (Apr 2016 – Oct 2019): Logistics Officer (SAP ERP, 100+ trucks/bowsers, operations, process management).
4. Cloud Experience: Strictly AWS EC2 (Ubuntu/Linux, Gunicorn, Nginx reverse proxy). NEVER claim AWS Lambda, Kubernetes, or Terraform.
5. AI Capabilities:
   - Multi-LLM API integrations (OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, Google Gemini 2.0 Flash / Pro, Vertex AI).
   - RAG pipelines: document ingestion (PDF, PPTX), semantic chunking, embeddings, vector search, grounded answer generation.
   - AI Video & Media: Google Veo 3, Kling, character/scene consistency, timeline animations, Fabric.js interactive canvas, ElevenLabs voice cloning/TTS, D-ID avatars.
   - Python & Flask REST backends, async IO, data pipelines, JSON/XML processing.
6. Salesforce: Trailhead Ranger with 10 Superbadges (MFA & SSO, Reports & Dashboards, Flow automation). This is self-directed platform learning, NOT a formal commercial certification.
7. Education (Fixed, do not hallucinate):
   - Bachelor of Information Technology (BIT) — University of Colombo, UCSC (2020 – 2023)
   - BSc Transport & Logistics Management — University of Moratuwa (2011 – 2016)

=== INSTRUCTIONS FOR TAILORING ===
1. DO NOT return common static elements like personal contact or education institutions in this JSON. Those are fixed on the client.
2. Return ONLY a valid JSON object matching the requested schema.
3. Align keywords, technical terminology, and framing directly with the target JD to maximize ATS score and recruiter appeal, while keeping every single bullet point 100% grounded in Thananjayan's verified capabilities.
4. "growingInto": Pick 2-3 genuine areas mentioned in the JD where Thananjayan can leverage his rapid learning ability (e.g. healthcare compliance, FinTech data governance, formal LLM evaluation frameworks, forward-deployed engineering).`;

    const userPrompt = `TARGET ROLE / TITLE: ${jobTitle || 'AI Full-Stack Engineer / AI Builder'}
TARGET COMPANY: ${companyName || 'Target Company'}

=== JOB DESCRIPTION ===
${jobDescription}

=== RETRIEVED CANDIDATE FACTUAL CONTEXT ===
${topContext}

Generate a tailored JSON response with the following exact keys:
{
  "targetTitle": "Authentic professional title tailored to the JD. MUST start with either 'FULLSTACK AI ENGINEER', 'PYTHON ENGINEER', 'FULLSTACK ENGINEER', or 'AI BUILDER', followed by a domain subtitle matching the JD (e.g. 'FULLSTACK AI ENGINEER | AI-POWERED SOLUTIONS & CLOUD ARCHITECTURE' or 'PYTHON ENGINEER | RAG PIPELINES, REST APIS & BACKEND SYSTEMS'). NEVER use 'SENIOR' or 'LEAD' in this title.",
  "summary": "Compelling 4-5 line professional summary highlighting proven production AI builds, RAG, Python/Flask, and independent shipping track record tailored to solve this JD's problems.",
  "coreSkills": [
    { "category": "Primary Domain (e.g. AI-Powered Building)", "skills": "Specific skills & responsibilities matching JD" },
    { "category": "LLM & Agentic Integration", "skills": "Models, prompting, structured output, RAG, tool calling" },
    { "category": "APIs & Data Handling", "skills": "REST APIs, JSON/XML, webhooks, document pipelines" },
    { "category": "Programming & Backend", "skills": "Python, Flask, JavaScript, SQL, Git" },
    { "category": "AI Video & Media Engineering", "skills": "Google Veo, Kling, Fabric.js, ElevenLabs TTS, D-ID" },
    { "category": "Cloud & Infrastructure", "skills": "AWS EC2, Linux/Ubuntu Server, Gunicorn, Nginx" },
    { "category": "Growing Into / Domain Alignment", "skills": "1-2 domain-specific skills from the JD he is expanding into" }
  ],
  "tailoredFlipickExperience": [
    "4-5 high-impact bullet points for Flipick (Apr 2023 - Present) tailored to this JD's priorities (using action verbs, exact technical stacks, and production achievements)"
  ],
  "tailoredProjects": [
    {
      "name": "AI-Powered Course Content Generation Platform",
      "subtitle": "Python / Flask / RAG / PPTX & SCORM",
      "bullets": [
        "1-2 tailored bullet points highlighting RAG, extraction, automated layout, and production use"
      ]
    },
    {
      "name": "AI Cinematic Video Generation & Editing Platform",
      "subtitle": "Google Veo 3 / Kling / In-App Video Editor",
      "bullets": [
        "1-2 tailored bullet points highlighting storyboards, character consistency, and custom editor pipeline"
      ]
    },
    {
      "name": "AI RAG Knowledge Base & Document Intelligence",
      "subtitle": "Python / OpenAI Embeddings / Vector Retrieval",
      "bullets": [
        "1-2 tailored bullet points highlighting chunking, retrieval accuracy, and structured question-answering"
      ]
    }
  ],
  "additionalLearning": [
    "Studying domain-specific practices relevant to JD (compliance, eval frameworks, etc.)",
    "Exploring formal AI evaluation and testing frameworks for production AI systems",
    "Salesforce platform development (Trailhead Ranger, 10 Superbadges completed) — Flow automation and process design"
  ],
  "coverLetter": {
    "salutation": "Dear Hiring Team,",
    "subject": "Application for [Target Title] at [Target Company]",
    "paragraphs": [
      "I am writing to express my strong enthusiasm for the [Target Title] position at [Target Company]. With 3+ years of experience independently designing, building, and deploying production AI systems and Python/Flask microservices at Flipick, I bring a demonstrated track record of taking complex requirements and shipping functional, high-value AI solutions.",
      "In reviewing your needs for [Target Company], I noted your emphasis on [key requirement from JD]. At Flipick, I engineered end-to-end RAG pipelines and integrated multiple leading LLM APIs (OpenAI, Anthropic Claude, Google Gemini), implementing prompt engineering, structured JSON validation, and retrieval accuracy optimizations.",
      "Beyond document intelligence, I developed an AI-powered course content generation engine (PDF to automated PPTX/SCORM layout) and an AI cinematic video creation platform with Google Veo 3 and Kling. All of these workflows were deployed and maintained on AWS EC2 with Gunicorn and Nginx reverse proxies, prioritizing uptime, speed, and real production utility over prototypes.",
      "My academic background includes a Bachelor of Information Technology (BIT) from the University of Colombo, UCSC, alongside Salesforce Trailhead Ranger recognition with 10 Superbadges, demonstrating my disciplined technical foundation and ability to master new platforms quickly.",
      "I would welcome the opportunity to discuss how my hands-on AI building experience, backend engineering skills, and independent shipping mindset can help [Target Company] achieve its technical goals. Thank you for your time and consideration."
    ],
    "signoff": "Sincerely,\nThananjayan Aruljothy\nAI Full-Stack Engineer"
  },
  "matchAnalysis": {
    "matchScore": 88,
    "matchedKeywords": ["Keyword1", "Keyword2", "Keyword3", "Keyword4", "Keyword5"],
    "keyStrengths": [
      "Strength 1 explaining direct match with JD",
      "Strength 2 explaining direct match with JD",
      "Strength 3 explaining direct match with JD"
    ],
    "customPitch": "A punchy, tailored 2-sentence hook for Thananjayan to use when reaching out or applying to this role."
  }
}`;

    const completionRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      })
    });

    if (!completionRes.ok) {
      const errData = await completionRes.json().catch(() => ({}));
      return res.status(completionRes.status).json({
        error: 'OpenAI API error',
        details: errData.error?.message || completionRes.statusText
      });
    }

    const completionData = await completionRes.json();
    const rawContent = completionData.choices?.[0]?.message?.content;

    let parsedResult;
    try {
      parsedResult = JSON.parse(rawContent);
    } catch (parseErr) {
      return res.status(500).json({
        error: 'Failed to parse JSON response from LLM',
        raw: rawContent
      });
    }

    return res.status(200).json({
      success: true,
      data: parsedResult
    });

  } catch (err) {
    console.error('Tailored CV Generation Error:', err);
    return res.status(500).json({
      error: 'Internal server error while generating tailored CV',
      details: err.message
    });
  }
}

