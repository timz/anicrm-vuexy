<script setup lang="ts">
import AppPricing from '@modules/subscriptions/components/AppPricing.vue'
import DialogCloseBtn from '@core/components/dialogs/DialogCloseBtn.vue'
import { api } from '@crudui/services/AxiosService'
import type { FormattedPricingPlan, PricingPlan } from '@modules/subscriptions/types/pricing'

const selectedRadio = ref('monthly')
const isPricingPlanDialogVisible = ref(false)
const pricingPlans = ref<FormattedPricingPlan[]>([])
const selectedPricingPlan = ref<FormattedPricingPlan | null>(null)
const loading = ref(false)

const findActivePlan = (): FormattedPricingPlan | null => {
  return pricingPlans.value.find(plan => plan.active === true) || null
}

const findPlanByCode = (code: string): FormattedPricingPlan | null => {
  return pricingPlans.value.find(plan => plan.code === code) || null
}

const fetchPricingPlans = async () => {
  loading.value = true
  try {
    const response = await api.post('/billing/info')

    if (response.data?.success && response.data?.content?.items) {
      // Map pricing plans for display
      pricingPlans.value = response.data.content.items.map((plan: PricingPlan) => ({
        name: plan.title,
        monthlyPrice: Number.parseFloat(plan.price_monthly),
        yearlyPrice: Number.parseFloat(plan.price_annual),
        priceAnnualMonth: plan.info.price_annual_month,
        priceMonthlyYear: plan.info.price_monthly_year,
        highlight: plan.info.highlight,
        active: plan.active,
        features: plan.info.features,
        code: plan.code,
      }))

      // Find and set the active plan from formatted plans
      selectedPricingPlan.value = findActivePlan()
    }
  }
  catch (error) {
    console.error('Error fetching pricing plans:', error)
  }
  finally {
    loading.value = false
  }
}

const handlePlanSelected = (code: string) => {
  const newPlan = findPlanByCode(code)
  if (newPlan) {
    selectedPricingPlan.value = newPlan
    isPricingPlanDialogVisible.value = false
  }
}

onMounted(() => {
  fetchPricingPlans()
})
</script>

<template>
  <div class="payment-page">
    <VContainer>
      <div class="d-flex justify-center align-center payment-card">
        <div class="bg-surface rounded-lg">
          <VRow no-gutters>
            <VCol class="px-8 py-4" cols="12" md="7" :class="$vuetify.display.mdAndUp ? 'border-e' : 'border-b'">
              <h4 class="text-h4 mb-2">
                Оплата подписки
              </h4>
              <div class="text-body-1">
                Выберите вариант продления подписки или измените текущий план
              </div>
              <div class="mt-4 w-100 bg-grey-100 rounded-lg">
                <div class="d-flex align-center gap-2 flex-wrap pa-4">
                  <div>
                    <small>Тарифный план:</small><br>
                    <strong>{{ selectedPricingPlan?.name || 'Не выбран' }}</strong>
                  </div>
                  <v-spacer />
                  <crud-button-secondary @click="isPricingPlanDialogVisible = !isPricingPlanDialogVisible">
                    Изменить
                  </crud-button-secondary>
                </div>
              </div>

              <VRadioGroup
                v-model="selectedRadio"
                class="my-4"
              >
                <VRow dense>
                  <VCol cols="12">
                    <VLabel
                      class="custom-input custom-radio-icon rounded cursor-pointer"
                      :class="selectedRadio === 'monthly' ? 'active' : ''"
                    >
                      <div>
                        <VRadio name="monthly" value="monthly" />
                      </div>
                      <div class="flex">
                        <div>Оплата на 1 месяц</div>
                        <strong>{{ selectedPricingPlan?.monthlyPrice || '0' }} </strong> ₽
                      </div>
                    </VLabel>
                  </VCol>
                  <VCol cols="12">
                    <VLabel
                      class="custom-input custom-radio-icon rounded cursor-pointer"
                      :class="selectedRadio === 'annual' ? 'active' : ''"
                    >
                      <div>
                        <VRadio name="annual" value="annual" />
                      </div>
                      <div class="flex">
                        <div>Оплата на 1 год</div>
                        <strong>{{ selectedPricingPlan?.yearlyPrice || '0' }} </strong>₽
                      </div>
                    </VLabel>
                  </VCol>
                </VRow>
              </VRadioGroup>
            </VCol>

            <VCol class="px-8 py-4" cols="12" md="5">
              <h4 class="text-h4 mb-2">
                Сводка по заказу
              </h4>

              <div class="my-5">
                <div class="d-flex justify-space-between mb-2">
                  <span>Стоимость подписки</span>
                  <h6 class="text-h6">
                    $85.99
                  </h6>
                </div>
                <div class="d-flex justify-space-between">
                  <span>НДС</span>
                  <h6 class="text-h6">
                    $4.99
                  </h6>
                </div>
                <VDivider class="my-4" />
                <div class="d-flex justify-space-between">
                  <span>Итого</span>
                  <h6 class="text-h6">
                    $90.98
                  </h6>
                </div>
              </div>

              <VBtn block color="primary" class="mb-4">
                <template #append>
                  <VIcon icon="tabler-arrow-right" class="flip-in-rtl" />
                </template>
                Перейти к оплате
              </VBtn>

              <div class="text-body-1 mb-2">
                Продолжая, вы принимаете наши Условия обслуживания и Политику конфиденциальности.
              </div>
            </VCol>
          </VRow>
        </div>
      </div>
    </VContainer>

    <!-- Pricing Plan Dialog -->
    <VDialog v-model="isPricingPlanDialogVisible" max-width="960">
      <VCard class="pa-6">
        <AppPricing
          md="4"
          :pricing-plans="pricingPlans"
          :loading="loading"
          @plan-selected="handlePlanSelected"
        />
      </VCard>
      <DialogCloseBtn @click="isPricingPlanDialogVisible = !isPricingPlanDialogVisible" />
    </VDialog>
  </div>
</template>

<style lang="scss" scoped>
.payment-page {
  max-width: 820px;
  margin: 0 auto;
}

.payment-card {
  .custom-radio-icon {
    display: flex;
  }

  .v-label.custom-input {
    padding: 1rem;
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    opacity: 1;
    white-space: normal;

    &:hover {
      border-color: rgba(var(--v-border-color), 0.25);
    }

    &.active {
      border-color: rgb(var(--v-theme-primary));

      .v-icon {
        color: rgb(var(--v-theme-primary)) !important;
      }
    }

    &.custom-radio {
      .v-input__control {
        grid-area: none;
      }
    }

    .v-radio {
      margin-block-start: 0 !important;
    }
  }
}
</style>
