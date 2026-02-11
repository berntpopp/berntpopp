<!-- .vitepress/theme/Layout.vue -->
<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import Hero from './components/Hero.vue'
import Dock from './components/Dock.vue'
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

    <!-- Global Dock inserted at layout bottom -->
    <template #layout-bottom>
      <Dock />
    </template>
  </Layout>
</template>

<style scoped>
/* Hide default home content when using custom hero */
:deep(.VPHome) {
  display: none;
}
</style>
