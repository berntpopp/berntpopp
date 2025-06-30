<template>
  <div class="cv-entry">
    <div class="entry-header">
      <h3 class="entry-title">{{ title }}</h3>
      <span class="entry-period">{{ period }}</span>
    </div>
    <div class="entry-body">
      <p class="entry-organization">{{ organization }}</p>
      <p v-if="department" class="entry-department">{{ department }}</p>
      <p v-if="location" class="entry-location">{{ location }}</p>
      <p v-if="details" class="entry-details">{{ details }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  organization: String,
  department: String,
  period: String,
  location: String,
  details: String
})
</script>

<style scoped>
.cv-entry {
  padding: 1.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  margin-bottom: 1rem;
  transition: all 0.2s;
}

.cv-entry:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.entry-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: var(--vp-c-text-1);
}

.entry-period {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

.entry-body p {
  margin: 0 0 0.25rem 0;
}

.entry-organization {
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.entry-department {
  font-size: 0.95rem;
  color: var(--vp-c-text-3);
}

.entry-location {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  font-style: italic;
}

.entry-details {
  margin-top: 0.5rem !important;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .entry-header {
    flex-direction: column;
  }
  
  .entry-period {
    align-self: flex-start;
  }
}
</style>