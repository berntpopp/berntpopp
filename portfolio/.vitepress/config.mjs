// .vitepress/config.mjs
import { defineConfig } from 'vitepress'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Try to load SEO configuration
let seoConfig = null;
let pagesConfig = null;

try {
  const configPath = join(process.cwd(), 'seo/config.json');
  const pagesPath = join(process.cwd(), 'seo/pages.json');
  
  if (existsSync(configPath)) {
    seoConfig = JSON.parse(readFileSync(configPath, 'utf-8'));
  }
  if (existsSync(pagesPath)) {
    pagesConfig = JSON.parse(readFileSync(pagesPath, 'utf-8'));
  }
} catch (e) {
  console.warn('⚠️  SEO configuration not found, using defaults');
}

// Fallback configuration
const defaultConfig = {
  site: {
    title: 'Bernt Popp',
    description: 'Dr. med. Bernt Popp, an accomplished board-certified geneticist and senior physician with expertise in human genetics, rare diseases, and bioinformatics.',
    url: 'https://berntpopp.com',
    image: '/b2_round.png'
  }
};

const site = seoConfig?.site || defaultConfig.site;

export default defineConfig({
  title: site.title,
  description: site.description,
  
  // Generate meta tags dynamically
  transformPageData(pageData) {
    const pagePath = pageData.relativePath.replace(/\.md$/, '').replace(/index$/, '') || '/';
    const normalizedPath = pagePath === '' ? '/' : `/${pagePath}`;
    const pageConfig = pagesConfig?.pages[normalizedPath];
    
    // Set page-specific title and description
    if (pageConfig) {
      pageData.title = pageConfig.title === 'Home' ? site.title : `${pageConfig.title} | ${site.title}`;
      pageData.description = pageConfig.description;
      pageData.frontmatter.keywords = pageConfig.keywords;
    }
    
    return pageData;
  },
  
  // Vite configuration for better hot reload
  vite: {
    server: {
      hmr: true,
      watch: {
        usePolling: true, // Enable polling for WSL compatibility
        interval: 100
      }
    }
  },
  
  head: [
    // Dynamic meta tags based on SEO config
    ['meta', { name: 'author', content: site.author || 'Dr.med. Bernt Popp' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    
    // Open Graph tags
    ['meta', { property: 'og:site_name', content: site.title }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: site.locale || 'en_US' }],
    
    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    site.twitterHandle && ['meta', { name: 'twitter:site', content: site.twitterHandle }],
    
    // Canonical URL (will be set per page)
    ['link', { rel: 'canonical', href: '' }],
    
    // Favicon
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/dna-helix.svg' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    
    // Google Fonts
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap', rel: 'stylesheet' }],
    
    // Preload critical images
    ['link', { rel: 'preload', as: 'image', href: site.image }],
  ].filter(Boolean),

  themeConfig: {
    logo: '/dna-helix.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Publications', link: '/publications' },
      { text: 'CV', link: '/cv' },
      { text: 'About', link: '/about' },
      { text: 'Impressum', link: '/impressum' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/berntpopp' },
    ],
    
    // Add search if needed
    search: {
      provider: 'local'
    }
  },
  
  // Build-time data
  async buildEnd(siteConfig) {
    // This runs after build, could be used for post-processing
    console.log('✅ Build completed');
  }
})