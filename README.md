# Carousel Studio

An AI-powered carousel maker for Instagram and LinkedIn — built for the **@your_divine.sofia**, **Dadly App**, and **DataWithSachin** accounts. Generates on-brand, Gita-inspired carousels using OpenAI and exports them as PNG ZIPs ready to post.

---

## Features

- **Platform selector** — Instagram or LinkedIn carousel modes
- **Account selector** — separate carousel styles for Sofia, Dadly, and DataWithSachin
- **AI generation** — powered by OpenAI GPT-4.1-mini with platform-specific prompts
- **Instagram-style preview** — swipeable carousel with arrows and dot navigation
- **PNG export** — downloads all 6 slides as a ZIP at full 1080×1080px resolution

---

## Tech Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Frontend | React 19, Vite 8              |
| Backend  | Node.js, Express 5            |
| AI       | OpenAI API (GPT-4.1-mini)     |
| Export   | html-to-image, JSZip          |
| Deploy   | Vercel                        |

---

## Local Development

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### 2. Install dependencies

```bash
# Root (server) dependencies
npm install

# Frontend dependencies
npm install --prefix web
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and add your OpenAI key:

```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4.1-mini
PORT=8787
```

### 4. Run the dev server

```bash
npm run dev
```

Starts both the Express API and Vite dev server concurrently.
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Deploying to Vercel

### Step 1 — Push to GitHub

Push your project to a GitHub repository. Make sure `.env` is **not** committed (it's already in `.gitignore`).

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2 — Import into Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New → Project**
2. Connect your GitHub account
3. Select this repository and click **Import**

### Step 3 — Configure build settings

When prompted, set these values:

| Setting | Value |
|---|---|
| **Framework Preset** | `Other` |
| **Root Directory** | *(leave as default —* `.` *)* |
| **Build Command** | `npm install --prefix web && npm run build` |
| **Output Directory** | *(leave empty)* |
| **Install Command** | `npm install` |

### Step 4 — Add environment variables

Go to **Settings → Environment Variables** and add:

| Name | Value |
|---|---|
| `OPENAI_API_KEY` | `sk-your-openai-key` |
| `OPENAI_MODEL` | `gpt-4.1-mini` |

> ⚠️ Never commit your `.env` file. Always add secrets via the Vercel dashboard only.

### Step 5 — Deploy

Click **Deploy**. Vercel will:
1. Install server dependencies (`npm install`)
2. Build the React frontend (`npm run build` → outputs to `web/dist/`)
3. Serve everything via the Express server using `vercel.json`

Your live URL will be `https://your-project-name.vercel.app`.

### Step 6 — Redeploy on changes

Every `git push` to your `main` branch will automatically trigger a new Vercel deployment.

---

## Project Structure

```
├── server/
│   ├── index.js               # Express server + API routes
│   └── openai.js              # OpenAI prompt logic (Instagram + LinkedIn)
├── web/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx            # Platform selection page
│   │   │   └── InstagramAccountsPage.jsx  # Account selection page
│   │   ├── components/
│   │   │   ├── CarouselPreview.jsx        # Instagram-style swipeable preview
│   │   │   ├── CarouselCanvas.jsx         # Hidden canvas for PNG export
│   │   │   └── slides/                    # Hook, Lesson, CTA slide components
│   │   ├── lib/
│   │   │   ├── sample.js                  # Default carousel data
│   │   │   └── export.js                  # PNG ZIP export logic
│   │   └── assets/                        # Icons and images
│   └── public/
├── .env.example               # Environment variable template
├── vercel.json                # Vercel deployment config
└── package.json
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | ✅ Yes | Your OpenAI secret key |
| `OPENAI_MODEL` | Optional | Model to use. Defaults to `gpt-4.1-mini` |
| `PORT` | Optional | Local port. Defaults to `8787` (Vercel ignores this) |

---

## Security Note

If you ever accidentally exposed your OpenAI API key in a chat or commit:
- **Revoke it immediately** in your [OpenAI dashboard](https://platform.openai.com/api-keys)
- Generate a new key and add it only via `.env` locally or Vercel's environment variables
