const OpenAIImport = require("openai");
const OpenAI = OpenAIImport.default ?? OpenAIImport;

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to your .env (see .env.example).",
    );
  }
  return new OpenAI({ apiKey });
}

function buildSystemPrompt() {
  return [
    "You write concise Instagram carousel copy for @your_divine.sofia.",
    "",
    "VOICE:",
    "- Bold but calm. Direct. Modern lens. Not preachy, not academic.",
    "- Never dramatic or sensational.",
    "",
    "RULES:",
    "- Do NOT fabricate scripture quotes. If unsure, write a paraphrase and label it as 'Paraphrase' (still cite chapter/verse only when certain).",
    "- Keep each slide tight. One insight per slide.",
    "- Use exactly 6 slides: hook, lesson, lesson, lesson, lesson, CTA.",
    "",
    "FORMAT:",
    "- Output MUST be valid JSON only. No markdown. No backticks.",
    "- Use the schema provided by the user message.",
  ].join("\n");
}

function buildUserPrompt({ theme, language }) {
  return [
    `THEME: ${theme}`,
    `LANGUAGE: ${language}`,
    "",
    "Return JSON with this exact shape:",
    "{",
    '  "theme": string,',
    '  "slides": [',
    "    {",
    '      "type": "hook",',
    '      "roleTag": string,',
    '      "headline": string,',
    '      "subtext": string,',
    '      "appScreenKey": "app1" | "app2" | "app3" | "app4" | "app5" | "app6"',
    "    },",
    "    {",
    '      "type": "lesson",',
    '      "lessonLabel": "Lesson 01 · [topic]",',
    '      "ghostNumber": "02",',
    '      "sanskrit": string,',
    '      "quote": string,',
    '      "highlightWord": string,',
    '      "reference": string,',
    '      "applicationLabel": "Why it matters",',
    '      "applicationBody": string',
    "    },",
    "    {",
    '      "type": "lesson",',
    '      "lessonLabel": "Lesson 02 · [topic]",',
    '      "ghostNumber": "03",',
    '      "sanskrit": string,',
    '      "quote": string,',
    '      "highlightWord": string,',
    '      "reference": string,',
    '      "applicationLabel": "Why it matters",',
    '      "applicationBody": string',
    "    },",
    "    {",
    '      "type": "lesson",',
    '      "lessonLabel": "Lesson 03 · [topic]",',
    '      "ghostNumber": "04",',
    '      "sanskrit": string,',
    '      "quote": string,',
    '      "highlightWord": string,',
    '      "reference": string,',
    '      "applicationLabel": "Why it matters",',
    '      "applicationBody": string',
    "    },",
    "    {",
    '      "type": "lesson",',
    '      "lessonLabel": "Lesson 04 · [topic]",',
    '      "ghostNumber": "05",',
    '      "sanskrit": string,',
    '      "quote": string,',
    '      "highlightWord": string,',
    '      "reference": string,',
    '      "applicationLabel": "Why it matters",',
    '      "applicationBody": string',
    "    },",
    "    {",
    '      "type": "cta",',
    '      "eyebrow": string,',
    '      "headline": string,',
    '      "subtitle": string,',
    '      "pillars": [string, string, string],',
    '      "handle": "your_divine.sofia",',
    '      "role": "AI Automation & Newsletter Strategist",',
    '      "appScreenKey": "app1" | "app2" | "app3" | "app4" | "app5" | "app6"',
    "    }",
    "  ]",
    "}",
    "",
    "Content constraints:",
    "- Hook headline: 3–5 lines, 1 word intended for red highlight (provide it as highlightWord inside each lesson; for hook embed the highlighted word by surrounding it with *asterisks* like *mind*).",
    "- Lesson quote: max 2 lines, keep it paraphrase-safe if uncertain.",
    "- Application body: 2–3 sentences. Mark one key insight with **double-asterisks**.",
    "- References: only include chapter/verse when you're confident; otherwise use '— Bhagavad Gita · Paraphrase'.",
    "- Avoid melodrama (no 'I was broken', 'saved me', etc.).",
  ].join("\n");
}

async function generateCarousel({ theme, language }) {
  const client = getClient();
  const resp = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    temperature: 0.7,
    max_output_tokens: 900,
    input: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: buildUserPrompt({ theme, language }) },
    ],
    text: { format: { type: "json_object" } },
  });

  const text = resp.output_text;
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Model did not return valid JSON. Try again.");
  }
  if (!parsed || !Array.isArray(parsed.slides) || parsed.slides.length !== 6) {
    throw new Error("Unexpected JSON shape from model. Try again.");
  }
  return parsed;
}

