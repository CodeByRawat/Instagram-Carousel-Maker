const { generateLinkedInNews } = require('../server/openai')

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { newsContent, storyCount } = req.body ?? {}
  if (!newsContent || typeof newsContent !== 'string' || newsContent.trim().length < 30) {
    return res.status(400).json({ error: 'Paste some news content first.' })
  }
  const count = Number.isInteger(storyCount) && storyCount >= 1 && storyCount <= 12 ? storyCount : 6
  try {
    const data = await generateLinkedInNews({ newsContent: newsContent.slice(0, 10000), storyCount: count })
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' })
  }
}
