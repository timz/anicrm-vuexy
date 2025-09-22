<template>
  <PageTitle>{{ $t('modules.workers.pageTitle') }}</PageTitle>
  <crud-table>
    <template #actionsSection>
      <create-button
        v-if="meStore.userCan('workers_create')"
        :to="{ name: 'workerCreate' }"
      />
    </template>
    <template #filterForm>
      <v-col cols="12" md="4">
        <crud-input v-model="dataListProvider.filter.value.name" />
      </v-col>
      <v-col cols="12" md="3">
        <crud-select
          v-model="dataListProvider.filter.value.is_outside"

          :items="[
            { title: $t('modules.workers.filter.all'), value: null },
            { title: $t('modules.workers.filter.yes'), value: true },
            { title: $t('modules.workers.filter.no'), value: false },
          ]"
        />
      </v-col>
    </template>

    <!-- Custom formatting for is_outside column -->
    <template #body-cell-is_outside="{ value }">
      {{ value ? $t('modules.workers.filter.yes') : $t('modules.workers.filter.no') }}
    </template>

    <!-- Custom formatting for created column -->
    <template #body-cell-created="{ value }">
      {{ formatTableDate(value) }}
    </template>
  </crud-table>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMeStore } from '@crudui/stores/meStore'
import CrudTable from '@crudui/components/table/CrudTable.vue'
import type { UseCrudDataListReturn } from '@crudui/providers/useCrudDataList'
import { useCrudDataList } from '@crudui/providers/useCrudDataList'
import CrudInput from '@crudui/components/Inputs/CrudInput.vue'
import CreateButton from '@crudui/components/buttons/CreateButton.vue'
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
const { t } = useI18n()

const columns = [
  {
    name: 'name',
    required: true,
    label: t('modules.workers.table.name'),
    align: 'left',
    field: 'name',
    sortable: true,
  },
  {
    name: 'mobile',
    required: false,
    label: t('modules.workers.table.mobile'),
    align: 'left',
    field: 'mobile',
    sortable: true,
  },
  {
    name: 'is_outside',
    required: false,
    label: t('modules.workers.table.isOutside'),
    align: 'center',
    field: 'is_outside',
    sortable: true,
    headerStyle: 'width: 100px',
  },
  {
    name: 'created',
    required: false,
    label: t('modules.workers.table.created'),
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
