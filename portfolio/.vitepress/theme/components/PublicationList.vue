<template>
  <div class="publication-list">
    <div class="header-row">
      <h1 class="page-title">Science</h1>
      <div class="stats-counter">
        <span class="count">{{ filteredPublications.length }}</span>
        <span class="label">PUBLICATIONS</span>
      </div>
    </div>

    <div class="controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="SEARCH DATABASE..."
        class="search-input"
      />

      <div class="filters">
        <button
          class="filter-btn"
          :class="{ active: showOnlyFirstLast }"
          @click="showOnlyFirstLast = !showOnlyFirstLast"
        >
          [ KEY AUTHORSHIPS ]
        </button>
        <button
          class="filter-btn"
          :class="{ active: showAllAuthors }"
          @click="showAllAuthors = !showAllAuthors"
        >
          [ SHOW ALL AUTHORS ]
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">INITIALIZING DATABASE...</div>
    <div v-else-if="error" class="error">SYSTEM ERROR: {{ error }}</div>
    <div v-else class="publications-grid">
      <div v-for="(pub, index) in filteredPublications" :key="index" class="pub-row">
        <div class="pub-year">{{ pub.entryTags?.YEAR || 'ND' }}</div>

        <div class="pub-content">
          <div class="pub-header">
            <h3 class="pub-title">{{ formatTitle(pub.entryTags?.TITLE) || 'Untitled' }}</h3>
            <div class="pub-meta">
              <span v-if="getAuthorshipPosition(pub.entryTags?.AUTHOR).isFirst" class="meta-tag"
                >FIRST</span
              >
              <span v-if="getAuthorshipPosition(pub.entryTags?.AUTHOR).isLast" class="meta-tag"
                >LAST</span
              >
            </div>
          </div>

          <!-- eslint-disable-next-line vue/no-v-html -->
          <p class="pub-authors" v-html="formatAuthors(pub.entryTags?.AUTHOR, showAllAuthors)" />

          <div class="pub-journal">
            {{ pub.entryTags?.JOURNAL || 'Preprint/Other' }}
            <span v-if="pub.entryTags?.VOLUME">• Vol {{ pub.entryTags.VOLUME }}</span>
          </div>

          <div class="pub-links">
            <a
              v-if="pub.entryTags?.DOI"
              :href="`https://doi.org/${pub.entryTags.DOI}`"
              target="_blank"
              class="link-item"
            >
              DOI &nearr;
            </a>
            <a
              v-if="pub.entryTags?.URL"
              :href="pub.entryTags.URL"
              target="_blank"
              class="link-item"
            >
              URL &nearr;
            </a>
          </div>
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
const showOnlyFirstLast = ref(false)
const showAllAuthors = ref(false)

const filteredPublications = computed(() => {
  let filtered = publications.value

  // Filter by first/last author if enabled
  if (showOnlyFirstLast.value) {
    filtered = filtered.filter((pub) => {
      const { isFirst, isLast } = getAuthorshipPosition(pub.entryTags?.AUTHOR)
      return isFirst || isLast
    })
  }

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((pub) => {
      return (
        pub.entryTags?.TITLE?.toLowerCase().includes(query) ||
        pub.entryTags?.AUTHOR?.toLowerCase().includes(query) ||
        pub.entryTags?.JOURNAL?.toLowerCase().includes(query) ||
        pub.entryTags?.YEAR?.toString().includes(query) ||
        pub.citationKey?.toLowerCase().includes(query)
      )
    })
  }

  return filtered
})

function formatTitle(title) {
  if (!title) return ''
  return title.replace(/[{}]/g, '')
}

function getAuthorshipPosition(authors) {
  if (!authors) return { isFirst: false, isLast: false }

  const authorList = authors
    .replace(/[{}]/g, '')
    .split(' and ')
    .map((a) => a.trim())

  const targetNames = ['Popp, Bernt', 'Bernt Popp', 'Popp, B.', 'B. Popp', 'Popp, B', 'B Popp']

  const firstAuthor = authorList[0]
  const lastAuthor = authorList[authorList.length - 1]

  const isFirst = targetNames.some((name) => firstAuthor.includes(name))
  const isLast = targetNames.some((name) => lastAuthor.includes(name))

  return { isFirst, isLast }
}

