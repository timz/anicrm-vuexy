<template>
  <VDialog
    :model-value="modelValue"
    persistent
    class="v-dialog-xl"
    scrollable
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="$emit('update:modelValue', false)" />

    <!-- Dialog Content -->
    <VCard>
      <VCardText class="pt-8">
        <div class="text-center mb-6">
          <h3 class="text-h3 mb-2">
            <span class="font-weight-bold">Выберите</span> тарифный план
          </h3>
        </div>

        <div v-if="!loading && pricingPlans.length > 0">
          <AppPricing :pricing-plans="pricingPlans" md="4" @plan-selected="handlePlanSelectedWithPeriod" />
        </div>

        <div v-else class="d-flex justify-center align-center" style="min-height: 400px">
          <VProgressCircular indeterminate color="primary" size="64" />
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ActivePlanInfoDto, FormattedPricingPlan, PricingPlan } from '../types/pricing'
import AppPricing from './AppPricing.vue'
import DialogCloseBtn from '@crudui/components/dialogs/DialogCloseBtn.vue'
import { secureApi } from '@crudui/services/AxiosService'

interface Props {
  modelValue: boolean
  activePlanInfo: ActivePlanInfoDto | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const router = useRouter()

// Состояние загрузки тарифов
const loading = ref(false)
const pricingPlans = ref<FormattedPricingPlan[]>([])

// Загрузка информации о тарифах
const fetchPricingPlans = async () => {
  loading.value = true
  try {
    const response = await secureApi.post('/billing/plans-info')

    if (response.data?.success && response.data?.content?.items) {
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
    console.error('Ошибка при загрузке тарифов:', error)
  }
  finally {
    loading.value = false
  }
}

// Загрузка тарифов при открытии диалога
watch(() => props.modelValue, (newValue) => {
  if (newValue && pricingPlans.value.length === 0) {
    fetchPricingPlans()
  }
})

// Обработчик выбора тарифа
const handlePlanSelectedWithPeriod = (data: { code: string; period: 'monthly' | 'annual' }) => {
  // Закрываем диалог
  emit('update:modelValue', false)

  // Переходим на страницу оплаты
  router.push({
    path: '/subscriptions/payment-summary',
    query: {
      plan: data.code,
      period: data.period,
    },
  })
}
</script>
