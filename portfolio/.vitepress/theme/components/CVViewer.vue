<template>
  <div class="cv-viewer">
    <div class="cv-header">
      <div class="cv-title-block">
        <h1 class="cv-title">Curriculum Vitae</h1>
        <div class="cv-subtitle">BERNT POPP, MD</div>
      </div>
      <div class="cv-actions">
        <a href="/Bernt-Popp_CV_EN.pdf" target="_blank" class="action-btn">
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

              <div v-if="entry.highlights" class="entry-highlights">
                <ul>
                  <li v-for="(highlight, hIndex) in entry.highlights" :key="hIndex">
                    {{ highlight }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

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
          highlights: e.url ? [`URL: ${e.url}`] : [],
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
.cv-viewer {
  max-width: 1000px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  font-family: var(--vp-font-family-base);
}

.cv-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 6rem;
  border-bottom: 4px solid var(--vp-c-text-1);
  padding-bottom: 2rem;
}

.cv-title {
  font-family: var(--vp-font-family-headings);
  font-size: 4.5rem;
  line-height: 0.9;
  margin: 0;
  letter-spacing: -0.03em;
}

.cv-subtitle {
  font-family: var(--vp-font-family-mono);
  font-size: 1rem;
  letter-spacing: 0.1em;
  margin-top: 1rem;
  color: var(--vp-c-text-2);
}

.action-btn {
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  color: var(--vp-c-bg); /* Invert text default */
  background: var(--vp-c-text-1); /* Solid block default */
  text-decoration: none;
  font-weight: 600;
  border: 1px solid var(--vp-c-text-1);
  padding: 0.75rem 1.5rem;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 4px; /* Slight roundness */
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
  grid-template-columns: 250px 1fr;
  gap: 3rem;
  margin-bottom: 5rem;
  page-break-inside: avoid;
}

.section-title {
  font-family: var(--vp-font-family-mono);
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--vp-c-text-1);
  letter-spacing: 0.05em;
  margin: 0;
  position: sticky;
  top: 2rem;
}

.cv-entry {
  margin-bottom: 3rem;
  border-left: 1px solid var(--vp-c-divider);
  padding-left: 2rem;
  position: relative;
}

.cv-entry:last-child {
  margin-bottom: 0;
}

/* Entry Details */
.entry-meta {
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.entry-location::before {
  content: '/';
  margin-right: 1rem;
  opacity: 0.5;
}

.entry-title {
  font-family: var(--vp-font-family-base);
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--vp-c-text-1);
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
  line-height: 1.6;
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
}

.entry-highlights li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--vp-c-accent);
}

/* Status Messages */
.loading,
.error {
  font-family: var(--vp-font-family-mono);
  text-align: center;
  margin: 4rem 0;
  font-size: 1.25rem;
}

.error {
  color: var(--vp-c-danger);
}

/* Print */
@media print {
  .cv-viewer {
    padding: 0;
    max-width: none;
  }
  .cv-header {
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
}

/* Mobile */
@media (max-width: 768px) {
  .cv-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
  }

  .cv-title {
    font-size: 3rem;
  }

  .cv-section {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 4rem;
  }

  .section-title {
    position: static;
    border-bottom: 1px solid var(--vp-c-divider);
    padding-bottom: 0.5rem;
  }

  .cv-entry {
    padding-left: 0;
    border-left: none;
    margin-bottom: 2.5rem;
  }
}
</style>
