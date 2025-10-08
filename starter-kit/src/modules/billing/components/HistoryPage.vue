<template>
  <PageTitle>{{ $t('modules.billing.history.pageTitle') }}</PageTitle>
  <crud-list>
    <template #actionsSection>
      <crud-button-primary>Оплатить или изменить тариф</crud-button-primary>
    </template>
    <template #prepend>
      <VAvatar color="secondary" variant="tonal">
        <VIcon :size="22" icon="tabler-clipboard-text" />
      </VAvatar>
    </template>
    <template #default="{ item }">
      <v-list-item-title>
        {{ $t('modules.billing.history.fields.paidAt') }}: {{ formatDate(item.paid_at) }}
      </v-list-item-title>
      <v-list-item-subtitle >
        {{ $t('modules.billing.history.fields.amount') }}: <strong>{{ item.amount }}</strong>
      </v-list-item-subtitle>
    </template>
    <template #append="{ item }">
      <v-chip size="small" :color="getStatusColor(item.status)" variant="tonal">
        {{ item.status }}
      </v-chip>
    </template>
  </crud-list>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import CrudList from '@crudui/components/list/CrudList.vue'
import type { UseCrudDataListReturn } from '@crudui/providers/useCrudDataList'
import { useCrudDataList } from '@crudui/providers/useCrudDataList'
import PageTitle from '@crudui/components/templates/PageTitle.vue'

interface BillingPaymentItem {
  id: string
  amount: string
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
    paid: 'success',
    pending: 'warning',
    failed: 'error',
    refunded: 'info',
  }

  return statusColors[status.toLowerCase()] || 'default'
}

const formatDate = (dateString: string): string => {
  if (!dateString) {
    return '-'
  }
  const date = new Date(dateString)

  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
