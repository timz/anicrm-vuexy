<script lang="ts" setup>
const DefaultLayoutWithVerticalNav = defineAsyncComponent(
  () => import('../components/templates/DefaultLayoutWithVerticalNav.vue'),
)

const { layoutAttrs } = useSkins()

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
  <Component v-bind="layoutAttrs" :is="DefaultLayoutWithVerticalNav">
    <AppLoadingIndicator ref="refLoadingIndicator" />

    <RouterView v-slot="{ Component }">
      <Suspense :timeout="0" @fallback="isFallbackStateActive = true" @resolve="isFallbackStateActive = false">
        <Component :is="Component" />
      </Suspense>
    </RouterView>
  </Component>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use '@crudui/styles/default-layout';
</style>
