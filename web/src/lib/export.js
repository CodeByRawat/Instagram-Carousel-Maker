import * as htmlToImage from 'html-to-image'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { jsPDF } from 'jspdf'

function safeSlug(s) {
  return String(s || 'carousel')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)
}

async function captureSlide(node, slideHeight) {
  const opts = {
    pixelRatio: 2,
    cacheBust: true,
    width: 1200,
    height: slideHeight,
    style: { transform: 'none' },
  }
  // First call caches fonts and embedded images; second call renders cleanly
  await htmlToImage.toPng(node, opts)
  return htmlToImage.toPng(node, opts)
}

export async function exportCarouselZip({ theme, slideNodes, slideHeight = 1500 }) {
  if (!Array.isArray(slideNodes) || slideNodes.length === 0) {
    throw new Error('Export stage not ready.')
  }

  const zip = new JSZip()
  const folder = zip.folder(safeSlug(theme) || 'carousel')

  for (let i = 0; i < slideNodes.length; i++) {
    const dataUrl = await captureSlide(slideNodes[i], slideHeight)
    const base64 = dataUrl.split(',')[1]
    folder.file(`${String(i + 1).padStart(2, '0')}.png`, base64, { base64: true })
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, `${safeSlug(theme) || 'carousel'}.zip`)
}

export async function exportCarouselPdf({ theme, slideNodes, slideHeight = 1500 }) {
  if (!Array.isArray(slideNodes) || slideNodes.length === 0) {
    throw new Error('Export stage not ready.')
  }

  // PDF page at 1200×1500pt (1pt = 1px at 72dpi; jsPDF units in pt)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [1200, slideHeight],
    hotfixes: ['px_scaling'],
  })

  for (let i = 0; i < slideNodes.length; i++) {
    if (i > 0) pdf.addPage([1200, slideHeight], 'portrait')
    const dataUrl = await captureSlide(slideNodes[i], slideHeight)
    pdf.addImage(dataUrl, 'PNG', 0, 0, 1200, slideHeight, undefined, 'FAST')
  }

  pdf.save(`${safeSlug(theme) || 'carousel'}.pdf`)
}
