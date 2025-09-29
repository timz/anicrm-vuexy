<script setup lang="ts">
import AppPricing from '@modules/subscriptions/components/AppPricing.vue'
import AppStepper from '@/crudui/components/templates/AppStepper.vue'
import { api } from '@crudui/services/AxiosService'
import type { FormattedPricingPlan, PricingPlan } from '@modules/subscriptions/types/pricing'

const selectedPeriod = ref('monthly')
const pricingPlans = ref<FormattedPricingPlan[]>([])
const selectedPricingPlan = ref<FormattedPricingPlan | null>(null)
const loading = ref(false)
const activeStep = ref(0)

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

const handlePlanSelectedWithPeriod = (data: { code: string; period: 'monthly' | 'annual' }) => {
  const newPlan = findPlanByCode(data.code)
  if (newPlan) {
    selectedPricingPlan.value = newPlan
    selectedPeriod.value = data.period
    // Move to step 2
    activeStep.value = 1
  }
}

const stepperItems = [
  {
    title: 'Выбор тарифа',
    subtitle: 'Выберите тариф и период оплаты'
  },
  {
    title: 'Сводка',
    subtitle: 'Проверьте данные перед оплатой'
  }
]

onMounted(() => {
  fetchPricingPlans()
})
</script>

<template>
  <div class="payment-page">
    <VContainer>
      <!-- Stepper -->
      <VCard class="mb-6">
        <VCardText>
          <h4 class="text-h4 mb-4">Оформление подписки</h4>
          <AppStepper
            v-model:current-step="activeStep"
            :items="stepperItems"
            class="stepper-icon-step-bg"
          />
        </VCardText>

        <VDivider />

        <VCardText>
          <!-- Stepper content -->
          <VWindow
            v-model="activeStep"
            class="disable-tab-transition"
          >
            <!-- Step 1: Выбор тарифа и периода -->
            <VWindowItem :value="0">
              <div class="pa-4">
                <h4 class="text-h4 mb-2">
                  Оплата подписки
                </h4>
                <div class="text-body-1 mb-4">
                  Выберите вариант продления подписки или измените текущий план
                </div>

                <!-- AppPricing component directly in step 1 -->
                <AppPricing
                  md="4"
                  :pricing-plans="pricingPlans"
                  :loading="loading"
                  @plan-selected="handlePlanSelectedWithPeriod"
                />
              </div>
            </VWindowItem>

            <!-- Step 2: Сводка -->
            <VWindowItem :value="1">
              <div class="pa-4">
                <h5 class="text-h5 mb-4">Сводка по заказу</h5>

                <!-- Информация о выбранном тарифе -->
                <div class="mb-4">
                  <div class="bg-grey-100 rounded-lg pa-4 mb-4">
                    <div class="d-flex justify-space-between mb-2">
                      <span>Тарифный план:</span>
                      <strong>{{ selectedPricingPlan?.name || 'Не выбран' }}</strong>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span>Период подписки:</span>
                      <strong>{{ selectedPeriod === 'annual' ? '1 год' : '1 месяц' }}</strong>
                    </div>
                  </div>
                </div>

                <!-- Итоговая стоимость -->
                <div class="my-5">
                  <div class="d-flex justify-space-between mb-2">
                    <span>Стоимость подписки</span>
                    <h6 class="text-h6">
                      {{ selectedPeriod === 'annual'
                        ? (selectedPricingPlan?.yearlyPrice || '0')
                        : (selectedPricingPlan?.monthlyPrice || '0') }} ₽
                    </h6>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span>НДС (20%)</span>
                    <h6 class="text-h6">
                      {{ selectedPeriod === 'annual'
                        ? Math.round((selectedPricingPlan?.yearlyPrice || 0) * 0.2)
                        : Math.round((selectedPricingPlan?.monthlyPrice || 0) * 0.2) }} ₽
                    </h6>
                  </div>
                  <VDivider class="my-4" />
                  <div class="d-flex justify-space-between">
                    <span class="font-weight-medium">Итого</span>
                    <h6 class="text-h6 text-primary">
                      {{ selectedPeriod === 'annual'
                        ? Math.round((selectedPricingPlan?.yearlyPrice || 0) * 1.2)
                        : Math.round((selectedPricingPlan?.monthlyPrice || 0) * 1.2) }} ₽
                    </h6>
                  </div>
                </div>

                <div class="text-body-2 text-medium-emphasis">
                  Продолжая, вы принимаете наши Условия обслуживания и Политику конфиденциальности.
                </div>
              </div>
            </VWindowItem>
          </VWindow>

          <!-- Navigation buttons -->
          <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-4">
            <VBtn
              color="secondary"
              variant="tonal"
              :disabled="activeStep === 0"
              @click="activeStep--"
            >
              <VIcon
                icon="tabler-arrow-left"
                start
                class="flip-in-rtl"
              />
              Назад
            </VBtn>

            <VBtn
              v-if="activeStep === 0"
              color="primary"
              @click="activeStep++"
            >
              Далее
              <VIcon
                icon="tabler-arrow-right"
                end
                class="flip-in-rtl"
              />
            </VBtn>

            <VBtn
              v-else
              color="success"
              block
            >
              Перейти к оплате
              <VIcon
                icon="tabler-arrow-right"
                end
                class="flip-in-rtl"
              />
            </VBtn>
          </div>
        </VCardText>
      </VCard>

      <!-- Старый блок с формой оплаты удален, так как перенесен в степпер -->
    </VContainer>
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