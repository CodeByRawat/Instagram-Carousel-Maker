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
    "You build LinkedIn carousel slides for Sachin Rawat, an AI & Automation Engineer.",
    "",
    "Your job is to follow a carousel brief exactly — not to summarise it, not to interpret it loosely.",
    "A brief tells you: the title, the structure (e.g. hook → 3 X → 3 Y → CTA), and the specific points to cover.",
    "Your job is to flesh each point out into a full slide with real, specific content.",
    "",
    "SACHIN'S VOICE:",
    "- Direct and honest. No hype, no 'game-changer', no 'revolutionary', no '🚀'.",
    "- Short lines, punchy rhythm. One idea per line. Frequent line breaks.",
    "- First-person where it fits. Sentence case. No fluff adjectives.",
    "",
    "FORMAT: Valid JSON only. No markdown. No backticks.",
  ].join("\n");
}

function buildFromContentUserPrompt({ content, slideCount = 8, ideaIndex = 1 }) {
  const lessonCount = slideCount - 2;
  const lessonSlides = Array.from({ length: lessonCount }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return [
      "    {",
      '      "type": "lesson",',
      `      "lessonLabel": "TIP ${n} · [ACTUAL TOPIC IN CAPS — match the brief point]",`,
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
    `TARGET: Build carousel for idea #${ideaIndex} from the list above.`,
    `SLIDE COUNT: ${slideCount} (1 hook + ${lessonCount} lessons + 1 cta)`,
    "",
    "FOLLOW THESE STEPS EXACTLY:",
    "",
    `Step 1 — EXTRACT IDEA #${ideaIndex}:`,
    `  Find the item numbered ${ideaIndex}. in the source. Ignore all other items.`,
    "  Pull out: (a) the quoted title, (b) the described slide structure, (c) the specific points/roles/tools/items listed.",
    "",
    "Step 2 — MAP THE STRUCTURE:",
    "  The brief's structure tells you what each slide covers. Follow it slide-for-slide.",
    `  Example: if the brief says 'hook → 3 roles AI automates → 3 roles AI fumbles → CTA', then:`,
    "    Slide 1 = hook, Slides 2-4 = one automation role each, Slides 5-7 = one fumble each, Slide 8 = CTA.",
    "  Adjust for your actual slide count and the brief's actual structure.",
    "",
    "Step 3 — WRITE THE SLIDES:",
    "  Hook: derive line1/line2/line3 from the brief's title. line3 goes in the neon-green block — make it 1–4 punchy words.",
    "  Lessons: one slide per point from the brief. lessonLabel TOPIC must name the actual point (e.g. 'EMAIL TRIAGE', 'JUDGMENT CALLS', 'CREATIVE DIRECTION'), not a generic label.",
    "  Lesson body: 3–5 short lines. Real, specific content about that point. Not vague.",
    "  CTA: if the brief specifies CTA language (e.g. 'DM me AUDIT'), use it verbatim.",
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
    "  * Use [pill]Word[/pill] tags on one line to render command/keyword pills — e.g. [pill]Test[/pill][pill]Lint[/pill].",
    "  * Use **double-asterisks** around one key insight per slide.",
    "- Keep it grounded in the source content. No invented facts.",
  ].join("\n");
}

async function generateLinkedInFromContent({ content, slideCount = 8, ideaIndex = 1 }) {
  const client = getClient();
  const resp = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    temperature: 0.65,
    max_output_tokens: 3000,
    input: [
      { role: "system", content: buildFromContentSystemPrompt() },
      { role: "user", content: buildFromContentUserPrompt({ content, slideCount, ideaIndex }) },
    ],
    text: { format: { type: "json_object" } },
  });

  const text = resp.output_text;
  let parsed;
  try { parsed = JSON.parse(text); } catch {
    throw new Error("Model did not return valid JSON. Try again.");
  }
  if (!parsed || !Array.isArray(parsed.slides) || parsed.slides.length < 2) {
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
  if (!parsed || !Array.isArray(parsed.slides) || parsed.slides.length < 2) {
    throw new Error("Unexpected JSON shape from model. Try again.");
  }
  return parsed;
}

// ── News: turn a news dump into a daily news carousel ───────────────────────

