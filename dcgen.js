/**
 * Thananjayan.ai — Tailored CV Generator Studio (dcgen)
 * 
 * Merges verified master constants with dynamic RAG-tailored JSON
 * for any pasted Job Description, and generates high-resolution A4 PDFs.
 */

// === 1. VERIFIED CANDIDATE CONSTANTS (Never hallucinated, fixed baseline) ===
const CANDIDATE_CONSTANTS = {
  name: "THANANJAYAN ARULJOTHY",
  contact: {
    location: "Sri Lanka",
    workPreference: "Remote",
    phone: "+94 77 844 9255",
    email: "thananjayan1991@yahoo.com",
    portfolio: "portfolio-thananjayan.vercel.app",
    portfolioUrl: "https://portfolio-thananjayan.vercel.app/",
    github: "github.com/Thananjayan91",
    githubUrl: "https://github.com/Thananjayan91",
    linkedin: "linkedin.com/in/thananjayan-aruljothy",
    linkedinUrl: "https://linkedin.com/in/thananjayan-aruljothy",
    trailhead: "salesforce.com/trailblazer/taruljothy",
    trailheadUrl: "https://www.salesforce.com/trailblazer/taruljothy"
  },
  fixedExperiences: [
    {
      role: "Associate Software Engineer",
      company: "Eureka Innovations",
      dates: "Jan 2022 – Apr 2022",
      bullets: [
        "Developed web application features and interactive interfaces using JavaScript and Three.js.",
        "Contributed to AI-enabled EdTech products including Brainiverse and Xtramark."
      ]
    },
    {
      role: "Junior Web Developer",
      company: "KoceanSoft",
      dates: "Apr 2022 – Nov 2022",
      bullets: [
        "Developed and customized websites using HTML, CSS, JavaScript, and WordPress.",
        "Worked with Firebase configuration and backend integrations."
      ]
    },
    {
      role: "Logistics Officer",
      company: "INSEE Cement",
      dates: "Apr 2016 – Oct 2019",
      bullets: [
        "Managed logistics operations, ERP-based (SAP) order processing, deliveries, invoicing, and operational reporting.",
        "Coordinated with internal teams and external transportation partners to plan and execute delivery schedules."
      ]
    }
  ],
  education: [
    {
      degree: "Bachelor of Information Technology (BIT)",
      institution: "University of Colombo, UCSC",
      years: "2020 – 2023"
    },
    {
      degree: "BSc Transport & Logistics Management",
      institution: "University of Moratuwa",
      years: "2011 – 2016"
    }
  ],
  defaultSalesforceBadge: "Salesforce platform development (Trailhead Ranger, 10 Superbadges completed) — Flow automation and process design."
};

// === 2. INITIAL BASELINE (Matches Dispensed AI Builder CV format) ===
let currentDocType = 'cv'; // 'cv' or 'cl'

