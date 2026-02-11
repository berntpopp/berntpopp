<template>
  <div class="photography-wrapper">
    <!-- Dark Mode Forced Wrapper -->
    <div class="dark-canvas">
      <div class="header">
        <h1 class="title">Visuals</h1>
        <p class="subtitle">
          Capturing the silence of the underwater world and the noise of the land.
        </p>

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

    <!-- Lightbox -->
    <Transition name="fade">
      <div v-if="lightboxOpen" class="lightbox" @click="closeLightbox">
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

        <button class="close-btn" @click="closeLightbox">✕</button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const galleryData = ref({
  title: 'Photography',
  description: '',
  photos: [],
  categories: {},
})

const selectedCategory = ref('all')
const lightboxOpen = ref(false)
const currentPhoto = ref(null)

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
  } catch (error) {
    console.error('Failed to load photography data:', error)
  }
  window.addEventListener('keydown', handleKeydown)
})

const openLightbox = (photo) => {
  currentPhoto.value = photo
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  currentPhoto.value = null
  document.body.style.overflow = ''
}

const handleKeydown = (e) => {
  if (e.key === 'Escape') closeLightbox()
}

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Force Dark Theme for this component */
.photography-wrapper {
  background-color: #050505;
  min-height: 100vh;
  /* Removed hacked full-width */
  width: 100%;
  color: #fff;
  padding-bottom: 6rem; /* Space for dock */
}

.dark-canvas {
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
}

.header {
  text-align: center;
  margin-bottom: 4rem;
}

.title {
  font-family: var(--vp-font-family-headings);
  font-size: 3.5rem;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.subtitle {
  font-family: var(--vp-font-family-mono);
  font-size: 0.9rem;
  color: #888;
  max-width: 400px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

/* Filter */
.filter-bar {
  display: flex;
  justify-content: center;
  gap: 2rem;
  border-top: 1px solid #222;
  border-bottom: 1px solid #222;
  padding: 1rem 0;
  display: inline-flex; /* center the bar itself */
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
  gap: 2rem; /* More breathing room */
}

.grid-item {
  position: relative;
  aspect-ratio: 3/2; /* Classic photo ratio */
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
}
</style>
