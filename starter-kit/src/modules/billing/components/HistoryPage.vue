<template>
  <PageTitle>{{ $t('modules.billing.history.pageTitle') }}</PageTitle>
  <crud-list>
    <template #list-item="{ item }">
      <div class="d-flex flex-column">
        <v-list-item-title class="d-flex align-center gap-2">
          <v-icon icon="mdi-cash-multiple" size="20" color="primary" />
          <span class="font-weight-medium">{{ $t('modules.billing.history.fields.id') }}: {{ item.id }}</span>
          <v-chip size="small" :color="getStatusColor(item.status)" variant="tonal">
            {{ item.status }}
          </v-chip>
        </v-list-item-title>
        <v-list-item-subtitle class="mt-2 d-flex flex-wrap gap-4">
          <span>
            <v-icon icon="mdi-currency-usd" size="16" class="me-1" />
            {{ $t('modules.billing.history.fields.amount') }}: <strong>{{ item.amount }}</strong>
          </span>
          <span>
            <v-icon icon="mdi-calendar" size="16" class="me-1" />
            {{ $t('modules.billing.history.fields.paidAt') }}: {{ formatDate(item.paid_at) }}
          </span>
        </v-list-item-subtitle>
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

interface BillingPaymentItem {
  id: string
  amount: string
  status: string
  paid_at: string
}

const { t } = useI18n()

const columns = [
  {
    name: 'id',
    required: true,
    label: t('modules.billing.history.fields.id'),
    align: 'left',
    field: 'id',
    sortable: true,
  },
  {
    name: 'amount',
    required: true,
    label: t('modules.billing.history.fields.amount'),
    align: 'left',
    field: 'amount',
    sortable: true,
  },
  {
    name: 'status',
    required: true,
    label: t('modules.billing.history.fields.status'),
    align: 'left',
    field: 'status',
    sortable: true,
  },
  {
    name: 'paid_at',
    required: true,
    label: t('modules.billing.history.fields.paidAt'),
    align: 'left',
    field: 'paid_at',
    sortable: true,
  },
]

// Создаем dataListProvider для списка
const dataListProvider: UseCrudDataListReturn<BillingPaymentItem> = useCrudDataList<BillingPaymentItem>({
  mode: 'list',
  urlBase: '/billing/history',
  pk: 'id',
  columns,
  rowActions: [], // Нет действий, как требовалось
})

provide('dataListProvider', dataListProvider)

// Helper functions
const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'paid': 'success',
    'pending': 'warning',
    'failed': 'error',
    'refunded': 'info',
  }
  return statusColors[status.toLowerCase()] || 'default'
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
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
