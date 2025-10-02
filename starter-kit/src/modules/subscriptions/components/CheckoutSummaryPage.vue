<script setup lang="ts">
import { api } from '@crudui/services/AxiosService'
import type { FormattedPricingPlan } from '@modules/subscriptions/types/pricing'

const router = useRouter()
const route = useRoute()

// Data from route query params
const planCode = computed(() => route.query.plan as string)
const period = computed(() => route.query.period as 'monthly' | 'annual')

// Reactive state
const selectedPlan = ref<FormattedPricingPlan | null>(null)
const promoCode = ref('')
const promoDiscount = ref(0)
const promoError = ref('')
const isValidatingPromo = ref(false)
const loading = ref(false)

// Computed values
const basePrice = computed(() => {
  if (!selectedPlan.value)
    return 0
  return period.value === 'annual'
    ? selectedPlan.value.yearlyPrice
    : selectedPlan.value.monthlyPrice
})

const discountAmount = computed(() => {
  return Math.round(basePrice.value * (promoDiscount.value / 100))
})

const priceAfterDiscount = computed(() => {
  return basePrice.value - discountAmount.value
})

const vat = computed(() => {
  // Assuming VAT is already included in the price
  return Math.round(priceAfterDiscount.value * 0.2)
})

const totalPrice = computed(() => {
  return priceAfterDiscount.value
})

const periodText = computed(() => {
  return period.value === 'annual' ? '1 год' : '1 месяц'
})

// Fetch plan details
const fetchPlanDetails = async () => {
  loading.value = true
  try {
    const response = await api.post('/billing/info')

    if (response.data?.success && response.data?.content?.items) {
      const plan = response.data.content.items.find((p: any) => p.code === planCode.value)

      if (plan) {
        selectedPlan.value = {
          name: plan.title,
          monthlyPrice: Number.parseFloat(plan.price_monthly),
          yearlyPrice: Number.parseFloat(plan.price_annual),
          priceAnnualMonth: plan.info.price_annual_month,
          priceMonthlyYear: plan.info.price_monthly_year,
          highlight: plan.info.highlight,
          active: plan.active,
          features: plan.info.features,
          code: plan.code,
        }
      }
      else {
        // Plan not found, redirect back
        router.push('/select-plane')
      }
    }
  }
  catch (error) {
    console.error('Error fetching plan details:', error)
    router.push('/select-plane')
  }
  finally {
    loading.value = false
  }
}

// Validate promo code
const validatePromoCode = async () => {
  if (!promoCode.value.trim()) {
    promoDiscount.value = 0
    promoError.value = ''
    return
  }

  isValidatingPromo.value = true
  promoError.value = ''

  try {
    // TODO: Replace with actual API endpoint
    const response = await api.post('/subscriptions/validate-promo', {
      code: promoCode.value.trim(),
      plan: planCode.value,
      period: period.value,
    })

    if (response.data?.success) {
      promoDiscount.value = response.data.discount || 0
      promoError.value = ''
    }
    else {
      promoDiscount.value = 0
      promoError.value = response.data?.message || 'Промокод недействителен'
    }
  }
  catch (error: any) {
    promoDiscount.value = 0
    promoError.value = error.response?.data?.message || 'Ошибка проверки промокода'
  }
  finally {
    isValidatingPromo.value = false
  }
}

// Handle payment
const handlePayment = async () => {
  loading.value = true

  try {
    // TODO: Replace with actual checkout endpoint
    const response = await api.post('/subscriptions/checkout', {
      plan: planCode.value,
      period: period.value,
      promo_code: promoCode.value.trim() || undefined,
    })

    if (response.data?.success && response.data?.redirect_url) {
      // Redirect to YooKassa
      window.location.href = response.data.redirect_url
    }
    else {
      console.error('Checkout failed:', response.data)
    }
  }
  catch (error) {
    console.error('Error creating payment:', error)
  }
  finally {
    loading.value = false
  }
}

// Go back to plan selection
const goBack = () => {
  router.push({
    path: '/select-plane',
    query: {
      plan: planCode.value,
      period: period.value,
    },
  })
}

// Lifecycle
onMounted(() => {
  // Validate required query params
  if (!planCode.value || !period.value) {
    router.push('/select-plane')
    return
  }

  fetchPlanDetails()
})
</script>

