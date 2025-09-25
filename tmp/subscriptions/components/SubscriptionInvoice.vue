<script setup lang="ts">
import { ref } from 'vue'

const promoCode = ref('')

const invoiceData = {
  title: 'Ваш заказ',
  subscription: {
    name: 'Professional',
    monthlyPrice: '1 578,54 ₽',
    totalMonths: 24,
    totalPrice: '37 884,84 ₽'
  },
  summary: {
    total: '37 106,39 ₽',
    originalPrice: '56 827,26 ₽',
    savings: '19 720,81 ₽'
  }
}

const proceedPayment = () => {
  // Handle payment logic
}
</script>

<template>
  <div class="fullscreen flex flex-center">
    <q-card class="invoice-card bg-blue-grey-10 text-white" style="max-width: 480px; width: 100%; border-radius: 16px;">
      <!-- Header -->
      <q-card-section class="invoice-header">
        <h5 class="text-h5 text-weight-medium q-ma-none text-blue-grey-2">
          {{ invoiceData.title }}
        </h5>
      </q-card-section>

      <q-separator dark />

      <!-- Subscription Info -->
      <q-card-section class="subscription-section">
        <div class="subscription-info">
          <div class="subscription-icon">
            <q-icon name="flash_on" size="md" color="orange" />
          </div>
          <div class="subscription-details">
            <div class="subscription-name text-h6 text-weight-medium">
              {{ invoiceData.subscription.name }}
            </div>
            <div class="subscription-monthly text-white text-caption">
              {{ invoiceData.subscription.totalMonths }} месяца × {{ invoiceData.subscription.monthlyPrice }}
            </div>
          </div>
          <div class="subscription-price text-h6 text-weight-medium">
            {{ invoiceData.subscription.totalPrice }}
          </div>
        </div>
      </q-card-section>



      <q-separator dark />



      <!-- Final Total -->
      <q-card-section class="final-section">
        <div class="original-price text-strike text-blue-grey-2 text-right">
          {{ invoiceData.summary.originalPrice }}
        </div>
        <div class="final-total-row">
          <div class="final-total-label">
            <div class="text-h6 text-weight-bold text-white">Итого к оплате</div>
            <div class="security-info">
              <q-icon name="lock" size="xs" color="positive" class="q-mr-xs" />
              <span class="text-caption text-positive">Безопасная оплата</span>
            </div>
          </div>
          <div class="final-total-price">
            <div class="text-h5 text-weight-bold text-white">{{ invoiceData.summary.total }}</div>
            <div class="savings text-caption text-orange">
              <q-icon name="local_fire_department" size="xs" class="q-mr-xs" />
              Экономия {{ invoiceData.summary.savings }}
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- Continue Button -->
      <q-card-section class="continue-section text-center">
        <q-btn
          unelevated
          color="blue-grey-2"
          label="Продолжить"
          class="q-my-sm text-weight-medium text-blue-grey-9"
          @click="proceedPayment"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped lang="scss">

.invoice-card {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.invoice-header {
  padding: 24px 24px 16px;
}

.subscription-section {
  padding: 20px 24px;
}

.subscription-info {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.subscription-icon {
  background: #fff3e0;
  border-radius: 8px;
  padding: 12px;
  min-width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.subscription-details {
  flex: 1;
}

.subscription-name {
  line-height: 1.3;
  margin-bottom: 4px;
}

.subscription-period {
  font-size: 14px;
  margin-bottom: 2px;
}

.subscription-next,
.subscription-monthly {
  font-size: 12px;
  line-height: 1.3;
}

.subscription-price {
  text-align: right;
}

.continue-section {
  padding: 0 24px 20px;
}

.continue-btn {
  border-radius: 8px;
  height: 48px;
}

.promo-section {
  padding: 16px 24px;
}

.promo-code-container {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 6px;
  padding: 8px 12px;
}

.promo-text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.summary-section {
  padding: 20px 24px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  &.summary-total {
    padding-top: 8px;
    border-top: 1px solid #e0e0e0;
    margin-top: 8px;
  }
}

.final-section {
  padding: 20px 24px;
}

.original-price {
  font-size: 14px;
  margin-bottom: 8px;
}

.final-total-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.final-total-label {
  .security-info {
    display: flex;
    align-items: center;
    margin-top: 4px;
  }
}

.final-total-price {
  text-align: right;

  .savings {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 4px;
  }
}

.footer-section {
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
}

.powered-by {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
