<template>
  <div class="story-wrapper">
    <div class="story-container">
      <div class="story-header">
        <div class="meta-tag">THE SCIENCE</div>
        <h1 class="story-title">Selected<br />Publications</h1>
        <div class="story-subtitle">
          {{ filteredPublications.length }} works on neurodevelopmental disorders, rare tumors, and
          bioinformatics.
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
      <template v-else>
        <div v-if="filteredPublications.length > 0" class="summary-bar">
          Showing {{ displayedCount }} of {{ filteredPublications.length }} publications
          <span v-if="hasMore" class="load-hint">— scroll to load more</span>
        </div>

        <div class="publications-grid">
          <div v-for="group in displayedYearGroups" :key="group.year" class="year-group">
            <div class="year-header">{{ group.year }}</div>
            <div v-for="(pub, index) in group.publications" :key="index" class="pub-row">
              <div class="pub-year">{{ pub.entryTags?.YEAR || 'ND' }}</div>

              <div class="pub-content">
                <h3 class="pub-title">
                  {{ formatTitle(pub.entryTags?.TITLE) || 'Untitled' }}
                  <span class="pub-meta-tags">
                    <span v-if="getAuthorshipPosition(pub.entryTags?.AUTHOR).isFirst" class="tag"
                      >FIRST</span
                    >
                    <span v-if="getAuthorshipPosition(pub.entryTags?.AUTHOR).isLast" class="tag"
                      >LAST</span
                    >
                  </span>
                </h3>

                <!-- eslint-disable-next-line vue/no-v-html -->
                <p
                  class="pub-authors"
                  v-html="formatAuthors(pub.entryTags?.AUTHOR, showAllAuthors)"
                />

                <div class="pub-journal">
                  {{ pub.entryTags?.JOURNAL || 'Preprint/Other' }}
                  <span v-if="pub.entryTags?.VOLUME">• Vol {{ pub.entryTags.VOLUME }}</span>
                </div>

                <div class="pub-links">
                  <a
                    v-if="pub.entryTags?.DOI"
                    :href="`https://doi.org/${pub.entryTags.DOI}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="link-item"
                  >
                    DOI &nearr;
                  </a>
                  <a
                    v-if="pub.entryTags?.URL"
                    :href="pub.entryTags.URL"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="link-item"
                  >
                    URL &nearr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="hasMore" ref="loadMoreTrigger" class="load-more-trigger">
          <span class="loader-dots">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
      </template>
    </div>
    <Dock />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import BibtexParser from 'bibtex-parser-js'
import Dock from './Dock.vue'

const publications = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const showOnlyFirstLast = ref(false)
const showAllAuthors = ref(false)
const displayedYears = ref(3)
const loadMoreTrigger = ref(null)

let observer = null

const filteredPublications = computed(() => {
  let filtered = publications.value

  if (showOnlyFirstLast.value) {
    filtered = filtered.filter((pub) => {
      const { isFirst, isLast } = getAuthorshipPosition(pub.entryTags?.AUTHOR)
      return isFirst || isLast
    })
  }

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

const publicationsByYear = computed(() => {
  const groups = {}
  filteredPublications.value.forEach((pub) => {
    const year = pub.entryTags?.YEAR || 'Unknown'
    if (!groups[year]) {
      groups[year] = []
    }
    groups[year].push(pub)
  })
  return groups
})

const sortedYearGroups = computed(() => {
  return Object.keys(publicationsByYear.value)
    .sort((a, b) => {
      if (a === 'Unknown') return 1
      if (b === 'Unknown') return -1
      return parseInt(b) - parseInt(a)
    })
    .map((year) => ({
      year,
      publications: publicationsByYear.value[year],
    }))
})

const displayedYearGroups = computed(() => {
  return sortedYearGroups.value.slice(0, displayedYears.value)
})

const displayedCount = computed(() => {
  return displayedYearGroups.value.reduce((sum, g) => sum + g.publications.length, 0)
})

const hasMore = computed(() => {
  return displayedYears.value < sortedYearGroups.value.length
})

// Reset displayed years when filters change
watch([searchQuery, showOnlyFirstLast], () => {
  displayedYears.value = 3
})

function loadMore() {
  if (hasMore.value) {
    displayedYears.value += 2
  }
}

function setupObserver() {
  if (observer) {
    observer.disconnect()
  }
  if (!loadMoreTrigger.value) return

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadMore()
      }
    },
    { rootMargin: '200px' }
  )
  observer.observe(loadMoreTrigger.value)
}

