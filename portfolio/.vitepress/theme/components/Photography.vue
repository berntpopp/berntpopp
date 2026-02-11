<template>
  <div class="photography-gallery">
    <div class="gallery-header">
      <h1>{{ galleryData.title }}</h1>
      <p class="gallery-description">
        {{ galleryData.description }}
      </p>

      <!-- Category Filter -->
      <div v-if="galleryData.categories" class="category-filter">
        <button
          v-for="(label, key) in galleryData.categories"
          :key="key"
          :class="['category-btn', { active: selectedCategory === key }]"
          @click="selectedCategory = key"
        >
          {{ label }}
        </button>
      </div>
    </div>

    <div class="photo-grid">
      <div
        v-for="photo in filteredPhotos"
        :key="photo.filename"
        class="photo-item"
        @click="openLightbox(photo)"
      >
        <img :src="`/photography/${photo.filename}`" :alt="photo.alt" loading="lazy" />
        <div class="photo-overlay">
          <span class="photo-title">{{ photo.title }}</span>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Transition name="fade">
      <div v-if="lightboxOpen" class="lightbox" @click="closeLightbox">
        <button class="lightbox-close" aria-label="Close" @click="closeLightbox">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <button class="lightbox-prev" aria-label="Previous photo" @click.stop="prevPhoto">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button class="lightbox-next" aria-label="Next photo" @click.stop="nextPhoto">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
        <img
          :src="currentPhoto ? `/photography/${currentPhoto.filename}` : ''"
          :alt="currentPhoto?.alt"
          @click.stop
        />
        <div v-if="currentPhoto" class="lightbox-caption">
          {{ currentPhoto.title }}
          <span v-if="currentPhoto.description" class="lightbox-description">
            {{ currentPhoto.description }}
          </span>
          <span v-if="currentPhoto.location" class="lightbox-location">
            📍 {{ currentPhoto.location }}
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const galleryData = ref({
  title: 'Photography',
  description: 'A visual journey through the lens',
  photos: [],
  categories: {},
})

const selectedCategory = ref('all')
const lightboxOpen = ref(false)
const currentPhoto = ref(null)
const currentPhotoIndex = ref(0)

const filteredPhotos = computed(() => {
  if (selectedCategory.value === 'all') {
    return galleryData.value.photos
  }
  return galleryData.value.photos.filter((photo) => photo.category === selectedCategory.value)
})

// Load gallery data
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
  const index = filteredPhotos.value.findIndex((p) => p.filename === photo.filename)
  currentPhotoIndex.value = index
  currentPhoto.value = photo
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  currentPhoto.value = null
  document.body.style.overflow = ''
}

const nextPhoto = () => {
  currentPhotoIndex.value = (currentPhotoIndex.value + 1) % filteredPhotos.value.length
  currentPhoto.value = filteredPhotos.value[currentPhotoIndex.value]
}

const prevPhoto = () => {
  currentPhotoIndex.value =
    (currentPhotoIndex.value - 1 + filteredPhotos.value.length) % filteredPhotos.value.length
  currentPhoto.value = filteredPhotos.value[currentPhotoIndex.value]
}

const handleKeydown = (e) => {
  if (!lightboxOpen.value) return

  switch (e.key) {
    case 'Escape':
      closeLightbox()
      break
    case 'ArrowRight':
      nextPhoto()
      break
    case 'ArrowLeft':
      prevPhoto()
      break
  }
}

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.photography-gallery {
  width: 100%;
  padding: 2rem 0;
}

.gallery-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 0 1rem;
}

.gallery-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.gallery-description {
  font-size: 1.125rem;
  color: var(--vp-c-text-2);
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

/* Category Filter */
.category-filter {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.category-btn {
  padding: 0.5rem 1.25rem;
  border: 2px solid var(--vp-c-divider);
  background: transparent;
  border-radius: 24px;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-btn:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.category-btn.active {
  background: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  color: white;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.photo-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  background: var(--vp-c-bg-soft);
  aspect-ratio: 4/3;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.photo-item:hover img {
  transform: scale(1.05);
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  padding: 2rem 1rem 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.photo-item:hover .photo-overlay {
  transform: translateY(0);
}

.photo-title {
  color: white;
  font-weight: 500;
  font-size: 1.125rem;
}

/* Lightbox styles */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
}

.lightbox img {
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
}

.lightbox-close,
.lightbox-prev,
.lightbox-next {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s ease;
}

.lightbox-close:hover,
.lightbox-prev:hover,
.lightbox-next:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox-close {
  top: 1rem;
  right: 1rem;
}

.lightbox-prev {
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

.lightbox-next {
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

.lightbox-caption {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  text-align: center;
  font-size: 1.125rem;
  font-weight: 500;
}

.lightbox-description {
  display: block;
  font-size: 0.875rem;
  font-weight: 400;
  margin-top: 0.5rem;
  opacity: 0.8;
}

.lightbox-location {
  display: block;
  font-size: 0.75rem;
  font-weight: 400;
  margin-top: 0.25rem;
  opacity: 0.6;
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

/* Dark mode adjustments */
.dark .photo-item {
  background: var(--vp-c-bg-soft);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .photo-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .gallery-header h1 {
    font-size: 2rem;
  }

  .lightbox {
    padding: 1rem;
  }

  .lightbox-caption {
    bottom: 1rem;
    padding: 0 1rem;
  }
}
</style>
