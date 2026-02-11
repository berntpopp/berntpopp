<template>
  <div class="publication-list">
    <div class="controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search publications..."
        class="search-input"
      />
      <div class="filter-toggles">
        <label>
          <input v-model="showOnlyFirstLast" type="checkbox" />
          Show only first/last author publications
        </label>
        <label>
          <input v-model="showAllAuthors" type="checkbox" />
          Show all authors
        </label>
      </div>
      <div class="stats">
        Showing {{ filteredPublications.length }} of {{ publications.length }} publications
        <span v-if="showOnlyFirstLast" class="filter-active">(filtered)</span>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading publications...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="publications">
      <div v-for="(pub, index) in filteredPublications" :key="index" class="publication-item">
        <div class="title-row">
          <h3 class="title">{{ formatTitle(pub.entryTags?.TITLE) || 'No title' }}</h3>
          <div class="authorship-tags">
            <span
              v-if="getAuthorshipPosition(pub.entryTags?.AUTHOR).isFirst"
              class="tag first-author"
              >First Author</span
            >
            <span
              v-if="
                getAuthorshipPosition(pub.entryTags?.AUTHOR).isLast &&
                !getAuthorshipPosition(pub.entryTags?.AUTHOR).isFirst
              "
              class="tag last-author"
              >Last Author</span
            >
            <span
              v-if="
                getAuthorshipPosition(pub.entryTags?.AUTHOR).isFirst &&
                getAuthorshipPosition(pub.entryTags?.AUTHOR).isLast
              "
              class="tag sole-author"
              >Sole Author</span
            >
          </div>
        </div>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p class="authors" v-html="formatAuthors(pub.entryTags?.AUTHOR, showAllAuthors)" />
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
          <a v-if="pub.entryTags?.URL" :href="pub.entryTags.URL" target="_blank" class="link">
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
  // Remove curly braces used for BibTeX formatting
  return title.replace(/[{}]/g, '')
}

function getAuthorshipPosition(authors) {
  if (!authors) return { isFirst: false, isLast: false }

  // Remove curly braces and split by 'and'
  const authorList = authors
    .replace(/[{}]/g, '')
    .split(' and ')
    .map((a) => a.trim())

  // Check for Bernt Popp in various formats
  const targetNames = ['Popp, Bernt', 'Bernt Popp', 'Popp, B.', 'B. Popp', 'Popp, B', 'B Popp']

  const firstAuthor = authorList[0]
  const lastAuthor = authorList[authorList.length - 1]

  const isFirst = targetNames.some((name) => firstAuthor.includes(name))
  const isLast = targetNames.some((name) => lastAuthor.includes(name))

  return { isFirst, isLast }
}

function highlightTargetAuthor(author) {
  // Check for Bernt Popp in various formats and wrap with highlighting span
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
  // Remove curly braces and split by 'and'
  const authorList = authors
    .replace(/[{}]/g, '')
    .split(' and ')
    .map((a) => a.trim())

  let formattedAuthors

  if (showAll || authorList.length <= 4) {
    // Show all authors
    formattedAuthors = authorList.map(highlightTargetAuthor).join(', ')
  } else {
    // Show first 3 + et al.
    formattedAuthors = authorList.slice(0, 3).map(highlightTargetAuthor).join(', ') + ', et al.'
  }

  return formattedAuthors
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

.filter-toggles {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-toggles label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  cursor: pointer;
}

.filter-toggles input[type='checkbox'] {
  cursor: pointer;
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

.filter-active {
  color: var(--vp-c-brand);
  font-weight: 500;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.authorship-tags {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.tag {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tag.first-author {
  background: var(--vp-c-success-soft);
  color: var(--vp-c-success);
}

.tag.last-author {
  background: var(--vp-c-info-soft);
  color: var(--vp-c-info);
}

.tag.sole-author {
  background: var(--vp-c-warning-soft);
  color: var(--vp-c-warning);
}

.loading,
.error {
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
  margin: 0;
  color: var(--vp-c-text-1);
  flex: 1;
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

:deep(.author-highlight) {
  text-decoration: underline;
  text-decoration-color: var(--vp-c-brand);
  text-decoration-thickness: 2px;
  text-underline-offset: 2px;
  font-weight: 600;
  color: var(--vp-c-brand);
}

@media (max-width: 768px) {
  .title-row {
    flex-direction: column;
    gap: 0.5rem;
  }

  .authorship-tags {
    margin-bottom: 0.5rem;
  }

  .tag {
    font-size: 0.625rem;
    padding: 0.2rem 0.5rem;
  }
}
</style>
