<!-- .vitepress/theme/Layout.vue -->
<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import Hero from './components/Hero.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <div v-if="frontmatter.home" class="custom-home">
    <Layout>
      <template #layout-top>
        <Hero />
      </template>
    </Layout>
  </div>
  <Layout v-else />
</template>

<style scoped>
.custom-home :deep(.VPHome) {
  display: none;
}
</style>