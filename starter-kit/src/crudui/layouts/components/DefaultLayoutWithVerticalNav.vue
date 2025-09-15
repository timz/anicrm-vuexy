<script lang="ts" setup>
import navItems from '@/crudui/navigation/vertical'

// Components
import UserProfile from '@/crudui/layouts/components/UserProfile.vue'

// @layouts plugin
import {VerticalNavLayout} from '@layouts'
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

        <VSpacer/>
        <UserProfile/>
      </div>
    </template>

    <!-- 👉 Pages -->
    <slot/>

  </VerticalNavLayout>
</template>
