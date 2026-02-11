#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT_DIR = join(__dirname, '..')

/**
 * SEO Performance Monitoring Dashboard
 */
export class SEOMonitor {
  constructor() {
    this.configPath = join(ROOT_DIR, 'seo/config.json')
    this.pagesPath = join(ROOT_DIR, 'seo/pages.json')
    this.healthPath = join(ROOT_DIR, 'seo/health-report.json')
    this.metricsPath = join(ROOT_DIR, 'seo/metrics.json')
  }

  /**
   * Analyze SEO performance
   */
  analyzePerformance() {
    console.log('📊 Analyzing SEO performance...\n')

    const config = JSON.parse(readFileSync(this.configPath, 'utf-8'))
    const pages = JSON.parse(readFileSync(this.pagesPath, 'utf-8'))
    const health = JSON.parse(readFileSync(this.healthPath, 'utf-8'))

    const metrics = {
      timestamp: new Date().toISOString(),
      scores: {},
      recommendations: [],
      warnings: [],
      successes: [],
    }

    // Check meta descriptions length
    Object.entries(pages.pages).forEach(([path, page]) => {
      const descLength = page.description?.length || 0

      metrics.scores[path] = {
        descriptionLength: descLength,
        descriptionScore: this.scoreDescription(descLength),
        titleLength: page.title?.length || 0,
        titleScore: this.scoreTitle(page.title),
        keywordCount: page.keywords?.length || 0,
        keywordScore: this.scoreKeywords(page.keywords),
        overallScore: 0,
      }

      // Calculate overall score
      const scores = metrics.scores[path]
      scores.overallScore = Math.round(
        (scores.descriptionScore + scores.titleScore + scores.keywordScore) / 3
      )

      // Generate recommendations
      if (descLength < 120) {
        metrics.warnings.push(
          `${path}: Description too short (${descLength} chars). Aim for 150-160.`
        )
      } else if (descLength > 160) {
        metrics.warnings.push(
          `${path}: Description too long (${descLength} chars). Keep under 160.`
        )
      } else {
        metrics.successes.push(`${path}: Description length optimal (${descLength} chars).`)
      }

      if (!page.keywords || page.keywords.length < 3) {
        metrics.recommendations.push(
          `${path}: Add more keywords (current: ${page.keywords?.length || 0})`
        )
      }
    })

    // Check structured data
    this.analyzeStructuredData(metrics, config)

    // Check technical SEO
    this.analyzeTechnicalSEO(metrics, health)

    // Save metrics
    writeFileSync(this.metricsPath, JSON.stringify(metrics, null, 2))

    return metrics
  }

  /**
   * Score description length
   */
  scoreDescription(length) {
    if (length >= 150 && length <= 160) return 100
    if (length >= 140 && length <= 170) return 90
    if (length >= 120 && length <= 180) return 70
    if (length >= 100 && length <= 200) return 50
    return 30
  }

  /**
   * Score title
   */
  scoreTitle(title) {
    if (!title) return 0
    const length = title.length
    if (length >= 30 && length <= 60) return 100
    if (length >= 20 && length <= 70) return 80
    return 60
  }

  /**
   * Score keywords
   */
  scoreKeywords(keywords) {
    if (!keywords) return 0
    if (keywords.length >= 5 && keywords.length <= 10) return 100
    if (keywords.length >= 3 && keywords.length <= 15) return 80
    return 60
  }

  /**
   * Analyze structured data
   */
  analyzeStructuredData(metrics, config) {
    // Check Person schema completeness
    const person = config.person
    const requiredFields = ['name', 'jobTitle', 'email', 'sameAs', 'knowsAbout']
    const optionalFields = ['awards', 'credentials', 'alumniOf']

    requiredFields.forEach((field) => {
      if (!person[field]) {
        metrics.warnings.push(`Person schema missing required field: ${field}`)
      }
    })

    optionalFields.forEach((field) => {
      if (!person[field]) {
        metrics.recommendations.push(`Consider adding ${field} to Person schema for richer results`)
      }
    })

    // Check for research project schemas
    if (!config.researchProjects) {
      metrics.recommendations.push('Add ResearchProject schemas for SysNDD, HNF1B-db, etc.')
    }
  }

  /**
   * Analyze technical SEO
   */
  analyzeTechnicalSEO(metrics, health) {
    // Check all required files exist
    if (!health.checks.sitemap) {
      metrics.warnings.push('Sitemap.xml not found!')
    }
    if (!health.checks.robots) {
      metrics.warnings.push('Robots.txt not found!')
    }

    // Check page coverage
    const pagesWithoutSEO = Object.entries(health.pages).filter(([, data]) => {
      return !data.hasDescription || !data.hasKeywords
    })

    if (pagesWithoutSEO.length > 0) {
      metrics.warnings.push(`${pagesWithoutSEO.length} pages missing SEO data`)
    }

    // Success messages
    if (health.checks.sitemap && health.checks.robots && health.checks.structuredData) {
      metrics.successes.push('All technical SEO files are properly generated')
    }
  }

  /**
   * Generate SEO report
   */
  generateReport() {
    const metrics = this.analyzePerformance()

    console.log('═══════════════════════════════════════════════════════════════')
    console.log('                    SEO Performance Report                      ')
    console.log('═══════════════════════════════════════════════════════════════')
    console.log(`Generated: ${new Date().toLocaleString()}\n`)

    // Overall scores
    console.log('📊 PAGE SCORES:')
    console.log('───────────────────────────────────────────────────────────────')
    Object.entries(metrics.scores).forEach(([path, scores]) => {
      const stars = '⭐'.repeat(Math.floor(scores.overallScore / 20))
      console.log(`${path.padEnd(20)} ${scores.overallScore}% ${stars}`)
    })

    // Successes
    if (metrics.successes.length > 0) {
      console.log('\n✅ SUCCESSES:')
      console.log('───────────────────────────────────────────────────────────────')
      metrics.successes.forEach((success) => console.log(`  ✓ ${success}`))
    }

    // Warnings
    if (metrics.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:')
      console.log('───────────────────────────────────────────────────────────────')
      metrics.warnings.forEach((warning) => console.log(`  ⚠ ${warning}`))
    }

    // Recommendations
    if (metrics.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:')
      console.log('───────────────────────────────────────────────────────────────')
      metrics.recommendations.forEach((rec) => console.log(`  → ${rec}`))
    }

    // Summary
    const avgScore = Math.round(
      Object.values(metrics.scores).reduce((sum, s) => sum + s.overallScore, 0) /
        Object.keys(metrics.scores).length
    )

    console.log('\n📈 SUMMARY:')
    console.log('───────────────────────────────────────────────────────────────')
    console.log(`  Average SEO Score: ${avgScore}%`)
    console.log(`  Pages Analyzed: ${Object.keys(metrics.scores).length}`)
    console.log(`  Warnings: ${metrics.warnings.length}`)
    console.log(`  Recommendations: ${metrics.recommendations.length}`)
    console.log('═══════════════════════════════════════════════════════════════\n')

    return metrics
  }
}

// Run if called directly
if (import.meta.url === `file://${__filename}`) {
  const monitor = new SEOMonitor()
  monitor.generateReport()
}
