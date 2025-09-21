<script lang="ts" setup>
import navItems from '@crudui/components/templates/navigation/horizontal'

import { themeConfig } from '@themeConfig'

// Components
import UserProfile from '@crudui/components/templates/UserProfile.vue'
import { HorizontalNavLayout } from '@crudui/components/templates/helpers'
import { VNodeRenderer } from '@crudui/components/templates/helpers/VNodeRenderer'
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

      <UserProfile />
    </template>

    <!-- 👉 Pages -->
    <slot />
  </HorizontalNavLayout>
</template>
