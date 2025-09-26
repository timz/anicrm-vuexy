<template>
  <CenteredContentWrapper>
    <!-- Основной блок по центру -->
    <VCard :max-width="400" class="text-center pa-8">
      <!-- Заголовок -->
      <div class="mb-8">
        <div class="text-h5 font-weight-bold text-blue-grey-lighten-5">
          Начните пробный период вашего тарифного плана
        </div>
      </div>

      <!-- Блок плана -->
      <div class="plan-block mb-8 d-flex align-center">
        <div class="plan-icon me-4">
          <VIcon
            icon="tabler-rocket"
            size="32"
            color="secondary"
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
      <crud-button-primary block>
        Начать пробный период
      </crud-button-primary>
    </VCard>
  </CenteredContentWrapper>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import CenteredContentWrapper from '@crudui/components/templates/CenteredContentWrapper.vue'
import CrudButtonPrimary from '@core/components/buttons/CrudButtonPrimary.vue'

onMounted(() => {
  // Установка заголовка страницы
  document.title = 'Подписки'
})
</script>

<style scoped>
.plan-block {
  padding: 0;
}

.plan-icon {
  flex-shrink: 0;
}

.plan-info {
  flex: 1;
}
</style>
