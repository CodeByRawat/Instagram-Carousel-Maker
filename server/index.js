const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { generateCarousel, generateLinkedInCarousel, generateDadlyCarousel } = require("./openai");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

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
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

app.post("/api/generate-linkedin", async (req, res) => {
  try {
    const { theme, language = "en" } = req.body ?? {};
    if (!theme || typeof theme !== "string") {
      return res.status(400).json({ error: "Missing 'theme' string." });
    }
    const data = await generateLinkedInCarousel({ theme, language });
    return res.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
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
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
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