let activeCVData = {
  targetTitle: "FULLSTACK AI ENGINEER | AI-POWERED SOLUTIONS & CLOUD ARCHITECTURE",
  targetCompany: "Target Company",
  summary: "Software engineer with 3+ years of experience independently building and shipping AI-powered applications and automation pipelines that saw real production use — including an end-to-end AI content generation platform (PDF upload, RAG, AI-generated content, automated output as PPTX/SCORM) and an AI video generation platform (concept to character-consistent video to final rendered output). Comfortable coding and deploying independently, working with prompting, retrieval-augmented generation (RAG), APIs, and structured data handling. Bring a genuine, repeated track record of taking an unclear problem and shipping a working AI-powered solution on my own.",
  coreSkills: [
    {
      category: "AI-Powered Building",
      skills: "Independently designing, building, and deploying AI-powered applications and automation pipelines end to end"
    },
    {
      category: "LLM Integration",
      skills: "OpenAI, Anthropic Claude, Google Gemini, Vertex AI — prompting, structured output, retrieval-augmented generation (RAG)"
    },
    {
      category: "APIs & Data Handling",
      skills: "REST APIs, JSON/XML data processing, webhooks, document/data pipelines"
    },
    {
      category: "Programming & Backend",
      skills: "Python, Flask, JavaScript, SQL, Git"
    },
    {
      category: "AI Video & Image Generation",
      skills: "Google Veo 3, Kling — image-to-video generation, character/scene consistency"
    },
    {
      category: "Cloud",
      skills: "AWS EC2, Linux/Ubuntu Server, Gunicorn, Nginx"
    },
    {
      category: "Growing Into",
      skills: "Healthcare/regulated-industry data handling, formal AI evaluation frameworks, forward-deployed engineering"
    }
  ],
  tailoredFlipickExperience: [
    "Independently designed, built, and shipped AI-powered applications and pipelines used in real production workflows — not prototypes or internal demos.",
    "Built an AI content generation pipeline: PDF upload → RAG → AI-generated content → automated slide placement → PPTX/SCORM output, replacing manual content-creation work.",
    "Built a full AI video generation platform: concept → AI-generated characters/locations/props → storyboards → AI video clips (Google Veo, Kling) → custom in-app editor → final rendered output.",
    "Integrated LLM APIs (OpenAI, Anthropic Claude, Google Gemini/Vertex AI) into production features, handling prompting, structured output, and validating AI output for accuracy before use.",
    "Built backend APIs and data pipelines using Python and Flask, and deployed/maintained applications on AWS EC2 independently."
  ],
  tailoredProjects: [
    {
      name: "AI-Powered Course Content Generation Platform",
      subtitle: "Python / Flask / RAG / PPTX & SCORM",
      bullets: [
        "Built independently: PDF upload → RAG-based content extraction → AI-generated course content → automated slide layout → PPTX/SCORM export. Used in real content production, not a demo."
      ]
    },
    {
      name: "AI Cinematic Video Generation & Editing Platform",
      subtitle: "Google Veo 3 / Kling / In-App Video Editor",
      bullets: [
        "Built independently: concept → AI-generated characters/locations/props → storyboards → AI video generation (Veo, Kling) → custom in-app editor → final rendered MP4."
      ]
    },
    {
      name: "AI RAG Knowledge Base & Document Intelligence",
      subtitle: "Python / LLM / Vector Retrieval",
      bullets: [
        "Built independently: document ingestion, chunking, retrieval, and structured LLM-driven question-answering."
      ]
    }
  ],
  additionalLearning: [
    "Studying healthcare/regulated-industry data handling practices (patient data privacy, compliance frameworks).",
    "Exploring formal AI evaluation and testing frameworks for production AI systems.",
    "Salesforce platform development (Trailhead Ranger, 10 Superbadges completed) — Flow automation and process design."
  ],
  coverLetter: {
    salutation: "Dear Hiring Team,",
    subject: "Application for Senior Lead / AI Full-Stack Engineer at IFS",
    paragraphs: [
      "I am writing to express my strong enthusiasm for the Senior Lead position at IFS. With over 3 years of hands-on experience independently architecting, building, and deploying production AI systems and Python/Flask microservices at Flipick, I bring a demonstrated track record of taking complex requirements and shipping functional, high-value AI solutions.",
      "In reviewing your needs for IFS, I noted your emphasis on architecting robust backend workflows and deploying reliable AI capabilities. At Flipick, I engineered end-to-end RAG pipelines and integrated multiple leading LLM APIs (OpenAI, Anthropic Claude, Google Gemini), implementing prompt engineering, structured JSON validation, and retrieval accuracy optimizations.",
      "Beyond document intelligence, I developed an AI-powered course content generation engine (PDF to automated PPTX/SCORM layout) and an AI cinematic video creation platform with Google Veo 3 and Kling. All of these workflows were deployed and maintained on AWS EC2 with Gunicorn and Nginx reverse proxies, prioritizing uptime, speed, and real production utility over prototypes.",
      "My academic background includes a Bachelor of Information Technology (BIT) from the University of Colombo, UCSC, alongside Salesforce Trailhead Ranger recognition with 10 Superbadges, demonstrating my disciplined technical foundation and ability to master new platforms quickly.",
      "I would welcome the opportunity to discuss how my hands-on AI building experience, backend engineering skills, and independent shipping mindset can help IFS achieve its technical goals. Thank you for your time and consideration."
    ],
    signoff: "Sincerely,\nThananjayan Aruljothy\nAI Full-Stack Engineer"
  },
  matchAnalysis: {
    matchScore: 92,
    matchedKeywords: ["Python", "Flask", "RAG", "LLM Integration", "AWS EC2", "OpenAI", "Claude", "REST APIs"],
    keyStrengths: [
      "Proven track record shipping end-to-end AI applications into actual production workflows.",
      "Hands-on expertise across multi-modal AI (RAG document Q&A, voice synthesis, video models).",
      "Self-directed builder comfortable with full-lifecycle backend architecture and AWS EC2 deployments."
    ],
    customPitch: "I have 3+ years of experience independently architecting and deploying production AI applications—from multi-LLM RAG pipelines to generative media engines—using Python/Flask and AWS EC2."
  }
};

