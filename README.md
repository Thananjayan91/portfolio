# Thananjayan.ai — AI Full-Stack Engineer Portfolio & Permanent RAG System

A modern, high-performance portfolio website for **Thananjayan Aruljothy** (AI Full-Stack Engineer), built with a futuristic dark neural aesthetic, interactive circuit board skill tree, project showcase, and a **Retrieval-Augmented Generation (RAG)** system with a **permanent vector database**.

Ready for one-click deployment to **Vercel**.

---

## ⚡ Architecture: Permanent RAG on Vercel

```
[ Local Admin: Upload & Re-Index CV ]
                   │
                   ▼ (Calls OpenAI text-embedding-3-small)
[ Generates 1536-Dim Vector Embeddings ]
                   │
                   ▼ (Saved to project disk)
[ data/cv_index.json ] ──► git push origin main ──► [ Vercel Production ]
                                                              │
                                                              ▼
                                                 All Public Visitors Query 24/7
                                                 (Grounded Answers via gpt-4o-mini)
```

1. **Single Source of Truth**:
   The entire knowledge base and vector embeddings live permanently in [`data/cv_index.json`](file:///d:/Thananjayan%20-%20own%20products/portfolio/data/cv_index.json).
2. **Never Lost**:
   No reliance on browser `localStorage` or session cache. Works in incognito, on mobile, across all devices, forever.
3. **Zero Extra Cloud DB Costs**:
   Self-contained serverless vector search running directly inside Vercel Serverless Functions (`/api/chat`).

---

## 🚀 How to Re-Index and Push to Vercel

### Method 1: Using the Local Node Server (Recommended — Direct Disk Save)

1. Start the local server in your project folder:
   ```bash
   node server.js
   ```
2. Open **[http://localhost:3000](http://localhost:3000)** in your browser.
3. Click **`RAG Admin`** in the footer (passcode: `admin123`).
4. Paste your OpenAI API key and drop your new CV (PDF / TXT).
5. Click **"Re-Index CV Now"**.
   - The server will generate the embeddings and **write directly to `data/cv_index.json` on your disk**.
6. Commit and push to Vercel:
   ```bash
   git add data/cv_index.json
   git commit -m "feat: update permanent vector database"
   git push origin main
   ```

---

### Method 2: Using VS Code Live Server

1. Open the site via Live Server (`http://127.0.0.1:5500/` or `5502/`).
2. Open **`RAG Admin`** (passcode: `admin123`), paste your OpenAI key, and upload your CV.
3. Click **"Re-Index CV Now"**.
   - Because Live Server is static, it will generate the embeddings and **automatically download `cv_index.json`** to your Downloads folder.
4. Move `Downloads/cv_index.json` into your project's `data/` folder:
   `portfolio/data/cv_index.json`
5. Commit and push:
   ```bash
   git add data/cv_index.json
   git commit -m "feat: update permanent vector database"
   git push origin main
   ```

---

## 🔑 Setting Your OpenAI API Key on Vercel

In your [Vercel Project Dashboard](https://vercel.com):
1. Navigate to **Settings** → **Environment Variables**.
2. Add:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: `sk-your_openai_api_key_here`
3. Click **Save**. All visitor queries to `/api/chat` will now securely use this key.

---

## 📁 Project Structure

```
portfolio/
├── index.html               # Main website markup & admin modal
├── style.css                # Dark neural theme, animations & responsiveness
├── index.js                 # Neural canvas, circuit interactivity & RAG client
├── server.js                # Zero-dependency local dev server with direct disk write
├── package.json             # ES Module configuration
├── Thananjayan_hero.png     # Cutout portrait photo
├── Thananjayan_Aruljothy_CV.pdf # Master PDF Resume (Downloadable)
├── data/
│   └── cv_index.json        # Permanent vector database (chunks + 1536-dim embeddings)
├── api/
│   ├── chat.js              # Vercel Serverless Function (Cosine similarity + GPT-4o-mini)
│   └── index-cv.js          # Vercel Serverless Function (OpenAI text-embedding-3-small)
├── vercel.json              # Vercel deployment configuration
└── .env.example             # Environment variable template
```