function buildNewsSystemPrompt() {
  return [
    "You convert raw AI news content into a daily news LinkedIn carousel for Sachin Rawat, an AI & Automation Engineer.",
    "",
    "Your job is to extract, summarise, and format news stories as clean slide content.",
    "",
    "RULES:",
    "- Only include information present in the source. Do not invent stories, details, or numbers.",
    "- Each story gets its own slide. Do not merge stories.",
    "- Assign a short CATEGORY label to each story (e.g. REGULATION, MODELS, FUNDING, SECURITY, RESEARCH, INDUSTRY).",
    "- Write concise, factual summaries. No hype. No opinion. No emoji.",
    "- Headline: rewrite as a punchy 6–10 word summary — do not copy the source headline verbatim.",
    "- Summary: 2–3 short lines. Just the facts. Numbers, deadlines, and specifics are good.",
    "",
    "FORMAT: Valid JSON only. No markdown. No backticks.",
  ].join("\n");
}

function buildNewsUserPrompt({ newsContent, storyCount = 6 }) {
  const storySlides = Array.from({ length: storyCount }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return [
      "    {",
      '      "type": "news-story",',
      `      "storyNumber": "${n}",`,
      '      "category": string,',
      '      "headline": string,',
      '      "summary": string,',
      '      "source": string,',
      '      "footerTag": "/ daily news"',
      "    },",
    ].join("\n");
  }).join("\n");

  return [
    `NEWS CONTENT:\n"""\n${newsContent}\n"""`,
    "",
    `Extract the top ${storyCount} stories from the news content above.`,
    "If there are fewer stories than requested, include all of them.",
    "",
    "Return JSON with this exact shape:",
    "{",
    '  "theme": string,',
    '  "slides": [',
    "    {",
    '      "type": "news-cover",',
    '      "eyebrow": "AI & AUTOMATION · DAILY NEWS",',
    '      "dateDay": string,',
    '      "dateMonth": string,',
    '      "dateYear": string,',
    `      "storyCount": "${storyCount} STORIES",`,
    '      "subtitle": string,',
    '      "footerTag": "/ daily news"',
    "    },",
    storySlides,
    "    {",
    '      "type": "cta",',
    '      "eyebrow": "STAY AHEAD · AI & AUTOMATION",',
    '      "headline": string,',
    '      "subtitle": string,',
    '      "footerTag": "/ daily news"',
    "    }",
    "  ]",
    "}",
    "",
    "Field rules:",
    "- theme: short label like 'Top AI Stories · April 19, 2026'",
    "- news-cover dateDay: just the day number e.g. '19'",
    "- news-cover dateMonth: 3-letter month caps e.g. 'APR'",
    "- news-cover dateYear: 4-digit year e.g. '2026'",
    "- news-cover subtitle: one lowercase line e.g. 'what happened in AI today'",
    "- news-story category: one word in CAPS (REGULATION · MODELS · FUNDING · SECURITY · RESEARCH · INDUSTRY)",
    "- news-story headline: 6–10 words, sentence case, punchy rewrite of the story's core fact",
    "- news-story summary: 2–3 lines separated by \\n. Be specific — include numbers, deadlines, names.",
    "- news-story source: publication name only (e.g. 'Asanify', 'Reuters', 'The Verge')",
    "- cta headline: 2 lines split with \\n, e.g. 'follow for\\ndaily AI news.'",
    "- cta subtitle: 1–2 lines about what Sachin covers. May use ===text=== for the closing neon block.",
  ].join("\n");
}

async function generateLinkedInNews({ newsContent, storyCount = 6 }) {
  const client = getClient();
  const resp = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    temperature: 0.4,
    max_output_tokens: 3000,
    input: [
      { role: "system", content: buildNewsSystemPrompt() },
      { role: "user", content: buildNewsUserPrompt({ newsContent, storyCount }) },
    ],
    text: { format: { type: "json_object" } },
  });

  const text = resp.output_text;
  let parsed;
  try { parsed = JSON.parse(text); } catch {
    throw new Error("Model did not return valid JSON. Try again.");
  }
  if (!parsed || !Array.isArray(parsed.slides) || parsed.slides.length < 2) {
    throw new Error("Unexpected JSON shape from model. Try again.");
  }
  return parsed;
}

module.exports = { generateCarousel, generateLinkedInCarousel, generateDadlyCarousel, generateLinkedInFromContent, generateLinkedInStudy, generateLinkedInNews };

