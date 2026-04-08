const { generateLinkedInCarousel } = require('../server/openai')

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { theme, language = 'en' } = req.body ?? {}
  if (!theme || typeof theme !== 'string') return res.status(400).json({ error: "Missing 'theme' string." })
  try {
    const data = await generateLinkedInCarousel({ theme, language })
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' })
  }
}
