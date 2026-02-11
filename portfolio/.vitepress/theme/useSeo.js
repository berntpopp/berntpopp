// SEO Enhancement hook for VitePress
import { watch, nextTick } from 'vue'
import { useData, useRoute, inBrowser } from 'vitepress'

export function useSeo() {
  useData()
  const route = useRoute()

  // Only run in browser
  if (!inBrowser) return

  // Try to load SEO configuration
  let seoHelper = null
  import('./seo.js')
    .then((module) => {
      seoHelper = module
      updateMetaTags()
    })
    .catch(() => {
      console.warn('SEO helper not found')
    })

  function getCurrentPath() {
    const path = route.path.replace(/\.html$/, '')
    return path === '/index' ? '/' : path
  }

  function updateMetaTags() {
    if (!seoHelper) return

    const currentPath = getCurrentPath()
    const pageInfo = seoHelper.getPageSEO(currentPath)
    const structuredData = seoHelper.getStructuredData(currentPath)
    const siteConfig = seoHelper.seoConfig.site

    // Update meta tags
    updateOrCreateMeta('name', 'keywords', pageInfo.keywords)
    updateOrCreateMeta('property', 'og:title', pageInfo.title)
    updateOrCreateMeta('property', 'og:description', pageInfo.description)
    updateOrCreateMeta(
      'property',
      'og:url',
      `${siteConfig.url}${currentPath === '/' ? '' : currentPath}`
    )
    updateOrCreateMeta('property', 'og:image', `${siteConfig.url}${siteConfig.image}`)

    // Twitter Card
    updateOrCreateMeta('name', 'twitter:title', pageInfo.title)
    updateOrCreateMeta('name', 'twitter:description', pageInfo.description)
    updateOrCreateMeta('name', 'twitter:image', `${siteConfig.url}${siteConfig.image}`)

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = `${siteConfig.url}${currentPath === '/' ? '' : currentPath}`

    // Add structured data
    removeExistingStructuredData()
    structuredData.forEach((schema) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-schema-type', 'auto-generated')
      script.textContent = JSON.stringify(schema)
      document.head.appendChild(script)
    })

    // Academic SEO for publications page
    if (currentPath === '/publications') {
      const config = seoHelper.seoConfig
      updateOrCreateMeta('name', 'citation_author', config.person.name)
      updateOrCreateMeta(
        'name',
        'citation_author_email',
        config.academicSEO.googleScholar.authorEmail
      )
      updateOrCreateMeta(
        'name',
        'citation_author_institution',
        config.academicSEO.googleScholar.institution
      )
    }
  }

  function updateOrCreateMeta(attr, value, content) {
    if (!content) return

    let meta = document.querySelector(`meta[${attr}="${value}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute(attr, value)
      document.head.appendChild(meta)
    }
    meta.content = content
  }

  function removeExistingStructuredData() {
    const scripts = document.querySelectorAll('script[data-schema-type="auto-generated"]')
    scripts.forEach((script) => script.remove())
  }

  // Watch for route changes
  watch(
    () => route.path,
    () => {
      nextTick(() => {
        updateMetaTags()
      })
    }
  )

  // Initial update
  nextTick(() => {
    updateMetaTags()
  })
}
