<script lang="ts" setup>
import { useLayoutConfigStore } from '@core/components/templates/stores/config'
import { layoutConfig } from '@core/components/templates/helpers'
import { VNodeRenderer } from '@crudui/components/templates/helpers/VNodeRenderer'
import LanguageSwitcher from '@crudui/components/LanguageSwitcher.vue'
import UserProfile from '@crudui/components/templates/UserProfile.vue'

const configStore = useLayoutConfigStore()

// SECTION: Loading Indicator
const isFallbackStateActive = ref(false)
const refLoadingIndicator = ref<any>(null)

// watching if the fallback state is active and the refLoadingIndicator component is available
watch(
  [isFallbackStateActive, refLoadingIndicator],
  () => {
    if (isFallbackStateActive.value && refLoadingIndicator.value)
      refLoadingIndicator.value.fallbackHandle()

    if (!isFallbackStateActive.value && refLoadingIndicator.value)
      refLoadingIndicator.value.resolveHandle()
  },
  { immediate: true },
)
// !SECTION
</script>

<template>
  <AppLoadingIndicator ref="refLoadingIndicator" />

  <div class="layout-wrapper layout-boxed">
    <div class="layout-content-wrapper">
      <!-- 👉 navbar -->
      <header
        class="layout-navbar ma-4"
        :class="[{ 'navbar-blur': configStore.isNavbarBlurEnabled }]"
      >
        <div class="navbar-content-container boxed-container">
          <div class="d-flex h-100 align-center">
            <!-- 👉 Logo -->
            <div class="app-logo d-flex align-center gap-x-3">
              <VNodeRenderer :nodes="layoutConfig.app.logo" />
            </div>

            <VSpacer />

            <!-- Language Switcher -->
            <LanguageSwitcher class="me-2" />

            <UserProfile :short-menu="true" />
          </div>
        </div>
      </header>

      <!-- 👉 Pages -->
      <main class="layout-page-content">
        <div class="page-content-container boxed-container">
          <RouterView v-slot="{ Component }">
            <Suspense :timeout="0" @fallback="isFallbackStateActive = true" @resolve="isFallbackStateActive = false">
              <Component :is="Component" />
            </Suspense>
          </RouterView>
        </div>
      </main>
    </div>
  </div>
</template>

<style lang="scss">
@use "@styles/variables/template" as variables;
@use "@crudui/styles/base/placeholders/index" as *;
@use "@core/styles/mixins";

.layout-wrapper.layout-boxed {
  .layout-content-wrapper {
    display: flex;
    flex-direction: column;
    min-block-size: 100dvh;
  }

  .boxed-container {
    max-inline-size: 1200px;
    margin-inline: auto;
    padding-inline: 1rem;
  }

  .layout-navbar {
    z-index: variables.$layout-vertical-nav-layout-navbar-z-index;
    position: sticky;
    inset-block-start: 0;

    .navbar-content-container {
      block-size: variables.$layout-vertical-nav-navbar-height;
      background-color: rgb(var(--v-theme-surface));
      border-radius: variables.$default-layout-with-vertical-nav-navbar-footer-roundness;

      @extend %default-layout-vertical-nav-floating-navbar-and-sticky-elevated-navbar-scrolled;
    }

    &.navbar-blur .navbar-content-container {
      @extend %blurry-bg;
    }
  }

  .layout-page-content {
    padding-block: 1.5rem;
  }
}
</style>
