<template>
  <div class="centered-content-wrapper">
    <div :style="{ minWidth: `${minWidth}` }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  minWidth?: string
}

withDefaults(defineProps<Props>(), {
  minWidth: '320px',
})
</script>

<style scoped>
.centered-content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  min-height: calc(100vh - 118px);
}

@media (max-width: 600px) {
  .centered-content-wrapper {
    padding: 1rem;
  }
}
</style>