function buildLinkedInSystemPrompt() {
  return [
    "You write concise LinkedIn carousel copy for @your_divine.sofia.",
    "",
    "VOICE:",
    "- Thoughtful, professional, and grounded. Speaks to ambitious professionals.",
    "- Insightful without being preachy. Bridges ancient wisdom with modern work life.",
    "- No fluff, no motivational clichés.",
    "",
    "RULES:",
    "- Do NOT fabricate scripture quotes. If unsure, write a paraphrase and label it as 'Paraphrase' (cite chapter/verse only when certain).",
    "- Keep each slide focused. One idea per slide.",
    "- Use exactly 6 slides: hook, lesson, lesson, lesson, lesson, CTA.",
    "- LinkedIn audience: founders, creators, knowledge workers seeking clarity.",
    "",
    "FORMAT:",
    "- Output MUST be valid JSON only. No markdown. No backticks.",
    "- Use the schema provided by the user message.",
  ].join("\n");
}

function buildLinkedInUserPrompt({ theme, language }) {
  return [
    `THEME: ${theme}`,
    `LANGUAGE: ${language}`,
    "",
    "Return JSON with this exact shape:",
    "{",
    '  "theme": string,',
    '  "slides": [',
    "    {",
    '      "type": "hook",',
    '      "roleTag": string,',
    '      "headline": string,',
    '      "subtext": string,',
    '      "appScreenKey": "app1" | "app2" | "app3" | "app4" | "app5" | "app6"',
    "    },",
    "    {",
    '      "type": "lesson",',
    '      "lessonLabel": "Lesson 01 · [topic]",',
    '      "ghostNumber": "02",',
    '      "sanskrit": string,',
    '      "quote": string,',
    '      "highlightWord": string,',
    '      "reference": string,',
    '      "applicationLabel": "Why it matters",',
    '      "applicationBody": string',
    "    },",
    "    {",
    '      "type": "lesson",',
    '      "lessonLabel": "Lesson 02 · [topic]",',
    '      "ghostNumber": "03",',
    '      "sanskrit": string,',
    '      "quote": string,',
    '      "highlightWord": string,',
    '      "reference": string,',
    '      "applicationLabel": "Why it matters",',
    '      "applicationBody": string',
    "    },",
    "    {",
    '      "type": "lesson",',
    '      "lessonLabel": "Lesson 03 · [topic]",',
    '      "ghostNumber": "04",',
    '      "sanskrit": string,',
    '      "quote": string,',
    '      "highlightWord": string,',
    '      "reference": string,',
    '      "applicationLabel": "Why it matters",',
    '      "applicationBody": string',
    "    },",
    "    {",
    '      "type": "lesson",',
    '      "lessonLabel": "Lesson 04 · [topic]",',
    '      "ghostNumber": "05",',
    '      "sanskrit": string,',
    '      "quote": string,',
    '      "highlightWord": string,',
    '      "reference": string,',
    '      "applicationLabel": "Why it matters",',
    '      "applicationBody": string',
    "    },",
    "    {",
    '      "type": "cta",',
    '      "eyebrow": string,',
    '      "headline": string,',
    '      "subtitle": string,',
    '      "pillars": [string, string, string],',
    '      "handle": "your_divine.sofia",',
    '      "role": "AI Automation & Newsletter Strategist",',
    '      "appScreenKey": "app1" | "app2" | "app3" | "app4" | "app5" | "app6"',
    "    }",
    "  ]",
    "}",
    "",
    "Content constraints for LinkedIn:",
    "- Hook headline: 3–5 lines, bold opener that speaks to a professional pain point. Mark one word with *asterisks* for red highlight.",
    "- Lesson quote: max 2 lines, rooted in practical wisdom. Paraphrase clearly if uncertain.",
    "- Application body: 2–3 sentences connecting the verse to professional life. Mark one key insight with **double-asterisks**.",
    "- CTA eyebrow: invite professionals to follow, save, or repost.",
    "- Avoid generic motivational language. Be specific and useful.",
  ].join("\n");
}

async function generateLinkedInCarousel({ theme, language }) {
  const client = getClient();
  const resp = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    temperature: 0.7,
    max_output_tokens: 900,
    input: [
      { role: "system", content: buildLinkedInSystemPrompt() },
      { role: "user", content: buildLinkedInUserPrompt({ theme, language }) },
    ],
    text: { format: { type: "json_object" } },
  });

  const text = resp.output_text;
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Model did not return valid JSON. Try again.");
  }
  if (!parsed || !Array.isArray(parsed.slides) || parsed.slides.length !== 6) {
    throw new Error("Unexpected JSON shape from model. Try again.");
  }
  return parsed;
}

module.exports = { generateCarousel, generateLinkedInCarousel };

