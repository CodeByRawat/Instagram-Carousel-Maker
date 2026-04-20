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
    "You are a LinkedIn carousel writer for Sachin Rawat, an AI & Automation Engineer who builds AI agents, automation workflows, and ships apps.",
    "His audience is builders, founders, engineers, and AI-curious professionals.",
    "",
    "VOICE AND TONE:",
    "- Direct and honest. No hype, no 'game-changer', no '🚀 in 2026'.",
    "- Short lines, punchy rhythm. One idea per line. Frequent line breaks.",
    "- Confident but not arrogant. First-person, specific, grounded in real building experience.",
    "- Self-deprecating when useful: 'I was wrong for 3 months' lands better than 'I cracked the code.'",
    "- No fluff adjectives: cut 'incredible', 'amazing', 'powerful', 'revolutionary'.",
    "- No em-dash overuse. Sentence case everywhere. Never title case, never ALL CAPS.",
    "- No mid-sentence bolding.",
    "",
    "OPENING LINE RULES:",
    "- Must earn the click. Use: a specific number with tension, a confession, a contrarian claim, or a before/after setup.",
    "- Never open with 'In today's fast-paced world', 'Let me tell you about', or a question.",
    "",
    "HONESTY GUARDRAILS:",
    "- Never invent features, tools, commands, or quotes.",
    "- Only write in first person about things Sachin actually does as an AI & Automation Engineer.",
    "- No fake metrics or fabricated origin stories.",
    "",
    "FORMAT: Output MUST be valid JSON only. No markdown. No backticks.",
  ].join("\n");
}

function buildLinkedInUserPrompt({ theme, language, slideCount = 8 }) {
  const lessonCount = slideCount - 2 // minus cover + CTA
  const lessonSlides = Array.from({ length: lessonCount }, (_, i) => {
    const n = String(i + 1).padStart(2, "0")
    return [
      "    {",
      '      "type": "lesson",',
      `      "lessonLabel": "TIP ${n} · [TOPIC IN CAPS]",`,
      `      "slideNumber": "${n}",`,
      '      "headline": string,',
      '      "body": string,',
      '      "footerTag": "/ workflow notes"',
      "    },",
    ].join("\n")
  }).join("\n")

  return [
    `THEME: ${theme}`,
    `LANGUAGE: ${language}`,
    `SLIDE COUNT: ${slideCount} (1 hook + ${lessonCount} lesson + 1 cta)`,
    "",
    "Return JSON with this exact shape:",
    "{",
    '  "theme": string,',
    '  "slides": [',
    "    {",
    '      "type": "hook",',
    '      "eyebrow": "AI & AUTOMATION · FIELD NOTES",',
    '      "line1": string,',
    '      "line2": string,',
    '      "line3": string,',
    '      "subtitle": string,',
    '      "footerTag": "/ workflow notes"',
    "    },",
    lessonSlides,
    "    {",
    '      "type": "cta",',
    '      "eyebrow": string,',
    '      "headline": string,',
    '      "subtitle": string,',
    '      "footerTag": "/ workflow notes"',
    "    }",
    "  ]",
    "}",
    "",
    "Content rules:",
    "- hook line1+line2+line3: three short stacked lines forming the title. Keep each line ≤16 chars so it fits the large font. Line3 sits in a neon-green block — punchy, 1–4 words.",
    "- hook subtitle: 1–2 lines separated by \\n teasing what the carousel covers.",
    "- lesson headline: the tip or claim, max 10 words, sentence case.",
    "- lesson body: 3–5 short punchy lines separated by \\n.",
    "  * Use ===text=== (triple equals) around a single punchline word or phrase to render it in a neon-green highlight block.",
    "  * Use [pill]Word[/pill] tags (all on one line) to render command/keyword pills — e.g. [pill]Test[/pill][pill]Lint[/pill].",
    "  * Use **double-asterisks** around one key insight per slide for emphasis.",
    "- cta eyebrow: 3–5 words in CAPS.",
    "- cta headline: short hook split across 2 lines with \\n.",
    "- cta subtitle: 1–2 lines about what Sachin ships/shares. May use ===text=== for the closing neon block.",
    "- Keep it specific to Sachin's actual work (AI agents, automation, apps). No generic motivational language.",
  ].join("\n");
}

