/**
 * Thananjayan.ai - Software Engineer & AI Portfolio
 * Verified Knowledge Base & RAG Assistant Engine
 */

let activeCVIndex = null;

document.addEventListener('DOMContentLoaded', async () => {
  initNeuralCanvas();
  initSkillsCircuit();
  initProjectsShowcase();
  await loadInitialVectorIndex();
  initRagChatbot();
  initNavigation();
  initCopyBio();
});

/* ===================================================================
   1. Permanent Vector Index Loader (from data/cv_index.json)
   =================================================================== */
async function loadInitialVectorIndex() {
  try {
    const res = await fetch('./data/cv_index.json?v=' + Date.now());
    if (res.ok) {
      activeCVIndex = await res.json();
    }
  } catch (err) {
    console.warn('Could not load data/cv_index.json:', err);
  }
}

/* ===================================================================
   Cosine Similarity Calculator
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
   3. Interactive Neural Skills Circuit (Verified Skills)
   =================================================================== */
const SKILLS_DATA = {
  python: {
    name: 'Python & Flask',
    percent: 95,
    desc: 'Primary language and framework for building REST APIs, AI service integrations, JSON/XML processing, and content automation workflows.',
    tags: ['Python 3.x', 'Flask', 'REST APIs', 'AsyncIO', 'Data Processing']
  },
  openai: {
    name: 'OpenAI & Claude AI',
    percent: 92,
    desc: 'Practical integration of OpenAI (GPT models) and Anthropic Claude for document question-answering, prompt workflows, and narration scripting.',
    tags: ['OpenAI API', 'Anthropic Claude', 'Prompt Engineering', 'Document Q&A']
  },
  aws: {
    name: 'AWS EC2 Deployment',
    percent: 90,
    desc: 'Deploying and maintaining production applications on AWS EC2 using Gunicorn and Nginx across Linux/Ubuntu and Windows environments.',
    tags: ['AWS EC2', 'Linux / Ubuntu', 'Windows Server', 'Gunicorn', 'Nginx']
  },
  gemini: {
    name: 'Google Gemini & Veo 3',
    percent: 88,
    desc: 'Integration of Gemini APIs, Google Veo 3 video clips, character/scene asset generation, and AI-assisted multimedia tools.',
    tags: ['Google Gemini', 'Google Veo 3', 'AI Video Clips', 'Asset Generation']
  },
  fabric: {
    name: 'Fabric.js Canvas Engine',
    percent: 90,
    desc: 'Interactive HTML5 canvas workflows for course authoring, slide element editing (text, shapes, images), and JSON structure persistence.',
    tags: ['Fabric.js', 'Canvas API', 'JSON Slide Layouts', 'Interactive Tools']
  },
  javascript: {
    name: 'JavaScript & Front-End',
    percent: 88,
    desc: 'Modern JavaScript (ES6+), DOM manipulation, responsive interface design, and multimedia integration for web applications.',
    tags: ['JavaScript ES6+', 'HTML5', 'CSS3', 'REST Integration', 'UI Design']
  },
  restapi: {
    name: 'REST APIs & Integrations',
    percent: 92,
    desc: 'Designing and integrating RESTful endpoints, third-party AI APIs, ElevenLabs TTS, Google TTS, D-ID avatars, and Mailchimp.',
    tags: ['RESTful Design', 'JSON', 'Third-Party APIs', 'Webhooks']
  },
  gunicorn: {
    name: 'Gunicorn & Nginx',
    percent: 88,
    desc: 'Configuring WSGI application servers (Gunicorn) with Nginx reverse proxying, SSL handling, and server process supervision.',
    tags: ['Gunicorn', 'Nginx Reverse Proxy', 'WSGI', 'Linux Administration']
  },
  rag: {
    name: 'Document Q&A / RAG',
    percent: 90,
    desc: 'Document ingestion (PDF/PowerPoint), semantic text chunking, vector embeddings, and context-grounded LLM retrieval.',
    tags: ['RAG Architecture', 'Vector Search', 'Text Chunking', 'Embeddings']
  },
  salesforce: {
    name: 'Salesforce Trailhead Ranger',
    percent: 85,
    desc: 'Self-directed platform practice with 10 completed Superbadges, Salesforce Flow, and business-process automation (Trailhead learning).',
    tags: ['Trailhead Ranger', '10 Superbadges', 'Salesforce Flow', 'Process Automation']
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
   4. Projects Showcase Switcher (Verified Project Responsibilities)
   =================================================================== */
const PROJECTS_DATA = [
  {
    title: 'Interactive Video Editor & Course Authoring',
    desc: 'Contributed to an interactive course-authoring platform at Flipick using Fabric.js. Built canvas workflows for adding/editing objects, saved slide layouts as JSON, integrated Google TTS and ElevenLabs for narration generation, and synchronized D-ID avatar video playback with canvas animations and LMS-compatible exports.',
    image: './project_aistudio.jpg',
    stack: ['Python Flask', 'Fabric.js Canvas', 'JavaScript', 'Google TTS', 'ElevenLabs', 'D-ID Avatars'],
    github: 'https://github.com/Thananjayan91',
    botQuery: 'Tell me about Thananjayan\'s interactive course authoring tool with Fabric.js'
  },
  {
    title: 'AI-Assisted PowerPoint Narration & Automation',
    desc: 'Engineered an automated multimedia pipeline that extracts text from uploaded PowerPoint slides, prompts OpenAI to draft structured narration scripts, synthesizes MP3 voiceovers, coordinates animation duration with audio length, and preserves human review checkpoints throughout the workflow.',
    image: './project_video.jpg',
    stack: ['Python Flask', 'OpenAI API', 'PowerPoint PPTX', 'Audio Synthesis', 'Workflow Approval'],
    github: 'https://github.com/Thananjayan91',
    botQuery: 'How does the PowerPoint narration automation pipeline work?'
  },
  {
    title: 'AI Video Generation Platform',
    desc: 'Contributed to an AI video project workflow transforming user briefs into scenes and assets (characters, locations). Integrated Google Gemini and Google Veo 3 short generated clips with an in-app video editor. Developed through AI-assisted coding using Claude Code with responsibility for workflow logic and integrations.',
    image: './project_edtech.jpg',
    stack: ['Google Gemini', 'Google Veo 3', 'Anthropic Claude', 'Node.js', 'Claude Code'],
    github: 'https://github.com/Thananjayan91',
    botQuery: 'What was Thananjayan\'s role in the AI Video Generation Platform?'
  },
  {
    title: 'Document Question-Answering & RAG System',
    desc: 'Architected document ingestion workflows accepting PDFs and presentations, parsing and chunking text content, computing vector embeddings, and running semantic vector search to provide citation-grounded answers through an LLM chatbot interface.',
    image: './project_aistudio.jpg',
    stack: ['Python', 'Flask', 'OpenAI Embeddings', 'Vector Search', 'RAG Pipeline'],
    github: 'https://github.com/Thananjayan91',
    botQuery: 'How is the Document Question-Answering RAG system implemented?'
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
    if (thumbCards[index]) thumbCards[index].classList.add('active');

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

    text = text.replace(/^---$/gm, '<div class="bot-contact-divider"></div>');

    const reachOutRegex = /(If you have (any |specific )?questions|please feel free to reach out|feel free to reach out|please feel free to contact|You can reach Thananjayan directly|reach out to Thananjayan directly)/i;
    if (reachOutRegex.test(text) && !text.includes('bot-contact-divider')) {
      text = text.replace(reachOutRegex, '<div class="bot-contact-divider"></div>$1');
    }

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

    const typingIndicator = appendMessage('assistant', '<div class="typing-indicator-dots"><span class="t-dot"></span><span class="t-dot"></span><span class="t-dot"></span></div>');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query })
      });

      if (response.ok) {
        const data = await response.json();
        typingIndicator.parentElement.remove();
        simulateStreamingText(data.answer);
        return;
      }
    } catch (e) {
      console.warn('Backend call to /api/chat unavailable, using local semantic fallback:', e);
    }

    // Local semantic scoring fallback from loaded cv_index.json
    setTimeout(() => {
      typingIndicator.parentElement.remove();
      const localAnswer = queryLocalKnowledge(query);
      simulateStreamingText(localAnswer);
    }, 350);
  }

  function queryLocalKnowledge(query) {
    if (activeCVIndex && activeCVIndex.chunks && activeCVIndex.chunks.length > 0) {
      const qLower = query.toLowerCase();
      let bestChunk = activeCVIndex.chunks[0];
      let bestScore = -1;

      activeCVIndex.chunks.forEach(chunk => {
        const text = `${chunk.title || ''} ${chunk.text}`.toLowerCase();
        let score = 0;
        qLower.split(/\s+/).forEach(word => {
          if (word.length > 2 && text.includes(word)) score += 1;
        });
        if (score > bestScore) {
          bestScore = score;
          bestChunk = chunk;
        }
      });

      return bestChunk.text;
    }

    return "Thananjayan Aruljothy is an AI-focused software engineer with over 3 years of experience at Flipick (April 2023 – August 2026), specializing in Python/Flask applications, REST APIs, and AI integrations (OpenAI, Claude, Gemini). Deploys on AWS EC2 with Gunicorn and Nginx.\n\nIf you have specific questions, feel free to reach out directly at thananjayan1991@yahoo.com or +94 77 844 9255.";
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
            <p>Chat cleared. Ask me anything about Thananjayan's verified experience, technical skills, or projects!</p>
          </div>
        </div>
      `;
      const promptChipsContainer = document.querySelector('.bot-prompt-chips');
      if (promptChipsContainer) {
        promptChipsContainer.style.display = 'grid';
      }
    });
  }
}

/* ===================================================================
   6. Navigation & UI Helpers
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
