<script lang="ts" setup>
import { HorizontalNavGroup, HorizontalNavLink } from '@core/components/templates/helpers/components'
import type { HorizontalNavItems, NavGroup, NavLink } from '@core/components/templates/helpers/types'

defineProps<{
  navItems: HorizontalNavItems
}>()

const resolveNavItemComponent = (item: NavLink | NavGroup) => {
  if ('children' in item)
    return HorizontalNavGroup

  return HorizontalNavLink
}
</script>

<template>
  <ul class="nav-items">
    <Component
      :is="resolveNavItemComponent(item)"
      v-for="(item, index) in navItems"
      :key="index"
      data-allow-mismatch
      :item="item"
    />
  </ul>
</template>

<style lang="scss">
.layout-wrapper.layout-nav-type-horizontal {
  .nav-items {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
