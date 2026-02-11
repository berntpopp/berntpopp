<template>
  <div class="dock-wrapper">
    <nav class="dock-container" aria-label="Main navigation">
      <a
        href="/"
        class="dock-item"
        :class="{ active: currentPath === '/' }"
        :aria-current="currentPath === '/' ? 'page' : undefined"
      >
        <span class="icon">01</span>
        <span class="label">Home</span>
      </a>
      <div class="divider"></div>
      <a
        href="/about"
        class="dock-item"
        :class="{ active: currentPath.includes('/about') }"
        :aria-current="currentPath.includes('/about') ? 'page' : undefined"
      >
        <span class="icon">02</span>
        <span class="label">Story</span>
      </a>
      <a
        href="/publications"
        class="dock-item"
        :class="{ active: currentPath.includes('/publications') }"
        :aria-current="currentPath.includes('/publications') ? 'page' : undefined"
      >
        <span class="icon">03</span>
        <span class="label">Science</span>
      </a>
      <a
        href="/photography"
        class="dock-item"
        :class="{ active: currentPath.includes('/photography') }"
        :aria-current="currentPath.includes('/photography') ? 'page' : undefined"
      >
        <span class="icon">04</span>
        <span class="label">Art</span>
      </a>
      <a
        href="/cv"
        class="dock-item"
        :class="{ active: currentPath.includes('/cv') }"
        :aria-current="currentPath.includes('/cv') ? 'page' : undefined"
      >
        <span class="icon">05</span>
        <span class="label">CV</span>
      </a>
      <div class="divider"></div>
      <a
        href="/impressum"
        class="dock-item secondary"
        :class="{ active: currentPath.includes('/impressum') }"
        :aria-current="currentPath.includes('/impressum') ? 'page' : undefined"
      >
        <span class="icon">i</span>
        <span class="label">Legal</span>
      </a>
      <button
        class="dock-item theme-toggle"
        aria-label="Toggle dark mode"
        @click="toggleAppearance"
      >
        <span class="icon">
          <!-- Sun icon (shown in dark mode = switch to light) -->
          <svg
            class="icon-sun"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <!-- Moon icon (shown in light mode = switch to dark) -->
          <svg
            class="icon-moon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </span>
        <span class="label">Theme</span>
      </button>
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

function toggleAppearance() {
  const html = document.documentElement
  html.classList.toggle('dark')
  // Persist preference
  const isDarkNow = html.classList.contains('dark')
  localStorage.setItem('vitepress-theme-appearance', isDarkNow ? 'dark' : 'light')
}
</script>

<style scoped>
.dock-wrapper {
  position: fixed;
  bottom: 2rem;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem);
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
  background: rgba(255, 255, 255, 0.92);
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

.dock-item.active {
  color: var(--vp-c-text-1);
  background: rgba(0, 0, 0, 0.03);
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

/* Secondary dock items (Legal) */
.dock-item.secondary {
  min-width: 48px;
  padding: 0.5rem 0.75rem;
}

.dock-item.secondary .label {
  font-size: 0.75rem;
  font-style: italic;
}

.dock-item.secondary .icon {
  font-style: italic;
}

/* Theme toggle */
.theme-toggle {
  min-width: 48px;
  padding: 0.5rem 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
}

.theme-toggle .icon {
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Sun/Moon icons: CSS-only toggle avoids SSR hydration mismatch */
.icon-sun {
  display: none;
}

.icon-moon {
  display: block;
}

.theme-toggle .label {
  font-size: 0.75rem;
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

/* Responsive: Tablet */
@media (max-width: 768px) {
  .dock-container {
    padding: 0.5rem 1rem;
    gap: 0.35rem;
  }

  .dock-item {
    min-width: auto;
    padding: 0.5rem 0.75rem;
  }
}

/* Responsive: Mobile */
@media (max-width: 600px) {
  .dock-container {
    padding: 0.5rem 0.75rem;
    gap: 0;
    border-radius: 16px;
    width: calc(100% - 1.5rem);
    max-width: 420px;
    justify-content: space-evenly;
  }

  .dock-item {
    min-width: 44px; /* WCAG touch target */
    min-height: 44px;
    padding: 0.4rem 0.25rem;
  }

  .dock-item.secondary {
    min-width: 36px;
    padding: 0.4rem 0.15rem;
  }

  .theme-toggle {
    min-width: 36px;
    padding: 0.4rem 0.15rem;
  }

  .icon {
    display: none; /* Hide numbers on mobile */
  }

  .theme-toggle .icon {
    display: flex; /* Keep theme icon visible on mobile */
  }

  .label {
    font-size: 0.75rem;
  }

  /* Secondary items: icon-only on mobile */
  .dock-item.secondary .label {
    font-size: 0.65rem;
  }

  .theme-toggle .label {
    display: none; /* Icon-only for theme toggle on mobile */
  }

  .divider {
    display: none;
  }
}

/* Responsive: Small mobile (iPhone SE, etc.) */
@media (max-width: 390px) {
  .dock-container {
    padding: 0.4rem 0.5rem;
    width: calc(100% - 1rem);
  }

  .dock-item {
    min-width: 40px;
    padding: 0.35rem 0.15rem;
  }

  .dock-item.secondary {
    min-width: 32px;
  }

  .theme-toggle {
    min-width: 32px;
  }

  .label {
    font-size: 0.7rem;
  }

  .dock-item.secondary .label {
    display: none; /* Icon-only for Legal on very small screens */
  }

  .dock-item.secondary .icon {
    display: flex; /* Show "i" icon instead */
    font-size: 0.8rem;
    opacity: 0.8;
    font-style: italic;
  }
}
</style>

<!-- Dark mode overrides (unscoped to work with .dark on <html>) -->
<style>
.dark .dock-container {
  background: rgba(10, 10, 10, 0.98);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.06) inset;
}

.dark .dock-item {
  color: rgba(255, 255, 255, 0.75);
}

.dark .dock-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.dark .dock-item.active {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

.dark .dock-wrapper .icon {
  opacity: 0.8;
}

/* Sun/Moon icon toggle in dark mode */
.dark .icon-sun {
  display: block;
}

.dark .icon-moon {
  display: none;
}
</style>
