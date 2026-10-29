# Thananjayan.ai — AI Full-Stack Engineer Portfolio & Dynamic RAG System

A modern, high-performance portfolio website for **Thananjayan Aruljothy** (AI Full-Stack Engineer), built with a futuristic dark neural aesthetic, interactive circuit board skill tree, project showcase, and a **Retrieval-Augmented Generation (RAG)** system with a **dynamic CV uploader & re-indexer**.

Ready for one-click deployment to **Vercel**.

---

## ⚡ What’s Included

1. **Futuristic Neural Aesthetic UI**:
   - Neural constellation particle canvas background.
   - Hero section with glowing brackets `{Thananjayan Aruljothy}`, transparent cutout photo with artistic glowing splash backdrop, and floating tech badges.
   - Interactive macOS terminal with bio summary and copy button.
   - Neural circuit board with interactive tech nodes (*Python, Flask, OpenAI, AWS, Gemini, Fabric.js, Three.js, RAG*), displaying live proficiency percentages and detail tags.
   - Featured projects with connected circuit lines.
   - Verified credentials (*Salesforce Superbadge, Lightning Specialist, EducateHacks Winner*).

2. **RAG AI Assistant ("Ask My Bot")**:
   - Animated 3D robot mascot with glowing eyes, pulsing antenna, and `"Hello!"` speech bubble.
   - One-click prompt chips and live conversational query input.
   - **Vector Cosine Similarity Search**: Matches user queries against 1536-dimensional embeddings generated with `text-embedding-3-small`.
   - **Context-Grounded LLM Generation**: Uses `gpt-4o-mini` with source citations.

3. **Dynamic CV Uploader & Admin Re-Indexer**:
   - Discreet **`RAG Admin`** lock button in the footer.
   - Passcode protected (default: `admin123` or `thananjayan2026`).
   - Drag-and-drop new CVs (PDF / TXT) directly in your browser.
   - In-browser PDF text parsing via PDF.js with automated semantic sliding-window chunking.
   - Calls `/api/index-cv` to re-embed all chunks with OpenAI.
   - Immediately updates the live chatbot with your new resume data, saves to `localStorage`, and provides a one-click button to download the updated `cv_index.json`.

---

## 🚀 Running Locally

```bash
# Using Python
python -m http.server 3000

# Or using Node serve
npx serve .
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Setting Your OpenAI API Key

You can configure your `OPENAI_API_KEY` in two ways:

1. **Via the Website UI (Admin Modal)**:
   - Click the **`RAG Admin`** button in the footer.
   - Enter passcode `admin123`.
   - Paste your `sk-...` OpenAI key and click **Save Key** (persists in your browser).
2. **Via Vercel Environment Variables (Recommended for Production)**:
   - In your Vercel Project Dashboard, navigate to **Settings** → **Environment Variables**.
   - Key: `OPENAI_API_KEY`
   - Value: `your_openai_api_key_here`

---

## 🌐 Deploying to Vercel

```bash
git add .
git commit -m "feat: complete portfolio with dynamic RAG uploader and Vercel serverless endpoints"
git push origin main
```

1. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Select your `Thananjayan91/portfolio` repository.
3. In **Environment Variables**, add `OPENAI_API_KEY`.
4. Click **Deploy**!

---

## 📁 Project Architecture

```
portfolio/
├── index.html               # Main website markup & admin modal
├── style.css                # Dark neural theme, animations, admin UI & responsiveness
├── index.js                 # Background canvas, circuit logic, RAG client & admin controller
├── Thananjayan_hero.png     # Cutout portrait photo
├── Thananjayan_CV.pdf       # Verified PDF Resume
├── data/
│   └── cv_index.json        # Bundled vector knowledge base & chunks
├── api/
│   ├── chat.js              # Serverless function: Cosine similarity + GPT-4o-mini
│   └── index-cv.js          # Serverless function: OpenAI text-embedding-3-small
├── vercel.json              # Vercel deployment configuration
└── .env.example             # Environment variable template
```
