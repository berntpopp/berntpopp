<template>
  <div class="cv-container">
    <div v-if="loading" class="loading">Loading CV data...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <template v-else>
      <div class="cv-header">
        <div class="cv-title">
          <h1>{{ cvData.personalInfo.name }}</h1>
          <p class="subtitle">{{ cvData.personalInfo.title }}</p>
        </div>
        <div class="cv-actions">
          <a href="/Bernt-Popp_CV_EN.pdf" target="_blank" class="cv-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line
                x1="16"
                y1="13"
                x2="8"
                y2="13"
              />
              <line
                x1="16"
                y1="17"
                x2="8"
                y2="17"
              />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Download PDF (English)
          </a>
          <a href="/Bernt-Popp_CV_DE.pdf" target="_blank" class="cv-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line
                x1="16"
                y1="13"
                x2="8"
                y2="13"
              />
              <line
                x1="16"
                y1="17"
                x2="8"
                y2="17"
              />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Download PDF (Deutsch)
          </a>
        </div>
      </div>

      <div class="cv-content">
        <!-- Contact Section -->
        <section class="cv-section">
          <h2>Contact Information</h2>
          <div class="contact-grid">
            <div class="contact-item">
              <span class="icon">📧</span>
              <div>
                <a :href="`mailto:${cvData.personalInfo.email}`">{{ cvData.personalInfo.email }}</a>
                <br>
                <a :href="`mailto:${cvData.personalInfo.alternativeEmail}`">{{ cvData.personalInfo.alternativeEmail }}</a>
              </div>
            </div>
            <div class="contact-item">
              <span class="icon">📱</span>
              <span>{{ cvData.personalInfo.phone }}</span>
            </div>
            <div class="contact-item">
              <span class="icon">🌐</span>
              <a :href="cvData.personalInfo.website" target="_blank">{{ cvData.personalInfo.website }}</a>
            </div>
            <div class="contact-item">
              <span class="icon">📚</span>
              <a :href="`https://orcid.org/${cvData.personalInfo.orcid}`" target="_blank">ORCID {{ cvData.personalInfo.orcid }}</a>
            </div>
            <div class="contact-item">
              <span class="icon">📍</span>
              <span>{{ cvData.personalInfo.location }}</span>
            </div>
          </div>
        </section>

        <!-- Professional Summary -->
        <section class="cv-section">
          <h2>Professional Summary</h2>
          <p class="summary">{{ cvData.professionalSummary }}</p>
        </section>

        <!-- Professional Experience -->
        <section class="cv-section">
          <h2>Professional Experience</h2>
          <CVEntry 
            v-for="(job, index) in cvData.experience"
            :key="index"
            :title="job.title"
            :organization="job.organization"
            :department="job.department"
            :period="job.period"
            :location="job.location"
            :details="job.details"
          />
        </section>

        <!-- Education -->
        <section class="cv-section">
          <h2>Education</h2>
          <CVEntry 
            v-for="(edu, index) in cvData.education"
            :key="index"
            :title="edu.degree"
            :organization="edu.institution"
            :department="edu.department"
            :period="edu.period"
            :location="edu.location"
            :details="edu.thesis ? [edu.thesis] : []"
          />
        </section>

        <!-- Awards & Honors -->
        <section class="cv-section">
          <h2>Awards & Honors</h2>
          <div class="awards-list">
            <div v-for="(award, index) in cvData.awards" :key="index" class="award-item">
              <div class="award-header">
                <h3>{{ award.title }}</h3>
                <span class="year">{{ award.year }}</span>
              </div>
              <p class="organization">{{ award.organization }}</p>
              <p class="description">{{ award.description }}</p>
              <p v-if="award.projectNumber" class="project-number">Project #{{ award.projectNumber }}</p>
            </div>
          </div>
        </section>

        <!-- Research Projects -->
        <section class="cv-section">
          <h2>Research Projects</h2>
          <div class="projects-grid">
            <div v-for="(project, index) in cvData.projects" :key="index" class="project-card">
              <h3>{{ project.name }}</h3>
              <p class="role">{{ project.role }}</p>
              <p class="description">{{ project.description }}</p>
              <a
                v-if="project.url"
                :href="project.url"
                target="_blank"
                class="project-link"
              >View Project →</a>
            </div>
          </div>
        </section>

        <!-- Skills -->
        <section class="cv-section">
          <h2>Core Competencies</h2>
          <div class="skills-grid">
            <div class="skill-category">
              <h3>Clinical Skills</h3>
              <ul>
                <li v-for="(skill, index) in cvData.skills.clinical" :key="index">{{ skill }}</li>
              </ul>
            </div>
            <div class="skill-category">
              <h3>Technical Skills</h3>
              <ul>
                <li v-for="(skill, index) in cvData.skills.technical" :key="index">{{ skill }}</li>
              </ul>
            </div>
            <div class="skill-category">
              <h3>Programming</h3>
              <ul>
                <li v-for="(skill, index) in cvData.skills.programming" :key="index">{{ skill }}</li>
              </ul>
            </div>
            <div class="skill-category">
              <h3>Tools & Platforms</h3>
              <ul>
                <li v-for="(skill, index) in cvData.skills.tools" :key="index">{{ skill }}</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Languages & Memberships -->
        <section class="cv-section">
          <div class="two-column">
            <div>
              <h2>Languages</h2>
              <ul class="languages-list">
                <li v-for="(lang, index) in cvData.languages" :key="index">
                  <strong>{{ lang.language }}:</strong> {{ lang.level }}
                </li>
              </ul>
            </div>
            <div>
              <h2>Professional Memberships</h2>
              <ul>
                <li v-for="(membership, index) in cvData.memberships" :key="index">{{ membership }}</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Selected Publications Note -->
        <section class="cv-section">
          <h2>Publications</h2>
          <p>For a complete list of {{ publications }} publications, please visit the <router-link to="/publications">Publications</router-link> page.</p>
          <p class="publication-stats">
            <span v-if="firstAuthorCount > 0">{{ firstAuthorCount }} first author</span>
            <span v-if="firstAuthorCount > 0 && lastAuthorCount > 0"> | </span>
            <span v-if="lastAuthorCount > 0">{{ lastAuthorCount }} last author</span>
          </p>
        </section>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CVEntry from './CVEntry.vue'

