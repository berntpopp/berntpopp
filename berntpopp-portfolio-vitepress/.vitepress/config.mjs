// .vitepress/config.mjs
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Bernt Popp',
  description: 'Dr. med. Bernt Popp, an accomplished board-certified geneticist and senior physician with expertise in human genetics, rare diseases, and bioinformatics.',
  
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
    // Meta Tags from original header.html
    ['meta', { name: 'keywords', content: 'Bernt Popp, geneticist, human genetics, bioinformatics, senior physician, high-throughput sequencing, rare diseases' }],
    ['meta', { name: 'author', content: 'Dr.med. Bernt Popp' }],
    ['meta', { property: 'og:title', content: 'Meet Dr.med. Bernt Popp - Expert in Human Genetics and Bioinformatics' }],
    ['meta', { property: 'og:description', content: 'Explore the professional journey of Dr. Bernt Popp in genetic diagnostics and research.' }],
    ['meta', { property: 'og:image', content: 'https://www.berntpopp.com/assets/images/b2_round.png' }], // Update URL once deployed
    ['meta', { property: 'og:url', content: 'https://www.berntpopp.com' }], // Update URL once deployed
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    
    // Favicons
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],

    // Schema.org JSON-LD
    ['script', { type: 'application/ld+json' }, JSON.stringify({
        "@context": "http://schema.org",
        "@type": "Person",
        "name": "Bernt Popp",
        "jobTitle": "Senior Physician & Postdoctoral Research Fellow",
        "worksFor": { "@type": "EducationalOrganization", "name": "BIH Charité – Universitätsmedizin Berlin" },
        "url": "https://berntpopp.com/", // Update URL
        "sameAs": [
          "https://scholar.google.com/citations?user=Uvhu3t0AAAAJ",
          "https://orcid.org/0000-0002-3679-1081",
          "https://github.com/berntpopp"
        ]
    })],

    // Google Fonts
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap', rel: 'stylesheet' }],
  ],

  themeConfig: {
    logo: '/favicon-32x32.png', // Or a dedicated logo image
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Publications', link: '/publications' },
      { text: 'CV', link: '/cv' },
      { text: 'About', link: '/about' }, // Create an 'about.md' from your READMEs
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/berntpopp' },
      // Note: Add custom SVG icons for Google Scholar and ORCID later if needed.
    ]
  }
})