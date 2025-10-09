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
            <strong class="text-h6 font-weight-bold text-medium-emphasis">{{ getBillingCycleLabel(activePlanInfo.billing_cycle) }}</strong>
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
          <crud-button-primary
            v-if="activePlanInfo?.billing_cycle !== 'trial'"
            size="small"
            :to="{
              name: 'PaymentSummaryPage',
              query: {
                plan: activePlanInfo?.plan_code,
                period: activePlanInfo?.billing_cycle,
              },
            }"
          >
            Продлить текущий
          </crud-button-primary>
          <crud-button-primary size="small"   :to="{ name: 'SelectPlanePage' }">
            Изменить тариф
          </crud-button-primary>
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
import { onMounted, provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ActivePlanInfoDto } from '../types/pricing'
import CrudList from '@crudui/components/list/CrudList.vue'
import type { UseCrudDataListReturn } from '@crudui/providers/useCrudDataList'
import { useCrudDataList } from '@crudui/providers/useCrudDataList'
import { secureApi } from '@crudui/services/AxiosService'

const { t } = useI18n()

// Данные о текущем тарифе
const activePlanInfo = ref<ActivePlanInfoDto | null>(null)

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

// Функция для загрузки информации о текущем тарифе
const loadActivePlanInfo = async () => {
  try {
    const response = await secureApi.post('/billing/active-plan-info')
    if (response.data?.content) {
      activePlanInfo.value = response.data.content
    }
  }
  catch (error) {
    console.error('Ошибка при загрузке информации о тарифе:', error)
  }
}

// Маппинг billing_cycle в читаемый формат
const getBillingCycleLabel = (cycle: string): string => {
  const cycleLabels: Record<string, string> = {
    monthly: '1 месяц',
    yearly: '1 год',
    trial: 'Пробный период',
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

// Загрузка данных при монтировании компонента
onMounted(() => {
  loadActivePlanInfo()
})
</script>