<template>
  <div class="checkout-summary-page">
    <div class="text-center mb-6">
      <h3 class="text-h3 mb-2">
        <span class="font-weight-bold">Сводка</span> по заказу
      </h3>
      <p class="text-body-1 text-medium-emphasis">
        Проверьте детали заказа перед оплатой
      </p>
    </div>

    <VCard v-if="!loading && selectedPlan" class="pa-6">
      <!-- Plan Information -->
      <div class="mb-6">
        <h5 class="text-h6 mb-4">
          Выбранный тариф
        </h5>
        <div class="bg-grey-100 rounded-lg pa-4">
          <div class="d-flex justify-space-between mb-3">
            <span class="text-body-1">Тарифный план:</span>
            <strong class="text-h6">{{ selectedPlan.name }}</strong>
          </div>
          <div class="d-flex justify-space-between">
            <span class="text-body-1">Период подписки:</span>
            <strong class="text-h6">{{ periodText }}</strong>
          </div>
        </div>
      </div>

      <VDivider class="my-6" />

      <!-- Promo Code -->
      <div class="mb-6">
        <h5 class="text-h6 mb-4">
          Промокод
        </h5>
        <div class="d-flex gap-3">
          <VTextField
            v-model="promoCode"
            label="Введите промокод"
            placeholder="WELCOME10"
            variant="outlined"
            density="comfortable"
            :error-messages="promoError"
            @keyup.enter="validatePromoCode"
          />
          <VBtn
            color="primary"
            variant="tonal"
            :loading="isValidatingPromo"
            @click="validatePromoCode"
          >
            Применить
          </VBtn>
        </div>
        <div v-if="promoDiscount > 0" class="text-success mt-2">
          <VIcon icon="tabler-check" size="20" />
          Скидка {{ promoDiscount }}% применена
        </div>
      </div>

      <VDivider class="my-6" />

      <!-- Price Breakdown -->
      <div class="mb-6">
        <h5 class="text-h6 mb-4">
          Стоимость
        </h5>

        <div class="d-flex justify-space-between mb-3">
          <span class="text-body-1">Стоимость подписки</span>
          <span class="text-h6">{{ basePrice.toLocaleString() }} ₽</span>
        </div>

        <div v-if="promoDiscount > 0" class="d-flex justify-space-between mb-3 text-success">
          <span class="text-body-1">Скидка по промокоду ({{ promoDiscount }}%)</span>
          <span class="text-h6">-{{ discountAmount.toLocaleString() }} ₽</span>
        </div>

        <div class="d-flex justify-space-between mb-3 text-medium-emphasis">
          <span class="text-body-2">НДС включен (20%)</span>
          <span class="text-body-2">{{ vat.toLocaleString() }} ₽</span>
        </div>

        <VDivider class="my-4" />

        <div class="d-flex justify-space-between">
          <span class="text-h6 font-weight-bold">Итого к оплате</span>
          <span class="text-h5 text-primary font-weight-bold">
            {{ totalPrice.toLocaleString() }} ₽
          </span>
        </div>
      </div>

      <VDivider class="my-6" />

      <!-- Terms -->
      <div class="text-body-2 text-medium-emphasis mb-6">
        Продолжая, вы принимаете наши
        <a href="#" class="text-primary">Условия обслуживания</a>
        и
        <a href="#" class="text-primary">Политику конфиденциальности</a>.
      </div>

      <!-- Action Buttons -->
      <div class="d-flex flex-wrap gap-4 justify-space-between">
        <VBtn
          color="secondary"
          variant="tonal"
          size="large"
          @click="goBack"
        >
          <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
          Назад
        </VBtn>

        <VBtn
          color="success"
          size="large"
          :loading="loading"
          @click="handlePayment"
        >
          Перейти к оплате
          <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
        </VBtn>
      </div>
    </VCard>

    <!-- Loading State -->
    <VCard v-else class="pa-6">
      <div class="text-center">
        <VProgressCircular indeterminate color="primary" size="64" />
        <p class="text-body-1 mt-4">
          Загрузка данных...
        </p>
      </div>
    </VCard>
  </div>
</template>

<style lang="scss" scoped>
.checkout-summary-page {
  max-width: 720px;
  margin: 0 auto;
}
</style>
