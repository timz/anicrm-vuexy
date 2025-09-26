<template>
  <div class="subscription-wrapper">
    <!-- Основной блок по центру -->
    <VCard
      :max-width="400"
      width="100%"
      color="blue-grey-darken-4"
      class="subscription-card text-center pa-12"
      rounded="xl"
    >
      <!-- Заголовок -->
      <div class="mb-8">
        <div class="text-h6 font-weight-bold text-blue-grey-lighten-5">
          Начните пробный период вашего тарифного плана
        </div>
      </div>

      <!-- Блок плана -->
      <div class="plan-block mb-8 d-flex align-center">
        <div class="plan-icon mr-4">
          <VIcon
            icon="mdi-fire"
            size="32"
            color="red-darken-1"
          />
        </div>
        <div class="plan-info text-left">
          <div class="text-subtitle-1 font-weight-medium text-orange-lighten-2">
            Professional
          </div>
          <div class="text-body-2 text-orange-lighten-2">
            14 дней бесплатного пробного периода
          </div>
        </div>
      </div>

      <!-- Кнопка действия -->
      <VBtn
        variant="flat"
        color="blue-grey-lighten-4"
        class="font-weight-medium text-blue-grey-darken-4"
        block
        @click="startTrial"
      >
        Начать пробный период
      </VBtn>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const startTrial = () => {
  // Логика начала пробного периода
  console.log('Начать пробный период')
}

onMounted(() => {
  // Установка заголовка страницы
  document.title = 'Подписки'
})
</script>

<style scoped>
.subscription-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  min-height: calc(100vh - 118px);
}

.subscription-card {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
  z-index: 1;
}

.plan-block {
  padding: 0;
}

.plan-icon {
  flex-shrink: 0;
}

.plan-info {
  flex: 1;
}

@media (max-width: 600px) {
  .subscription-card {
    padding: 30px 20px;
    margin: 0 10px;
  }
}
</style>
