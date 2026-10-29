/**
 * Thananjayan.ai - Interactive Engine
 * Neural Background, Interactive Circuit, Projects Switcher & RAG Chatbot
 */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initSkillsCircuit();
  initProjectsShowcase();
  initRagChatbot();
  initNavigation();
  initCopyBio();
});

/* ===================================================================
   1. Interactive Background Neural Canvas (Constellation & Particles)
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

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.7)';
      ctx.fill();

      // Connect near particles
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

      // Subtle mouse interaction
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
   2. Interactive Neural Skills Circuit
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
   3. Projects Showcase Switcher
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

    // Smooth transition
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
          handleSendMessage(proj.botQuery);
        }
      };
    }
  }

  thumbCards.forEach((card, idx) => {
    card.addEventListener('click', () => selectProject(idx));
  });
}

/* ===================================================================
   4. RAG Chatbot Knowledge Base & Interactive Engine
   =================================================================== */

// Structured Knowledge Graph built directly from Thananjayan Aruljothy's verified CV
const RESUME_KNOWLEDGE_BASE = {
  profile: {
    fullName: "Thananjayan Aruljothy",
    headline: "AI Full-Stack Engineer | Python, Flask, OpenAI & LLM Apps | Scalable AI Web Solutions",
    location: "Sri Lanka",
    email: "thananjayan1991@yahoo.com",
    phone: "+94 77 844 9255",
    linkedin: "https://www.linkedin.com/in/thananjayan-aruljothy/",
    github: "https://github.com/Thananjayan91",
    languages: ["English (Professional Working)", "Tamil (Native / Bilingual)", "Sinhalese (Professional Working)"],
    summary: "AI Full Stack Developer specializing in intelligent applications powered by Large Language Models (LLMs), Generative AI, and modern cloud technologies. Experienced in Python Flask, OpenAI, Claude AI, Google Gemini, ElevenLabs, AI image/video generation, Fabric.js interactive canvas, and AWS EC2 deployments."
  },
  experience: [
    {
      company: "Flipick",
      role: "AI Full Stack Engineer",
      period: "April 2023 - Present (3+ years)",
      location: "Jaffna, Sri Lanka",
      highlights: [
        "Develop AI-powered applications and intelligent content creation platforms using Python, Flask, LLMs, and modern AI APIs.",
        "Design AI workflows integrating OpenAI, Claude AI, Google Gemini, and ElevenLabs Text-to-Speech (TTS).",
        "Build scalable backend services using Python Flask handling AI integrations, data processing, and application logic.",
        "Develop interactive web-based editors and creative tools using Fabric.js canvas technology for AI-generated content editing.",
        "Build AI video generation pipelines integrating LLM script generation, image generation, voice synthesis, avatars, and media workflows.",
        "Deploy and manage applications on AWS EC2 environments (Linux/Ubuntu and Windows)."
      ]
    },
    {
      company: "Eureka Innovations",
      role: "Associate Software Engineer",
      period: "April 2022 - November 2022 (8 months)",
      location: "Colombo, Sri Lanka",
      highlights: [
        "UI / UX Design using HTML, CSS, JavaScript.",
        "Firebase configuration and cloud database integration.",
        "Three.js for interactive 3D rendering.",
        "Involved in UI design of AI-integrated Edtech Products: Brainiverse & Xtramark."
      ]
    },
    {
      company: "KoceanSoft",
      role: "Junior Web Developer - CMS",
      period: "January 2022 - April 2022",
      location: "Jaffna, Sri Lanka",
      highlights: ["Developed responsive websites, CMS integrations, and modern SEO architecture."]
    }
  ],
  education: [
    {
      degree: "Bachelor of Information Technology (BIT)",
      institution: "University of Colombo School of Computing (UCSC)",
      period: "2020 - 2023"
    },
    {
      degree: "B.Sc (Hons) in Transport & Logistics Management",
      institution: "University of Moratuwa",
      period: "2011 - 2016"
    }
  ],
  certifications: [
    "Salesforce Multi-Factor Authentication and Single Sign-On Settings Superbadge Unit",
    "Lightning Experience Reports & Dashboards Specialist",
    "EducateHacks 2023 Winner / Innovation Award",
    "App Customization Specialist",
    "SEO Simplified & Web Optimization"
  ],
  skills: [
    "Generative AI & LLMs (OpenAI GPT-4o, Claude 3.5, Google Gemini, Prompt Engineering, Agentic Workflows)",
    "Backend & APIs (Python, Flask, FastAPI, REST APIs, WebSockets)",
    "Frontend & Graphics (JavaScript ES6+, Fabric.js Canvas, Three.js 3D, HTML5/CSS3)",
    "Cloud & DevOps (AWS EC2, AWS Lambda, Ubuntu/Linux, Windows Server)",
    "Media AI (ElevenLabs TTS, AI Video Pipelines, Avatar Generation)"
  ]
};

