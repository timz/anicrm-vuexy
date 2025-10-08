<template>
  <PageTitle>{{ $t('modules.billing.history.pageTitle') }}</PageTitle>
  <crud-table />
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { useI18n } from 'vue-i18n'
import CrudTable from '@crudui/components/table/CrudTable.vue'
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

// Создаем dataListProvider без действий
const dataListProvider: UseCrudDataListReturn<BillingPaymentItem> = useCrudDataList<BillingPaymentItem>({
  mode: 'table',
  urlBase: '/billing/history',
  pk: 'id',
  columns,
  rowActions: [], // Нет действий, как требовалось
})

provide('dataListProvider', dataListProvider)
</script>
