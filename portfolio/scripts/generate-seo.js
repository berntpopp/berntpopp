#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { glob } from 'glob'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT_DIR = join(__dirname, '..')

// Load configurations
const seoConfig = JSON.parse(readFileSync(join(ROOT_DIR, 'seo/config.json'), 'utf-8'))
const pagesConfig = JSON.parse(readFileSync(join(ROOT_DIR, 'seo/pages.json'), 'utf-8'))

// Ensure public directory exists
const publicDir = join(ROOT_DIR, 'public')
if (!existsSync(publicDir)) {
  mkdirSync(publicDir)
}

/**
 * Replace template variables with actual values
 */
function processTemplate(template, data) {
  if (typeof template === 'string') {
    // Handle string templates
    return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const keys = path.split('.')
      let value = data

      for (const key of keys) {
        value = value?.[key]
      }

      return value || ''
    })
  } else if (Array.isArray(template)) {
    // Handle arrays
    return template.map((item) => processTemplate(item, data))
  } else if (typeof template === 'object' && template !== null) {
    // Handle objects
    const result = {}
    for (const [key, value] of Object.entries(template)) {
      // Special handling for template values
      if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
        const path = value.slice(2, -2)
        const keys = path.split('.')
        let dataValue = data

        for (const k of keys) {
          dataValue = dataValue?.[k]
        }

        result[key] = dataValue
      } else {
        result[key] = processTemplate(value, data)
      }
    }
    return result
  }

  return template
}

/**
 * Generate sitemap.xml
 */
function generateSitemap() {
  console.log('📍 Generating sitemap.xml...')

  const pages = Object.keys(pagesConfig.pages)
  const lastmod = new Date().toISOString().split('T')[0]

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  pages.forEach((path) => {
    const url = path === '/' ? seoConfig.site.url : `${seoConfig.site.url}${path}`
    const changefreq = seoConfig.sitemap.changefreq[path.slice(1) || 'home'] || 'monthly'
    const priority = seoConfig.sitemap.priority[path.slice(1) || 'home'] || 0.5

    xml += '  <url>\n'
    xml += `    <loc>${url}</loc>\n`
    xml += `    <lastmod>${lastmod}</lastmod>\n`
    xml += `    <changefreq>${changefreq}</changefreq>\n`
    xml += `    <priority>${priority}</priority>\n`
    xml += '  </url>\n'
  })

  // Add publication pages if they exist
  try {
    const bibFile = join(ROOT_DIR, 'public/bp.bib')
    if (existsSync(bibFile)) {
      xml += '  <url>\n'
      xml += `    <loc>${seoConfig.site.url}/publications#all</loc>\n`
      xml += `    <lastmod>${lastmod}</lastmod>\n`
      xml += `    <changefreq>monthly</changefreq>\n`
      xml += `    <priority>0.8</priority>\n`
      xml += '  </url>\n'
    }
  } catch {
    console.log('⚠️  Could not check for publications')
  }

  xml += '</urlset>'

  writeFileSync(join(publicDir, 'sitemap.xml'), xml)
  console.log('✅ Generated sitemap.xml')
}

/**
 * Generate robots.txt
 */
function generateRobots() {
  console.log('🤖 Generating robots.txt...')

  let content = ''

  seoConfig.robots.rules.forEach((rule) => {
    content += `User-agent: ${rule.userAgent}\n`

    if (rule.allow) {
      rule.allow.forEach((path) => {
        content += `Allow: ${path}\n`
      })
    }

    if (rule.disallow) {
      rule.disallow.forEach((path) => {
        content += `Disallow: ${path}\n`
      })
    }

    if (rule.crawlDelay && rule.crawlDelay > 0) {
      content += `Crawl-delay: ${rule.crawlDelay}\n`
    }

    content += '\n'
  })

  if (seoConfig.robots.sitemap) {
    content += `Sitemap: ${seoConfig.site.url}/sitemap.xml\n`
    // Add image sitemap if it exists
    if (existsSync(join(publicDir, 'sitemap-images.xml'))) {
      content += `Sitemap: ${seoConfig.site.url}/sitemap-images.xml\n`
    }
  }

  writeFileSync(join(publicDir, 'robots.txt'), content.trim())
  console.log('✅ Generated robots.txt')
}

/**
 * Generate structured data for all pages
 */
