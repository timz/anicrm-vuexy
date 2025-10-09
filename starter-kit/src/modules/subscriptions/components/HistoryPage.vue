<template>
  <PageTitle>{{ $t('modules.billing.history.pageTitle') }}</PageTitle>
  <crud-list>
    <template #actionsSection>
      <crud-button-primary :to="{ name: 'SelectPlanePage' }">
        Оплатить или изменить тариф
      </crud-button-primary>
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
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { useI18n } from 'vue-i18n'
import CrudList from '@crudui/components/list/CrudList.vue'
import type { UseCrudDataListReturn } from '@crudui/providers/useCrudDataList'
import { useCrudDataList } from '@crudui/providers/useCrudDataList'
import PageTitle from '@crudui/components/templates/PageTitle.vue'

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
