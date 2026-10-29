/**
 * Thananjayan.ai - Interactive Engine
 * Neural Background, Interactive Circuit, Projects Switcher, RAG Chatbot & Admin CV Indexer
 */

let activeCVIndex = null;
let customApiKey = localStorage.getItem('thananjayan_openai_key') || '';

document.addEventListener('DOMContentLoaded', async () => {
  initNeuralCanvas();
  initSkillsCircuit();
  initProjectsShowcase();
  await loadInitialVectorIndex();
  initRagChatbot();
  initNavigation();
  initCopyBio();
  initAdminRAGModal();
});

/* ===================================================================
   Cosine Similarity & Client-Side OpenAI Fallback (For VS Code Live Server)
   =================================================================== */
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

async function callOpenAIEmbeddingsDirect(texts, apiKey) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
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
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenAI error ${res.status}: ${res.statusText}`);
  }
  return await res.json();
}

async function callOpenAIChatDirect(query, contextText, apiKey) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
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
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenAI error ${res.status}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content;
}
async function loadInitialVectorIndex() {
  // Always prioritize the committed permanent data/cv_index.json
  try {
    const res = await fetch('./data/cv_index.json?v=' + Date.now());
    if (res.ok) {
      activeCVIndex = await res.json();
      updateAdminStatusUI();
      return;
    }
  } catch (err) {
    console.warn('Could not load data/cv_index.json:', err);
  }

  // Secondary fallback to localStorage if available
  const cached = localStorage.getItem('thananjayan_active_index');
  if (cached) {
    try {
      activeCVIndex = JSON.parse(cached);
      updateAdminStatusUI();
    } catch (e) {
      console.warn('Could not parse cached index');
    }
  }
}

function updateAdminStatusUI() {
  if (!activeCVIndex) return;
  const docTitleEl = document.getElementById('status-doc-title');
  const chunksCountEl = document.getElementById('status-chunks-count');
  const lastIndexedEl = document.getElementById('status-last-indexed');

  if (docTitleEl) docTitleEl.textContent = activeCVIndex.documentTitle || 'Verified CV';
  if (chunksCountEl) chunksCountEl.textContent = `${activeCVIndex.chunks?.length || 0} Chunks`;
  if (lastIndexedEl && activeCVIndex.lastIndexed) {
    const date = new Date(activeCVIndex.lastIndexed);
    lastIndexedEl.textContent = date.toLocaleDateString();
  }
}

/* ===================================================================
   2. Interactive Background Neural Canvas (Constellation & Particles)
   =================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 1,
      color: Math.random() > 0.4 ? 'rgba(56, 189, 248, ' : 'rgba(168, 85, 247, '
    });
  }

  let mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.7)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 140) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - mdist / 140) * 0.35})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ===================================================================
   3. Interactive Neural Skills Circuit
   =================================================================== */
const SKILLS_DATA = {
  python: {
    name: 'Python & Flask',
    percent: 95,
    desc: 'Primary language & framework for building scalable REST APIs, AI agent microservices, data processing pipelines, and web applications.',
    tags: ['Python 3.x', 'Flask', 'FastAPI', 'AsyncIO', 'Data Processing']
  },
  openai: {
    name: 'OpenAI API & LLMs',
    percent: 95,
    desc: 'Deep specialization in prompt engineering, function calling, structured JSON output, tool use, embeddings, and autonomous agent workflows.',
    tags: ['GPT-4o', 'Function Calling', 'Embeddings', 'AI Workflows']
  },
  aws: {
    name: 'AWS Cloud EC2 & Lambda',
    percent: 90,
    desc: 'Deploying, managing, and automating high-availability production workloads on AWS EC2 (Ubuntu & Windows Server) and serverless AWS Lambda.',
    tags: ['AWS EC2', 'AWS Lambda', 'S3', 'Linux / Ubuntu', 'DevOps']
  },
  gemini: {
    name: 'Google Gemini & Claude AI',
    percent: 92,
    desc: 'Multi-modal reasoning pipelines, Anthropic Claude API tool-use integration, large-context document analysis, and generative workflows.',
    tags: ['Gemini 1.5/2.0', 'Claude 3.5 Sonnet', 'Multi-modal', 'Document Q&A']
  },
  fabric: {
    name: 'Fabric.js Canvas Engine',
    percent: 90,
    desc: 'Developing interactive HTML5 canvas editors, creative design tools, and asset manipulation systems for AI-generated visual content.',
    tags: ['Fabric.js', 'Canvas API', 'SVG Rendering', 'Interactive Tools']
  },
  javascript: {
    name: 'JavaScript & Modern Web',
    percent: 88,
    desc: 'Modern ES6+, DOM manipulation, responsive UI/UX architecture, component workflows, and real-time client-side experiences.',
    tags: ['JavaScript ES6+', 'HTML5', 'CSS3', 'REST Integration', 'UI/UX']
  },
  restapi: {
    name: 'REST APIs & Microservices',
    percent: 92,
    desc: 'Designing clean, secure, and performant RESTful endpoints, CORS security, JWT authentication, and high-concurrency request routing.',
    tags: ['RESTful Design', 'JSON', 'Microservices', 'Authentication', 'Webhooks']
  },
  threejs: {
    name: 'Three.js 3D Rendering',
    percent: 80,
    desc: 'Involved in 3D rendering for EdTech applications (Brainiverse & Xtramark), custom geometries, lighting, and browser animations.',
    tags: ['Three.js', 'WebGL', '3D Scene Graphs', 'OrbitControls']
  },
  rag: {
    name: 'RAG & Vector Retrieval',
    percent: 90,
    desc: 'Context-augmented AI generation, semantic chunking, vector similarity search, embeddings stores, and hallucination reduction.',
    tags: ['RAG Architecture', 'Vector DB', 'Semantic Search', 'Embeddings']
  },
  salesforce: {
    name: 'Salesforce Certified Specialist',
    percent: 85,
    desc: 'Superbadge certified in Multi-Factor Authentication (MFA), SSO Settings, Lightning Experience Reports & Dashboards, and App Customization.',
    tags: ['MFA & SSO Superbadge', 'Lightning Reports', 'Dashboards', 'App Customization']
  }
};

function initSkillsCircuit() {
  const nodes = document.querySelectorAll('.circuit-node');
  const nameEl = document.getElementById('skill-name');
  const percentEl = document.getElementById('skill-percent');
  const meterEl = document.getElementById('skill-meter');
  const descEl = document.getElementById('skill-desc');
  const tagsEl = document.getElementById('skill-tags');

  if (!nodes.length || !nameEl) return;

  function setSkill(skillKey) {
    const data = SKILLS_DATA[skillKey];
    if (!data) return;

    nodes.forEach(n => n.classList.remove('node-active'));
    const activeNode = document.querySelector(`.circuit-node[data-skill="${skillKey}"]`);
    if (activeNode) activeNode.classList.add('node-active');

    nameEl.textContent = data.name;
    percentEl.textContent = `${data.percent}%`;
    meterEl.style.width = `${data.percent}%`;
    descEl.textContent = data.desc;

    tagsEl.innerHTML = '';
    data.tags.forEach(t => {
      const pill = document.createElement('span');
      pill.className = 'skill-pill';
      pill.textContent = t;
      tagsEl.appendChild(pill);
    });
  }

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const skillKey = node.getAttribute('data-skill');
      setSkill(skillKey);
    });
    node.addEventListener('mouseenter', () => {
      const skillKey = node.getAttribute('data-skill');
      setSkill(skillKey);
    });
  });
}

/* ===================================================================
   4. Projects Showcase Switcher
   =================================================================== */
const PROJECTS_DATA = [
  {
    title: 'AI Content Studio & Fabric Canvas',
    desc: 'Architected and deployed an enterprise-grade AI content creation platform at Flipick. Enables users to dynamically prompt LLMs (OpenAI, Claude, Gemini) to generate rich multi-modal assets, then seamlessly customize them on an interactive HTML5 Fabric.js canvas with automated export pipelines.',
    image: './project_aistudio.jpg',
    stack: ['Python', 'Flask', 'OpenAI API', 'Claude AI', 'Fabric.js', 'AWS EC2'],
    github: 'https://github.com/Thananjayan91',
    botQuery: 'Tell me about the AI Content Studio project built with Fabric.js'
  },
  {
    title: 'Brainiverse & Xtramark (EdTech Platforms)',
    desc: 'Engineered responsive UI/UX and interactive 3D rendering modules using Three.js and Firebase at Eureka Innovations. Implemented engaging visual environments for AI-assisted educational technology products that boost student comprehension through 3D spatial models.',
    image: './project_edtech.jpg',
    stack: ['Three.js', 'WebGL', 'JavaScript', 'Firebase', 'HTML5/CSS3', 'Jira'],
    github: 'https://github.com/Thananjayan91',
    botQuery: 'What was Thananjayan\'s contribution to Brainiverse & Xtramark?'
  },
  {
    title: 'AI Video Generation & Media Automation Pipeline',
    desc: 'Constructed an end-to-end automated multimedia pipeline integrating LLM script generation, ElevenLabs neural voice synthesis, AI avatars, and media stitching workflows. Deployed on AWS EC2 with automated batch task management.',
    image: './project_video.jpg',
    stack: ['Python', 'ElevenLabs API', 'AWS EC2', 'FFmpeg', 'AI Avatars', 'REST APIs'],
    github: 'https://github.com/Thananjayan91',
    botQuery: 'How does Thananjayan\'s AI video generation pipeline work?'
  }
];

function initProjectsShowcase() {
  const thumbCards = document.querySelectorAll('.project-thumb-card');
  const projImg = document.getElementById('proj-img');
  const projTitle = document.getElementById('proj-title');
  const projDesc = document.getElementById('proj-desc');
  const projStack = document.getElementById('proj-stack');
  const projDemoLink = document.getElementById('proj-demo-link');

  if (!thumbCards.length || !projTitle) return;

  function selectProject(index) {
    const proj = PROJECTS_DATA[index];
    if (!proj) return;

    thumbCards.forEach(card => card.classList.remove('active'));
    thumbCards[index].classList.add('active');

    projImg.style.opacity = '0';
    setTimeout(() => {
      projImg.src = proj.image;
      projImg.alt = proj.title;
      projImg.style.opacity = '1';
    }, 180);

    projTitle.textContent = proj.title;
    projDesc.textContent = proj.desc;

    projStack.innerHTML = '';
    proj.stack.forEach(tech => {
      const badge = document.createElement('span');
      badge.className = 'stack-badge';
      badge.textContent = tech;
      projStack.appendChild(badge);
    });

    if (projDemoLink) {
      projDemoLink.onclick = (e) => {
        e.preventDefault();
        const chatInput = document.getElementById('chat-input');
        const botSection = document.getElementById('ask-bot');
        if (chatInput && botSection) {
          botSection.scrollIntoView({ behavior: 'smooth' });
          chatInput.value = proj.botQuery;
          if (handleSendMessage) handleSendMessage(proj.botQuery);
        }
      };
    }
  }

  thumbCards.forEach((card, idx) => {
    card.addEventListener('click', () => selectProject(idx));
  });
}

/* ===================================================================
   5. RAG Chatbot Client Interface
   =================================================================== */
let handleSendMessage = null;

function initRagChatbot() {
  const chatStream = document.getElementById('chat-stream');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const promptChips = document.querySelectorAll('.prompt-chip');
  const clearBtn = document.getElementById('clear-chat-btn');

  if (!chatStream || !chatInput || !sendBtn) return;

  function formatBotText(raw) {
    if (!raw) return '';
    let text = raw;

    // Convert standard markdown horizontal rules
    text = text.replace(/^---$/gm, '<div class="bot-contact-divider"></div>');

    // Detect reach out / contact phrases and insert a divider before them if not already present
    const reachOutRegex = /(If you have (any |specific )?questions|please feel free to reach out|feel free to reach out|please feel free to contact|You can reach Thananjayan directly|reach out to Thananjayan directly)/i;
    if (reachOutRegex.test(text) && !text.includes('bot-contact-divider')) {
      text = text.replace(reachOutRegex, '<div class="bot-contact-divider"></div>$1');
    }

    // Format paragraphs, bold, and line breaks
    return text
      .replace(/\n\s*\n/g, '</p><p>')
      .replace(/\n/g, '<br/>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `bot-msg ${sender}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'msg-avatar';
    avatarDiv.innerHTML = sender === 'assistant' 
      ? '<i class="fa-solid fa-robot"></i>' 
      : '<i class="fa-solid fa-user"></i>';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'msg-bubble';

    // If text starts with HTML element (like our typing indicator dots), render directly
    if (text.startsWith('<div')) {
      bubbleDiv.innerHTML = text;
    } else {
      bubbleDiv.innerHTML = `<p>${formatBotText(text)}</p>`;
    }

    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(bubbleDiv);
    chatStream.appendChild(msgDiv);
    chatStream.scrollTop = chatStream.scrollHeight;
    return bubbleDiv;
  }

  async function processUserMessage(rawQuery) {
    const query = rawQuery.trim();
    if (!query) return;

    // Remove suggested prompt chips on first question to maximize chat room
    const promptChipsContainer = document.querySelector('.bot-prompt-chips');
    if (promptChipsContainer) {
      promptChipsContainer.style.display = 'none';
    }

    appendMessage('user', query);
    chatInput.value = '';
    chatInput.disabled = true;
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

    // Minimal pulsating dots indicator without text
    const typingIndicator = appendMessage('assistant', '<div class="typing-indicator-dots"><span class="t-dot"></span><span class="t-dot"></span><span class="t-dot"></span></div>');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(customApiKey ? { 'x-api-key': customApiKey } : {})
        },
        body: JSON.stringify({ 
          query: query,
          activeIndex: activeCVIndex,
          apiKey: customApiKey || undefined
        })
      });

      if (response.ok) {
        const data = await response.json();
        typingIndicator.parentElement.remove();
        simulateStreamingText(data.answer);
        return;
      }

      // If running on local static server (e.g. VS Code Live Server 405) and customApiKey is available
      if ((response.status === 405 || response.status === 404) && customApiKey && activeCVIndex?.chunks) {
        console.log('Static server detected (405). Querying OpenAI directly with local vector search...');
        const queryEmbedData = await callOpenAIEmbeddingsDirect([query], customApiKey);
        const queryVec = queryEmbedData.data?.[0]?.embedding;
        
        let scored = activeCVIndex.chunks.map(chunk => ({
          ...chunk,
          score: (chunk.embedding && chunk.embedding.length > 0)
            ? cosineSimilarity(queryVec, chunk.embedding)
            : 0
        }));
        scored.sort((a, b) => b.score - a.score);
        const top = scored.slice(0, 3);
        const ctxText = top.map((c, i) => `[Source ${i+1}: ${c.title}]\n${c.text}`).join('\n\n');
        
        const aiResponse = await callOpenAIChatDirect(query, ctxText, customApiKey);
        typingIndicator.parentElement.remove();
        simulateStreamingText(aiResponse);
        return;
      }
    } catch (e) {
      console.warn('Network call to /api/chat failed, attempting client-side OpenAI or local fallback:', e);

      // If client-side OpenAI is possible
      if (customApiKey && activeCVIndex?.chunks) {
        try {
          const queryEmbedData = await callOpenAIEmbeddingsDirect([query], customApiKey);
          const queryVec = queryEmbedData.data?.[0]?.embedding;
          let scored = activeCVIndex.chunks.map(chunk => ({
            ...chunk,
            score: (chunk.embedding && chunk.embedding.length > 0)
              ? cosineSimilarity(queryVec, chunk.embedding)
              : 0
          }));
          scored.sort((a, b) => b.score - a.score);
          const top = scored.slice(0, 3);
          const ctxText = top.map((c, i) => `[Source ${i+1}: ${c.title}]\n${c.text}`).join('\n\n');
          const aiResponse = await callOpenAIChatDirect(query, ctxText, customApiKey);
          typingIndicator.parentElement.remove();
          simulateStreamingText(aiResponse);
          return;
        } catch (apiErr) {
          console.error('Direct OpenAI call failed:', apiErr);
        }
      }
    }

    // Local semantic scoring fallback
    setTimeout(() => {
      typingIndicator.parentElement.remove();
      const localAnswer = queryLocalKnowledge(query);
      simulateStreamingText(localAnswer.text);
    }, 350);
  }

  function queryLocalKnowledge(query) {
    if (activeCVIndex && activeCVIndex.chunks) {
      const qLower = query.toLowerCase();
      let bestChunk = activeCVIndex.chunks[0];
      let bestScore = -1;

      activeCVIndex.chunks.forEach(chunk => {
        const text = `${chunk.title} ${chunk.text}`.toLowerCase();
        let score = 0;
        qLower.split(/\s+/).forEach(word => {
          if (word.length > 2 && text.includes(word)) score += 1;
        });
        if (score > bestScore) {
          bestScore = score;
          bestChunk = chunk;
        }
      });

      return {
        text: bestChunk.text
      };
    }

    return {
      text: "Thananjayan Aruljothy is an AI Full-Stack Engineer with 3+ years experience specializing in Python Flask, Large Language Models (OpenAI, Claude, Gemini), interactive Fabric.js canvas tools, and AWS EC2 deployments.\n\nIf you have specific questions or need further information, please feel free to reach out to Thananjayan directly at thananjayan1991@yahoo.com or +94 77 844 9255."
    };
  }

  function simulateStreamingText(fullText) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'bot-msg assistant';

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'msg-avatar';
    avatarDiv.innerHTML = '<i class="fa-solid fa-robot"></i>';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'msg-bubble';
    bubbleDiv.innerHTML = '<p></p>';

    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(bubbleDiv);
    chatStream.appendChild(msgDiv);

    let index = 0;
    const p = bubbleDiv.querySelector('p');
    const timer = setInterval(() => {
      index += 3;
      const current = fullText.substring(0, index);
      p.innerHTML = formatBotText(current);
      chatStream.scrollTop = chatStream.scrollHeight;

      if (index >= fullText.length) {
        clearInterval(timer);
        chatInput.disabled = false;
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        chatInput.focus();
      }
    }, 15);
  }

  handleSendMessage = processUserMessage;

  sendBtn.addEventListener('click', () => {
    processUserMessage(chatInput.value);
  });

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      processUserMessage(chatInput.value);
    }
  });

  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      processUserMessage(q);
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      chatStream.innerHTML = `
        <div class="bot-msg assistant">
          <div class="msg-avatar">
            <i class="fa-solid fa-robot"></i>
          </div>
          <div class="msg-bubble">
            <p>Chat cleared. Ask me anything about Thananjayan's experience, technical skills, or projects!</p>
          </div>
        </div>
      `;
      // Restore suggested prompt chips when chat is cleared
      const promptChipsContainer = document.querySelector('.bot-prompt-chips');
      if (promptChipsContainer) {
        promptChipsContainer.style.display = 'grid';
      }
    });
  }
}

