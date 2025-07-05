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
        <h3 class="title">{{ formatTitle(pub.entryTags?.TITLE) || 'No title' }}</h3>
        <p class="authors">{{ formatAuthors(pub.entryTags?.AUTHOR) }}</p>
        <p class="details">
          <span v-if="pub.entryType" class="entry-type">{{ pub.entryType }}</span>
          <span v-if="pub.entryTags?.JOURNAL">{{ pub.entryTags.JOURNAL }}</span>
          <span v-if="pub.entryTags?.YEAR"> ({{ pub.entryTags.YEAR }})</span>
          <span v-if="pub.entryTags?.VOLUME">, {{ pub.entryTags.VOLUME }}</span>
          <span v-if="pub.entryTags?.NUMBER">({{ pub.entryTags.NUMBER }})</span>
          <span v-if="pub.entryTags?.PAGES">: {{ pub.entryTags.PAGES }}</span>
        </p>
        <div class="links">
          <a
            v-if="pub.entryTags?.DOI"
            :href="`https://doi.org/${pub.entryTags.DOI}`"
            target="_blank"
            class="link"
          >
            DOI
          </a>
          <a
            v-if="pub.entryTags?.URL"
            :href="pub.entryTags.URL"
            target="_blank"
            class="link"
          >
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
      pub.entryTags?.TITLE?.toLowerCase().includes(query) ||
      pub.entryTags?.AUTHOR?.toLowerCase().includes(query) ||
      pub.entryTags?.JOURNAL?.toLowerCase().includes(query) ||
      pub.entryTags?.YEAR?.toString().includes(query) ||
      pub.citationKey?.toLowerCase().includes(query)
    )
  })
})

function formatTitle(title) {
  if (!title) return ''
  // Remove curly braces used for BibTeX formatting
  return title.replace(/[{}]/g, '')
}

function formatAuthors(authors) {
  if (!authors) return ''
  // Remove curly braces and split by 'and'
  const authorList = authors.replace(/[{}]/g, '').split(' and ')
  
  // Format: show all authors for short lists, otherwise show first 3 + et al.
  if (authorList.length <= 4) {
    return authorList.join(', ')
  } else {
    return authorList.slice(0, 3).join(', ') + ', et al.'
  }
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
      const yearA = parseInt(a.entryTags?.YEAR) || 0
      const yearB = parseInt(b.entryTags?.YEAR) || 0
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

.entry-type {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  margin-right: 0.5rem;
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