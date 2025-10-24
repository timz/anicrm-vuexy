<script setup lang="ts">
import { secureApi } from '@crudui/services/AxiosService'

const router = useRouter()
const route = useRoute()

// Data from route query params
const planCode = computed(() => route.query.plan as string)
const period = computed(() => route.query.period as 'monthly' | 'annual')
const operationType = computed(() => route.query.operation_type as string || 'renewal')

// Reactive state
interface PaymentSummaryData {
  planTitle: string
  price: number
  billingCycle: string
  unspentAmount: number
  totalAmount: number
}

const paymentSummary = ref<PaymentSummaryData | null>(null)
const loading = ref(false)

// Computed values
const basePrice = computed(() => paymentSummary.value?.price || 0)

const vat = computed(() => {
  // Assuming VAT is already included in the price
  return Math.round(basePrice.value * 0.2)
})

const unspentAmount = computed(() => paymentSummary.value?.unspentAmount || 0)

const totalPrice = computed(() => paymentSummary.value?.totalAmount || 0)

const periodText = computed(() => paymentSummary.value?.billingCycle || '')

const showUnspentAmount = computed(() => unspentAmount.value > 0)

// Fetch plan details
const fetchPlanDetails = async () => {
  loading.value = true
  try {
    const response = await secureApi.post('/billing/payment-summary', {
      plan_code: planCode.value,
      billing_cycle: period.value === 'annual' ? 'yearly' : 'monthly',
      operation_type: operationType.value,
    })

    if (response.data?.success && response.data?.content) {
      const data = response.data.content

      paymentSummary.value = {
        planTitle: data.plan_title,
        price: Number.parseFloat(data.price),
        billingCycle: data.billing_cycle,
        unspentAmount: Number.parseFloat(data.unspent_amount),
        totalAmount: Number.parseFloat(data.total_amount),
      }
    }
    else {
      // Plan not found, redirect back
      // router.push('/select-plane')
    }
  }
  catch (error) {
    console.error('Error fetching plan details:', error)
    // router.push('/select-plane')
  }
  finally {
    loading.value = false
  }
}

// Handle payment
const handlePayment = async () => {
  loading.value = true

  try {
    const response = await secureApi.post('/billing/checkout', {
      plan_code: planCode.value,
      billing_cycle: period.value === 'annual' ? 'yearly' : 'monthly',
      operation_type: operationType.value,
    })

    if (response.data?.success && response.data?.content?.payment_url) {
      // Redirect to YooKassa
      window.location.href = response.data.content.payment_url
    }
    else {
      console.error('Checkout failed:', response.data)
      loading.value = false
    }
  }
  catch (error) {
    console.error('Error creating payment:', error)
    loading.value = false
  }
}

onMounted(() => {
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

    <VCard v-if="!loading && paymentSummary" class="pa-6">
      <!-- Plan Information -->
      <div class="mb-6">
        <h4 class="mb-4">
          Выбранный тариф
        </h4>

        <div class="d-flex justify-space-between mb-3">
          <span class="text-body-1">Тарифный план:</span>
          <strong class="text-h6">{{ paymentSummary.planTitle }}</strong>
        </div>
        <div class="d-flex justify-space-between">
          <span class="text-body-1">Период подписки:</span>
          <strong class="text-h6">{{ periodText }}</strong>
        </div>
      </div>

      <VDivider class="my-6" />

      <!-- Price Breakdown -->
      <div class="mb-6">
        <h4 class="mb-4">
          Стоимость
        </h4>

        <div class="d-flex justify-space-between mb-3">
          <span class="text-body-1">Стоимость подписки</span>
          <span class="text-h6">{{ basePrice.toLocaleString() }} ₽</span>
        </div>

        <div class="d-flex justify-space-between mb-3 text-medium-emphasis ">
          <span>НДС включен (20%)</span>
          <span>{{ vat.toLocaleString() }} ₽</span>
        </div>

        <div v-if="showUnspentAmount" class="d-flex justify-space-between mb-3 text-success">
          <span>Остаток от предыдущего тарифа</span>
          <span>{{ unspentAmount.toLocaleString() }} ₽</span>
        </div>

        <VDivider class="my-4" />

        <div class="d-flex justify-space-between">
          <span class="text-h6 font-weight-bold">Итого к оплате</span>
          <span class="text-h5 text-primary font-weight-bold">
            {{ totalPrice.toLocaleString() }} ₽
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex flex-wrap gap-4 justify-center">
        <VBtn color="primary" :loading="loading" @click="handlePayment">
          Перейти к оплате
          <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
        </VBtn>
      </div>

      <!-- Terms -->
      <div class=" text-center text-body-2 text-medium-emphasis mt-6">
        Продолжая, вы принимаете наши
        <a href="#" class="text-primary">Условия обслуживания</a>
        и
        <a href="#" class="text-primary">Политику конфиденциальности</a>.
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