async function generateLinkedInCarousel({ theme, language, slideCount = 8 }) {
  const client = getClient();
  const resp = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    temperature: 0.7,
    max_output_tokens: 1600,
    input: [
      { role: "system", content: buildLinkedInSystemPrompt() },
      { role: "user", content: buildLinkedInUserPrompt({ theme, language, slideCount }) },
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
  if (!parsed || !Array.isArray(parsed.slides) || parsed.slides.length !== slideCount) {
    throw new Error("Unexpected JSON shape from model. Try again.");
  }
  return parsed;
}

function buildDadlySystemPrompt() {
  return [
    "You write viral, informational Instagram carousel copy for @pagefordads — the Dadly app account.",
    "",
    "ABOUT DADLY: An app for new and expecting dads. Gives clear answers to pregnancy, newborn, and early parenting questions without panic spirals.",
    "",
    "VOICE:",
    "- Direct, practical, reassuring. Speaks man-to-man.",
    "- No fluff. No judgment. No baby-talk.",
    "- The first slide (hook) MUST be extremely hooky — a POV, a relatable 3am moment, or a bold statement that makes dads stop scrolling.",
    "",
    "RULES:",
    "- Only factually accurate parenting/baby information.",
    "- Each lesson slide = one clear, actionable insight.",
    "- Use exactly 6 slides: hook, lesson, lesson, lesson, lesson, CTA.",
    "- The CTA always promotes downloading the Dadly app.",
    "",
    "FORMAT: Output MUST be valid JSON only. No markdown. No backticks.",
  ].join("\n")
}

function buildDadlyUserPrompt({ theme, language }) {
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
    '      "eyebrow": string,',
    '      "headline": string,',
    '      "subtext": string,',
    '      "handle": "pagefordads",',
    '      "roleTag": "FOR DADS"',
    "    },",
    "    {",
    '      "type": "lesson",',
    '      "lessonLabel": "Tip 01 · [topic]",',
    '      "ghostNumber": "01",',
    '      "headline": string,',
    '      "body": string,',
    '      "handle": "pagefordads"',
    "    },",
    "    {",
    '      "type": "lesson",',
    '      "lessonLabel": "Tip 02 · [topic]",',
    '      "ghostNumber": "02",',
    '      "headline": string,',
    '      "body": string,',
    '      "handle": "pagefordads"',
    "    },",
    "    {",
    '      "type": "lesson",',
    '      "lessonLabel": "Tip 03 · [topic]",',
    '      "ghostNumber": "03",',
    '      "headline": string,',
    '      "body": string,',
    '      "handle": "pagefordads"',
    "    },",
    "    {",
    '      "type": "lesson",',
    '      "lessonLabel": "Tip 04 · [topic]",',
    '      "ghostNumber": "04",',
    '      "headline": string,',
    '      "body": string,',
    '      "handle": "pagefordads"',
    "    },",
    "    {",
    '      "type": "cta",',
    '      "eyebrow": string,',
    '      "headline": string,',
    '      "subtitle": string,',
    '      "pillars": [string, string, string, string, string],',
    '      "handle": "pagefordads"',
    "    }",
    "  ]",
    "}",
    "",
    "Content rules:",
    "- Hook headline: 2–4 lines, bold and relatable. Use *asterisks* around one word or phrase for gold highlight.",
    "- Hook subtext: tease what the carousel covers (1 line).",
    "- Lesson headline: punchy, max 10 words. Use *asterisks* for highlight.",
    "- Lesson body: 2–3 sentences. Bold key insight with **double asterisks**.",
    "- CTA pillars: 5 Dadly app features, short and punchy.",
  ].join("\n")
}

async function generateDadlyCarousel({ theme, language }) {
  const client = getClient()
  const resp = await client.responses.create({
    model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    temperature: 0.75,
    max_output_tokens: 900,
    input: [
      { role: 'system', content: buildDadlySystemPrompt() },
      { role: 'user', content: buildDadlyUserPrompt({ theme, language }) },
    ],
    text: { format: { type: 'json_object' } },
  })

  const text = resp.output_text
  let parsed
  try { parsed = JSON.parse(text) } catch {
    throw new Error('Model did not return valid JSON. Try again.')
  }
  if (!parsed || !Array.isArray(parsed.slides) || parsed.slides.length !== 6) {
    throw new Error('Unexpected JSON shape from model. Try again.')
  }
  return parsed
}

