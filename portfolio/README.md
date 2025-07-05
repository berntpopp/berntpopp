# Dr. Bernt Popp's Portfolio Website

A modern, SEO-optimized personal portfolio website built with VitePress, featuring automated SEO management, academic publication tracking, and an interactive CV viewer.

## 🌟 Features

- **VitePress-powered** static site generation with Vue 3
- **Automated SEO system** with GitHub Actions integration
- **Bibliography management** with BibTeX parsing and citation formatting
- **Interactive CV viewer** with timeline visualization
- **Dark mode support** with custom theming
- **Responsive design** optimized for all devices
- **Academic SEO** optimization for Google Scholar
- **Structured data** implementation for enhanced search visibility

## 🛠️ Tech Stack

- **Framework**: [VitePress](https://vitepress.dev/) (Vue-powered static site generator)
- **Frontend**: Vue 3, JavaScript
- **Styling**: Custom CSS with VitePress theme variables
- **SEO**: Automated generation with structured data (JSON-LD)
- **CI/CD**: GitHub Actions for automated SEO updates
- **Data Formats**: JSON (CV data), BibTeX (publications)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

## 🚀 Installation

1. Clone the repository:

```bash
git clone https://github.com/berntpopp/berntpopp.git
cd berntpopp/portfolio
```

1. Install dependencies:

```bash
npm install
```

## 💻 Development

### Start Development Server

```bash
npm run docs:dev
```

The development server will start at `http://localhost:5173` with hot module replacement enabled.

### Build for Production

```bash
npm run docs:build
```

This command:

- Generates all SEO files (sitemap, robots.txt, structured data)
- Builds the static site
- Outputs to `.vitepress/dist/`

### Preview Production Build

```bash
npm run docs:preview
```

Preview the production build locally at `http://localhost:4173`.

## 📁 Project Structure

```text
portfolio/
├── .vitepress/
│   ├── config.mjs          # VitePress configuration
│   ├── theme/              # Custom theme and components
│   │   ├── index.js        # Theme entry point
│   │   ├── custom.css      # Custom styles
│   │   ├── Layout.vue      # Main layout wrapper
│   │   ├── Hero.vue        # Homepage hero section
│   │   ├── PublicationList.vue  # Bibliography parser
│   │   ├── CVViewer.vue    # Interactive CV component
│   │   └── CVEntry.vue     # CV entry component
│   └── dist/               # Build output (git-ignored)
├── public/                 # Static assets
│   ├── bp.bib             # Bibliography data (BibTeX)
│   ├── cv-data.json       # Structured CV data
│   ├── cv-en.pdf          # English CV PDF
│   ├── cv-de.pdf          # German CV PDF
│   └── images/            # Profile and other images
├── seo/                    # SEO configuration
│   ├── config.json        # Main SEO settings
│   ├── pages.json         # Page-specific SEO
│   ├── templates/         # Structured data templates
│   └── health-report.json # SEO health monitoring
├── scripts/
│   └── generate-seo.js    # SEO generation script
├── index.md               # Homepage content
├── about.md               # About page
├── cv.md                  # CV page
├── publications.md        # Publications page
└── package.json           # Project dependencies
```

## 📝 Available Scripts

### Development & Build

- `npm run docs:dev` - Start development server with HMR
- `npm run docs:build` - Build for production (includes SEO generation)
- `npm run docs:preview` - Preview production build locally

### SEO Management

- `npm run seo:generate` - Generate sitemap, robots.txt, and structured data
- `npm run seo:check` - Run SEO health check and view report

### Code Quality

- `npm run lint` - Run all linters (JavaScript and Markdown)
- `npm run lint:js` - Lint JavaScript/Vue files
- `npm run lint:md` - Lint Markdown files
- `npm run lint:fix` - Auto-fix linting issues

## 🔧 Configuration

### Site Configuration

Edit `.vitepress/config.mjs` to modify:

- Site metadata (title, description)
- Navigation menu
- Theme settings
- Social links

### SEO Configuration

Edit `seo/config.json` to update:

- Site URL and metadata
- Person/organization information
- Sitemap priorities
- Keywords and descriptions
- Academic metadata

### Page-Specific SEO

Edit `seo/pages.json` to customize:

- Individual page titles and descriptions
- Page-specific keywords
- Schema.org type mappings
- Breadcrumb configuration

## 🧩 Key Components

### PublicationList.vue

Parses BibTeX files and displays formatted bibliography:

- Automatic author highlighting for "Bernt Popp"
- Filtering by authorship position
- Citation formatting
- Links to DOIs and PMIDs

### CVViewer.vue

Interactive CV display with:

- Timeline visualization
- Structured data from `cv-data.json`
- PDF download buttons (EN/DE)
- Responsive layout

### Hero.vue

Homepage hero section featuring:

- Profile image
- Professional introduction
- Call-to-action buttons
- Animated transitions

## 📊 Data Formats

### CV Data (`public/cv-data.json`)

```json
{
  "personalInfo": {
    "name": "string",
    "title": "string",
    "email": "string",
    "phone": "string",
    "website": "string",
    "orcid": "string"
  },
  "experience": [{
    "title": "string",
    "organization": "string",
    "period": "string",
    "location": "string",
    "details": ["array of strings"]
  }],
  "education": [...],
  "skills": {
    "clinical": [...],
    "technical": [...],
    "programming": [...]
  }
}
```

### Publications (`public/bp.bib`)

Standard BibTeX format with required fields:

- `@article`, `@inproceedings`, etc.
- Required: TITLE, AUTHOR, JOURNAL/BOOKTITLE, YEAR
- Optional: DOI, PMID, URL

## 🚀 Deployment

### Build for Deployment

```bash
npm run docs:build
```

The built files will be in `.vitepress/dist/`.

### Deploy to Static Hosting

The site can be deployed to any static hosting service:

1. **GitHub Pages**:
   - Push to repository
   - Configure Pages to serve from `gh-pages` branch or `/.vitepress/dist`

2. **Netlify/Vercel**:
   - Connect repository
   - Set build command: `cd portfolio && npm run docs:build`
   - Set publish directory: `portfolio/.vitepress/dist`

3. **Traditional Hosting**:
   - Upload contents of `.vitepress/dist/` to web server

## 🤖 Automated SEO System

The project includes GitHub Actions workflow (`.github/workflows/seo-update.yml`) that:

- Triggers on content changes or weekly schedule
- Regenerates all SEO files
- Creates health reports
- Commits changes automatically

### Manual SEO Generation

```bash
# Generate all SEO files
npm run seo:generate

# Check SEO health
npm run seo:check
```

## 🎨 Customization

### Styling

Edit `.vitepress/theme/custom.css` to modify:

- Color schemes (light/dark mode)
- Typography
- Component styles
- CSS variables

### Theme Variables

Key CSS variables:

- `--vp-c-brand`: Primary brand color
- `--vp-c-bg`: Background colors
- `--vp-c-text`: Text colors
- `--vp-font-family`: Typography

## 📄 License

This project is private and proprietary. All rights reserved.

## 👤 Author

### Dr. Bernt Popp

- Website: [berntpopp.com](https://berntpopp.com)
- Email: <bernt.popp@gmail.com>
- ORCID: [0000-0002-3679-1081](https://orcid.org/0000-0002-3679-1081)

---

Built with ❤️ using VitePress and Vue.js
