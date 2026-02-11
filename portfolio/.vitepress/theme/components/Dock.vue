<template>
  <div class="dock-wrapper">
    <nav class="dock-container">
      <a href="/" class="dock-item" :class="{ active: currentPath === '/' }">
        <span class="icon">01</span>
        <span class="label">Home</span>
      </a>
      <div class="divider"></div>
      <a href="/about" class="dock-item" :class="{ active: currentPath.includes('/about') }">
        <span class="icon">02</span>
        <span class="label">Story</span>
      </a>
      <a
        href="/publications"
        class="dock-item"
        :class="{ active: currentPath.includes('/publications') }"
      >
        <span class="icon">03</span>
        <span class="label">Science</span>
      </a>
      <a
        href="/photography"
        class="dock-item"
        :class="{ active: currentPath.includes('/photography') }"
      >
        <span class="icon">04</span>
        <span class="label">Art</span>
      </a>
      <a href="/cv" class="dock-item" :class="{ active: currentPath.includes('/cv') }">
        <span class="icon">05</span>
        <span class="label">CV</span>
      </a>
    </nav>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'

const { page } = useData()
const currentPath = computed(() =>
  page.value.relativePath ? '/' + page.value.relativePath.replace('index.md', '') : '/'
)
</script>

<style scoped>
.dock-wrapper {
  position: fixed;
  bottom: 2rem;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 1000;
  pointer-events: none; /* Let clicks pass through wrapper */
}

.dock-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 10px 15px -3px rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  pointer-events: auto; /* Re-enable clicks */
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

:global(.dark) .dock-container {
  background: rgba(20, 20, 20, 0.85);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}

.dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
  min-width: 60px;
  position: relative;
}

.dock-item:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--vp-c-text-1);
  transform: translateY(-2px);
}

:global(.dark) .dock-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dock-item.active {
  color: var(--vp-c-text-1);
  background: rgba(0, 0, 0, 0.03);
}

:global(.dark) .dock-item.active {
  background: rgba(255, 255, 255, 0.05);
}

.dock-item.active::after {
  content: '';
  position: absolute;
  bottom: 4px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--vp-c-accent);
}

.icon {
  font-family: var(--vp-font-family-mono);
  font-size: 0.65rem;
  opacity: 0.6;
  margin-bottom: 2px;
}

.label {
  font-family: var(--vp-font-family-base);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: -0.01em;
}

.dock-item.special .label {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.divider {
  width: 1px;
  height: 24px;
  background-color: var(--vp-c-divider);
  margin: 0 0.25rem;
}

/* Responsive: Shrink on mobile */
@media (max-width: 600px) {
  .dock-container {
    padding: 0.5rem 1rem;
    gap: 0.25rem;
    border-radius: 16px;
    width: 90%;
    justify-content: space-between;
  }

  .dock-item {
    min-width: auto;
    padding: 0.5rem;
  }

  .icon {
    display: none; /* Hide numbers on mobile */
  }

  .divider {
    display: none;
  }
}
</style>