// ── From-content: turn user-pasted content into Sachin-voice slides ────────

function buildFromContentSystemPrompt() {
  return [
    "You convert user-provided content into LinkedIn carousel slides for Sachin Rawat, an AI & Automation Engineer.",
    "Take the raw content (blog post, tweet, article, notes, or rough ideas) and restructure it as a carousel in Sachin's voice.",
    "",
    "SACHIN'S VOICE:",
    "- Direct and honest. No hype, no 'game-changer', no 'revolutionary', no '🚀'.",
    "- Short lines, punchy rhythm. One idea per line. Frequent line breaks.",
    "- First-person, specific, grounded in real building experience.",
    "- Self-deprecating when useful. Sentence case. No fluff adjectives.",
    "",
    "HONESTY RULES:",
    "- Only use claims and facts present in the provided content. Do not invent.",
    "- Never fabricate metrics, quotes, or tool names that aren't in the source.",
    "- Write in first person only for things the source says Sachin actually did.",
    "",
    "FORMAT: Valid JSON only. No markdown. No backticks.",
  ].join("\n");
}

function buildFromContentUserPrompt({ content, slideCount = 8 }) {
  const lessonCount = slideCount - 2;
  const lessonSlides = Array.from({ length: lessonCount }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return [
      "    {",
      '      "type": "lesson",',
      `      "lessonLabel": "TIP ${n} · [TOPIC IN CAPS]",`,
      `      "slideNumber": "${n}",`,
      '      "headline": string,',
      '      "body": string,',
      '      "footerTag": "/ workflow notes"',
      "    },",
    ].join("\n");
  }).join("\n");

  return [
    `SOURCE CONTENT:\n"""\n${content}\n"""`,
    "",
    `SLIDE COUNT: ${slideCount} (1 hook + ${lessonCount} lesson + 1 cta)`,
    "",
    "Extract the core ideas from the source content and restructure them as carousel slides.",
    "Rewrite in Sachin's voice — do not copy sentences verbatim.",
    "",
    "Return JSON with this exact shape:",
    "{",
    '  "theme": string,',
    '  "slides": [',
    "    {",
    '      "type": "hook",',
    '      "eyebrow": "AI & AUTOMATION · FIELD NOTES",',
    '      "line1": string,',
    '      "line2": string,',
    '      "line3": string,',
    '      "subtitle": string,',
    '      "footerTag": "/ workflow notes"',
    "    },",
    lessonSlides,
    "    {",
    '      "type": "cta",',
    '      "eyebrow": string,',
    '      "headline": string,',
    '      "subtitle": string,',
    '      "footerTag": "/ workflow notes"',
    "    }",
    "  ]",
    "}",
    "",
    "Content rules:",
    "- hook line1+line2+line3: short stacked lines forming the carousel's hook (≤16 chars each). Line3 is in a neon-green block — make it punchy.",
    "- hook subtitle: 1–2 lines teasing what's inside.",
    "- lesson headline: the core insight, max 10 words, sentence case.",
    "- lesson body: 3–5 short punchy lines separated by \\n.",
    "  * Use ===text=== around the sharpest punchline in the slide.",
    "  * Use **double-asterisks** around one key insight per slide.",
    "- Keep it grounded in the source content. No invented facts.",
  ].join("\n");
}

async function generateLinkedInFromContent({ content, slideCount = 8 }) {
  const client = getClient();
  const resp = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    temperature: 0.65,
    max_output_tokens: 1800,
    input: [
      { role: "system", content: buildFromContentSystemPrompt() },
      { role: "user", content: buildFromContentUserPrompt({ content, slideCount }) },
    ],
    text: { format: { type: "json_object" } },
  });

  const text = resp.output_text;
  let parsed;
  try { parsed = JSON.parse(text); } catch {
    throw new Error("Model did not return valid JSON. Try again.");
  }
  if (!parsed || !Array.isArray(parsed.slides) || parsed.slides.length !== slideCount) {
    throw new Error("Unexpected JSON shape from model. Try again.");
  }
  return parsed;
}

// ── Study AI: explain an AI/automation topic as educational slides ───────────

