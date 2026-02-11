<template>
  <main class="story-wrapper">
    <div class="story-container">
      <div class="story-header">
        <div class="meta-tag">CURRICULUM VITAE</div>
        <h1 class="story-title">Experience &<br />Education</h1>
        <div class="story-subtitle">BERNT POPP, MD</div>

        <div class="cv-actions" style="margin-top: 2rem">
          <a
            href="/Bernt-Popp_CV_EN.pdf"
            target="_blank"
            rel="noopener noreferrer"
            class="action-btn"
          >
            DOWNLOAD PDF &DownArrowBar;
          </a>
        </div>
      </div>

      <div v-if="loading" class="loading">Parsing Curriculum...</div>
      <div v-else-if="error" class="error">DATA ERROR: {{ error }}</div>
      <div v-else class="cv-content">
        <div v-for="(section, index) in cvSections" :key="index" class="cv-section">
          <div class="section-title-col">
            <h2 class="section-title">{{ formatSectionTitle(section.title) }}</h2>
          </div>
          <div class="section-content-col">
            <div v-for="(entry, eIndex) in section.entries" :key="eIndex" class="cv-entry">
              <div class="entry-meta">
                <span class="entry-date">{{ formatDates(entry) }}</span>
                <span v-if="entry.location" class="entry-location">{{ entry.location }}</span>
              </div>
              <div class="entry-details">
                <h3 class="entry-title">{{ entry.title }}</h3>
                <div v-if="entry.institution" class="entry-org">{{ entry.institution }}</div>
                <p v-if="entry.description" class="entry-desc">{{ entry.description }}</p>

                <div v-if="entry.highlights && entry.highlights.length" class="entry-highlights">
                  <ul>
                    <li v-for="(highlight, hIndex) in entry.highlights" :key="hIndex">
                      {{ highlight }}
                    </li>
                  </ul>
                </div>

                <div v-if="entry.url" class="entry-url">
                  <a
                    :href="entry.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link"
                  >
                    <span class="project-link-text">{{ entry.url }}</span>
                    <svg
                      class="external-icon"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Dock />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Dock from './Dock.vue'

const cvSections = ref([])
const loading = ref(true)
const error = ref(null)

// Map simple titles to nicer ones if needed
const titleMap = {
  education: 'Education',
  experience: 'Experience',
  'academic-appointments': 'Academic Appointments',
  awards: 'Honors & Awards',
  memberships: 'Memberships',
  teaching: 'Teaching',
  skills: 'Technical Skills',
}

function formatSectionTitle(key) {
  return titleMap[key] || key.replace(/-/g, ' ').toUpperCase()
}

function formatDates(entry) {
  if (!entry.start) return ''
  if (!entry.end) return `${entry.start} — Present`
  if (entry.start === entry.end) return entry.start
  return `${entry.start} — ${entry.end}`
}

