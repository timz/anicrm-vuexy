<template>
  <v-row>
    <v-col sm="12" md="5" lg="5" >

      <VCard class="pa-6 pt-4">
        <div class="text-h5 mb-4">
          Текущий тариф
        </div>
        <div v-if="activePlanInfo" class="mb-6">

          <div class="d-flex justify-space-between mb-1">
            <span class="text-body-1">Тарифный план:</span>
            <strong class="text-h6 font-weight-bold text-medium-emphasis">{{ activePlanInfo.plan_title }}</strong>
          </div>
          <div class="d-flex justify-space-between mb-3">
            <span class="text-body-1">Период подписки:</span>
            <strong class="text-h6 font-weight-bold text-medium-emphasis">{{ getBillingCycleLabel(activePlanInfo.billing_cycle, activePlanInfo.is_trial) }}</strong>
          </div>
          <div class="d-flex justify-space-between">
            <span class="text-body-1">Окончание подписки:</span>
            <strong class="text-h6 font-weight-bold text-medium-emphasis">{{ formatEndDate(activePlanInfo.ends_at) }}</strong>
          </div>
        </div>
        <div v-else class="mb-6">
          <v-skeleton-loader type="list-item-three-line" />
        </div>
        <div class="d-flex gap-2 justify-center mt-4">
          <VBtn @click="handleDirectRenew">
            {{ renewButtonLabel }}
          </VBtn>

          <VBtn @click="isChangeSubscriptionDialogVisible = true">
            Изменить тариф
          </VBtn>

          <ChangeSubscriptionDialog
            v-model="isChangeSubscriptionDialogVisible"
            :active-plan-info="activePlanInfo"
            :pricing-plans="pricingPlans"
            :loading="loadingPlans"
          />
        </div>
      </VCard>

    </v-col>
    <v-col sm="12" md="7" lg="7">
      <crud-list>
        <template #actionsSection>
          <div class="text-h5">
            {{ $t('modules.billing.history.pageTitle') }}
          </div>
        </template>
        <template #prepend>
          <VAvatar color="secondary" variant="tonal">
            <VIcon :size="22" icon="tabler-clipboard-text" />
          </VAvatar>
        </template>
        <template #default="{ item }">
          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ formatDate(item.paid_at) }}
          </v-list-item-subtitle>
        </template>
        <template #append="{ item }">
          <div class="flex-d flex-column flex-col">
            <v-chip size="small" :color="getStatusColor(item.status)" variant="tonal">
              {{ getStatusLabel(item.status) }}
            </v-chip>
            <div class="font-weight-bold text-right text-subtitle-1">
              {{ Number(item.amount).toLocaleString('ru-RU') }} ₽
            </div>
          </div>
        </template>
      </crud-list>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ActivePlanInfoDto, FormattedPricingPlan, PricingPlan } from '../types/pricing'
import CrudList from '@crudui/components/list/CrudList.vue'
import type { UseCrudDataListReturn } from '@crudui/providers/useCrudDataList'
import { useCrudDataList } from '@crudui/providers/useCrudDataList'
import { secureApi } from '@crudui/services/AxiosService'
import ChangeSubscriptionDialog from './ChangeSubscriptionDialog.vue'
import { useRouter } from 'vue-router'

const { t } = useI18n()

// Данные о текущем тарифе
const activePlanInfo = ref<ActivePlanInfoDto | null>(null)

// Данные о тарифах
const pricingPlans = ref<FormattedPricingPlan[]>([])
const loadingPlans = ref(false)

const isChangeSubscriptionDialogVisible = ref(false)
const router = useRouter()

// Динамическая подпись кнопки продления в зависимости от типа и периода подписки
const renewButtonLabel = computed(() => {
  if (!activePlanInfo.value) {
    return 'Продлить'
  }

  // Если пробный тариф или месячная подписка - продлить на месяц
  if (activePlanInfo.value.is_trial || activePlanInfo.value.billing_cycle === 'monthly') {
    return 'Продлить на месяц'
  }

  // Если годовая подписка - продлить на год
  if (activePlanInfo.value.billing_cycle === 'yearly') {
    return 'Продлить на год'
  }

  return 'Продлить'
})

interface BillingPaymentItem {
  id: string
  amount: number
  status: string
  paid_at: string
}

// Создаем dataListProvider для списка
const dataListProvider: UseCrudDataListReturn<BillingPaymentItem> = useCrudDataList<BillingPaymentItem>({
  mode: 'list',
  urlBase: '/billing/history',
  pk: 'id',
  columns: [],
  rowActions: [],
})

provide('dataListProvider', dataListProvider)

// Helper functions
// Преобразование billing_cycle из API формата в формат query параметров
const convertBillingCycleToQueryPeriod = (billingCycle: string): string => {
  // API возвращает 'yearly', но мы используем 'annual' в query
  return billingCycle === 'yearly' ? 'annual' : billingCycle
}

const getStatusColor = (status: unknown): string => {
  const statusColors: Record<string, string> = {
    pending: 'warning',
    succeeded: 'success',
    failed: 'error',
  }

  return statusColors[status.toLowerCase()] || 'default'
}

const getStatusLabel = (status: string): string => {
  const statusKey = `modules.billing.history.statuses.${status.toLowerCase()}`

  return t(statusKey)
}

const formatDate = (dateString: string): string => {
  if (!dateString) {
    return '-'
  }
  const date = new Date(dateString)

  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Функция для загрузки информации о тарифах и текущей подписке
const fetchPricingPlans = async () => {
  loadingPlans.value = true
  try {
    const response = await secureApi.post('/billing/plans-info')

    if (response.data?.success && response.data?.content?.items) {
      // Маппинг тарифных планов
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

      // Извлечение информации о текущей подписке
      if (response.data.content.current_subscription) {
        activePlanInfo.value = response.data.content.current_subscription
      }
    }
  }
  catch (error) {
    console.error('Ошибка при загрузке тарифов:', error)
  }
  finally {
    loadingPlans.value = false
  }
}

// Маппинг billing_cycle в читаемый формат
const getBillingCycleLabel = (cycle: string, isTrial?: boolean): string => {
  // Если это пробный период, возвращаем соответствующий текст
  if (isTrial) {
    return 'Пробный период'
  }

  const cycleLabels: Record<string, string> = {
    monthly: '1 месяц',
    yearly: '1 год',
  }

  return cycleLabels[cycle] || cycle
}

// Форматирование даты окончания подписки
const formatEndDate = (dateString: string | null): string => {
  if (!dateString) {
    return 'Бессрочно'
  }

  const date = new Date(dateString)

  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// Обработчик прямого продления подписки по текущему тарифу и периоду
const handleDirectRenew = () => {
  if (!activePlanInfo.value) {
    console.error('Информация о текущей подписке недоступна')
    return
  }

  // Переход на страницу подтверждения оплаты с текущими параметрами подписки
  router.push({
    name: 'PaymentSummaryPage',
    query: {
      plan: activePlanInfo.value.plan_code,
      period: convertBillingCycleToQueryPeriod(activePlanInfo.value.billing_cycle),
      operation_type: 'renewal',
    },
  })
}

// Загрузка данных при монтировании компонента
onMounted(() => {
  fetchPricingPlans()
})
</script>
