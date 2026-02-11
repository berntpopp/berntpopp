#!/usr/bin/env node

import { writeFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT_DIR = join(__dirname, '..')

/**
 * Generate image sitemap for better image SEO
 */
export function generateImageSitemap() {
  console.log('🖼️  Generating image sitemap...')

  const publicDir = join(ROOT_DIR, 'public')
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg']
  const images = []

  // Recursively find all images
  function findImages(dir, baseUrl = '') {
    const files = readdirSync(dir)

    files.forEach((file) => {
      const fullPath = join(dir, file)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        findImages(fullPath, `${baseUrl}/${file}`)
      } else if (imageExtensions.includes(extname(file).toLowerCase())) {
        // Skip certain directories
        if (baseUrl.includes('node_modules') || baseUrl.includes('.vitepress')) return

        images.push({
          loc: `https://berntpopp.com${baseUrl}/${file}`,
          title: generateImageTitle(file),
          caption: generateImageCaption(file, baseUrl),
        })
      }
    })
  }

  findImages(publicDir)

  // Generate image sitemap XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'

  // Group images by page
  const imagesByPage = {
    '/': [],
    '/about': [],
    '/cv': [],
    '/publications': [],
  }

  images.forEach((img) => {
    if (img.loc.includes('photography')) {
      imagesByPage['/'] = imagesByPage['/'] || []
      imagesByPage['/'].push(img)
    } else if (img.loc.includes('b1_') || img.loc.includes('b2_')) {
      // Profile images on multiple pages
      Object.keys(imagesByPage).forEach((page) => {
        imagesByPage[page].push(img)
      })
    } else {
      imagesByPage['/'].push(img)
    }
  })

  // Generate XML for each page
  Object.entries(imagesByPage).forEach(([page, pageImages]) => {
    if (pageImages.length === 0) return

    xml += '  <url>\n'
    xml += `    <loc>https://berntpopp.com${page === '/' ? '' : page}</loc>\n`

    pageImages.forEach((img) => {
      xml += '    <image:image>\n'
      xml += `      <image:loc>${img.loc}</image:loc>\n`
      xml += `      <image:title>${img.title}</image:title>\n`
      xml += `      <image:caption>${img.caption}</image:caption>\n`
      xml += '    </image:image>\n'
    })

    xml += '  </url>\n'
  })

  xml += '</urlset>'

  writeFileSync(join(publicDir, 'sitemap-images.xml'), xml)
  console.log('✅ Generated image sitemap')

  return images.length
}

/**
 * Generate image alt text and metadata
 */
export function generateImageMetadata() {
  console.log('📝 Generating image metadata...')

  const metadata = {
    '/b1_round.png': {
      alt: 'Dr.med. Bernt Popp - Professional portrait, round format',
      title: 'Dr.med. Bernt Popp Portrait',
      description:
        'Professional photograph of Dr. med. Bernt Popp, Senior Physician and Human Geneticist',
    },
    '/b2_round.png': {
      alt: 'Dr.med. Bernt Popp - Professional headshot, round format',
      title: 'Dr.med. Bernt Popp Headshot',
      description: 'Professional headshot of Dr.med. Bernt Popp at Charité Berlin',
    },
    '/b1_square_nobg.png': {
      alt: 'Dr.med. Bernt Popp - Professional portrait, transparent background',
      title: 'Dr.med. Bernt Popp Professional Photo',
      description: 'High-resolution professional photograph with transparent background',
    },
    '/dna-helix.svg': {
      alt: 'DNA double helix icon - representing genetics and molecular biology',
      title: 'DNA Helix Logo',
      description: 'Vector illustration of DNA double helix used as site logo',
    },
    '/favicon-16x16.png': {
      alt: 'berntpopp.com favicon 16x16',
      title: 'Site favicon',
      description: 'Website favicon for berntpopp.com',
    },
    '/favicon-32x32.png': {
      alt: 'berntpopp.com favicon 32x32',
      title: 'Site favicon',
      description: 'Website favicon for berntpopp.com',
    },
  }

  // Add photography metadata
  const photographyDir = join(ROOT_DIR, 'public/photography')
  if (existsSync(photographyDir)) {
    const photos = readdirSync(photographyDir)
    photos.forEach((photo) => {
      if (photo.includes('DSC')) {
        metadata[`/photography/${photo}`] = {
          alt: `Nature photography by Dr.med. Bernt Popp - ${photo.replace(/-/g, ' ').replace('.jpg', '')}`,
          title: `Photography - ${basename(photo, '.jpg')}`,
          description: 'High-quality nature and underwater photography',
        }
      }
    })
  }

  writeFileSync(join(ROOT_DIR, 'seo/image-metadata.json'), JSON.stringify(metadata, null, 2))

  console.log('✅ Generated image metadata')
  return Object.keys(metadata).length
}

/**
 * Helper function to generate image title
 */
function generateImageTitle(filename) {
  const name = basename(filename, extname(filename))
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replace(/Dsc/gi, 'Photo')
    .replace(/Nobg/gi, 'No Background')
    .replace(/Topaz/gi, '')
    .replace(/Denoise/gi, '')
    .replace(/Sharpen/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Helper function to generate image caption
 */
function generateImageCaption(filename, path) {
  if (path.includes('photography')) {
    return 'Nature and underwater photography by Dr.med. Bernt Popp'
  } else if (filename.includes('b1_') || filename.includes('b2_')) {
    return 'Dr. med. Bernt Popp - Senior Physician and Human Geneticist at Charité Berlin'
  } else if (filename.includes('dna')) {
    return 'DNA helix symbol representing genetics and molecular biology'
  } else if (filename.includes('favicon')) {
    return 'Website favicon for berntpopp.com'
  }
  return 'Image from berntpopp.com'
}

/**
 * Main function
 */
export async function optimizeImageSEO() {
  console.log('🚀 Starting image SEO optimization...\n')

  try {
    const imageCount = generateImageSitemap()
    const metadataCount = generateImageMetadata()

    console.log(`\n✨ Image SEO optimization completed!`)
    console.log(`   ✓ Processed ${imageCount} images`)
    console.log(`   ✓ Generated metadata for ${metadataCount} images`)

    return { imageCount, metadataCount }
  } catch (error) {
    console.error('\n❌ Error during image SEO optimization:', error)
    throw error
  }
}

// Run if called directly
if (import.meta.url === `file://${__filename}`) {
  optimizeImageSEO()
}
