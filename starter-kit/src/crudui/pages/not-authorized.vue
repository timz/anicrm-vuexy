<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

definePage({
  meta: {
    layout: 'clean',
    public: true,
  },
})

const handleGoBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="misc-wrapper">
    <div class="text-center">
      <h1 class="text-h1 mb-3">
        403 - Доступ запрещен
      </h1>
      
      <p class="text-body-1 mb-6">
        У вас нет прав для просмотра этой страницы
      </p>
      
      <VBtn 
        @click="handleGoBack"
        color="primary"
      >
        Вернуться на главную
      </VBtn>
    </div>
  </div>
</template>

<style lang="scss">
.misc-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1.5rem;
}
</style>