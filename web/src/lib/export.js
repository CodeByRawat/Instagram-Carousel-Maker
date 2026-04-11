import * as htmlToImage from 'html-to-image'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

function safeSlug(s) {
  return String(s || 'carousel')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)
}

export async function exportCarouselZip({ theme, slideNodes }) {
  if (!Array.isArray(slideNodes) || slideNodes.length !== 6) {
    throw new Error('Export stage not ready (need 6 slides).')
  }

  const zip = new JSZip()
  const folder = zip.folder(safeSlug(theme) || 'carousel')

  for (let i = 0; i < slideNodes.length; i++) {
    const node = slideNodes[i]
    const opts = {
      pixelRatio: 2,
      cacheBust: true,
      width: 1080,
      height: 1350,
      style: {
        transform: 'none',
      },
    }
    // First call fetches and caches all embedded images (fonts, <img> src, etc.)
    // Second call renders with everything already cached — prevents blank images
    await htmlToImage.toPng(node, opts)
    const dataUrl = await htmlToImage.toPng(node, opts)

    const base64 = dataUrl.split(',')[1]
    folder.file(`${String(i + 1).padStart(2, '0')}.png`, base64, { base64: true })
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, `${safeSlug(theme) || 'carousel'}.zip`)
}

