<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMeStore } from '@crudui/stores/meStore'
import { useLayoutConfigStore } from '@crudui/components/templates/stores/config'

// @layouts plugin
import { VerticalNavLayout } from '@crudui/components/templates/helpers'

// Components
import UserProfile from '@crudui/components/templates/UserProfile.vue'
import LanguageSwitcher from '@crudui/components/LanguageSwitcher.vue'

// Используем динамическое меню из meStore
const meStore = useMeStore()
const configStore = useLayoutConfigStore()
const { t } = useI18n()

// Преобразуем меню из meStore в формат для VerticalNavLayout
const navItems = computed(() => {
  return meStore.leftMenu
    .map(item => {
      const navItem: any = {
        // item.title уже содержит ключ перевода, передаем его как есть
        title: item.title,

        // Для Iconify используем формат как в full-version
        icon: item.icon ? { icon: `mdi-${item.icon.replace('mdi-', '')}` } : undefined,
      }

      // Если это группа с дочерними элементами
      if (item.childItems && item.childItems.length > 0) {
        navItem.children = item.childItems.map(child => ({
          // child.title уже содержит ключ перевода, передаем его как есть
          title: child.title,
          to: child.name ? { name: child.name } : undefined,

          // Для Iconify используем формат как в full-version
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
  <VerticalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <IconBtn id="vertical-nav-toggle-btn" class="ms-n3 d-lg-none" @click="toggleVerticalOverlayNavActive(true)">
          <VIcon size="26" icon="tabler-menu-2" />
        </IconBtn>

        <!-- Кнопка привязки/отвязки меню для десктопа -->
        <IconBtn
          class="ms-n3 d-none d-lg-block"
          @click="configStore.isVerticalNavCollapsed = !configStore.isVerticalNavCollapsed"
        >
          <VIcon icon="tabler-menu-2" />
        </IconBtn>

        <VSpacer />

        <!-- Language Switcher -->
        <LanguageSwitcher class="me-2" />

        <UserProfile />
      </div>
    </template>

    <!-- 👉 Pages -->
    <slot />
  </VerticalNavLayout>
</template>
