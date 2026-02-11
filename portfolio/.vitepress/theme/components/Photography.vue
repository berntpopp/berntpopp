<template>
  <div class="story-wrapper">
    <div class="story-container">
      <div class="story-header">
        <div class="meta-tag">THE ART</div>
        <h1 class="story-title">Visuals &<br />Moments</h1>
        <div class="story-subtitle">
          Capturing the silence of the underwater world and the noise of the land.
        </div>

        <div v-if="galleryData.categories" class="filter-bar">
          <button
            v-for="(label, key) in galleryData.categories"
            :key="key"
            :class="['filter-item', { active: selectedCategory === key }]"
            @click="selectedCategory = key"
          >
            {{ label }}
          </button>
        </div>
      </div>

      <div class="masonry-grid">
        <div
          v-for="photo in filteredPhotos"
          :key="photo.filename"
          class="grid-item"
          @click="openLightbox(photo)"
        >
          <img :src="`/photography/${photo.filename}`" :alt="photo.alt" loading="lazy" />
          <div class="item-overlay">
            <span class="view-icon">+</span>
          </div>
        </div>
      </div>
    </div>
    <Dock />

    <!-- Lightbox -->
    <Transition name="fade">
      <div
        v-if="lightboxOpen"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="currentPhoto?.title || 'Photo lightbox'"
        @click="closeLightbox"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div class="lightbox-content" @click.stop>
          <img
            :src="currentPhoto ? `/photography/${currentPhoto.filename}` : ''"
            :alt="currentPhoto?.alt"
          />
          <div class="lightbox-meta">
            <h3>{{ currentPhoto?.title }}</h3>
            <p>{{ currentPhoto?.description }}</p>
          </div>
        </div>

        <div class="lightbox-counter">
          {{ currentPhotoIndex + 1 }} / {{ filteredPhotos.length }}
        </div>

        <button
          ref="prevBtn"
          class="nav-btn nav-btn-prev"
          :disabled="currentPhotoIndex <= 0"
          aria-label="Previous photo"
          @click.stop="navigatePrev"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button
          ref="nextBtn"
          class="nav-btn nav-btn-next"
          :disabled="currentPhotoIndex >= filteredPhotos.length - 1"
          aria-label="Next photo"
          @click.stop="navigateNext"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <button ref="closeBtn" class="close-btn" aria-label="Close lightbox" @click="closeLightbox">
          &#x2715;
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import Dock from './Dock.vue'

const galleryData = ref({
  title: 'Photography',
  description: '',
  photos: [],
  categories: {},
})

const selectedCategory = ref('all')
const lightboxOpen = ref(false)
const currentPhoto = ref(null)
const currentPhotoIndex = ref(-1)

const closeBtn = ref(null)
const prevBtn = ref(null)
const nextBtn = ref(null)

let touchStartX = 0
let touchEndX = 0

const filteredPhotos = computed(() => {
  if (selectedCategory.value === 'all') {
    return galleryData.value.photos
  }
  return galleryData.value.photos.filter((photo) => photo.category === selectedCategory.value)
})

onMounted(async () => {
  try {
    const response = await fetch('/photography-data.json')
    const data = await response.json()
    galleryData.value = data.gallery
  } catch (err) {
    console.error('Failed to load photography data:', err)
  }
  window.addEventListener('keydown', handleKeydown)
})

const openLightbox = (photo) => {
  const idx = filteredPhotos.value.findIndex((p) => p.filename === photo.filename)
  currentPhotoIndex.value = idx
  currentPhoto.value = photo
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
  nextTick(() => {
    closeBtn.value?.focus()
  })
}

const closeLightbox = () => {
  lightboxOpen.value = false
  currentPhoto.value = null
  currentPhotoIndex.value = -1
  document.body.style.overflow = ''
}

const navigateNext = () => {
  if (currentPhotoIndex.value < filteredPhotos.value.length - 1) {
    currentPhotoIndex.value++
    currentPhoto.value = filteredPhotos.value[currentPhotoIndex.value]
  }
}

const navigatePrev = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
    currentPhoto.value = filteredPhotos.value[currentPhotoIndex.value]
  }
}

const handleKeydown = (e) => {
  if (!lightboxOpen.value) return

  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowRight') navigateNext()
  else if (e.key === 'ArrowLeft') navigatePrev()
  else if (e.key === 'Tab') {
    // Focus trap: cycle through close, prev, next
    e.preventDefault()
    const focusable = [closeBtn.value, prevBtn.value, nextBtn.value].filter(
      (el) => el && !el.disabled
    )
    if (focusable.length === 0) return
    const currentIdx = focusable.indexOf(document.activeElement)
    const nextIdx = e.shiftKey
      ? (currentIdx - 1 + focusable.length) % focusable.length
      : (currentIdx + 1) % focusable.length
    focusable[nextIdx]?.focus()
  }
}

const onTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX
}

const onTouchMove = (e) => {
  touchEndX = e.changedTouches[0].screenX
}

const onTouchEnd = () => {
  const diff = touchStartX - touchEndX
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      navigateNext()
    } else {
      navigatePrev()
    }
  }
}

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Force Dark Theme for this component */
.story-wrapper {
  background-color: #050505;
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 8rem; /* Space for dock */
  color: #fff;
}

.story-container {
  max-width: 1400px; /* Wide for photos */
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
  color: #666; /* Subtle in dark mode */
  margin-bottom: 1.5rem;
  text-transform: uppercase;
}

.story-title {
  font-family: var(--vp-font-family-headings);
  font-size: clamp(3rem, 8vw, 5rem);
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.story-subtitle {
  font-family: var(--vp-font-family-base);
  font-size: 1.25rem;
  color: #888;
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto;
}

/* Filter */
.filter-bar {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
  border-top: 1px solid #222;
  border-bottom: 1px solid #222;
  padding: 1rem 0;
  display: inline-flex;
}

.filter-item {
  background: none;
  border: none;
  color: #666;
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.3s;
  letter-spacing: 0.1em;
}

.filter-item:hover,
.filter-item.active {
  color: #fff;
}

/* Grid */
.masonry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.grid-item {
  position: relative;
  aspect-ratio: 3/2;
  overflow: hidden;
  cursor: zoom-in;
  filter: brightness(0.9);
  transition: all 0.4s ease;
  border-radius: 4px;
}

.grid-item:hover {
  filter: brightness(1.1);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.grid-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.grid-item:hover img {
  transform: scale(1.05);
}

.item-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.view-icon {
  font-size: 2rem;
  font-weight: 300;
}

.grid-item:hover .item-overlay {
  opacity: 1;
}

/* Lightbox */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 85vh;
  display: block;
}

.lightbox-meta {
  text-align: center;
  margin-top: 1rem;
}

.lightbox-meta h3 {
  font-family: var(--vp-font-family-base);
  font-weight: 400;
  margin: 0;
}

.lightbox-meta p {
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

/* Lightbox Counter */
.lightbox-counter {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.1em;
}

/* Nav Buttons */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.nav-btn:disabled {
  opacity: 0.2;
  cursor: default;
}

.nav-btn-prev {
  left: 2rem;
}

.nav-btn-next {
  right: 2rem;
}

.close-btn {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 1;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .masonry-grid {
    grid-template-columns: 1fr;
  }

  .nav-btn {
    width: 40px;
    height: 40px;
  }

  .nav-btn-prev {
    left: 1rem;
  }

  .nav-btn-next {
    right: 1rem;
  }
}
</style>
