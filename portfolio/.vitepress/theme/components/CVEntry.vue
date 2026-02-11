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
      <div v-if="details" class="entry-details">
        <ul v-if="Array.isArray(details)" class="details-list">
          <li v-for="(detail, index) in details" :key="index">{{ detail }}</li>
        </ul>
        <p v-else>{{ details }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  organization: {
    type: String,
    default: '',
  },
  department: {
    type: String,
    default: '',
  },
  period: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  details: {
    type: [String, Array],
    default: null,
  },
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

.entry-details p {
  margin: 0;
}

.details-list {
  margin: 0;
  padding-left: 1.5rem;
  list-style: none;
}

.details-list li {
  position: relative;
  padding-left: 1rem;
  margin-bottom: 0.25rem;
}

.details-list li:before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--vp-c-brand);
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
