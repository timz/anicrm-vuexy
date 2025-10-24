<script setup lang="ts">
import AppPricing from '@modules/subscriptions/components/AppPricing.vue'
import { secureApi } from '@crudui/services/AxiosService'
import type { FormattedPricingPlan, PricingPlan } from '@modules/subscriptions/types/pricing'

const router = useRouter()

const pricingPlans = ref<FormattedPricingPlan[]>([])
const loading = ref(false)

const findPlanByCode = (code: string): FormattedPricingPlan | null => {
  return pricingPlans.value.find(plan => plan.code === code) || null
}

const fetchPricingPlans = async () => {
  loading.value = true
  try {
    const response = await secureApi.post('/billing/plans-info')

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
    router.push({
      path: '/subscriptions/payment-summary',
      query: {
        plan: data.code,
        period: data.period,
        operation_type: 'plan_change',
      },
    })
  }
}

onMounted(() => {
  fetchPricingPlans()
})
</script>

<template>
  <div class="payment-page">
    <div class="text-center">
      <h3 class="text-h3 mb-2">
        <span class="font-weight-bold">Оформление</span> подписки
      </h3>
    </div>

    <AppPricing md="4" :pricing-plans="pricingPlans" @plan-selected="handlePlanSelectedWithPeriod" />
  </div>
</template>
