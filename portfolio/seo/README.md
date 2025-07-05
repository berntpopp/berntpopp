# 🚀 Automated SEO System

This directory contains the automated SEO configuration system for Dr.med. Bernt Popp's portfolio website.

## 📂 Directory Structure

```text
seo/
├── config.json          # Main SEO configuration
├── pages.json          # Page-specific SEO settings
├── schemas/            # JSON-LD structured data templates
│   ├── person.json     # Person schema
│   ├── website.json    # WebSite schema
│   ├── breadcrumb.json # BreadcrumbList schema
│   └── physician.json  # Physician schema (local SEO)
├── generated-schemas.json  # Generated structured data (auto)
├── health-report.json     # SEO health check report (auto)
└── README.md           # This file
```

## 🔧 Configuration Files

### `config.json`

Main SEO configuration containing:

- Site metadata (URL, title, description)
- Person information (name, job, contact, etc.)
- Organization details (medical specialty, services)
- Sitemap settings (changefreq, priority)
- Robots.txt rules
- Keywords (primary, secondary, research, local)
- Academic SEO settings

### `pages.json`

Page-specific SEO configuration:

- Custom titles and descriptions per page
- Page-specific keywords
- Schema.org type mappings
- Breadcrumb configuration
- Academic metadata flags

## 🤖 Automation

### SEO Generation Script

Run the SEO generation:

```bash
npm run seo:generate
```

This will:

1. Generate `sitemap.xml` in the public directory
2. Generate `robots.txt` in the public directory
3. Process structured data templates
4. Create VitePress SEO helper module
5. Generate SEO health report

### GitHub Actions

The system automatically updates SEO files when:

- Markdown content changes
- SEO configuration is updated
- Bibliography file is modified
- Weekly schedule (keeps sitemap fresh)

## 📝 Making Changes

### To update site-wide SEO

1. Edit `seo/config.json`
2. Run `npm run seo:generate`
3. Commit changes

### To update page-specific SEO

1. Edit `seo/pages.json`
2. Run `npm run seo:generate`
3. Commit changes

### To add a new page

1. Add entry to `seo/pages.json`
2. Run `npm run seo:generate`
3. The page will be included in sitemap automatically

### To modify structured data

1. Edit templates in `seo/schemas/`
2. Templates use `{{variable}}` syntax
3. Run `npm run seo:generate`

## 🔍 SEO Features

### Implemented

- ✅ Dynamic sitemap.xml generation
- ✅ Configurable robots.txt
- ✅ JSON-LD structured data (Person, WebSite, Physician)
- ✅ Page-specific meta tags
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Canonical URLs
- ✅ Academic SEO (Google Scholar)
- ✅ Local SEO (Berlin)
- ✅ Breadcrumb navigation
- ✅ SEO health reporting

### VitePress Integration

- Dynamic meta tags via `transformPageData`
- Client-side SEO enhancement via `useSeo` hook
- Structured data injection
- Automatic canonical URL management

## 📊 Health Report

Check SEO health:

```bash
npm run seo:check
```

The health report includes:

- File generation status
- Page coverage
- Meta tag completeness
- Description length analysis
- Keyword coverage

## 🚨 Important Notes

1. **Don't edit generated files directly** - They will be overwritten
2. **Keep descriptions between 150-160 characters** for optimal display
3. **Update keywords regularly** based on search trends
4. **Test structured data** using Google's Rich Results Test
5. **Monitor performance** via Google Search Console

## 🔗 Resources

- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards)