// === 3. PRESET JDS FOR 1-CLICK TESTING ===
const PRESETS = {
  aiBuilder: {
    title: "AI Builder / Applied AI Engineer",
    company: "Stealth AI / Tech Startup",
    jd: `We are seeking an autonomous AI Builder / Applied AI Engineer to design and deploy customer-facing GenAI products.
Responsibilities:
- Build production-ready workflows using LLM APIs (OpenAI, Claude, Gemini).
- Develop RAG pipelines for complex document analysis and structured data extraction.
- Create backend microservices using Python and Flask.
- Implement prompt engineering, structured JSON outputs, and evaluation safeguards.
- Deploy and manage applications on AWS cloud infrastructure.
Requirements:
- 3+ years software engineering experience with strong Python skills.
- Proven experience deploying generative AI features to real users.
- Independent builder mindset: can take fuzzy requirements and deliver production software.`
  },
  fullstackAI: {
    title: "Full-Stack AI Software Engineer",
    company: "Enterprise Cloud Platforms",
    jd: `Looking for a Full-Stack AI Engineer to develop AI-assisted web applications and media pipelines.
Responsibilities:
- Build responsive frontend features and interactive canvas tools (Fabric.js/JavaScript).
- Architect Python/Flask RESTful APIs and integrate external AI model endpoints.
- Handle document ingestion, vector embeddings, and real-time streaming LLM responses.
- Deploy services using AWS EC2, Gunicorn, and Nginx reverse proxies.
- Collaborate on audio/video generation and multi-modal AI integrations.
Requirements:
- Strong experience in Python, REST APIs, JavaScript, and AWS EC2.
- Practical experience with OpenAI / Anthropic APIs and RAG workflows.`
  },
  ragSpecialist: {
    title: "AI RAG & Document Intelligence Engineer",
    company: "Data & Knowledge Solutions",
    jd: `We are hiring a RAG & LLM Specialist to lead our document automation and question-answering systems.
Responsibilities:
- Build document processing pipelines (PDF, PPTX, text) with semantic chunking and vector search.
- Evaluate retrieval accuracy, context relevance, and hallucination reduction.
- Create secure REST APIs in Python for querying enterprise knowledge bases.
- Deploy scalable server environments on AWS EC2.
Requirements:
- Deep understanding of embeddings, cosine similarity, vector retrieval, and prompt optimization.
- Python backend expertise and ability to ship end-to-end solutions.`
  }
};

