<script setup lang="ts">
import type { FormattedPricingPlan } from '@modules/subscriptions/types/pricing'

const props = defineProps<{
  md?: string | number
  pricingPlans: FormattedPricingPlan[]
}>()

const emit = defineEmits<{
  planSelected: [data: { code: string; period: 'monthly' | 'annual' }]
}>()

const annualMonthlyPlanPriceToggler = ref(false)

const handlePlanSelect = (plan: FormattedPricingPlan) => {
  const period = annualMonthlyPlanPriceToggler.value ? 'annual' : 'monthly'

  emit('planSelected', { code: plan.code, period })
}
</script>

<template>
  <div class="d-flex align-center justify-center mx-auto mt-8 mb-6">
    <VLabel for="pricing-plan-toggle" class="cursor-pointer me-3 text-primary text-h5"> За месяц </VLabel>

    <div class="position-relative">
      <VSwitch id="pricing-plan-toggle" v-model="annualMonthlyPlanPriceToggler" class="large-switch">
        <template #label>
          <div class="text-h5 text-primary">За год</div>
        </template>
      </VSwitch>

      <div class="save-upto-chip position-absolute align-center d-none d-md-flex gap-1">
        <VChip label color="primary" size="small"> Сэкономьте 25% </VChip>
        <VIcon icon="tabler-corner-right-down" size="36" class="mt-2 text-disabled" />
      </div>
    </div>
  </div>

  <!-- SECTION pricing plans -->
  <VRow dense>
    <VCol v-for="plan in props.pricingPlans" :key="plan.name" cols="12" :md="props.md">
      <!-- 👉  Card -->
      <VCard flat border :class="plan.highlight ? 'border-primary border-opacity-100' : ''">
        <VCardText style="block-size: 1rem" class="text-end">
          <!-- 👉 Popular -->
          <VChip v-show="plan.highlight" label color="primary" size="small"> Популярный </VChip>
        </VCardText>

        <VCardText>
          <!-- 👉 Plan name -->
          <h4 class="text-h4 text-center">
            {{ plan.name }}
          </h4>
          <!-- 👉 Plan price  -->

          <div class="position-relative">
            <div class="text-center d-flex justify-center align-center pb-10">
              <template v-if="!annualMonthlyPlanPriceToggler">
                <!-- МЕСЯЧНАЯ ОПЛАТА -->
                <h2 class="text-h3 font-weight-bold text-primary mb-2">
                  {{ plan.monthlyPrice.toLocaleString('ru-RU') }} ₽
                  <span class="text-body-1 text-disabled">/месяц</span>
                </h2>
              </template>

              <template v-else>
                <!-- ГОДОВАЯ ОПЛАТА -->
                <h2 class="text-h3 font-weight-bold text-primary mb-2">
                  {{ plan.yearlyPrice.toLocaleString('ru-RU') }} ₽
                  <span class="text-body-1 text-disabled">/год</span>
                </h2>
              </template>
            </div>

            <!-- 👉 Дополнительная информация -->
            <div class="annual-price-text position-absolute text-center" style="width: 100%">
              <template v-if="!annualMonthlyPlanPriceToggler">
                <!-- При месячной оплате показываем годовой эквивалент -->
                <div class="text-body-1 text-disabled">
                  или {{ (plan.monthlyPrice * 12).toLocaleString('ru-RU') }} ₽ в год
                </div>
              </template>

              <template v-else>
                <!-- При годовой оплате показываем экономию -->
                <div class="d-flex flex-column align-center gap-1">
                  <template v-if="plan.yearlyPrice === 0">
                    <!-- Бесплатный план -->
                    <div class="text-body-2 font-weight-bold text-success">Бесплатно</div>
                  </template>
                  <template v-else>
                    <!-- Перечеркнутая оригинальная цена -->
                    <div class="text-body-1 text-decoration-line-through">
                      Вместо {{ plan.priceMonthlyYear.toLocaleString('ru-RU') }} ₽
                    </div>

                    <!-- Экономия -->
                    <div class="text-body-1 font-weight-bold text-success">
                      Экономия {{ (plan.monthlyPrice * 12 - plan.yearlyPrice).toLocaleString('ru-RU') }} ₽
                    </div>
                  </template>
                </div>
              </template>
            </div>
          </div>

          <!-- 👉 Plan features -->

          <VList class="card-list mb-8 mt-2" style="min-height: 112px">
            <VListItem v-for="feature in plan.features" :key="feature">
              <template #prepend>
                <VIcon
                  size="16"
                  icon="tabler-circle-check-filled"
                  color="rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity))"
                />
              </template>

              <VListItemTitle class="text-body-1">
                {{ feature }}
              </VListItemTitle>
            </VListItem>
          </VList>

          <!-- 👉 Plan actions -->
          <VBtn block @click="handlePlanSelect(plan)">
            {{ plan.active ? 'Ваш текущий план' : 'Выбрать' }}
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
  <!-- !SECTION  -->
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.5rem;
}

.save-upto-chip {
  inset-block-start: -2.25rem;
  inset-inline-end: 1rem;
}

.annual-price-text {
  inset-block-end: 0%;
  inset-inline-start: 50%;
  transform: translateX(-50%);
  min-height: 40px;
}

.large-switch {
  :deep(.v-switch__track) {
    height: 24px;
    width: 42px;
  }

  :deep(.v-switch__thumb) {
    height: 18px;
    width: 18px;
  }

  :deep(.v-selection-control__input) {
    height: 24px;
    width: 42px;
  }
}
</style>
