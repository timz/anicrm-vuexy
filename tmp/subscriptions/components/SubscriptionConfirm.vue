<template>
  <div class="fullscreen flex flex-center">

    <!-- Основной блок по центру -->
    <q-card class="bg-blue-grey-10 subscription-card text-center q-pa-xl" style="max-width: 400px; width: 100%; border-radius: 16px;">
      <!-- Заголовок -->
      <div class="q-mb-lg">
        <div class="text-h6 text-weight-bold text-blue-grey-1">
          Начните пробный период вашего тарифного плана
        </div>
      </div>

      <!-- Блок плана -->
      <div class="plan-block q-mb-lg ">
        <div class="plan-icon">
          <q-icon name="local_fire_department" size="32px" color="red-6" />
        </div>
        <div class="plan-info text-orange-3 ">
          <div class="text-subtitle1 text-weight-medium ">Professional</div>
          <div class="text-body2 ">14 дней бесплатного пробного периода</div>
        </div>
      </div>

      <!-- Кнопка действия -->
      <q-btn
        unelevated
        color="blue-grey-2"
        label="Начать пробный период"
        class=" text-weight-medium text-blue-grey-9"
        @click="startTrial"
      />
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { setPageTitle } from '@crud/services/PageService'
import { onMounted } from 'vue'

const startTrial = () => {
  // Логика начала пробного периода
  console.log('Начать пробный период')
}

onMounted(() => {
  setPageTitle('Подписки')
})
</script>

<style scoped>

.subscription-card {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.card-header h2 {
  color: #ffffff;
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 30px 0;
  line-height: 1.4;
}

.plan-block {
  margin-bottom: 30px;
  display: flex;
  align-items: center;

}

.plan-icon {
  flex-shrink: 0;
}

.plan-info {
  flex: 1;
  text-align: left;
}

.plan-info h3 {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.plan-info p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  margin: 0;
  line-height: 1.3;
}

@media (max-width: 600px) {
  .subscription-card {
    padding: 30px 20px;
    margin: 0 10px;
  }

  .card-header h2 {
    font-size: 16px;
  }

  .plan-block {
    padding: 16px;
  }
}
</style>