onMounted(async () => {
  try {
    const response = await fetch('/cv-data.json')
    if (!response.ok) throw new Error('Failed to load CV data')

    const data = await response.json()

    // Explicitly construct sections in desired order
    const sections = []

    // 1. Experience
    if (data.experience) {
      sections.push({
        id: 'experience',
        title: 'Professional Experience',
        entries: data.experience.map((e) => ({
          title: e.title,
          institution: e.organization,
          location: e.location,
          start: e.period?.split(' - ')[0],
          end: e.period?.split(' - ')[1],
          description: e.department ? `${e.department}` : '',
          highlights: e.details,
        })),
      })
    }

    // 2. Education
    if (data.education) {
      sections.push({
        id: 'education',
        title: 'Education',
        entries: data.education.map((e) => ({
          title: e.degree,
          institution: e.institution,
          location: e.location,
          start: e.period?.split(' - ')[0],
          end: e.period?.split(' - ')[1],
          description: e.thesis ? `Thesis: ${e.thesis}` : '',
          highlights: [], // Edu usually doesn't have list highlights in this data
        })),
      })
    }

    // 3. Awards
    if (data.awards) {
      sections.push({
        id: 'awards',
        title: 'Honors & Awards',
        entries: data.awards.map((e) => ({
          title: e.title,
          institution: e.organization,
          start: e.year,
          end: e.year, // Single year
          description: e.description,
        })),
      })
    }

    // 4. Projects (Open Source)
    if (data.projects) {
      sections.push({
        id: 'projects',
        title: 'Open Source Projects',
        entries: data.projects.map((e) => ({
          title: e.name,
          institution: e.role,
          description: e.description,
          url: e.url || null,
          highlights: [],
        })),
      })
    }

    cvSections.value = sections
  } catch (e) {
    console.error(e)
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.story-wrapper {
  background-color: var(--vp-c-bg);
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 8rem; /* Space for dock */
}

.story-container {
  max-width: 900px;
  width: 100%;
  padding: 6rem 1.5rem;
}

.story-header {
  text-align: center;
  margin-bottom: 6rem;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 3rem;
}

.meta-tag {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  color: var(--vp-c-accent-soft);
  margin-bottom: 1.5rem;
  text-transform: uppercase;
}

.story-title {
  font-family: var(--vp-font-family-headings);
  font-size: clamp(3rem, 8vw, 5rem);
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
}

.story-subtitle {
  font-family: var(--vp-font-family-base);
  font-size: 1.25rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto 2rem;
  letter-spacing: 0.05em;
}

.action-btn {
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  color: var(--vp-c-bg);
  background: var(--vp-c-text-1);
  text-decoration: none;
  font-weight: 600;
  border: 1px solid var(--vp-c-text-1);
  padding: 0.75rem 1.5rem;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1;
}

.action-btn:hover {
  background: transparent;
  color: var(--vp-c-text-1);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Sections */
.cv-section {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 3rem;
  margin-bottom: 5rem;
  page-break-inside: avoid;
}

.section-title {
  font-family: var(--vp-font-family-mono);
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--vp-c-text-1);
  letter-spacing: 0.05em;
  margin: 0;
  position: sticky;
  top: 2rem;
  text-align: right;
  border-right: 1px solid var(--vp-c-accent);
  padding-right: 1rem;
  height: fit-content;
}

.cv-entry {
  margin-bottom: 3rem;
  position: relative;
}

.cv-entry:last-child {
  margin-bottom: 0;
}

/* Entry Details */
.entry-meta {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.entry-location::before {
  content: '//';
  margin-right: 1rem;
  color: var(--vp-c-accent-soft);
}

.entry-title {
  font-family: var(--vp-font-family-base);
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--vp-c-text-1);
  line-height: 1.3;
}

.entry-org {
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
  font-style: italic;
  font-family: var(--vp-font-family-headings);
}

.entry-desc {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
  max-width: 650px;
}

.entry-highlights ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.entry-highlights li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.entry-highlights li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--vp-c-accent);
}

/* Project URL */
.entry-url {
  margin-top: 0.75rem;
}

.project-link {
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  color: var(--vp-c-accent-soft);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.project-link:hover {
  border-bottom-color: var(--vp-c-accent);
}

.external-icon {
  flex-shrink: 0;
}

/* Status Messages */
.loading,
.error {
  font-family: var(--vp-font-family-mono);
  text-align: center;
  margin: 4rem 0;
  font-size: 1rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.error {
  color: var(--vp-c-danger);
}

/* Print */
@media print {
  .story-wrapper,
  .story-container {
    padding: 0;
    max-width: none;
    min-height: auto;
    display: block;
  }
  .story-header {
    margin-bottom: 3rem;
    border-bottom-width: 2px;
  }
  .cv-actions {
    display: none;
  }
  .cv-section {
    gap: 1.5rem;
    margin-bottom: 3rem;
  }
  .section-title {
    position: static;
    border-right: none;
    text-align: left;
    padding-right: 0;
    border-bottom: 1px solid #000;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
  }
  .cv-section {
    grid-template-columns: 1fr;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .cv-section {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 4rem;
  }

  .section-title {
    position: static;
    border-right: none;
    text-align: left;
    padding-right: 0;
    border-bottom: 1px solid var(--vp-c-divider);
    padding-bottom: 0.5rem;
    color: var(--vp-c-accent-soft);
  }

  .cv-entry {
    padding-left: 0;
    border-left: none;
    margin-bottom: 2.5rem;
  }
}
</style>
