<!-- .vitepress/theme/Layout.vue -->
<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import Hero from './components/Hero.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <template #layout-top v-if="frontmatter.home">
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