/* ===================================================================
   6. Protected Admin RAG Modal & Dynamic CV Indexer
   =================================================================== */
function initAdminRAGModal() {
  const openBtn = document.getElementById('open-admin-btn');
  const closeBtn = document.getElementById('admin-close-btn');
  const modal = document.getElementById('admin-modal');
  const authStep = document.getElementById('admin-auth-step');
  const dashStep = document.getElementById('admin-dashboard-step');
  const passInput = document.getElementById('admin-passcode-input');
  const unlockBtn = document.getElementById('admin-unlock-btn');
  const authError = document.getElementById('auth-error');
  const lockAgainBtn = document.getElementById('admin-lock-again-btn');

  // Key & Uploader elements
  const apiKeyInput = document.getElementById('admin-openai-key');
  const saveKeyBtn = document.getElementById('save-api-key-btn');
  const dropzone = document.getElementById('cv-dropzone');
  const fileInput = document.getElementById('cv-file-input');
  const browseBtn = document.getElementById('browse-file-btn');
  const fileBar = document.getElementById('upload-file-bar');
  const fileNameEl = document.getElementById('selected-file-name');
  const fileSizeEl = document.getElementById('selected-file-size');
  const removeFileBtn = document.getElementById('remove-file-btn');
  const startIndexBtn = document.getElementById('start-indexing-btn');
  const downloadIndexBtn = document.getElementById('download-index-btn');
  const progressWrap = document.getElementById('indexing-progress-wrap');
  const progressBar = document.getElementById('indexing-progress-bar');
  const progressLabel = document.getElementById('indexing-step-label');
  const progressPercent = document.getElementById('indexing-step-percent');
  const previewContainer = document.getElementById('chunks-preview-container');
  const previewCount = document.getElementById('preview-chunk-count');
  const previewList = document.getElementById('chunks-preview-list');
  const toggleChunksBtn = document.getElementById('toggle-chunks-btn');

  if (!openBtn || !modal) return;

  let currentUploadedFile = null;
  let parsedChunks = [];

  if (customApiKey && apiKeyInput) {
    apiKeyInput.value = customApiKey;
  }

  // Open & Close
  openBtn.addEventListener('click', () => {
    modal.classList.add('open');
    if (sessionStorage.getItem('thananjayan_admin_auth') === 'true') {
      authStep.style.display = 'none';
      dashStep.style.display = 'block';
      updateAdminStatusUI();
    } else {
      authStep.style.display = 'block';
      dashStep.style.display = 'none';
      passInput.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('open');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  // Passcode unlock (default passcode: admin123)
  function attemptUnlock() {
    const val = passInput.value.trim();
    if (val === 'admin123' || val === 'thananjayan2026') {
      sessionStorage.setItem('thananjayan_admin_auth', 'true');
      authError.style.display = 'none';
      authStep.style.display = 'none';
      dashStep.style.display = 'block';
      updateAdminStatusUI();
    } else {
      authError.style.display = 'block';
    }
  }

  unlockBtn.addEventListener('click', attemptUnlock);
  passInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attemptUnlock();
  });

  lockAgainBtn.addEventListener('click', () => {
    sessionStorage.removeItem('thananjayan_admin_auth');
    dashStep.style.display = 'none';
    authStep.style.display = 'block';
    passInput.value = '';
  });

  // Save API key
  saveKeyBtn.addEventListener('click', () => {
    const keyVal = apiKeyInput.value.trim();
    if (keyVal) {
      customApiKey = keyVal;
      localStorage.setItem('thananjayan_openai_key', keyVal);
      showToast('OpenAI API Key saved securely in your browser!');
    } else {
      customApiKey = '';
      localStorage.removeItem('thananjayan_openai_key');
      showToast('API Key cleared (will fallback to Vercel env variable)');
    }
  });

  // Drag and drop setup
  browseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  dropzone.addEventListener('click', () => fileInput.click());

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) handleSelectedFile(files[0]);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) handleSelectedFile(fileInput.files[0]);
  });

  async function handleSelectedFile(file) {
    currentUploadedFile = file;
    dropzone.style.display = 'none';
    fileBar.style.display = 'flex';
    fileNameEl.textContent = file.name;
    fileSizeEl.textContent = `${Math.round(file.size / 1024)} KB`;

    // Process & Chunk Document
    startIndexBtn.disabled = true;
    progressWrap.style.display = 'block';
    progressBar.style.width = '20%';
    progressLabel.textContent = 'Parsing document text...';
    progressPercent.textContent = '20%';

    try {
      let extractedText = '';
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        extractedText = await extractTextFromPDF(file);
      } else {
        extractedText = await file.text();
      }

      progressBar.style.width = '60%';
      progressLabel.textContent = 'Performing semantic chunking...';
      progressPercent.textContent = '60%';

      parsedChunks = chunkDocumentText(extractedText, file.name);

      progressBar.style.width = '100%';
      progressLabel.textContent = `Extracted ${parsedChunks.length} semantic chunks!`;
      progressPercent.textContent = '100%';

      // Render chunk preview
      renderChunksPreview(parsedChunks);
      startIndexBtn.disabled = false;
      showToast(`Document parsed into ${parsedChunks.length} chunks. Ready to index!`);

    } catch (err) {
      console.error('Error parsing file:', err);
      progressLabel.textContent = `Error: ${err.message}`;
      showToast('Failed to parse document. Please try a valid text or PDF file.');
    }
  }

  removeFileBtn.addEventListener('click', () => {
    currentUploadedFile = null;
    parsedChunks = [];
    fileInput.value = '';
    dropzone.style.display = 'block';
    fileBar.style.display = 'none';
    progressWrap.style.display = 'none';
    previewContainer.style.display = 'none';
    startIndexBtn.disabled = true;
  });

  // PDF.js Text Extractor
  async function extractTextFromPDF(file) {
    if (!window.pdfjsLib) {
      throw new Error('PDF.js library is not loaded');
    }
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items.map(item => item.str).join(' ');
      fullText += `\n\n--- Page ${pageNum} ---\n` + pageStrings;
    }

    return fullText;
  }

  // Semantic Chunker (Sliding Window with Overlap)
  function chunkDocumentText(text, filename) {
    const paragraphs = text
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 35);

    const chunks = [];
    let currentChunk = '';
    let chunkIndex = 0;

    for (const para of paragraphs) {
      if ((currentChunk + ' ' + para).length > 600 && currentChunk.length > 100) {
        chunks.push({
          id: `chunk_${chunkIndex}`,
          title: `Section ${chunkIndex + 1} (${filename})`,
          category: 'Resume Knowledge',
          text: currentChunk.trim(),
          embedding: []
        });
        chunkIndex++;
        // 120-char overlap
        currentChunk = currentChunk.slice(-120) + ' ' + para;
      } else {
        currentChunk += (currentChunk ? '\n' : '') + para;
      }
    }

    if (currentChunk.trim().length > 20) {
      chunks.push({
        id: `chunk_${chunkIndex}`,
        title: `Section ${chunkIndex + 1} (${filename})`,
        category: 'Resume Knowledge',
        text: currentChunk.trim(),
        embedding: []
      });
    }

    return chunks;
  }

  function renderChunksPreview(chunks) {
    previewContainer.style.display = 'block';
    previewCount.textContent = chunks.length;
    previewList.innerHTML = '';

    chunks.forEach((c, idx) => {
      const item = document.createElement('div');
      item.className = 'chunk-preview-item';
      item.innerHTML = `
        <div class="chunk-preview-title">${idx + 1}. ${c.title}</div>
        <div>${c.text.substring(0, 160)}...</div>
      `;
      previewList.appendChild(item);
    });
  }

  if (toggleChunksBtn) {
    toggleChunksBtn.addEventListener('click', () => {
      const isHidden = previewList.style.display === 'none';
      previewList.style.display = isHidden ? 'flex' : 'none';
      const chevron = document.getElementById('chunks-chevron');
      if (chevron) {
        chevron.className = isHidden ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down';
      }
    });
  }

  // Trigger Re-indexing with OpenAI Embeddings
  startIndexBtn.addEventListener('click', async () => {
    if (!parsedChunks || parsedChunks.length === 0) return;

    startIndexBtn.disabled = true;
    progressBar.style.width = '30%';
    progressLabel.textContent = 'Calling OpenAI Embeddings API (text-embedding-3-small)...';
    progressPercent.textContent = '30%';

    try {
      let indexResult = null;
      let usedServerless = false;

      // 1. Attempt Vercel serverless endpoint first
      try {
        const response = await fetch('/api/index-cv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chunks: parsedChunks,
            documentTitle: currentUploadedFile ? currentUploadedFile.name : 'Uploaded_CV.pdf',
            apiKey: customApiKey || undefined
          })
        });

        if (response.ok) {
          const resData = await response.json();
          indexResult = resData.index;
          usedServerless = true;
        } else if (response.status !== 405 && response.status !== 404) {
          const errJson = await response.json().catch(() => ({}));
          throw new Error(errJson.error || errJson.details || `Indexing failed (${response.status})`);
        }
      } catch (netErr) {
        console.warn('Serverless endpoint not reachable, trying client-side indexing:', netErr);
      }

      // 2. Direct browser fallback if running on static local server (e.g. VS Code Live Server 405)
      if (!usedServerless) {
        if (!customApiKey) {
          throw new Error('Static local server detected (Live Server). Please enter and save your OpenAI API Key above to index directly, or run with "vercel dev".');
        }

        console.log('Static dev server (405) detected. Invoking OpenAI Embeddings directly from browser...');
        progressLabel.textContent = 'Calling OpenAI Embeddings API directly from browser...';
        progressBar.style.width = '60%';
        progressPercent.textContent = '60%';

        const texts = parsedChunks.map(c => `${c.title || ''}: ${c.text}`);
        const embedData = await callOpenAIEmbeddingsDirect(texts, customApiKey);

        const indexedChunks = parsedChunks.map((chunk, index) => ({
          ...chunk,
          embedding: embedData.data[index].embedding
        }));

        indexResult = {
          lastIndexed: new Date().toISOString(),
          documentTitle: currentUploadedFile ? currentUploadedFile.name : 'Uploaded_CV.pdf',
          embeddingModel: 'text-embedding-3-small',
          totalChunks: indexedChunks.length,
          chunks: indexedChunks
        };
      }

      activeCVIndex = indexResult;
      localStorage.setItem('thananjayan_active_index', JSON.stringify(activeCVIndex));

      progressBar.style.width = '100%';
      progressLabel.textContent = `Completed! ${activeCVIndex.chunks.length} chunks indexed.`;
      progressPercent.textContent = '100%';

      updateAdminStatusUI();

      if (usedServerless) {
        showToast('Saved directly to data/cv_index.json! Push to Vercel to update live bot.');
      } else {
        // Auto-download file for static Live Server user so it's ready to put into data/
        triggerDownloadIndex();
        showToast('Downloaded cv_index.json! Move it into data/ and push to Vercel.');
      }

    } catch (err) {
      console.error('Re-indexing error:', err);
      progressLabel.textContent = `Failed: ${err.message}`;
      showToast(`Error: ${err.message}`);
    } finally {
      startIndexBtn.disabled = false;
    }
  });

  function triggerDownloadIndex() {
    if (!activeCVIndex) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeCVIndex, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'cv_index.json');
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  }

  // Download cv_index.json to commit permanently to repository
  downloadIndexBtn.addEventListener('click', () => {
    if (!activeCVIndex) {
      showToast('No active index to download');
      return;
    }
    triggerDownloadIndex();
    showToast('Downloaded cv_index.json! Move it into data/ and git push to Vercel.');
  });
}

/* ===================================================================
   7. Navigation & UI Helpers
   =================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast) return;
  toastMsg.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function initCopyBio() {
  const copyBtn = document.getElementById('copy-bio-btn');
  const bioText = document.getElementById('bio-text');
  if (!copyBtn || !bioText) return;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(bioText.innerText.trim()).then(() => {
      showToast('Profile bio copied to clipboard!');
    }).catch(() => {
      showToast('Bio text selected');
    });
  });
}
