<template>
  <PageTitle>{{ $t('modules.deals.title') }}</PageTitle>
  <crud-table>
    <template #actionsSection>
      <create-button
        v-if="meStore.userCan('deals_create')"
        :to="{ name: 'dealCreate' }"
      />
    </template>
    <template #filterForm>
      <v-col cols="12" md="4">
        <crud-input
          v-model="dataListProvider.filter.value.id"
          type="number"
          label="ID"
        />
      </v-col>
      <v-col cols="12" md="4">
        <crud-input
          v-model="dataListProvider.filter.value.initial_contact"
          :label="$t('modules.deals.filter.contact')"
        />
      </v-col>
      <v-col cols="12" md="4">
        <crud-input
          v-model="dataListProvider.filter.value.status"
          :label="$t('modules.deals.filter.status')"
        />
      </v-col>
      <v-col cols="12" md="4">
        <crud-input
          v-model="dataListProvider.filter.value.client_name"
          :label="$t('modules.deals.filter.client')"
        />
      </v-col>
      <v-col cols="12" md="4">
        <crud-input
          v-model="dataListProvider.filter.value.amount"
          type="number"
          :label="$t('modules.deals.filter.amount')"
        />
      </v-col>
      <v-col cols="12" md="4">
        <crud-input
          v-model="dataListProvider.filter.value.event_type_title"
          :label="$t('modules.deals.filter.eventType')"
        />
      </v-col>
    </template>

    <!-- Custom formatting for amount column -->
    <template #body-cell-amount="{ value }">
      {{ value ? `${parseFloat(value).toLocaleString("ru-RU")} ₽` : "" }}
    </template>

    <!-- Custom formatting for margin column -->
    <template #body-cell-margin="{ value }">
      {{ value ? `${parseFloat(value).toLocaleString("ru-RU")} ₽` : "" }}
    </template>

    <!-- Custom formatting for event_date column -->
    <template #body-cell-event_date="{ value }">
      {{ value ? new Date(value).toLocaleDateString("ru-RU") : "" }}
    </template>

    <!-- Custom formatting for status column -->
    <template #body-cell-status="{ value }">
      {{ getStatusLabel(value) }}
    </template>

    <!-- Custom formatting for created column -->
    <template #body-cell-created="{ value }">
      {{ value ? new Date(value).toLocaleDateString("ru-RU") : "" }}
    </template>
  </crud-table>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { useMeStore } from '@crudui/stores/meStore'
import CrudTable from '@crudui/components/table/CrudTable.vue'
import type { UseCrudDataListReturn } from '@crudui/providers/useCrudDataList'
import { useCrudDataList } from '@crudui/providers/useCrudDataList'
import CrudInput from '@crudui/components/Inputs/CrudInput.vue'
import CreateButton from '@crudui/components/buttons/CreateButton.vue'
import { createStandardActions } from '@crudui/components/table/buttons/rowActionsFactory'
import PageTitle from '@crudui/components/templates/PageTitle.vue'

interface DealItem {
  id: number | null
  client_id: number | null
  lead_id?: number | null
  client_kid_id?: number | null
  event_type_id: number | null
  amount: string | null
  margin: string | null
  status: string | null
  event_date: string | null
  rejection_reason_id?: number | null
  closed?: string | null
  adv_source_id: number | null
  initial_contact: string
  initial_contact_type: string
  created: string | null
  edited: string | null
  client_name?: string | null
  client_kid_name?: string | null
  event_type_title?: string | null
  rejection_reason_title?: string | null
  adv_source_title?: string | null
}

const meStore = useMeStore()
const { t } = useI18n()

const statusOptions = [
  { label: t('modules.deals.statuses.new'), value: 'new' },
  { label: t('modules.deals.statuses.inProgress'), value: 'in_progress' },
  { label: t('modules.deals.statuses.hot'), value: 'hot' },
  { label: t('modules.deals.statuses.cold'), value: 'cold' },
  { label: t('modules.deals.statuses.closed'), value: 'closed' },
  { label: t('modules.deals.statuses.cancelled'), value: 'cancelled' },
  { label: t('modules.deals.statuses.rejected'), value: 'rejected' },
]

const getStatusLabel = (status: string | null): string => {
  const option = statusOptions.find(opt => opt.value === status)

  return option ? option.label : status || ''
}

const columns = [
  {
    name: 'id',
    required: true,
    label: t('modules.deals.table.id'),
    align: 'left',
    field: 'id',
    sortable: true,
    headerStyle: 'width: 80px',
  },
  {
    name: 'client_name',
    required: false,
    label: t('modules.deals.table.client'),
    align: 'left',
    field: 'client_name',
    sortable: true,
    headerStyle: 'width: 150px',
  },
  {
    name: 'event_type_title',
    required: false,
    label: t('modules.deals.table.event'),
    align: 'left',
    field: 'event_type_title',
    sortable: true,
    headerStyle: 'width: 150px',
  },
  {
    name: 'amount',
    required: false,
    label: t('modules.deals.table.amount'),
    align: 'right',
    field: 'amount',
    sortable: true,
    headerStyle: 'width: 120px',
  },
  {
    name: 'margin',
    required: false,
    label: t('modules.deals.table.margin'),
    align: 'right',
    field: 'margin',
    sortable: true,
    headerStyle: 'width: 120px',
  },
  {
    name: 'event_date',
    required: false,
    label: t('modules.deals.table.eventDate'),
    align: 'center',
    field: 'event_date',
    sortable: true,
    headerStyle: 'width: 140px',
  },
  {
    name: 'status',
    required: false,
    label: t('modules.deals.table.status'),
    align: 'center',
    field: 'status',
    sortable: true,
    headerStyle: 'width: 120px',
  },
  {
    name: 'initial_contact',
    required: false,
    label: t('modules.deals.table.contact'),
    align: 'left',
    field: 'initial_contact',
    sortable: true,
    headerStyle: 'width: 150px',
  },
  {
    name: 'created',
    required: false,
    label: t('modules.deals.table.created'),
    align: 'center',
    field: 'created',
    sortable: true,
    headerStyle: 'width: 120px',
  },
]

// Создаем dataListProvider
const dataListProvider: UseCrudDataListReturn<DealItem> =
  useCrudDataList<DealItem>({
    mode: 'table',
    urlBase: '/deals',
    pk: 'id',
    columns,
    rowActions: [
      ...createStandardActions<DealItem>({
        edit: {
          routeName: 'dealEdit',
          show: () => meStore.userCan('deals_update'),
        },
        delete: {
          show: () => meStore.userCan('deals_delete'),
          onDelete: (item: DealItem) => {
            console.log('Delete item:', item.id)
          },
        },
      }),
    ],
  })

provide('dataListProvider', dataListProvider)
</script>