// Local RAG Query Retrieval Engine (Matches intent & semantic keywords)
function queryKnowledgeBase(userPrompt) {
  const query = userPrompt.toLowerCase().trim();

  // 1. Technical Strengths & Skills
  if (query.includes('strength') || query.includes('skill') || query.includes('tech stack') || query.includes('technolog')) {
    return {
      text: `Thananjayan's core technical strengths span three main pillars:\n\n` +
            `1. **Generative AI & LLM Systems**: Expert in designing agentic workflows with OpenAI (GPT-4o), Claude 3.5 Sonnet, Google Gemini, and ElevenLabs voice synthesis.\n` +
            `2. **Backend & Cloud Architecture**: 3+ years engineering high-concurrency Python Flask REST APIs, data pipelines, and production AWS EC2 (Ubuntu/Windows) & Lambda deployments.\n` +
            `3. **Interactive Visual Engines**: Deep experience with **Fabric.js canvas** for AI graphic editors and **Three.js** for 3D web rendering.`,
      citation: "LinkedIn CV - Top Skills & Experience"
    };
  }

  // 2. Flipick / Current Role & Projects
  if (query.includes('flipick') || query.includes('current role') || query.includes('present') || query.includes('content studio') || query.includes('fabric')) {
    return {
      text: `Thananjayan is currently an **AI Full Stack Engineer at Flipick** (April 2023 – Present). Key achievements include:\n\n` +
            `• Architecting intelligent content creation platforms powered by Python Flask and frontier LLMs (OpenAI, Claude, Gemini).\n` +
            `• Engineering interactive web editors using **Fabric.js canvas** for AI-generated assets.\n` +
            `• Building automated AI video pipelines with ElevenLabs TTS, avatars, and media stitching.\n` +
            `• Deploying and maintaining server environments on AWS EC2.`,
      citation: "LinkedIn CV - Experience: Flipick"
    };
  }

  // 3. LLMs, AI agents, Video generation
  if (query.includes('llm') || query.includes('agent') || query.includes('video') || query.includes('openai') || query.includes('gemini') || query.includes('claude')) {
    return {
      text: `Thananjayan builds end-to-end AI applications leveraging:\n\n` +
            `• **LLM Orchestration**: Prompt design, JSON structured outputs, function calling, and multi-turn workflows with OpenAI, Claude, and Gemini.\n` +
            `• **AI Video Pipeline**: Automated generation combining LLM scriptwriting, neural voice synthesis via ElevenLabs, custom avatars, and video rendering.\n` +
            `• **RAG & Context Search**: Connecting vector retrieval pipelines to provide factual, citation-backed answers for enterprise users.`,
      citation: "LinkedIn CV - AI Full-Stack Specialization"
    };
  }

  // 4. Flask, AWS, Cloud & DevOps
  if (query.includes('flask') || query.includes('aws') || query.includes('cloud') || query.includes('ec2') || query.includes('backend') || query.includes('lambda')) {
    return {
      text: `Thananjayan uses **Python Flask** as his primary backend framework, building RESTful endpoints that integrate AI APIs, handle asynchronous processing, and interface with relational databases. On the cloud side, he deploys and optimizes applications on **AWS EC2** (both Linux/Ubuntu and Windows Server environments) as well as **AWS Lambda** serverless functions.`,
      citation: "LinkedIn CV - Experience & Cloud Deployment"
    };
  }

  // 5. Eureka Innovations & Three.js / EdTech
  if (query.includes('eureka') || query.includes('edtech') || query.includes('three') || query.includes('brainiverse') || query.includes('xtramark')) {
    return {
      text: `At **Eureka Innovations** (2022), Thananjayan worked as an Associate Software Engineer where he:\n\n` +
            `• Developed interactive UI/UX for AI-integrated EdTech products **Brainiverse & Xtramark**.\n` +
            `• Implemented browser-based 3D model rendering using **Three.js**.\n` +
            `• Integrated Firebase authentication, cloud functions, and real-time database capabilities.`,
      citation: "LinkedIn CV - Experience: Eureka Innovations"
    };
  }

  // 6. Education & Qualifications
  if (query.includes('education') || query.includes('degree') || query.includes('university') || query.includes('colombo') || query.includes('moratuwa') || query.includes('ucsc') || query.includes('qualification')) {
    return {
      text: `Thananjayan holds two degrees:\n\n` +
            `1. **Bachelor of Information Technology (BIT)** – University of Colombo School of Computing (UCSC) (2020 – 2023).\n` +
            `2. **B.Sc (Hons) in Transport & Logistics Management** – University of Moratuwa (2011 – 2016).`,
      citation: "LinkedIn CV - Education Section"
    };
  }

  // 7. Certifications
  if (query.includes('certificat') || query.includes('salesforce') || query.includes('superbadge') || query.includes('award') || query.includes('credential')) {
    return {
      text: `Thananjayan's verified credentials include:\n\n` +
            `• **Salesforce Superbadge**: Multi-Factor Authentication (MFA) & Single Sign-On (SSO) Settings\n` +
            `• **Salesforce Specialist**: Lightning Experience Reports & Dashboards\n` +
            `• **EducateHacks 2023**: AI & EdTech Innovation Winner\n` +
            `• **App Customization Specialist** (Salesforce)\n` +
            `• **SEO Simplified** & Web Performance Certification`,
      citation: "LinkedIn CV - Certifications & Honors"
    };
  }

  // 8. Contact, Email, Hiring
  if (query.includes('contact') || query.includes('hire') || query.includes('email') || query.includes('phone') || query.includes('reach') || query.includes('available')) {
    return {
      text: `You can reach Thananjayan directly:\n\n` +
            `• **Email**: [thananjayan1991@yahoo.com](mailto:thananjayan1991@yahoo.com)\n` +
            `• **Phone / WhatsApp**: [+94 77 844 9255](tel:+94778449255)\n` +
            `• **LinkedIn**: [linkedin.com/in/thananjayan-aruljothy](https://www.linkedin.com/in/thananjayan-aruljothy/)\n` +
            `• **GitHub**: [github.com/Thananjayan91](https://github.com/Thananjayan91)\n\n` +
            `He is currently open to exciting AI engineering roles, technical consultations, and full-stack projects.`,
      citation: "LinkedIn CV - Contact Details"
    };
  }

  // Default intelligent fallback
  return {
    text: `Thananjayan Aruljothy is an AI Full-Stack Engineer with 3+ years experience specializing in Python Flask, Large Language Models (OpenAI, Claude, Gemini), interactive Fabric.js canvas tools, and AWS EC2 deployments. ` +
          `Feel free to ask about his specific projects, his technical stack, education at University of Colombo, or how to get in touch!`,
    citation: "LinkedIn CV - Overview"
  };
}

