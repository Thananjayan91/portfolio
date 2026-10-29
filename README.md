# Thananjayan.ai — AI Full-Stack Engineer Portfolio & RAG Assistant

A modern, high-performance portfolio website for **Thananjayan Aruljothy** (AI Full-Stack Engineer), built with a futuristic dark neural aesthetic, interactive circuit board skill tree, interactive project showcase, and a built-in **RAG (Retrieval-Augmented Generation) AI Assistant**.

Ready for instant one-click deployment to **Vercel**.

---

## ⚡ Key Highlights & Architecture

- **Futuristic Visual Design**: Inspired by neural AI networks, featuring ambient floating particle constellations, glowing purple splash backdrop for the hero portrait, and glassmorphism styling.
- **Interactive Skills Circuit**: Stylized neural PCB circuit board with clickable/hoverable nodes (Python, Flask, OpenAI, AWS, Gemini, Fabric.js, Three.js, etc.) dynamically updating a sleek proficiency meter card.
- **Featured Projects Showcase**: Left thumbnail selector linked by a glowing neon circuit line to an interactive project preview card with technology badges and links.
- **RAG AI Assistant ("Ask My Bot")**:
  - Animated 3D robot mascot with expressive glowing eyes and greeting bubble.
  - Interactive chat interface pre-loaded with Thananjayan's verified CV and project archives.
  - One-click prompt chips for quick exploration.
  - Streaming text responses with source citations.
- **Serverless Backend Endpoint (`/api/chat`)**:
  - Native Vercel Serverless Function handling retrieval-augmented queries.
  - Seamlessly ready to plug into external vector databases (Pinecone, Supabase, Chroma) or LLM providers (OpenAI GPT-4o, Google Gemini, Claude) by adding your API key in Vercel environment variables.
- **One-Click Resume Download**: Direct download button serving `Thananjayan_CV.pdf`.

---

## 🚀 Running Locally

You can run the project locally with any static web server:

### Using Python:
```bash
python -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Using Node.js / npx:
```bash
npx serve .
```

---

## 🌐 Deploying to Vercel

### Option 1: Git Push (Recommended)
1. Commit and push your changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: complete portfolio UI with RAG engine and Vercel setup"
   git push origin main
   ```
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `Thananjayan91/portfolio` repository.
4. Leave the default settings (Framework Preset: **Other**) and click **Deploy**!

### Option 2: Vercel CLI
```bash
npx vercel
```

---

## 🤖 RAG System Integration Details

The project includes both a client-side intelligent knowledge retriever and a serverless backend function at `/api/chat.js`.

### Connecting your custom LLM / Vector DB:
1. In your Vercel Dashboard, go to **Settings** -> **Environment Variables**.
2. Add:
   - `OPENAI_API_KEY`: Your OpenAI API key (or `GEMINI_API_KEY` for Google Gemini).
3. If using a Vector Database (e.g., Pinecone, Supabase, Qdrant), you can add the embeddings search directly into `/api/chat.js`.

---

## 📁 Project Structure

```
portfolio/
├── index.html               # Main semantic HTML5 markup
├── style.css                # Futuristic dark theme, animations & responsiveness
├── index.js                 # Neural canvas, circuit interactivity, chat engine
├── Thananjayan_hero.png     # Clean portrait cutout
├── Thananjayan_CV.pdf       # Verified PDF Resume
├── project_aistudio.jpg     # AI Studio preview mockup
├── project_edtech.jpg       # EdTech preview mockup
├── project_video.jpg        # Video Pipeline preview mockup
├── cert_salesforce.jpg      # Salesforce certificate preview
├── cert_lightning.jpg       # Lightning Specialist preview
├── cert_educatehacks.jpg    # EducateHacks preview
├── vercel.json              # Vercel deployment configuration
└── api/
    └── chat.js              # Vercel Serverless Function (RAG API)
```

