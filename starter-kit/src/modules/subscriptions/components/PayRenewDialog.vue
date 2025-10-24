<template>
  <VDialog
    :model-value="modelValue"
    persistent
    class="v-dialog-sm"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="$emit('update:modelValue', false)" />

    <!-- Dialog Content -->
    <VCard title="Выберите период продления">
      <VCardText>
        <div v-if="activePlanInfo && !loading && activePlan" class="mb-4">
          <div class="text-body-2 text-medium-emphasis mb-4">
            Текущий тариф: <strong>{{ activePlanInfo.plan_title }}</strong>
          </div>

          <CustomRadios
            v-model:selected-radio="selectedPeriod"
            :radio-content="periodOptions"
          >
            <template #default="{ item }">
              <div class="flex-grow-1">
                <div class="d-flex justify-space-between align-center mb-1">
                  <div class="text-h6">
                    {{ item.title }}
                  </div>
                  <div class="text-h6 text-primary">
                    {{ item.subtitle }}
                  </div>
                </div>
                <p class="text-body-2 mb-0">
                  {{ item.desc }}
                </p>
              </div>
            </template>
          </CustomRadios>
        </div>

        <VSkeletonLoader v-else type="list-item-three-line" />
      </VCardText>

      <VCardText class="d-flex justify-end gap-3 flex-wrap">
        <VBtn
          color="secondary"
          variant="tonal"
          @click="$emit('update:modelValue', false)"
        >
          Отменить
        </VBtn>
        <VBtn
          :disabled="loading || !activePlan"
          :loading="loading"
          @click="handleRenew"
        >
          Продлить
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ActivePlanInfoDto, FormattedPricingPlan } from '../types/pricing'
import type { CustomInputContent } from '@core/utils/types'
import CustomRadios from '@crudui/components/app-form-elements/CustomRadios.vue'
import DialogCloseBtn from '@crudui/components/dialogs/DialogCloseBtn.vue'

interface Props {
  modelValue: boolean
  activePlanInfo: ActivePlanInfoDto | null
  pricingPlans: FormattedPricingPlan[]
  loading: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'renew', period: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Router для навигации
const router = useRouter()

// Выбранный период продления
const selectedPeriod = ref<string>('monthly')

// Поиск активного тарифа по plan_code
const activePlan = computed<FormattedPricingPlan | null>(() => {
  if (!props.activePlanInfo || props.pricingPlans.length === 0) {
    return null
  }

  return props.pricingPlans.find(plan => plan.code === props.activePlanInfo?.plan_code) || null
})

// Опции для выбора периода
const periodOptions = computed<CustomInputContent[]>(() => {
  if (!props.activePlanInfo || !activePlan.value) {
    return []
  }

  const plan = activePlan.value

  return [
    {
      title: 'Месячная подписка',
      subtitle: `${plan.monthlyPrice.toLocaleString('ru-RU')} ₽/мес`,
      desc: `Оплата каждый месяц. Итого ${plan.priceMonthlyYear.toLocaleString('ru-RU')} ₽/год`,
      value: 'monthly',
    },
    {
      title: 'Годовая подписка',
      subtitle: `${plan.yearlyPrice.toLocaleString('ru-RU')} ₽/год`,
      desc: `Выгоднее! ~${plan.priceAnnualMonth.toLocaleString('ru-RU')} ₽/мес`,
      value: 'annual',
    },
  ]
})

// Обработчик продления подписки
const handleRenew = () => {
  // Определяем тип операции: renewal или cycle_change
  // Если выбранный период отличается от текущего billing_cycle - это смена цикла
  const currentCycle = props.activePlanInfo?.billing_cycle
  const selectedCycle = selectedPeriod.value === 'annual' ? 'yearly' : selectedPeriod.value
  const operationType = currentCycle === selectedCycle ? 'renewal' : 'cycle_change'

  // Переход на страницу оплаты с параметрами
  router.push({
    name: 'PaymentSummaryPage',
    query: {
      plan: props.activePlanInfo?.plan_code,
      period: selectedPeriod.value,
      operation_type: operationType,
    },
  })

  // Закрываем диалог
  emit('update:modelValue', false)
}
</script>
