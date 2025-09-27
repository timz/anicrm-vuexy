<template>
  <div class="centered-content-wrapper">
    <div style="min-width: 1200px">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// Универсальный компонент для центрирования контента
// Используется для отображения блоков по центру экрана
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
