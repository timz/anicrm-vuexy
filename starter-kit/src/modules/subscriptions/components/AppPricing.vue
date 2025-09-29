<script setup lang="ts">
import type { FormattedPricingPlan } from '@modules/subscriptions/types/pricing'

const props = defineProps<{
  title?: string
  xs?: number | string
  sm?: number | string
  md?: string | number
  lg?: string | number
  xl?: string | number
  pricingPlans: FormattedPricingPlan[]
  loading?: boolean
}>()

const emit = defineEmits<{
  planSelected: [code: string]
}>()

const annualMonthlyPlanPriceToggler = ref(true)

const handlePlanSelect = (plan: FormattedPricingPlan) => {
  if (!plan.active) {
    emit('planSelected', plan.code)
  }
}
</script>

<template>
  <!-- 👉 Title and subtitle -->
  <div class="text-center">
    <h3 class="text-h3 pricing-title mb-2">
      <span class="font-weight-bold">Тарифные</span> планы
    </h3>
    <p class="mb-2 text-subtitle-1">
      Выберите подходящий план для ваших потребностей.
    </p>
  </div>

  <!-- 👉 Annual and monthly price toggler -->

  <div class="d-flex text-body-1 align-center justify-center mx-auto mt-8 mb-6">
    <VLabel for="pricing-plan-toggle" class="cursor-pointer me-3 text-primary">
      Помесячная оплата
    </VLabel>

    <div class="position-relative">
      <VSwitch id="pricing-plan-toggle" v-model="annualMonthlyPlanPriceToggler">
        <template #label>
          <div class="text-body-1 text-primary">
            Оплата за год
          </div>
        </template>
      </VSwitch>

      <div class="save-upto-chip position-absolute align-center d-none d-md-flex gap-1">
        <VIcon icon="tabler-corner-left-down" size="36" class="flip-in-rtl mt-2 text-disabled" />
        <VChip label color="primary" size="small">
          Сэкономьте 25%
        </VChip>
      </div>
    </div>
  </div>

  <!-- SECTION pricing plans -->
  <VRow dense>
    <VCol
      v-for="plan in props.pricingPlans"
      :key="plan.name"
      cols="12"
      :xs="props.xs"
      :sm="props.sm"
      :md="props.md"
      :lg="props.lg"
      :xl="props.xl"
    >
      <!-- 👉  Card -->
      <VCard flat border :class="plan.highlight ? 'border-primary border-opacity-100' : ''">
        <VCardText style="block-size: 1rem" class="text-end">
          <!-- 👉 Popular -->
          <VChip v-show="plan.highlight" label color="primary" size="small">
            Популярный
          </VChip>
        </VCardText>

        <VCardText>
          <!-- 👉 Plan name -->
          <h4 class="text-h4 text-center">
            {{ plan.name }}
          </h4>
          <!-- 👉 Plan price  -->

          <div class="position-relative">
            <div class="d-flex justify-center pt-2 pb-10">
              <h2 class="text-h2 font-weight-bold text-primary">
                {{ annualMonthlyPlanPriceToggler ? plan.priceAnnualMonth : plan.monthlyPrice }} ₽
                <span class="text-body-1">/ мес.</span>
              </h2>
            </div>

            <!-- 👉 Annual Price -->
            <span class="font-weight-bold annual-price-text position-absolute text-disabled pb-4">
              {{ annualMonthlyPlanPriceToggler
                ? (plan.yearlyPrice === 0 ? 'Бесплатно' : `${plan.yearlyPrice} ₽ / год`)
                : (plan.priceMonthlyYear === 0 ? 'Бесплатно' : `${plan.priceMonthlyYear} ₽ / год`)
              }}
            </span>
          </div>

          <!-- 👉 Plan features -->

          <VList class="card-list mb-8" style="min-height: 112px">
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
          <VBtn
            block
            :disabled="plan.active"
            @click="handlePlanSelect(plan)"
          >
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
  inset-block-start: -2rem;
  inset-inline-end: -5rem;
}

.annual-price-text {
  inset-block-end: 3%;
  inset-inline-start: 50%;
  transform: translateX(-50%);
}
</style>