function buildStudySystemPrompt() {
  return [
    "You create educational LinkedIn carousel slides explaining AI and automation concepts.",
    "Audience: builders, founders, engineers — curious practitioners, not academics or complete beginners.",
    "",
    "TEACHING APPROACH:",
    "- Start with a plain-language definition. No jargon without explanation.",
    "- Give a concrete analogy or real-world example.",
    "- Explain why builders care: when to use it, what problem it solves.",
    "- Surface common mistakes or misconceptions.",
    "- End with a practical takeaway — something the reader can act on.",
    "",
    "TONE:",
    "- Clear and direct. No waffle, no 'In conclusion', no 'To summarise'.",
    "- Confident teacher energy. Not condescending. Not hyped.",
    "- Short sentences. One idea per line. Use \\n to break body text.",
    "",
    "FORMAT: Valid JSON only. No markdown. No backticks.",
  ].join("\n");
}

function buildStudyUserPrompt({ topic, slideCount = 8 }) {
  const lessonCount = slideCount - 2;
  const lessonSlides = Array.from({ length: lessonCount }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return [
      "    {",
      '      "type": "lesson",',
      `      "lessonLabel": "TIP ${n} · [CONCEPT IN CAPS]",`,
      `      "slideNumber": "${n}",`,
      '      "headline": string,',
      '      "body": string,',
      '      "footerTag": "/ explained"',
      "    },",
    ].join("\n");
  }).join("\n");

  return [
    `TOPIC: ${topic}`,
    `SLIDE COUNT: ${slideCount} (1 hook + ${lessonCount} lesson + 1 cta)`,
    "",
    "Teach this topic clearly across the slides. Suggested progression:",
    "  01 — what it is (plain language definition)",
    "  02 — how it works (the core mechanism or architecture)",
    "  03 — a concrete example or analogy that makes it click",
    "  04 — when to use it / what problem it solves",
    "  05+ — common mistakes, edge cases, or advanced nuance (if more slides)",
    "  CTA — invite questions, follow for more explained topics",
    "",
    "Return JSON with this exact shape:",
    "{",
    '  "theme": string,',
    '  "slides": [',
    "    {",
    '      "type": "hook",',
    '      "eyebrow": "AI & AUTOMATION · EXPLAINED",',
    '      "line1": string,',
    '      "line2": string,',
    '      "line3": "explained.",',
    '      "subtitle": string,',
    '      "footerTag": "/ explained"',
    "    },",
    lessonSlides,
    "    {",
    '      "type": "cta",',
    '      "eyebrow": "AI & AUTOMATION · EXPLAINED",',
    '      "headline": string,',
    '      "subtitle": string,',
    '      "footerTag": "/ explained"',
    "    }",
    "  ]",
    "}",
    "",
    "Content rules:",
    "- hook line1+line2: split the topic name across 2 lines (≤16 chars each). line3 is always 'explained.'",
    "- hook subtitle: 1 line like 'what it is, how it works, and when to use it.'",
    "- lesson headline: the concept name or key question, max 10 words, sentence case.",
    "- lesson body: 3–5 short lines separated by \\n.",
    "  * Use ===term=== to highlight a key term or punchline in a neon-green block.",
    "  * Use **double-asterisks** around the single most important sentence.",
    "- Avoid oversimplifying. The reader is technical.",
  ].join("\n");
}

async function generateLinkedInStudy({ topic, slideCount = 8 }) {
  const client = getClient();
  const resp = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    temperature: 0.6,
    max_output_tokens: 1800,
    input: [
      { role: "system", content: buildStudySystemPrompt() },
      { role: "user", content: buildStudyUserPrompt({ topic, slideCount }) },
    ],
    text: { format: { type: "json_object" } },
  });

  const text = resp.output_text;
  let parsed;
  try { parsed = JSON.parse(text); } catch {
    throw new Error("Model did not return valid JSON. Try again.");
  }
  if (!parsed || !Array.isArray(parsed.slides) || parsed.slides.length !== slideCount) {
    throw new Error("Unexpected JSON shape from model. Try again.");
  }
  return parsed;
}

module.exports = { generateCarousel, generateLinkedInCarousel, generateDadlyCarousel, generateLinkedInFromContent, generateLinkedInStudy };