function highlightTargetAuthor(author) {
  const targetPatterns = [/Popp,\s*Bernt/g, /Bernt\s+Popp/g, /Popp,\s*B\.?/g, /B\.?\s+Popp/g]

  let highlighted = author
  targetPatterns.forEach((pattern) => {
    highlighted = highlighted.replace(
      pattern,
      (match) => `<span class="author-highlight">${match}</span>`
    )
  })

  return highlighted
}

function formatAuthors(authors, showAll = false) {
  if (!authors) return ''
  const authorList = authors
    .replace(/[{}]/g, '')
    .split(' and ')
    .map((a) => a.trim())

  let formattedAuthors

  if (showAll || authorList.length <= 4) {
    formattedAuthors = authorList.map(highlightTargetAuthor).join(', ')
  } else {
    formattedAuthors = authorList.slice(0, 3).map(highlightTargetAuthor).join(', ') + ', et al.'
  }

  return formattedAuthors
}

onMounted(async () => {
  try {
    const response = await fetch('/bp.bib')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const bibText = await response.text()
    const parsed = BibtexParser.toJSON(bibText)

    publications.value = parsed.sort((a, b) => {
      const yearA = parseInt(a.entryTags?.YEAR) || 0
      const yearB = parseInt(b.entryTags?.YEAR) || 0
      return yearB - yearA
    })
  } catch (e) {
    error.value = 'Failed to load publications: ' + e.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.publication-list {
  max-width: 1000px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  font-family: var(--vp-font-family-mono);
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 4rem;
  border-bottom: 2px solid var(--vp-c-text-1);
  padding-bottom: 1rem;
}

.page-title {
  font-family: var(--vp-font-family-headings);
  font-size: 4rem;
  line-height: 0.9;
  margin: 0;
}

.stats-counter {
  text-align: right;
  font-family: var(--vp-font-family-mono);
}

.stats-counter .count {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
}

.stats-counter .label {
  font-size: 0.75rem;
  opacity: 0.6;
}

/* Controls */
.controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 4rem;
}

.search-input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 1rem 0;
  font-family: var(--vp-font-family-mono);
  font-size: 1rem;
  color: var(--vp-c-text-1);
  border-radius: 0;
}

.search-input:focus {
  outline: none;
  border-bottom-color: var(--vp-c-accent);
}

.filters {
  display: flex;
  gap: 1.5rem;
}

.filter-btn {
  background: transparent;
  border: none;
  padding: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: color 0.2s;
}

.filter-btn:hover,
.filter-btn.active {
  color: var(--vp-c-accent);
}

/* Grid */
.publications-grid {
  display: flex;
  flex-direction: column;
}

.pub-row {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 2rem;
  padding: 2rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: background 0.2s;
}

.pub-row:hover {
  background: var(--vp-c-bg-soft);
}

.pub-year {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--vp-c-text-2);
  opacity: 0.5;
}

.pub-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pub-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.pub-title {
  font-family: var(--vp-font-family-base);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
  color: var(--vp-c-text-1);
}

.pub-meta {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.meta-tag {
  font-size: 0.7rem;
  border: 1px solid var(--vp-c-text-2);
  padding: 0.1em 0.4em;
  border-radius: 2px;
  color: var(--vp-c-text-2);
}

.pub-authors {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.6;
}

.pub-journal {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
  letter-spacing: 0.05em;
}

.pub-links {
  margin-top: 0.5rem;
  display: flex;
  gap: 1.5rem;
}

.link-item {
  font-size: 0.8rem;
  text-decoration: none;
  color: var(--vp-c-accent);
  text-transform: uppercase;
}

.link-item:hover {
  text-decoration: underline;
}

:deep(.author-highlight) {
  color: var(--vp-c-text-1);
  font-weight: 700;
  border-bottom: 1px solid var(--vp-c-text-1);
}

/* Responsive */
@media (max-width: 600px) {
  .header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .pub-row {
    grid-template-columns: 1fr; /* Stack year on top */
    gap: 0.5rem;
  }

  .pub-year {
    font-size: 0.9rem;
  }
}
</style>
