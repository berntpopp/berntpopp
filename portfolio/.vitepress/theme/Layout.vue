<!-- .vitepress/theme/Layout.vue -->
<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import Hero from './components/Hero.vue'
import { useSeo } from './useSeo.js'

const { Layout } = DefaultTheme
const { frontmatter } = useData()

// Initialize SEO enhancement
useSeo()
</script>

<template>
  <Layout>
    <template v-if="frontmatter.home" #layout-top>
      <Hero />
    </template>
  </Layout>
</template>

<style scoped>
/* Hide default home content when using custom hero */
:deep(.VPHome) {
  display: none;
}
</style>
