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

        <div v-if="!props.loading && props.pricingPlans.length > 0">
          <AppPricing :pricing-plans="props.pricingPlans" :active-plan-info="props.activePlanInfo" md="4" @plan-selected="handlePlanSelectedWithPeriod" />
        </div>

        <div v-else class="d-flex justify-center align-center" style="min-height: 400px">
          <VProgressCircular indeterminate color="primary" size="64" />
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import type { ActivePlanInfoDto, FormattedPricingPlan } from '../types/pricing'
import AppPricing from './AppPricing.vue'
import DialogCloseBtn from '@crudui/components/dialogs/DialogCloseBtn.vue'

interface Props {
  modelValue: boolean
  pricingPlans: FormattedPricingPlan[]
  loading: boolean
  activePlanInfo: ActivePlanInfoDto | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const router = useRouter()

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
      operation_type: 'plan_change',
    },
  })
}
</script>