let handleSendMessage = null;

function initRagChatbot() {
  const chatStream = document.getElementById('chat-stream');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const promptChips = document.querySelectorAll('.prompt-chip');
  const clearBtn = document.getElementById('clear-chat-btn');

  if (!chatStream || !chatInput || !sendBtn) return;

  function appendMessage(sender, text, citation = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `bot-msg ${sender}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'msg-avatar';
    avatarDiv.innerHTML = sender === 'assistant' 
      ? '<i class="fa-solid fa-robot"></i>' 
      : '<i class="fa-solid fa-user"></i>';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'msg-bubble';

    // Format newlines & bold
    let formatted = text
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    bubbleDiv.innerHTML = `<p>${formatted}</p>`;

    if (citation) {
      const citeSpan = document.createElement('div');
      citeSpan.className = 'citation-badge';
      citeSpan.innerHTML = `<i class="fa-solid fa-bookmark"></i> Source: ${citation}`;
      bubbleDiv.appendChild(citeSpan);
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

    appendMessage('user', query);
    chatInput.value = '';
    chatInput.disabled = true;
    sendBtn.disabled = true;

    // Show temporary typing indicator
    const typingIndicator = appendMessage('assistant', '<i class="fa-solid fa-circle-notch fa-spin"></i> Retrieving context from CV knowledge base...');

    // Attempt to query the backend /api/chat (Vercel serverless function) if online,
    // otherwise seamlessly use the local RAG knowledge engine.
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query })
      });

      if (response.ok) {
        const data = await response.json();
        typingIndicator.parentElement.remove();
        simulateStreamingText(data.answer, data.citation || 'Vercel RAG API');
        return;
      }
    } catch (e) {
      // Local fallback
    }

    // Fallback to client-side RAG engine
    setTimeout(() => {
      typingIndicator.parentElement.remove();
      const result = queryKnowledgeBase(query);
      simulateStreamingText(result.text, result.citation);
    }, 450);
  }

  function simulateStreamingText(fullText, citation) {
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
      p.innerHTML = current
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br/>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      chatStream.scrollTop = chatStream.scrollHeight;

      if (index >= fullText.length) {
        clearInterval(timer);
        if (citation) {
          const citeSpan = document.createElement('div');
          citeSpan.className = 'citation-badge';
          citeSpan.innerHTML = `<i class="fa-solid fa-bookmark"></i> Source: ${citation}`;
          bubbleDiv.appendChild(citeSpan);
        }
        chatInput.disabled = false;
        sendBtn.disabled = false;
        chatInput.focus();
      }
    }, 18);
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
    });
  }
}

/* ===================================================================
   5. Navigation & UI Helpers
   =================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
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

  // Active section indicator
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
  }, 2600);
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
