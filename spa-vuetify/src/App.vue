<template>
  <component :is="currentLayout">
    <router-view />
  </component>
  <NotificationSystem />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayoutDefault from '@crud/layouts/MainLayoutDefault.vue'
import AuthLayoutDefault from '@crud/layouts/AuthLayoutDefault.vue'
import NotificationSystem from '@crud/components/NotificationSystem.vue'

const route = useRoute()

const currentLayout = computed(() => {
  const layoutName = route.meta?.layout as string
  
  switch (layoutName) {
    case 'auth':
      return AuthLayoutDefault
    case 'clean':
      return 'div' // Простой div для чистого layout
    default:
      return MainLayoutDefault
  }
})
</script>
