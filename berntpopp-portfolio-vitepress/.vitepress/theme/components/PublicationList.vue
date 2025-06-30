<template>
  <div class="publication-list">
    <div class="controls">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search publications..." 
        class="search-input"
      >
      <div class="stats">
        Showing {{ filteredPublications.length }} of {{ publications.length }} publications
      </div>
    </div>
    
    <div v-if="loading" class="loading">Loading publications...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="publications">
      <div 
        v-for="(pub, index) in filteredPublications" 
        :key="index" 
        class="publication-item"
      >
        <h3 class="title">{{ pub.title }}</h3>
        <p class="authors">{{ formatAuthors(pub.author) }}</p>
        <p class="details">
          <span v-if="pub.journal">{{ pub.journal }}</span>
          <span v-if="pub.year"> ({{ pub.year }})</span>
          <span v-if="pub.volume">, {{ pub.volume }}</span>
          <span v-if="pub.pages">: {{ pub.pages }}</span>
        </p>
        <div class="links">
          <a v-if="pub.doi" :href="`https://doi.org/${pub.doi}`" target="_blank" class="link">
            DOI
          </a>
          <a v-if="pub.url" :href="pub.url" target="_blank" class="link">
            URL
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BibtexParser from 'bibtex-parser-js'

const publications = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')

const filteredPublications = computed(() => {
  if (!searchQuery.value) return publications.value
  
  const query = searchQuery.value.toLowerCase()
  return publications.value.filter(pub => {
    return (
      pub.title?.toLowerCase().includes(query) ||
      pub.author?.toLowerCase().includes(query) ||
      pub.journal?.toLowerCase().includes(query) ||
      pub.year?.toString().includes(query)
    )
  })
})

function formatAuthors(authors) {
  if (!authors) return ''
  // Simple formatting - can be improved
  return authors.replace(/and/g, ',').replace(/[{}]/g, '')
}

onMounted(async () => {
  try {
    console.log('Fetching publications...')
    const response = await fetch('/bp.bib')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const bibText = await response.text()
    console.log('Bib file loaded, parsing...')
    
    const parsed = BibtexParser.toJSON(bibText)
    console.log(`Parsed ${parsed.length} publications`)
    
    // Sort by year (descending)
    publications.value = parsed.sort((a, b) => {
      const yearA = parseInt(a.year) || 0
      const yearB = parseInt(b.year) || 0
      return yearB - yearA
    })
  } catch (e) {
    console.error('Error loading publications:', e)
    error.value = 'Failed to load publications: ' + e.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.publication-list {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 0;
}

.controls {
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg);
}

.stats {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: var(--vp-c-text-2);
}

.error {
  color: var(--vp-c-danger);
}

.publications {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.publication-item {
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s;
}

.publication-item:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-text-1);
}

.authors {
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

.details {
  margin: 0 0 0.75rem 0;
  color: var(--vp-c-text-3);
  font-size: 0.875rem;
}

.links {
  display: flex;
  gap: 1rem;
}

.link {
  font-size: 0.875rem;
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.link:hover {
  color: var(--vp-c-brand-dark);
  text-decoration: underline;
}
</style>