async function generateStructuredData() {
  console.log('🏗️  Generating structured data...')

  const schemas = {}

  // Load all schema templates
  const schemaFiles = await glob('seo/schemas/*.json', { cwd: ROOT_DIR })

  for (const file of schemaFiles) {
    const name = file.split('/').pop().replace('.json', '')
    const template = JSON.parse(readFileSync(join(ROOT_DIR, file), 'utf-8'))
    schemas[name] = template
  }

  // Process main schemas
  const structuredData = {
    person: processTemplate(schemas.person, {
      siteUrl: seoConfig.site.url,
      ...seoConfig,
    }),
    website: processTemplate(schemas.website, {
      siteUrl: seoConfig.site.url,
      ...seoConfig,
    }),
    physician: processTemplate(schemas.physician, {
      siteUrl: seoConfig.site.url,
      ...seoConfig,
    }),
  }

  // Generate page-specific schemas
  const pageSchemas = {}

  Object.entries(pagesConfig.pages).forEach(([path, page]) => {
    if (page.breadcrumb && path !== '/') {
      pageSchemas[path] = {
        breadcrumb: processTemplate(schemas.breadcrumb, {
          siteUrl: seoConfig.site.url,
          pageName: page.title,
          pageUrl: `${seoConfig.site.url}${path}`,
        }),
      }
    }
  })

  // Save structured data
  writeFileSync(
    join(ROOT_DIR, 'seo/generated-schemas.json'),
    JSON.stringify({ main: structuredData, pages: pageSchemas }, null, 2)
  )

  console.log('✅ Generated structured data')
}

/**
 * Generate VitePress SEO configuration
 */
function generateVitePressConfig() {
  console.log('⚙️  Generating VitePress SEO configuration...')

  const config = {
    site: seoConfig.site,
    pages: pagesConfig.pages,
    structuredData: JSON.parse(readFileSync(join(ROOT_DIR, 'seo/generated-schemas.json'), 'utf-8')),
  }

  // Generate the SEO helper module
  const seoHelper = `// Auto-generated SEO configuration
// Generated on: ${new Date().toISOString()}

export const seoConfig = ${JSON.stringify(config, null, 2)};

export function getPageSEO(path) {
  const page = seoConfig.pages[path] || seoConfig.pages['/'];
  const site = seoConfig.site;
  
  return {
    title: page.title === 'Home' ? site.title : \`\${page.title} | \${site.title}\`,
    description: page.description,
    keywords: page.keywords?.join(', ') || '',
    type: page.type || 'WebPage'
  };
}

export function getStructuredData(path) {
  const schemas = [];
  
  // Add main schemas
  schemas.push(seoConfig.structuredData.main.person);
  schemas.push(seoConfig.structuredData.main.website);
  
  // Add physician schema on homepage and about page
  if (path === '/' || path === '/about') {
    schemas.push(seoConfig.structuredData.main.physician);
  }
  
  // Add page-specific schemas
  const pageSchemas = seoConfig.structuredData.pages[path];
  if (pageSchemas) {
    Object.values(pageSchemas).forEach(schema => schemas.push(schema));
  }
  
  return schemas;
}
`

  writeFileSync(join(ROOT_DIR, '.vitepress/theme/seo.js'), seoHelper)
  console.log('✅ Generated VitePress SEO configuration')
}

/**
 * Generate SEO health report
 */
function generateHealthReport() {
  console.log('📊 Generating SEO health report...')

  const report = {
    timestamp: new Date().toISOString(),
    checks: {
      sitemap: existsSync(join(publicDir, 'sitemap.xml')),
      robots: existsSync(join(publicDir, 'robots.txt')),
      structuredData: existsSync(join(ROOT_DIR, 'seo/generated-schemas.json')),
      vitepressConfig: existsSync(join(ROOT_DIR, '.vitepress/theme/seo.js')),
    },
    pages: {},
  }

  // Check each page
  Object.entries(pagesConfig.pages).forEach(([path, page]) => {
    report.pages[path] = {
      hasTitle: !!page.title,
      hasDescription: !!page.description,
      descriptionLength: page.description?.length || 0,
      hasKeywords: !!page.keywords && page.keywords.length > 0,
      hasBreadcrumb: !!page.breadcrumb,
    }
  })

  writeFileSync(join(ROOT_DIR, 'seo/health-report.json'), JSON.stringify(report, null, 2))

  console.log('✅ Generated SEO health report')

  // Print summary
  console.log('\n📋 SEO Health Summary:')
  console.log(`   ✓ Sitemap: ${report.checks.sitemap ? '✅' : '❌'}`)
  console.log(`   ✓ Robots.txt: ${report.checks.robots ? '✅' : '❌'}`)
  console.log(`   ✓ Structured Data: ${report.checks.structuredData ? '✅' : '❌'}`)
  console.log(`   ✓ VitePress Config: ${report.checks.vitepressConfig ? '✅' : '❌'}`)
  console.log(`   ✓ Pages configured: ${Object.keys(report.pages).length}`)
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting SEO generation...\n')

  try {
    generateSitemap()
    generateRobots()
    await generateStructuredData()
    generateVitePressConfig()
    generateHealthReport()

    console.log('\n✨ SEO generation completed successfully!')
  } catch (error) {
    console.error('\n❌ Error during SEO generation:', error)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${__filename}`) {
  main()
}

export { generateSitemap, generateRobots, generateStructuredData, generateVitePressConfig }