watch(
  () => loadMoreTrigger.value,
  (el) => {
    if (el) {
      nextTick(() => setupObserver())
    }
  }
)

watch(hasMore, (val) => {
  if (val) {
    nextTick(() => setupObserver())
  } else if (observer) {
    observer.disconnect()
  }
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
    console.error(e)
    error.value = 'Failed to load publications: ' + e.message
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
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
  max-width: 900px; /* Slightly wider for data */
  width: 100%;
  padding: 6rem 1.5rem;
}

.story-header {
  text-align: center;
  margin-bottom: 6rem;
}

.meta-tag {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  color: var(--vp-c-accent);
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
  margin: 0 auto;
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
  text-align: center;
}

.search-input:focus {
  outline: none;
  border-bottom-color: var(--vp-c-accent);
}

.filters {
  display: flex;
  gap: 2rem;
  justify-content: center;
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

/* Summary Bar */
.summary-bar {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.load-hint {
  opacity: 0.6;
}

/* Grid */
.publications-grid {
  display: flex;
  flex-direction: column;
}

/* Year Groups */
.year-group {
  margin-bottom: 1rem;
}

.year-header {
  font-family: var(--vp-font-family-headings);
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  padding: 1.5rem 0 1rem;
  border-bottom: 2px solid var(--vp-c-accent);
  margin-bottom: 0.5rem;
  position: sticky;
  top: 0;
  background-color: var(--vp-c-bg);
  z-index: 10;
}

.pub-row {
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: 2rem;
  padding: 2rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: all 0.2s;
}

:global(.dark) .pub-row {
  border-bottom-color: rgba(255, 255, 255, 0.15);
}

.pub-row:hover {
  transform: translateX(10px);
}

.pub-year {
  font-family: var(--vp-font-family-mono);
  font-size: 1rem;
  font-weight: 700;
  color: var(--vp-c-text-3);
  padding-top: 5px;
}

.pub-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pub-title {
  font-family: var(--vp-font-family-base);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
  color: var(--vp-c-text-1);
}

.pub-meta-tags {
  display: inline-flex;
  gap: 0.5rem;
  margin-left: 0.5rem;
  vertical-align: middle;
}

.tag {
  font-family: var(--vp-font-family-mono);
  font-size: 0.6rem;
  border: 1px solid var(--vp-c-divider);
  padding: 0.1em 0.4em;
  border-radius: 2px;
  color: var(--vp-c-text-2);
}

.pub-authors {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.pub-journal {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
  letter-spacing: 0.05em;
  margin-top: 0.25rem;
}

.pub-links {
  margin-top: 0.75rem;
  display: flex;
  gap: 1.5rem;
}

.link-item {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  text-decoration: none;
  color: var(--vp-c-accent);
  text-transform: uppercase;
  border-bottom: 1px solid transparent;
}

.link-item:hover {
  border-bottom-color: var(--vp-c-accent);
}

:deep(.author-highlight) {
  color: var(--vp-c-text-1);
  font-weight: 600;
  border-bottom: 1px solid var(--vp-c-divider);
}

/* Load More Trigger */
.load-more-trigger {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.loader-dots {
  display: flex;
  gap: 0.5rem;
}

.loader-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--vp-c-text-3);
  animation: loader-pulse 1.4s infinite ease-in-out both;
}

.loader-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loader-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes loader-pulse {
  0%,
  80%,
  100% {
    transform: scale(0);
    opacity: 0.3;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 600px) {
  .pub-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .year-header {
    font-size: 1.5rem;
  }
}
</style>
