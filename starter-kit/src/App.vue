<script setup lang="ts">
import { useTheme } from 'vuetify'
import ScrollToTop from '@crudui/components/ScrollToTop.vue'
import initCore from '@crudui/utils/initCore'
import { initConfigStore, useConfigStore } from '@crudui/stores/config'
import { hexToRgb } from '@crudui/utils/colorConverter'
import NotificationSystem from '@crudui/components/templates/NotificationSystem.vue'

const { global } = useTheme()

// ℹ️ Sync current theme with initial loader theme
initCore()
initConfigStore()

const configStore = useConfigStore()
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView />

      <ScrollToTop />
      <NotificationSystem />
    </VApp>
  </VLocaleProvider>
</template>