const cvData = ref(null)
const loading = ref(true)
const error = ref(null)
const publications = ref(72) // Will be dynamic later
const firstAuthorCount = ref(15) // Will be dynamic later
const lastAuthorCount = ref(8) // Will be dynamic later

onMounted(async () => {
  try {
    const response = await fetch('/cv-data.json')
    if (!response.ok) {
      throw new Error('Failed to load CV data')
    }
    cvData.value = await response.json()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.cv-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 0;
}

.loading, .error {
  text-align: center;
  padding: 4rem 2rem;
  font-size: 1.125rem;
}

.error {
  color: var(--vp-c-danger);
}

.cv-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--vp-c-divider);
}

.cv-title h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.subtitle {
  margin: 0;
  font-size: 1.25rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.cv-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.cv-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  font-weight: 500;
  transition: all 0.2s;
}

.cv-link:hover {
  background: var(--vp-c-bg-soft-up);
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.cv-content {
  margin-top: 2rem;
}

.cv-section {
  margin-bottom: 3rem;
}

.cv-section h2 {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: var(--vp-c-text-1);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

/* Contact Grid */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.contact-item .icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.contact-item a {
  color: var(--vp-c-brand);
  text-decoration: none;
}

.contact-item a:hover {
  text-decoration: underline;
}

/* Summary */
.summary {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

/* Awards */
.awards-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.award-item {
  padding: 1.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.award-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.award-header h3 {
  margin: 0;
  font-size: 1.125rem;
  color: var(--vp-c-text-1);
}

.year {
  font-weight: 600;
  color: var(--vp-c-brand);
}

.organization {
  margin: 0.25rem 0;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.description {
  margin: 0.5rem 0 0 0;
  color: var(--vp-c-text-2);
}

.project-number {
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.project-card {
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s;
}

.project-card:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.project-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: var(--vp-c-text-1);
}

.role {
  margin: 0 0 0.75rem 0;
  font-weight: 500;
  color: var(--vp-c-brand);
}

.project-card .description {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.project-link {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
}

.project-link:hover {
  text-decoration: underline;
}

/* Skills Grid */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.skill-category h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  color: var(--vp-c-text-1);
}

.skill-category ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.skill-category li {
  padding: 0.5rem 0;
  color: var(--vp-c-text-2);
  position: relative;
  padding-left: 1.5rem;
}

.skill-category li:before {
  content: "▸";
  position: absolute;
  left: 0;
  color: var(--vp-c-brand);
}

/* Two Column Layout */
.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.languages-list {
  list-style: none;
  padding: 0;
}

.languages-list li {
  padding: 0.5rem 0;
  color: var(--vp-c-text-2);
}

/* Publication Stats */
.publication-stats {
  margin-top: 0.5rem;
  color: var(--vp-c-text-3);
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 768px) {
  .cv-header {
    flex-direction: column;
  }
  
  .cv-actions {
    width: 100%;
  }
  
  .cv-link {
    justify-content: center;
    flex: 1;
  }
  
  .two-column {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>