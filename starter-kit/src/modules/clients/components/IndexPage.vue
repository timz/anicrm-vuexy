<template>
  <PageTitle>Клиенты</PageTitle>

  <crud-table>
    <template #actionsSection>
      <create-button v-if="meStore.userCan('clients_create')" :to="{ name: 'clientCreate' }" />
    </template>
    <template #filterForm>
      <v-col cols="12" md="4">
        <crud-input v-model="dataListProvider.filter.value.title"  />
      </v-col>
      <v-col cols="12" md="4">
        <crud-date-range-picker-2 v-model="dataListProvider.filter.value.created"  />
      </v-col>
      <v-col cols="12" md="4">
        <CrudSelector
          v-model="dataListProvider.filter.value.adv_id"
          multiple
          data-url="/adv-sources/list"
          
        />
      </v-col>
    </template>

    <template #body-cell-created="{ value }">
      {{ formatTableDate(value) }}
    </template>

    <template #body-cell-edited="{ value }">
      {{ formatTableDate(value) }}
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
import { useTimezone } from '@crudui/composables/useTimezone'
import PageTitle from '@crudui/components/templates/PageTitle.vue'
import CrudSelector from '@core/components/Inputs/CrudSelector.vue'

const { formatTableDate } = useTimezone()

interface ClientItem {
  id: number | null
  title: string
  created: string
  edited: string
  [key: string]: unknown
}

const meStore = useMeStore()

const columns = [
  {
    name: 'title',
    required: true,
    label: 'Название',
    align: 'left',
    field: 'title',
    sortable: true,
  },
  {
    name: 'created',
    label: 'Создан',
    align: 'left',
    field: 'created',
    sortable: true,
    style: 'width: 120px',
  },
  {
    name: 'edited',
    label: 'Правки',
    align: 'left',
    field: 'edited',
    sortable: true,
    style: 'width: 120px',
  },
]

const dataListProvider: UseCrudDataListReturn<ClientItem> = useCrudDataList<ClientItem>({
  mode: 'table',
  urlBase: '/clients',
  columns,
  rowActions: [
    ...createStandardActions<ClientItem>({
      edit: {
        routeName: 'clientEdit',
        show: () => meStore.userCan('clients_update'),
      },
      delete: {
        show: () => meStore.userCan('clients_delete'),
        onDelete: async (item: ClientItem) => {
          // The actual deletion is handled by CrudTable component
          // This handler can be used for additional logic if needed
          console.log('Deleting item:', item.id)
        },
      },
    }),
  ],
})

provide('dataListProvider', dataListProvider)
</script>
