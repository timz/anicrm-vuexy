<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMeStore } from '@crudui/stores/meStore'
import { themeConfig } from '@themeConfig'

// Components
import UserProfile from '@crudui/components/templates/UserProfile.vue'
import LanguageSwitcher from '@crudui/components/LanguageSwitcher.vue'
import { HorizontalNavLayout } from '@crudui/components/templates/helpers'
import { VNodeRenderer } from '@crudui/components/templates/helpers/VNodeRenderer'

// Используем динамическое меню из meStore
const meStore = useMeStore()
const { t } = useI18n()

// Преобразуем меню из meStore в формат для HorizontalNavLayout
const navItems = computed(() => {
  return meStore.leftMenu
    .map(item => {
      const navItem: any = {
        title: t(item.title),
        icon: item.icon ? { icon: `mdi-${item.icon.replace('mdi-', '')}` } : undefined,
      }

      // Если это группа с дочерними элементами
      if (item.childItems && item.childItems.length > 0) {
        navItem.children = item.childItems.map(child => ({
          title: t(child.title),
          to: child.name ? { name: child.name } : undefined,
          icon: child.icon ? { icon: `mdi-${child.icon.replace('mdi-', '')}` } : undefined,
        }))
      }
      // Если это обычный пункт меню
      else if (item.path !== '#' && item.name) {
        navItem.to = { name: item.name }
      }

      return navItem
    })
    .filter(item => item.to || (item.children && item.children.length > 0))
})
</script>

<template>
  <HorizontalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->
    <template #navbar>
      <RouterLink to="/" class="app-logo d-flex align-center gap-x-3">
        <VNodeRenderer :nodes="themeConfig.app.logo" />

        <h1 class="app-title font-weight-bold leading-normal text-xl text-capitalize">
          {{ themeConfig.app.title }}
        </h1>
      </RouterLink>
      <VSpacer />

      <!-- Language Switcher -->
      <LanguageSwitcher class="me-2" />

      <UserProfile />
    </template>

    <!-- 👉 Pages -->
    <slot />
  </HorizontalNavLayout>
</template>