// === 4. RENDER CV TO A4 PAPER ===
function renderCV() {
  const paper = document.getElementById('cv-paper');
  if (!paper) return;

  const c = CANDIDATE_CONSTANTS;
  const data = activeCVData;

  paper.innerHTML = `
    <!-- Header -->
    <header class="cv-header">
      <h1 class="cv-name">${c.name}</h1>
      <div class="cv-target-title">${escapeHTML(data.targetTitle || 'FULLSTACK AI ENGINEER | AI-POWERED SOLUTIONS & CLOUD ARCHITECTURE')}</div>
      <div class="cv-contact-line">
        ${c.contact.location} | ${c.contact.workPreference} | 
        <a href="tel:${c.contact.phone}">${c.contact.phone}</a> | 
        <a href="mailto:${c.contact.email}">${c.contact.email}</a> | 
        <strong>Portfolio:</strong> <a href="${c.contact.portfolioUrl}" target="_blank" rel="noopener">${c.contact.portfolioUrl}</a><br />
        GitHub: <a href="${c.contact.githubUrl}" target="_blank" rel="noopener">${c.contact.github}</a> | 
        LinkedIn: <a href="${c.contact.linkedinUrl}" target="_blank" rel="noopener">${c.contact.linkedin}</a> | 
        Trailhead: <a href="${c.contact.trailheadUrl}" target="_blank" rel="noopener">${c.contact.trailhead}</a>
      </div>
    </header>

    <!-- Professional Summary -->
    <section class="cv-section">
      <h2 class="cv-section-title">Professional Summary</h2>
      <p class="cv-summary-text">${escapeHTML(data.summary)}</p>
    </section>

    <!-- Core Skills -->
    <section class="cv-section">
      <h2 class="cv-section-title">Core Skills</h2>
      <div class="cv-skills-block">
        ${(data.coreSkills || []).map(skill => `
          <div class="cv-skill-line">
            <span class="cv-skill-category">${escapeHTML(skill.category)}:</span> ${escapeHTML(skill.skills)}
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Professional Experience -->
    <section class="cv-section">
      <h2 class="cv-section-title">Professional Experience</h2>

      <!-- Flipick (Tailored via RAG) -->
      <div class="cv-job-entry">
        <div class="cv-job-header">
          <span class="cv-job-role-company">AI Full Stack Engineer — Flipick</span>
          <span class="cv-job-meta">India — Remote | Apr 2023 – Present</span>
        </div>
        <ul class="cv-bullet-list">
          ${(data.tailoredFlipickExperience || []).map(bullet => `
            <li>${escapeHTML(bullet)}</li>
          `).join('')}
        </ul>
      </div>

      <!-- Eureka Innovations (Fixed Master Record) -->
      <div class="cv-job-entry">
        <div class="cv-job-header">
          <span class="cv-job-role-company">Associate Software Engineer — Eureka Innovations</span>
          <span class="cv-job-meta">Jan 2022 – Apr 2022</span>
        </div>
        <ul class="cv-bullet-list">
          ${c.fixedExperiences[0].bullets.map(b => `<li>${escapeHTML(b)}</li>`).join('')}
        </ul>
      </div>

      <!-- KoceanSoft (Fixed Master Record) -->
      <div class="cv-job-entry">
        <div class="cv-job-header">
          <span class="cv-job-role-company">Junior Web Developer — KoceanSoft</span>
          <span class="cv-job-meta">Apr 2022 – Nov 2022</span>
        </div>
        <ul class="cv-bullet-list">
          ${c.fixedExperiences[1].bullets.map(b => `<li>${escapeHTML(b)}</li>`).join('')}
        </ul>
      </div>

      <!-- INSEE Cement (Fixed Master Record) -->
      <div class="cv-job-entry">
        <div class="cv-job-header">
          <span class="cv-job-role-company">Logistics Officer — INSEE Cement</span>
          <span class="cv-job-meta">Apr 2016 – Oct 2019</span>
        </div>
        <ul class="cv-bullet-list">
          ${c.fixedExperiences[2].bullets.map(b => `<li>${escapeHTML(b)}</li>`).join('')}
        </ul>
      </div>
    </section>

    <!-- Selected Build Examples / Key Projects -->
    <section class="cv-section">
      <h2 class="cv-section-title">Selected Build Examples</h2>
      ${(data.tailoredProjects || []).map(p => `
        <div class="cv-project-entry">
          <div class="cv-project-title">
            ${escapeHTML(p.name)} <span class="cv-project-tech">| ${escapeHTML(p.subtitle || '')}</span>
          </div>
          <ul class="cv-bullet-list">
            ${(p.bullets || []).map(b => `<li>${escapeHTML(b)}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </section>

    <!-- Education (Fixed Master Academic Record) -->
    <section class="cv-section">
      <h2 class="cv-section-title">Education</h2>
      ${c.education.map(edu => `
        <div class="cv-edu-item">
          <span class="cv-edu-degree">${edu.degree}</span> — <span class="cv-edu-inst">${edu.institution}</span> <span class="cv-edu-years">| ${edu.years}</span>
        </div>
      `).join('')}
    </section>

    <!-- Additional Learning / Platform Credentials -->
    <section class="cv-section">
      <h2 class="cv-section-title">Additional Learning & Platform Practice</h2>
      <ul class="cv-bullet-list">
        ${(data.additionalLearning || []).map(b => `<li>${escapeHTML(b)}</li>`).join('')}
      </ul>
    </section>
  `;

  renderMatchAnalytics();
}

function renderCoverLetter() {
  const paper = document.getElementById('cl-paper');
  if (!paper) return;

  const c = CANDIDATE_CONSTANTS;
  const data = activeCVData;
  const cl = data.coverLetter || {};

  const compInput = (document.getElementById('company-input')?.value || data.targetCompany || 'the Hiring Company').trim();
  const roleInput = (document.getElementById('job-title-input')?.value || data.targetTitle || 'AI Full-Stack Engineer').trim();
  const todayStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  paper.innerHTML = `
    <!-- Header -->
    <header class="cl-header">
      <h1 class="cl-name">${c.name}</h1>
      <div class="cl-target-title">${escapeHTML(roleInput)}</div>
      <div class="cl-contact-line">
        ${c.contact.location} | ${c.contact.workPreference} | 
        <a href="tel:${c.contact.phone}">${c.contact.phone}</a> | 
        <a href="mailto:${c.contact.email}">${c.contact.email}</a> | 
        <strong>Portfolio:</strong> <a href="${c.contact.portfolioUrl}" target="_blank" rel="noopener">${c.contact.portfolioUrl}</a><br />
        GitHub: <a href="${c.contact.githubUrl}" target="_blank" rel="noopener">${c.contact.github}</a> | 
        LinkedIn: <a href="${c.contact.linkedinUrl}" target="_blank" rel="noopener">${c.contact.linkedin}</a> | 
        Trailhead: <a href="${c.contact.trailheadUrl}" target="_blank" rel="noopener">${c.contact.trailhead}</a>
      </div>
    </header>

    <!-- Meta / Recipient Block -->
    <div class="cl-meta-block">
      <div class="cl-date">${todayStr}</div>
      <div class="cl-recipient">
        <strong>Hiring Team / Recruitment Manager</strong><br />
        ${escapeHTML(compInput)}
      </div>
      <div class="cl-subject">RE: Application for ${escapeHTML(roleInput)}</div>
      <div class="cl-salutation">${escapeHTML(cl.salutation || 'Dear Hiring Team,')}</div>
    </div>

    <!-- Letter Body -->
    <div class="cl-body">
      ${(cl.paragraphs || []).map(p => `<p class="cl-body-paragraph">${escapeHTML(p)}</p>`).join('')}
    </div>

    <!-- Formal Signoff -->
    <div class="cl-signoff">
      <p>Sincerely,</p>
      <p style="margin-top: 4pt; font-weight: 700; color: #0f172a;">${c.name}</p>
      <p style="font-weight: 400; font-size: 8.5pt; color: #475569;">${escapeHTML(roleInput)}</p>
    </div>
  `;
}

function switchDocumentTab(docType) {
  currentDocType = docType;
  const tabCV = document.getElementById('tab-cv');
  const tabCL = document.getElementById('tab-cl');
  const cvPaper = document.getElementById('cv-paper');
  const clPaper = document.getElementById('cl-paper');
  const dlLabel = document.getElementById('download-btn-label');

  if (docType === 'cl') {
    tabCL?.classList.add('active');
    tabCV?.classList.remove('active');
    if (cvPaper) cvPaper.style.display = 'none';
    if (clPaper) clPaper.style.display = 'block';
    if (dlLabel) dlLabel.textContent = 'Download Cover Letter (PDF)';
    renderCoverLetter();
  } else {
    tabCV?.classList.add('active');
    tabCL?.classList.remove('active');
    if (clPaper) clPaper.style.display = 'none';
    if (cvPaper) cvPaper.style.display = 'block';
    if (dlLabel) dlLabel.textContent = 'Download CV (PDF)';
    renderCV();
  }
}

function renderMatchAnalytics() {
  const card = document.getElementById('match-card');
  const scoreBadge = document.getElementById('match-score');
  const keywordsWrap = document.getElementById('match-keywords');
  const pitchBox = document.getElementById('match-pitch');

  if (!card || !activeCVData.matchAnalysis) return;

  const ma = activeCVData.matchAnalysis;
  if (scoreBadge) scoreBadge.textContent = `${ma.matchScore || 90}% Match`;

  if (keywordsWrap && Array.isArray(ma.matchedKeywords)) {
    keywordsWrap.innerHTML = ma.matchedKeywords.map(k => `<span class="keyword-badge">${escapeHTML(k)}</span>`).join('');
  }

  if (pitchBox && ma.customPitch) {
    pitchBox.innerHTML = `<strong>Quick Outreach Hook:</strong> "${escapeHTML(ma.customPitch)}"`;
  }

  card.classList.add('visible');
}

function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}

// === 5. FORM SUBMISSION & API CALL ===
async function handleGenerate(e) {
  e.preventDefault();

  const jdInput = document.getElementById('jd-input');
  const jobTitleInput = document.getElementById('job-title-input');
  const companyInput = document.getElementById('company-input');
  const apiKeyInput = document.getElementById('api-key-input');
  const generateBtn = document.getElementById('btn-generate');
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');

  const jd = (jdInput?.value || '').trim();
  if (jd.length < 20) {
    alert('Please paste a full Job Description (minimum 20 characters) so the RAG engine can tailor your CV.');
    jdInput?.focus();
    return;
  }

  // UI loading state
  generateBtn.disabled = true;
  statusIndicator.classList.add('active');
  statusText.textContent = 'Analyzing JD keywords & querying CV vector store...';

  try {
    const customKey = apiKeyInput?.value.trim() || undefined;

    setTimeout(() => {
      if (generateBtn.disabled) {
        statusText.textContent = 'Synthesizing tailored skills, summary, and experience JSON...';
      }
    }, 1800);

    let resData = null;

    try {
      const response = await fetch('/api/generate-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobDescription: jd,
          jobTitle: jobTitleInput?.value.trim() || '',
          companyName: companyInput?.value.trim() || '',
          apiKey: customKey
        })
      });

      if (response.ok) {
        resData = await response.json();
      } else if (response.status === 404 || response.status === 405) {
        console.warn('API endpoint not found (static server detected). Attempting browser-side fallback...');
      } else {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.details || `Generation failed (${response.status})`);
      }
    } catch (netErr) {
      console.warn('Network call to /api/generate-cv failed, trying browser direct fallback:', netErr);
    }

    // Direct Browser Fallback for VS Code Live Server
    if (!resData || !resData.data) {
      if (!customKey) {
        throw new Error(
          'Static dev server detected (e.g. Live Server). To test locally, either:\n' +
          '1. Enter your OpenAI API Key in the field above, OR\n' +
          '2. Run "node server.js" in terminal and open http://localhost:3000/dcgen'
        );
      }

      statusText.textContent = 'Calling OpenAI API directly from browser...';

      // Fetch active cv_index chunks
      let cvContext = '';
      try {
        const cvRes = await fetch('./data/cv_index.json');
        if (cvRes.ok) {
          const cvJson = await cvRes.json();
          cvContext = (cvJson.chunks || []).slice(0, 4).map(c => `[${c.title}]\n${c.text}`).join('\n\n');
        }
      } catch (e) {
        console.warn('Could not load local cv_index.json:', e);
      }

      const clientPrompt = `You are an elite Tech Career Architect tailoring Thananjayan Aruljothy's CV for a specific Job Description.

STRICT FACTUAL GUARDRAILS:
1. Candidate: Thananjayan Aruljothy
2. Primary Role: Flipick (April 2023 – Present), AI Full Stack Engineer / AI Developer (India — Remote).
   STRICT TITLE RULE: Thananjayan has ~3+ years experience. DO NOT label him 'Senior Software Engineer' (SSE), 'Senior Developer', or 'Lead' in his title.
   targetTitle MUST start with either:
   - 'FULLSTACK AI ENGINEER' (if JD emphasizes LLMs, RAG, GenAI apps)
   - 'PYTHON ENGINEER' or 'PYTHON BACKEND ENGINEER' (if JD emphasizes Python/Flask/APIs)
   - 'FULLSTACK ENGINEER' (if JD emphasizes full-stack web applications)
   - 'AI BUILDER' (if JD emphasizes hands-on shipping of AI tools)
   followed by a matching domain subtitle (e.g. 'FULLSTACK AI ENGINEER | AI-POWERED SOLUTIONS & CLOUD ARCHITECTURE'). NEVER use 'SENIOR' or 'LEAD' in this title.
3. Cloud: Strictly AWS EC2 (Ubuntu/Linux, Gunicorn, Nginx reverse proxy). NEVER claim AWS Lambda or Kubernetes.
4. AI Capabilities: Multi-LLM APIs (OpenAI, Claude, Gemini), RAG pipelines, Veo 3 / Kling video, Fabric.js canvas, ElevenLabs TTS, D-ID avatars, Python Flask backends.
5. Salesforce: Trailhead Ranger with 10 Superbadges (self-directed learning, not commercial certification).
6. Return ONLY a valid JSON object matching the requested schema.

TARGET ROLE: ${jobTitleInput?.value.trim() || 'AI Full-Stack Engineer / AI Builder'}
TARGET COMPANY: ${companyInput?.value.trim() || 'Target Company'}

=== JOB DESCRIPTION ===
${jd}

=== RETRIEVED CANDIDATE CONTEXT ===
${cvContext}

Generate JSON matching this exact structure:
{
  "targetTitle": "Authentic title starting with FULLSTACK AI ENGINEER, PYTHON ENGINEER, FULLSTACK ENGINEER, or AI BUILDER + domain subtitle. NO 'SENIOR' or 'LEAD'.",
  "summary": "Tailored 4-line professional summary addressing JD pain points.",
  "coreSkills": [
    { "category": "Domain", "skills": "Skills matching JD" }
  ],
  "tailoredFlipickExperience": [
    "4-5 high impact bullet points matching JD requirements"
  ],
  "tailoredProjects": [
    { "name": "AI-Powered Course Content Generation Platform", "subtitle": "Python / Flask / RAG / PPTX & SCORM", "bullets": ["1-2 bullets"] },
    { "name": "AI Cinematic Video Generation & Editing Platform", "subtitle": "Google Veo 3 / Kling / In-App Video Editor", "bullets": ["1-2 bullets"] },
    { "name": "AI RAG Knowledge Base & Document Intelligence", "subtitle": "Python / LLM / Vector Retrieval", "bullets": ["1-2 bullets"] }
  ],
  "additionalLearning": [
    "Studying domain practices matching JD",
    "Exploring formal AI evaluation frameworks",
    "Salesforce platform development (Trailhead Ranger, 10 Superbadges completed) — Flow automation and process design"
  ],
  "matchAnalysis": {
    "matchScore": 92,
    "matchedKeywords": ["Keyword1", "Keyword2", "Keyword3"],
    "keyStrengths": ["Strength 1", "Strength 2"],
    "customPitch": "2-sentence outreach pitch"
  }
}`;

      const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an expert resume architect. Return strictly valid JSON.' },
            { role: 'user', content: clientPrompt }
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' }
        })
      });

      if (!openAiRes.ok) {
        const errJson = await openAiRes.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `OpenAI error (${openAiRes.status})`);
      }

      const openAiData = await openAiRes.json();
      resData = { data: JSON.parse(openAiData.choices[0].message.content) };
    }

    if (!resData || !resData.data) {
      throw new Error('Invalid response structure received from generator');
    }

    // Merge generated JSON into active CV state
    activeCVData = {
      ...activeCVData,
      ...resData.data
    };

    // Re-render CV
    renderCV();

    // Scroll preview into view on mobile
    if (window.innerWidth < 1100) {
      document.getElementById('right-panel')?.scrollIntoView({ behavior: 'smooth' });
    }

    statusText.textContent = 'Done! Tailored CV generated successfully.';
    setTimeout(() => {
      statusIndicator.classList.remove('active');
    }, 2500);

  } catch (err) {
    console.error('Tailor error:', err);
    alert(`Generation Error: ${err.message}`);
    statusIndicator.classList.remove('active');
  } finally {
    generateBtn.disabled = false;
  }
}

// === 6. PDF EXPORT & TOOLBAR ACTIONS ===
function getDownloadFilename(docType = 'CV') {
  const compInput = (document.getElementById('company-input')?.value || activeCVData.targetCompany || '').trim();
  const titleInput = (document.getElementById('job-title-input')?.value || activeCVData.targetTitle || 'Senior_Lead').trim();

  const sanitize = (str) => str.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');

  const companyClean = sanitize(compInput) || 'General';
  const roleClean = sanitize(titleInput) || 'Software_Engineer';

  if (docType === 'Cover_Letter') {
    return `Thananjayan_Aruljothy_Cover_Letter_${companyClean}_${roleClean}.pdf`;
  }
  return `Thananjayan_Aruljothy_CV_${companyClean}_${roleClean}.pdf`;
}

function downloadPDF() {
  const isCoverLetter = currentDocType === 'cl';
  const targetElement = isCoverLetter ? document.getElementById('cl-paper') : document.getElementById('cv-paper');
  if (!targetElement) return;

  const rawFilename = getDownloadFilename(isCoverLetter ? 'Cover_Letter' : 'CV');
  const filenameWithoutExt = rawFilename.replace(/\.pdf$/i, '');

  // Temporarily set document.title so browser print "Save as PDF" pre-fills the exact tailored filename!
  const originalTitle = document.title;
  document.title = filenameWithoutExt;

  const restoreTitle = () => {
    document.title = originalTitle;
    window.removeEventListener('afterprint', restoreTitle);
  };

  window.addEventListener('afterprint', restoreTitle);
  setTimeout(restoreTitle, 4000);

  // Trigger high-definition native ATS Vector PDF engine (perfect margins, crisp vector fonts, clickable links)
  window.print();
}

function copyMarkdown() {
  const d = activeCVData;
  const c = CANDIDATE_CONSTANTS;

  if (currentDocType === 'cl') {
    const cl = d.coverLetter || {};
    const compInput = (document.getElementById('company-input')?.value || d.targetCompany || 'the Hiring Company').trim();
    const roleInput = (document.getElementById('job-title-input')?.value || d.targetTitle || 'AI Full-Stack Engineer').trim();
    const todayStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const clText = `${c.name}
${c.contact.location} | ${c.contact.phone} | ${c.contact.email}
Portfolio: ${c.contact.portfolioUrl} | GitHub: https://${c.contact.github} | LinkedIn: https://${c.contact.linkedin}

${todayStr}

To: Hiring Team / Recruitment Manager
${compInput}

RE: Application for ${roleInput}

${cl.salutation || 'Dear Hiring Team,'}

${(cl.paragraphs || []).join('\n\n')}

Sincerely,
${c.name}
${roleInput}
`;
    navigator.clipboard.writeText(clText).then(() => {
      alert('Cover Letter copied to clipboard!');
    }).catch(() => {
      alert('Unable to copy automatically. Please select text manually.');
    });
    return;
  }

  const md = `# ${c.name}
**${d.targetTitle}**
${c.contact.location} | ${c.contact.workPreference} | ${c.contact.phone} | ${c.contact.email}
Portfolio: ${c.contact.portfolioUrl} | GitHub: https://${c.contact.github} | LinkedIn: https://${c.contact.linkedin} | Trailhead: https://${c.contact.trailhead}

---

## PROFESSIONAL SUMMARY
${d.summary}

---

## CORE SKILLS
${(d.coreSkills || []).map(s => `- **${s.category}:** ${s.skills}`).join('\n')}

---

## PROFESSIONAL EXPERIENCE

### AI Full Stack Engineer — Flipick
*India — Remote | Apr 2023 – Present*
${(d.tailoredFlipickExperience || []).map(b => `- ${b}`).join('\n')}

### Associate Software Engineer — Eureka Innovations
*Jan 2022 – Apr 2022*
${c.fixedExperiences[0].bullets.map(b => `- ${b}`).join('\n')}

### Junior Web Developer — KoceanSoft
*Apr 2022 – Nov 2022*
${c.fixedExperiences[1].bullets.map(b => `- ${b}`).join('\n')}

### Logistics Officer — INSEE Cement
*Apr 2016 – Oct 2019*
${c.fixedExperiences[2].bullets.map(b => `- ${b}`).join('\n')}

---

## SELECTED BUILD EXAMPLES
${(d.tailoredProjects || []).map(p => `### ${p.name} | ${p.subtitle}\n${(p.bullets || []).map(b => `- ${b}`).join('\n')}`).join('\n\n')}

---

## EDUCATION
${c.education.map(e => `- **${e.degree}** — ${e.institution} (${e.years})`).join('\n')}

---

## ADDITIONAL LEARNING & PLATFORM PRACTICE
${(d.additionalLearning || []).map(b => `- ${b}`).join('\n')}
`;

  navigator.clipboard.writeText(md).then(() => {
    alert('CV copied to clipboard in clean ATS Markdown format!');
  }).catch(() => {
    alert('Unable to copy automatically. Please select text manually.');
  });
}

function toggleEditMode() {
  const paper = currentDocType === 'cl' ? document.getElementById('cl-paper') : document.getElementById('cv-paper');
  const btn = document.getElementById('btn-edit-toggle');
  const banner = document.getElementById('edit-banner');
  if (!paper || !btn) return;

  const isEditable = paper.getAttribute('contenteditable') === 'true';
  if (isEditable) {
    paper.setAttribute('contenteditable', 'false');
    btn.classList.remove('active');
    btn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Live';
    banner?.classList.remove('visible');
  } else {
    paper.setAttribute('contenteditable', 'true');
    btn.classList.add('active');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Finish Editing';
    banner?.classList.add('visible');
  }
}

// === 7. INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
  // Render initial default documents
  renderCV();
  renderCoverLetter();

  // Attach form listeners
  const form = document.getElementById('jd-form');
  if (form) form.addEventListener('submit', (e) => handleGenerate(e));

  // Dedicated Cover Letter generation button
  const btnGenCL = document.getElementById('btn-generate-cl');
  if (btnGenCL) {
    btnGenCL.addEventListener('click', async (e) => {
      await handleGenerate(e);
      switchDocumentTab('cl');
    });
  }

  // Document tab listeners (CV vs Cover Letter)
  document.getElementById('tab-cv')?.addEventListener('click', () => switchDocumentTab('cv'));
  document.getElementById('tab-cl')?.addEventListener('click', () => switchDocumentTab('cl'));

  // Attach toolbar listeners
  document.getElementById('btn-download-pdf')?.addEventListener('click', downloadPDF);
  document.getElementById('btn-copy-md')?.addEventListener('click', copyMarkdown);
  document.getElementById('btn-edit-toggle')?.addEventListener('click', toggleEditMode);

  // Presets listeners
  document.querySelectorAll('.preset-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const key = pill.dataset.preset;
      const p = PRESETS[key];
      if (p) {
        const jdInput = document.getElementById('jd-input');
        const titleInput = document.getElementById('job-title-input');
        const compInput = document.getElementById('company-input');

        if (jdInput) jdInput.value = p.jd;
        if (titleInput) titleInput.value = p.title;
        if (compInput) compInput.value = p.company;

        jdInput?.focus();
      }
    });
  });

  // API Key accordion toggle
  const apiHeader = document.getElementById('api-key-header');
  const apiBody = document.getElementById('api-key-body');
  apiHeader?.addEventListener('click', () => {
    apiBody?.classList.toggle('open');
  });
});

