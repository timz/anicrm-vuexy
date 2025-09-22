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
        403 - {{ $t('errors.accessDenied') }}
      </h1>

      <p class="text-body-1 mb-6">
        {{ $t('errors.noPermission') }}
      </p>

      <VBtn
        color="primary"
        @click="handleGoBack"
      >
        {{ $t('errors.returnHome') }}
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
