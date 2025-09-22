<template>
  <PageTitle>{{ $t('modules.measures.title') }}</PageTitle>
  <crud-table>
    <template #actionsSection>
      <create-button v-if="meStore.userCan('measures_create')" @click="dialogProvider.openCreateDialog" />
    </template>
    <template #filterForm>
      <v-col cols="12" md="6">
        <crud-input v-model="dataListProvider.filter.value.title" :label="$t('modules.measures.table.title')" />
      </v-col>
    </template>
  </crud-table>

  <!-- Диалог редактирования -->
  <crud-dialog>
    <template #default="{ stateProcessing }">
      <v-col cols="12">
        <crud-input
          v-model="model.title"
          :label="$t('modules.measures.form.title')"
          :rules="[val => !!val || $t('modules.measures.validation.titleRequired'), val => val.length >= 2 || $t('modules.measures.validation.titleMinLength')]"
          :disabled="stateProcessing"
        />
      </v-col>
    </template>
  </crud-dialog>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import { useMeStore } from '@crudui/stores/meStore'
import CrudTable from '@crudui/components/table/CrudTable.vue'
import type { UseCrudDataListReturn } from '@crudui/providers/useCrudDataList'
import { useCrudDataList } from '@crudui/providers/useCrudDataList'
import CrudInput from '@crudui/components/Inputs/CrudInput.vue'
import CreateButton from '@crudui/components/buttons/CreateButton.vue'
import { createStandardActions } from '@crudui/components/table/buttons/rowActionsFactory'
import { useCrudDialogProvider } from '@crudui/providers/useCrudDialogProvider'
import CrudDialog from '@crudui/components/dialogs/CrudDialog.vue'
import PageTitle from '@crudui/components/templates/PageTitle.vue'

interface MeasureItem {
  id: number | null
  title: string
}

const meStore = useMeStore()

const columns = [
  {
    name: 'title',
    required: true,
    label: 'modules.measures.table.title',
    align: 'left',
    field: 'title',
    sortable: true,
  },
]

// Создаем dataListProvider
const dataListProvider: UseCrudDataListReturn<MeasureItem> = useCrudDataList<MeasureItem>({
  mode: 'table',
  urlBase: '/measures',
  pk: 'id',
  columns,
  rowActions: [
    ...createStandardActions<MeasureItem>({
      editDialog: {
        show: () => meStore.userCan('measures_update'),
        handler: (item: MeasureItem) => dialogProvider.openEditDialog(item.id),
      },
      delete: {
        show: () => meStore.userCan('measures_delete'),
        onDelete: (item: MeasureItem) => {
          console.log('Delete item:', item.id)
        },
      },
    }),
  ],
})

// Создаем dialogProvider с колбеком
const dialogProvider = useCrudDialogProvider<MeasureItem>({
  formConfig: {
    prefixUrl: '/measures',
    model: ref({ id: null, title: '' }),
  },
  onItemSaved: () => {
    void dataListProvider.refresh()
  },
})

const model = dialogProvider.model

provide('dataListProvider', dataListProvider)
provide('dialogProvider', dialogProvider)
</script>
