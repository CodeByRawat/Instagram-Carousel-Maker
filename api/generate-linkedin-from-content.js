const { generateLinkedInFromContent } = require('../server/openai')

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { content, slideCount } = req.body ?? {}
  if (!content || typeof content !== 'string' || content.trim().length < 20) {
    return res.status(400).json({ error: "Provide at least 20 characters of source content." })
  }
  const count = Number.isInteger(slideCount) && slideCount >= 3 && slideCount <= 15 ? slideCount : 8
  try {
    const data = await generateLinkedInFromContent({ content: content.slice(0, 8000), slideCount: count })
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' })
  }
}
