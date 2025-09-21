<template>
  <PageTitle>Сотрудники</PageTitle>
  <crud-table>
    <template #actionsSection>
      <crud-button-primary
        v-if="meStore.userCan('workers_create')"
        label="{{ ('common.create') }}"
        :to="{ name: 'workerCreate' }"
      >
        Создать
      </crud-button-primary>
    </template>
    <template #filterForm>
      <v-col cols="12" md="4">
        <crud-input v-model="dataListProvider.filter.value.name" label="ФИО" />
      </v-col>
      <v-col cols="12" md="3">
        <crud-select
          v-model="dataListProvider.filter.value.is_outside"
          label="Внешний сотрудник"
          :items="[
            { title: 'Все', value: null },
            { title: 'Да', value: true },
            { title: 'Нет', value: false },
          ]"
        />
      </v-col>
    </template>

    <!-- Custom formatting for is_outside column -->
    <template #body-cell-is_outside="{ value }">
      {{ value ? "Да" : "Нет" }}
    </template>

    <!-- Custom formatting for created column -->
    <template #body-cell-created="{ value }">
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
import CrudButtonPrimary from '@crudui/components/buttons/CrudButtonPrimary.vue'
import { createStandardActions } from '@crudui/components/table/buttons/rowActionsFactory'
import { useTimezone } from '@crudui/composables/useTimezone'
import CrudSelect from '@crudui/components/Inputs/CrudSelect.vue'
import PageTitle from '@crudui/components/templates/PageTitle.vue'

interface WorkerItem {
  id: number | null
  mobile: string
  is_outside: boolean
  name: string
  created: string
}

const meStore = useMeStore()
const { formatTableDate } = useTimezone()

const columns = [
  {
    name: 'name',
    required: true,
    label: 'ФИО',
    align: 'left',
    field: 'name',
    sortable: true,
  },
  {
    name: 'mobile',
    required: false,
    label: 'Телефон',
    align: 'left',
    field: 'mobile',
    sortable: true,
  },
  {
    name: 'is_outside',
    required: false,
    label: 'Внешний',
    align: 'center',
    field: 'is_outside',
    sortable: true,
    headerStyle: 'width: 100px',
  },
  {
    name: 'created',
    required: false,
    label: 'Создан',
    align: 'center',
    field: 'created',
    sortable: true,
    headerStyle: 'width: 150px',
  },
]

// Создаем dataListProvider
const dataListProvider: UseCrudDataListReturn<WorkerItem> =
  useCrudDataList<WorkerItem>({
    mode: 'table',
    urlBase: '/workers',
    pk: 'id',
    columns,
    rowActions: [
      ...createStandardActions<WorkerItem>({
        edit: {
          routeName: 'workerEdit',
          show: () => meStore.userCan('workers_update'),
        },
        delete: {
          show: () => meStore.userCan('workers_delete'),
          onDelete: (item: WorkerItem) => {
            console.log('Delete item:', item.id)
          },
        },
      }),
    ],
  })

provide('dataListProvider', dataListProvider)
</script>
