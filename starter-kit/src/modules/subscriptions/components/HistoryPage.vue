<template>
  <v-row>
    <v-col sm="12" md="5" lg="5" >

      <VCard class="pa-6 pt-4">
        <div class="text-h5 mb-4">
          Текущий тариф
        </div>
        <div class="mb-6">

          <div class="d-flex justify-space-between mb-1">
            <span class="text-body-1">Тарифный план:</span>
            <strong class="text-h6 font-weight-bold text-medium-emphasis">Профессионал</strong>
          </div>
          <div class="d-flex justify-space-between mb-3">
            <span class="text-body-1">Период подписки:</span>
            <strong class="text-h6 font-weight-bold text-medium-emphasis">1 месяц</strong>
          </div>
          <div class="d-flex justify-space-between">
            <span class="text-body-1">Окончание подписки:</span>
            <strong class="text-h6 font-weight-bold text-medium-emphasis">19.11.1980</strong>
          </div>
        </div>
        <div class="d-flex gap-2 justify-center mt-4">
          <crud-button-primary size="small"  :to="{ name: 'SelectPlanePage' }">
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
import { provide } from 'vue'
import { useI18n } from 'vue-i18n'
import CrudList from '@crudui/components/list/CrudList.vue'
import type { UseCrudDataListReturn } from '@crudui/providers/useCrudDataList'
import { useCrudDataList } from '@crudui/providers/useCrudDataList'

const { t } = useI18n()

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
</script>
