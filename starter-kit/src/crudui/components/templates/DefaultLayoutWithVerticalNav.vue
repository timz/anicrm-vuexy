<script lang="ts" setup>
import navItems from '@crudui/components/templates/navigation/vertical'

// Components
import UserProfile from '@crudui/components/templates/UserProfile.vue'

// @layouts plugin
import { VerticalNavLayout } from '@crudui/components/templates/helpers'
</script>

<template>
  <VerticalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <IconBtn
          id="vertical-nav-toggle-btn"
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon
            size="26"
            icon="tabler-menu-2"
          />
        </IconBtn>

        <VSpacer />
        <UserProfile />
      </div>
    </template>

    <!-- 👉 Pages -->
    <slot />
  </VerticalNavLayout>
</template>
