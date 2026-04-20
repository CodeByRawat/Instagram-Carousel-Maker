const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const {
  generateCarousel,
  generateLinkedInCarousel,
  generateDadlyCarousel,
  generateLinkedInFromContent,
  generateLinkedInStudy,
  generateLinkedInNews,
} = require("./openai");

const app = express();
app.use(cors());
app.use(express.json({ limit: "4mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/generate", async (req, res) => {
  try {
    const { theme, language = "en" } = req.body ?? {};
    if (!theme || typeof theme !== "string") {
      return res.status(400).json({ error: "Missing 'theme' string." });
    }
    const data = await generateCarousel({ theme, language });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

app.post("/api/generate-linkedin", async (req, res) => {
  try {
    const { theme, language = "en", slideCount } = req.body ?? {};
    if (!theme || typeof theme !== "string") {
      return res.status(400).json({ error: "Missing 'theme' string." });
    }
    const count = Number.isInteger(slideCount) && slideCount >= 3 && slideCount <= 15 ? slideCount : 8;
    const data = await generateLinkedInCarousel({ theme, language, slideCount: count });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

app.post("/api/generate-linkedin-from-content", async (req, res) => {
  try {
    const { content, slideCount, ideaIndex } = req.body ?? {};
    if (!content || typeof content !== "string" || content.trim().length < 20) {
      return res.status(400).json({ error: "Provide at least 20 characters of source content." });
    }
    const count = Number.isInteger(slideCount) && slideCount >= 3 && slideCount <= 15 ? slideCount : 8;
    const idea = Number.isInteger(ideaIndex) && ideaIndex >= 1 ? ideaIndex : 1;
    const data = await generateLinkedInFromContent({ content: content.slice(0, 8000), slideCount: count, ideaIndex: idea });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

app.post("/api/generate-linkedin-study", async (req, res) => {
  try {
    const { topic, slideCount } = req.body ?? {};
    if (!topic || typeof topic !== "string" || topic.trim().length < 2) {
      return res.status(400).json({ error: "Missing 'topic' string." });
    }
    const count = Number.isInteger(slideCount) && slideCount >= 3 && slideCount <= 15 ? slideCount : 8;
    const data = await generateLinkedInStudy({ topic: topic.slice(0, 200), slideCount: count });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

app.post("/api/generate-dadly", async (req, res) => {
  try {
    const { theme, language = "en" } = req.body ?? {};
    if (!theme || typeof theme !== "string") {
      return res.status(400).json({ error: "Missing 'theme' string." });
    }
    const data = await generateDadlyCarousel({ theme, language });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

app.post("/api/generate-linkedin-news", async (req, res) => {
  try {
    const { newsContent, storyCount } = req.body ?? {};
    if (!newsContent || typeof newsContent !== "string" || newsContent.trim().length < 30) {
      return res.status(400).json({ error: "Paste some news content first." });
    }
    const count = Number.isInteger(storyCount) && storyCount >= 1 && storyCount <= 12 ? storyCount : 6;
    const data = await generateLinkedInNews({ newsContent: newsContent.slice(0, 10000), storyCount: count });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

// Serve Vite build in production
const distDir = path.join(__dirname, "..", "web", "dist");
app.use(express.static(distDir));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

const port = process.env.PORT ? Number(process.env.PORT) : 8787;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${port}`);
});
