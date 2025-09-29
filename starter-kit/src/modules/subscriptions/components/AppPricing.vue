<script setup lang="ts">
import { api } from '@crudui/services/AxiosService'

interface Pricing {
  title?: string
  xs?: number | string
  sm?: number | string
  md?: string | number
  lg?: string | number
  xl?: string | number
}

interface PricingPlan {
  id: number
  code: string
  title: string
  price_monthly: string
  price_annual: string
  visible: boolean
  info: {
    icon: string
    features: string[]
    highlight: boolean
    action_backend: {
      link: string
      text: string
      style: string
    }
    price_annual_month: number
    price_monthly_year: number
  }
  active: boolean
}

const props = defineProps<Pricing>()

const annualMonthlyPlanPriceToggler = ref(true)
const pricingPlans = ref<any[]>([])
const loading = ref(false)

const fetchPricingPlans = async () => {
  loading.value = true
  try {
    const response = await api.post('/billing/info')

    if (response.data?.success && response.data?.content?.items) {
      pricingPlans.value = response.data.content.items.map((plan: PricingPlan) => ({
        name: plan.title,
        monthlyPrice: Number.parseFloat(plan.price_monthly),
        yearlyPrice: Number.parseFloat(plan.price_annual),
        priceAnnualMonth: plan.info.price_annual_month,
        priceMonthlyYear: plan.info.price_monthly_year,
        isPopular: plan.info.highlight,
        current: plan.active,
        features: plan.info.features,
        code: plan.code,
      }))
    }
  }
  catch (error) {
    console.error('Error fetching pricing plans:', error)
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPricingPlans()
})
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
    <VCol v-for="plan in pricingPlans" :key="plan.name" v-bind="props" cols="12">
      <!-- 👉  Card -->
      <VCard flat border :class="plan.isPopular ? 'border-primary border-opacity-100' : ''">
        <VCardText style="block-size: 1rem" class="text-end">
          <!-- 👉 Popular -->
          <VChip v-show="plan.isPopular" label color="primary" size="small">
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
            <span
              class="font-weight-bold annual-price-text position-absolute text-disabled pb-4"
            >
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
            :disabled="plan.current"
            color="primary"
            variant="flat"
            :active="false"
          >
            {{ plan.current ? 'Ваш текущий план' : 'Выбрать' }}
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
