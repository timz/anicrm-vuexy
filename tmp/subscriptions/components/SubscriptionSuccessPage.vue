<template>
  <div class="fullscreen flex flex-center ">
    <q-card class="bg-blue-grey-10 success-card text-center q-pa-xl" style="max-width: 400px; width: 100%; border-radius: 16px;">
      <!-- Success icon with decorative stars -->
      <div class="relative-position q-mb-lg">
        <!-- Stars/decorative elements -->
        <q-icon
          name="star"
          color="positive"
          size="md"
          class="absolute star-1"
          style="top: -10px; left: 60px;"
        />
        <q-icon
          name="star"
          color="warning"
          size="sm"
          class="absolute star-2"
          style="top: 20px; right: 50px;"
        />
        <q-icon
          name="star"
          color="orange"
          size="xs"
          class="absolute star-3"
          style="bottom: 10px; left: 40px;"
        />
        <q-icon
          name="star"
          color="accent"
          size="xs"
          class="absolute star-4"
          style="bottom: 30px; right: 30px;"
        />
        <q-icon
          name="star"
          color="positive"
          size="sm"
          class="absolute star-5"
          style="top: 50px; left: 20px;"
        />
        <q-icon
          name="star"
          color="warning"
          size="xs"
          class="absolute star-6"
          style="bottom: -5px; right: 60px;"
        />

        <!-- Main success icon -->
        <div class="success-icon-container">
          <q-avatar size="80px" color="blue-grey-8" text-color="white">
            <q-icon  name="check" size="40px" />
          </q-avatar>
        </div>
      </div>

      <!-- Success message -->
      <div class="q-mb-lg">
        <div class="text-h6 text-weight-bold text-blue-grey-1 q-mb-xs">
          Заказ подтверждён
        </div>
        <div class="text-body2 text-orange-3">
          Спасибо! Запрос успешно обработан.
        </div>
      </div>

      <!-- Continue button -->
      <q-btn
        unelevated
        color="blue-grey-2"
        label="Продолжить"
        class=" text-weight-medium text-blue-grey-9"
        @click="handleContinue"
      />
    </q-card>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue'
import {setPageTitle} from '@crud/services/PageService'

onMounted(() => {
  setPageTitle('Подписка оформлена')
})

const handleContinue = () => {
  // Здесь можно добавить логику перехода или закрытия окна
  console.log('Continue clicked')
}
</script>

<style scoped>
.success-card {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.success-icon-container {
  position: relative;
  z-index: 10;
}

.star-1, .star-2, .star-3, .star-4, .star-5, .star-6 {
  z-index: 5;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.star-1 {
  animation: sparkle 2s ease-in-out infinite;
  animation-delay: 0s;
}

.star-2 {
  animation: sparkle 2s ease-in-out infinite;
  animation-delay: 0.3s;
}

.star-3 {
  animation: sparkle 2s ease-in-out infinite;
  animation-delay: 0.6s;
}

.star-4 {
  animation: sparkle 2s ease-in-out infinite;
  animation-delay: 0.9s;
}

.star-5 {
  animation: sparkle 2s ease-in-out infinite;
  animation-delay: 1.2s;
}

.star-6 {
  animation: sparkle 2s ease-in-out infinite;
  animation-delay: 1.5s;
}
</style>
