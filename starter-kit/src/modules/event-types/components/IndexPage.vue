<template>
  <PageTitle>Типы событий</PageTitle>
  <crud-table>
    <template #actionsSection>
      <crud-button-primary
        v-if="meStore.userCan('event_types_create')"
        label="Создать"
        @click="dialogProvider.openCreateDialog"
      >
        Создать
      </crud-button-primary>
    </template>
    <template #filterForm>
      <v-col cols="12" md="6">
        <crud-input v-model="dataListProvider.filter.value.id" type="number" label="Ид" />
      </v-col>
      <v-col cols="12" md="6">
        <crud-input v-model="dataListProvider.filter.value.title" label="Название" />
      </v-col>
    </template>
  </crud-table>

  <!-- Диалог редактирования -->
  <crud-dialog>
    <template #default="{ stateProcessing }">
      <v-col cols="12">
        <crud-input
          v-model="model.title"
          label="Название"
          :rules="[val => !!val || 'Название обязательно', val => val.length >= 2 || 'Минимум 2 символа']"
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
import CrudButtonPrimary from '@crudui/components/buttons/CrudButtonPrimary.vue'
import { createStandardActions } from '@crudui/components/table/buttons/rowActionsFactory'
import { useCrudDialogProvider } from '@crudui/providers/useCrudDialogProvider'
import CrudDialog from '@crudui/components/dialogs/CrudDialog.vue'
import PageTitle from '@crudui/components/templates/PageTitle.vue'

interface EventTypeItem {
  id: number | null
  title: string
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
]

// Создаем dataListProvider
const dataListProvider: UseCrudDataListReturn<EventTypeItem> = useCrudDataList<EventTypeItem>({
  mode: 'table',
  urlBase: '/event-types',
  pk: 'id',
  columns,
  rowActions: [
    ...createStandardActions<EventTypeItem>({
      editDialog: {
        show: () => meStore.userCan('event_types_update'),
        handler: (item: EventTypeItem) => dialogProvider.openEditDialog(item.id),
      },
      delete: {
        show: () => meStore.userCan('event_types_delete'),
        onDelete: (item: EventTypeItem) => {
          console.log('Delete item:', item.id)
        },
      },
    }),
  ],
})

// Создаем dialogProvider с колбеком
const dialogProvider = useCrudDialogProvider<EventTypeItem>({
  formConfig: {
    prefixUrl: '/event-types',
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
