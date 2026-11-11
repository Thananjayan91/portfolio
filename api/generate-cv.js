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
      // Include all indexed chunks (sorted by relevance) so no verified facts are omitted
      topContext = scoredChunks.map(c => `[${c.title}]\n${c.text}`).join('\n\n');
    }

    // 3. Prompt OpenAI LLM for Pure JSON Output
    const systemPrompt = `You are an elite Executive Tech Career Architect and ATS Optimization Specialist tailoring Thananjayan Aruljothy's CV for a specific Job Description (JD).

=== STRICT ANTI-HALLUCINATION & EVIDENCE-BASED GROUNDING RULES (CRITICAL) ===
0. ZERO FABRICATION RULE (HIGHEST PRIORITY):
   - You MUST ONLY list skills, technologies, tools, programming languages, and domain experience that EXPLICITLY appear in the RETRIEVED CANDIDATE FACTUAL CONTEXT (his indexed CV) below.
   - NEVER copy or mirror unfamiliar technologies, responsibilities, or industry domains from the JD (e.g. "maritime software", "maritime operations", "dry dock", "offline functionality", "offline data synchronization", "FinTech", "Healthcare", "Java", "C#/.NET", "Kubernetes", "AWS Lambda", "Terraform", "PyTorch/TensorFlow model training") into his Headline (targetTitle), Summary, Core Skills, or Flipick Experience as if he already has them!
   - If the JD mentions skills/domains Thananjayan does NOT have in his indexed CV, put those ONLY in the "Growing Into / Domain Alignment" skill row and "additionalLearning" section, explicitly framed as areas he is learning/expanding into — NEVER claim them as verified experience.
   - How to tailor truthfully: Reorder and spotlight his REAL verified skills from the indexed CV that best support the JD (for instance, if a JD values reliable operational software, highlight his Python/Flask APIs, AWS EC2 deployments, structured data handling, and his real 3.5 years of transport/logistics & SAP ERP experience at INSEE Cement).

=== STRICT FACTUAL GUARDRAILS (NEVER VIOLATE OR HALLUCINATE) ===
1. Candidate: Thananjayan Aruljothy
2. Primary Professional Role: Flipick (April 2023 – Present), AI Full Stack Engineer / AI Developer (India — Remote).
   STRICT TITLE RULE: Thananjayan has ~3+ years of professional engineering experience. DO NOT label him "Senior Software Engineer" (SSE), "Senior Developer", or "Lead" in his title or headline. Even if the target JD is for a Senior role, his own headline (targetTitle) MUST authentically choose between:
   - "FULLSTACK AI ENGINEER" (if the JD emphasizes LLMs, RAG, GenAI apps, AI agents)
   - "PYTHON ENGINEER" or "PYTHON BACKEND ENGINEER" (if the JD emphasizes Python, Flask, REST APIs, microservices)
   - "FULLSTACK ENGINEER" (if the JD emphasizes full-stack web application development)
   - "AI BUILDER" (if the JD emphasizes hands-on shipping of AI tools and automations)
   followed by a tech-stack subtitle drawn STRICTLY from his VERIFIED skills (e.g. "FULLSTACK AI ENGINEER | PYTHON, LLM APIS & CLOUD DEPLOYMENT" or "PYTHON ENGINEER | FLASK, REST APIS & AI WORKFLOWS"). NEVER include the employer's unfamiliar industry (such as "MARITIME SOFTWARE") in targetTitle.
3. Previous Experience:
   - Eureka Innovations (Jan 2022 – Apr 2022): Associate Software Engineer (JavaScript, Three.js, EdTech features).
   - KoceanSoft (Apr 2022 – Nov 2022): Junior Web Developer (HTML, CSS, JS, WordPress, Firebase).
   - INSEE Cement (Apr 2016 – Oct 2019): Logistics Officer (SAP ERP, 100+ trucks/bowsers, operations, external transport coordination).
4. Cloud & Deployment: Strictly AWS EC2, Linux/Ubuntu & Windows servers, Gunicorn, Nginx reverse proxy, Git. NEVER claim AWS Lambda, Kubernetes, Terraform, or Docker/CI/CD ownership.
5. Verified Technical & AI Capabilities:
   - Backend & APIs: Python, Flask, REST APIs, JSON, XML processing, Mailchimp integration.
   - LLM & GenAI: OpenAI, Anthropic Claude, Google Gemini API integrations; RAG document Q&A (PDF/PPTX ingestion, semantic chunking, vector retrieval, answer generation), Claude Code.
   - Frontend & Media: JavaScript, Fabric.js interactive canvas, Google TTS, ElevenLabs TTS, D-ID avatar integration, PowerPoint/PPTX export, LMS ZIP export; exposure to Angular/Node.js in AI-assisted projects.
   - AI Video: Google Veo 3, Gemini, scene/character asset generation, in-app video editor.
6. Salesforce: Trailhead Ranger with 10 Superbadges (MFA & SSO, Reports & Dashboards, Flow automation). Self-directed platform learning ONLY, NOT paid work experience or commercial certification.
7. Education (Fixed, do not hallucinate):
   - Bachelor of Information Technology (BIT) — University of Colombo, UCSC (2020 – 2023)
   - BSc Transport & Logistics Management — University of Moratuwa (2011 – 2016)
8. NO FAKE METRICS: Do not invent unverified percentages (like "30% faster"), user counts, or customer impact claims unless explicitly stated in the retrieved context.

=== INSTRUCTIONS FOR TAILORING ===
1. DO NOT return common static elements like personal contact or education institutions in this JSON. Those are fixed on the client.
2. Return ONLY a valid JSON object matching the requested schema.
3. Prioritize and rephrase his REAL verified achievements from the retrieved context to show strong fit for the JD without inventing unverified JD skills or domain claims.
4. "Growing Into / Domain Alignment": Identify 1-2 unfamiliar technologies or domain concepts from the JD (e.g., offline synchronization, maritime operations, healthcare compliance) and state clearly that he is expanding/learning into them.`;

    const targetRoleName = (jobTitle || '').trim() || 'Software Engineer';
    const targetCompanyName = (companyName || '').trim() || 'Target Company';

    const userPrompt = `TARGET ROLE / TITLE TO APPLY FOR: ${targetRoleName}
TARGET COMPANY: ${targetCompanyName}

=== JOB DESCRIPTION ===
${jobDescription}

=== RETRIEVED CANDIDATE FACTUAL CONTEXT ===
${topContext}

Generate a tailored JSON response with the following exact keys:
{
  "targetTitle": "Authentic professional title using ONLY Thananjayan's VERIFIED skills. MUST start with 'FULLSTACK AI ENGINEER', 'PYTHON ENGINEER', 'FULLSTACK ENGINEER', or 'AI BUILDER', followed by a subtitle of his REAL tech stack relevant to the JD (e.g. 'FULLSTACK AI ENGINEER | PYTHON, LLM APIS & CLOUD DEPLOYMENT' or 'PYTHON ENGINEER | FLASK BACKENDS, REST APIS & AWS EC2'). NEVER put 'SENIOR', 'LEAD', or unfamiliar JD industries like 'MARITIME SOFTWARE'.",
  "targetCountry": "Country of the job location extracted from the JD (e.g. 'Norway', 'Singapore', 'United Kingdom', 'Germany', 'Australia', etc.), or empty string '' if unspecified or Remote-only.",
  "summary": "Compelling 4-5 line professional summary strictly grounded in Thananjayan's VERIFIED indexed CV (3+ years at Flipick, Python/Flask, REST APIs, multi-LLM integrations, RAG pipelines, AWS EC2, plus INSEE Cement SAP/logistics background if operationally relevant). NEVER claim prior experience in unfamiliar JD domains (like maritime software or offline sync).",
  "coreSkills": [
    { "category": "Primary Domain (Verified)", "skills": "ONLY verified strengths from his indexed CV most relevant to this JD (e.g. Full-stack web applications, Python/Flask APIs, AI workflow automation, operational/SAP logistics coordination). NEVER copy unverified JD responsibilities here." },
    { "category": "LLM & Agentic Integration", "skills": "OpenAI GPT-4o, Anthropic Claude, Google Gemini APIs, RAG document Q&A, prompt engineering, structured JSON output" },
    { "category": "APIs & Data Handling", "skills": "REST APIs, JSON/XML processing, PDF/PPTX document ingestion, Mailchimp & third-party service integrations" },
    { "category": "Programming & Backend", "skills": "Python, Flask, JavaScript, Fabric.js, Git, Claude Code (exposure to Node.js & Angular in AI-assisted projects)" },
    { "category": "AI Video & Media Engineering", "skills": "Google Veo 3, Kling, ElevenLabs TTS, Google TTS, D-ID avatars, interactive canvas editing" },
    { "category": "Cloud & Infrastructure", "skills": "AWS EC2, Linux/Ubuntu & Windows Servers, Gunicorn, Nginx reverse proxy" },
    { "category": "Growing Into / Domain Alignment", "skills": "ONLY here: 1-2 unfamiliar JD skills/domains he is actively learning or expanding into (e.g. 'Expanding into offline-first architecture, data synchronization, and maritime domain workflows')" }
  ],
  "tailoredFlipickExperience": [
    "4-5 accurate bullet points strictly grounded in verified Flipick work (Python/Flask, REST APIs, OpenAI/Claude/Gemini, RAG document QA, PDF/PPTX/SCORM export, interactive video/course editor, AWS EC2/Gunicorn/Nginx, Git, Claude Code). Emphasize aspects most relevant to the JD WITHOUT inventing JD-domain claims or fake metrics."
  ],
  "tailoredProjects": [
    {
      "name": "AI-Powered Course Content Generation Platform",
      "subtitle": "Python / Flask / RAG / PPTX & SCORM",
      "bullets": [
        "1-2 grounded bullet points highlighting PDF/PPTX ingestion, LLM content workflows, automated slide layout, and export"
      ]
    },
    {
      "name": "AI Cinematic Video Generation & Editing Platform",
      "subtitle": "Google Veo 3 / Gemini / In-App Video Editor",
      "bullets": [
        "1-2 grounded bullet points highlighting scene/asset generation, AI video integration, and in-app editor workflows"
      ]
    },
    {
      "name": "AI RAG Knowledge Base & Document Intelligence",
      "subtitle": "Python / Flask / OpenAI Embeddings / Vector Retrieval",
      "bullets": [
        "1-2 grounded bullet points highlighting document upload, semantic vectorization, and grounded LLM Q&A"
      ]
    }
  ],
  "additionalLearning": [
    "Studying domain-specific practices relevant to the target JD (e.g. offline data synchronization, domain architecture, or compliance)",
    "Exploring formal AI evaluation and testing practices for production AI workflows",
    "Salesforce platform development (Trailhead Ranger, 10 Superbadges completed) — Flow automation, MFA/SSO, Reports & Dashboards"
  ],
  "coverLetter": {
    "salutation": "Dear Hiring Team,",
    "subject": "RE: Application for ${targetRoleName}",
    "paragraphs": [
      "I am writing to express my strong enthusiasm for the ${targetRoleName} position at ${targetCompanyName}. With 3+ years of experience independently designing, building, and deploying production AI systems and Python/Flask microservices at Flipick, I bring a demonstrated track record of taking complex requirements and shipping functional, high-value AI solutions.",
      "In reviewing your needs for ${targetCompanyName}, I noted your emphasis on [key requirement from JD]. At Flipick, I engineered end-to-end RAG pipelines and integrated multiple leading LLM APIs (OpenAI, Anthropic Claude, Google Gemini), implementing prompt engineering, structured JSON validation, and retrieval accuracy optimizations.",
      "Beyond document intelligence, I developed an AI-powered course content generation engine (PDF to automated PPTX/SCORM layout) and an AI cinematic video creation platform with Google Veo 3 and Kling. All of these workflows were deployed and maintained on AWS EC2 with Gunicorn and Nginx reverse proxies, prioritizing uptime, speed, and real production utility over prototypes.",
      "My academic background includes a Bachelor of Information Technology (BIT) from the University of Colombo, UCSC, alongside Salesforce Trailhead Ranger recognition with 10 Superbadges, demonstrating my disciplined technical foundation and ability to master new platforms quickly.",
      "I would welcome the opportunity to discuss how my hands-on AI building experience, backend engineering skills, and independent shipping mindset can help ${targetCompanyName} achieve its technical goals. Thank you for your time and consideration."
    ],
    "signoff": "Sincerely,\\nThananjayan Aruljothy\\nFullstack AI Engineer"
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

