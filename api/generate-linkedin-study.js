const { generateLinkedInStudy } = require('../server/openai')

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { topic, slideCount } = req.body ?? {}
  if (!topic || typeof topic !== 'string' || topic.trim().length < 2) {
    return res.status(400).json({ error: "Missing 'topic' string." })
  }
  const count = Number.isInteger(slideCount) && slideCount >= 3 && slideCount <= 15 ? slideCount : 8
  try {
    const data = await generateLinkedInStudy({ topic: topic.slice(0, 200), slideCount: count })
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' })
  }
}
