# 🪷 Wisdom – Eternal Quotes
## Brand Identity Document
*your_divine.sofia · Instagram Carousel System*

---

## 01 · Person & Voice

| Field | Value |
|---|---|
| **Name** | your_divine.sofia |
| **Platform** | Instagram |
| **Niche** | Ancient Hindu wisdom for modern life |
| **Tagline** | *Ancient Wisdom. Daily Practice.* |
| **Sources** | Bhagavad Gita · Upanishads · Vedas · Ramacharitmanas |

### Voice & Tone
- **Bold but calm** — not preachy, not academic
- **Direct** — one truth per slide, no fluff
- **Modern lens** — ancient verse, contemporary application
- **Never** dramatic or sensational

### Hook Style
Provocative but grounded. Examples:
> *"The Gita knew this 5,000 years ago."*
> *"Here's what no one tells you about the mind."*
> *"Ancient India's answer to burnout."*

---

## 02 · Color Palette

| Role | Name | Hex | Usage |
|---|---|---|---|
| **Background** | Warm Cream | `#EDE8E0` | All slide backgrounds |
| **Background 2** | Deep Cream | `#E5DED4` | Panels, right columns |
| **Primary Text** | Near Black | `#111111` | Headlines, body |
| **Accent** | Temple Red | `#C0392B` | Highlight words, dots, rules |
| **Secondary** | Saffron Amber | `#D4922A` | Sanskrit text, verse refs, amber accents |
| **Body Text** | Warm Mid | `#555555` | Body copy, subtext |
| **Muted** | Warm Grey | `#999999` | Role tags, captions |
| **Pure White** | White | `#FFFFFF` | Author bar text |

> ⚠️ **No dark slides.** All slides stay in the cream/black/red palette. Bright theme only.

---

## 03 · Typography

| Role | Font | Weight | Size | Usage |
|---|---|---|---|---|
| **Display** | Inter | 900 (Black) | 86–124px | Hook headlines, CTA |
| **Section Title** | Inter | 900 (Black) | 72–82px | Slide titles |
| **Quote** | Playfair Display | 700 Italic | 46–58px | Gita verses, quotes |
| **Body** | Inter | 400 | 19–23px | Application text, subtext |
| **Label** | Inter | 700 | 12–13px | Lesson labels, eyebrows |
| **Sanskrit** | Noto Serif Devanagari | 400–600 | 17–22px | Original Sanskrit verses |
| **Handle** | Inter | 700 | 17–18px | Footer username |

### Typographic Rules
- Headlines: `letter-spacing: -3px`, `line-height: 0.92–0.95`
- Labels: `UPPERCASE`, `letter-spacing: 3–4px`
- Red highlight: wrap word in `<em>` — no italic, just color
- Bold in body: `**word**` → `<strong>` tag

---

## 04 · Slide System

### Canvas
- **Size:** 1080 × 1080 px (Instagram square)
- **Theme:** Cream only — `#EDE8E0` background, no dark slides

### Footer (every slide)
| Element | Spec |
|---|---|
| Height | 90px |
| Background | Transparent (floats over slide) |
| Left | Profile photo circle (56px) + handle |
| Right | Pagination dots (6 total, active = red `#C0392B`) |
| Avatar border | 2px solid `#111111` |

### Top Rule
- 5px solid line at very top
- Color: `#111111` on cream slides, `#C0392B` on CTA slide

---

## 05 · Slide Templates

### Template A — Hook (Slide 1)
```
[Role tag — top right, grey]
[BIG HEADLINE — left, 50% width, Inter 900]
[Subtext — left, below headline]
[Decorative visual element — right half]
[Footer]
```
- Headline: 3–5 lines, one word/phrase in red
- Right side: illustration, mandala, or geometric accent

---

### Template B — Lesson (Slides 2, 3, 5)
```
[5px top rule — black]
[Ghost number — top right, 4% opacity]
[Lesson label — top left, red uppercase]
[Sanskrit verse — amber, Noto Serif Devanagari]
[Big quote mark " — red, 15% opacity]
[QUOTE — Playfair Display Italic, black + red word]
[Reference — amber uppercase]
[Divider line]
[WHY IT MATTERS label — red]
[Application body — Inter 400, mid grey]
[Footer]
```
- Quote: max 2 lines
- Application: max 3 sentences
- Format: `*word*` = red · `**word**` = bold

---

### Template C — CTA (Slide 6)
```
[5px top rule — red]
[Eyebrow — red uppercase]
[BIG HEADLINE — Inter 900]
[Subtitle]
[3 bullet pillars — red dot + text]
[@handle — underlined with red border]
[Author bar — black bg, full width]
  [Left: avatar circle + handle + role]
  [Right: Like · Save · Share ✦]
```

---

## 06 · Content Formula

### Per Carousel (6 slides)
1. **Hook** — 1 provocative headline + 1 subline
2. **Lesson 1** — Sanskrit + quote (Gita) + 3-line application
3. **Lesson 2** — Sanskrit + quote (Gita) + 3-line application
4. **Lesson 3** — Sanskrit + quote (Gita) + 3-line application
5. **Lesson 4** — Sanskrit + quote (Gita) + 3-line application
6. **CTA** — Follow prompt + 3 pillars + handle

### Content Sources (in priority order)
1. Bhagavad Gita (primary)
2. Upanishads
3. Ramacharitmanas
4. Vedas

### Lesson Structure
```
Label:     "Lesson 01 · [Topic Name]"
Sanskrit:  Original Devanagari verse
Quote:     English — max 2 lines — 1 word in red
Ref:       "— Bhagavad Gita · Chapter X, Verse Y"
Apply:     2–3 sentences. **Bold** the key insight.
```

---

## 07 · Prompt Template

Use this to generate new carousels:

```
Create a 6-slide Instagram carousel for @your_divine.sofia.

THEME: [topic — e.g. "dealing with failure" / "stress at work" / "relationships"]

BRAND:
- Platform: Instagram · Handle: your_divine.sofia
- Style: Bright cream (#EDE8E0), black (#111111), red (#C0392B), amber (#D4922A)
- NO dark slides
- Fonts: Inter 900 for headlines, Playfair Display Italic for quotes
- Footer: profile photo circle + handle + pagination dots on every slide

STRUCTURE:
- Slide 1: Hook headline (bold, 1 red word) + subtext
- Slide 2: Lesson 1 — Sanskrit + Gita quote + application
- Slide 3: Lesson 2 — Sanskrit + Gita quote + application
- Slide 4: Lesson 3 — Sanskrit + Gita quote + application
- Slide 5: Lesson 4 — Sanskrit + Gita quote + application
- Slide 6: CTA — Follow prompt + 3 content pillars + handle

OUTPUT: Single HTML file, 1080×1080px per slide, stacked vertically.
```

---

## 08 · Do's & Don'ts

### ✅ Do
- One insight per slide — don't crowd
- Always cite the verse (Chapter + Verse)
- Include Sanskrit original — it adds authenticity
- Keep application text relatable (work, stress, relationships)
- Use the red accent sparingly — 1 word per headline max

### ❌ Don't
- No dark/black slide backgrounds
- No purple gradients or generic AI aesthetics
- No fake or made-up quotes
- Don't use more than 1 red word per headline
- Don't mix fonts outside the defined system

---

*Last updated: April 2026*
