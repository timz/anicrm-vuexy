<template>
  <PageTitle>Площадки</PageTitle>
  <crud-table>
    <template #actionsSection>
      <create-button
        v-if="meStore.userCan('places_create')"
        @click="dialogProvider.openCreateDialog"
      />
    </template>
    <template #filterForm>
      <v-col cols="12" md="4">
        <crud-input
          v-model="dataListProvider.filter.value.title"
          label="Название"
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          v-model="dataListProvider.filter.value.is_available"
          label="Доступно"
          :items="[
            { title: 'Все', value: null },
            { title: 'Да', value: true },
            { title: 'Нет', value: false },
          ]"
          item-title="title"
          item-value="value"
          clearable
        />
      </v-col>
    </template>

    <!-- Custom formatting for is_available column -->
    <template #body-cell-is_available="{ value }">
      {{ value ? "Да" : "Нет" }}
    </template>

    <!-- Custom formatting for work_hours column -->
    <template #body-cell-work_hours="{ row }">
      {{ getWorkHours(row) }}
    </template>
  </crud-table>

  <!-- Диалог редактирования -->
  <crud-dialog>
    <template #default="{ stateProcessing }">
      <v-col cols="12">
        <crud-input
          v-model="model.title"
          label="Название"
          :rules="[
            (val) => !!val || 'Название обязательно',
            (val) => (val && val.length >= 2) || 'Минимум 2 символа',
          ]"
          :disabled="stateProcessing"
        />
      </v-col>

      <v-col cols="12">
        <crud-input
          v-model="model.address"
          type="textarea"
          label="Адрес"
          :disabled="stateProcessing"
        />
      </v-col>

      <v-col cols="6">
        <crud-input
          v-model.number="model.work_from"
          label="Работает с (час)"
          type="number"
          :rules="[
            (val) =>
              val === null
              || val === undefined
              || (val >= 0 && val <= 23)
              || 'Час от 0 до 23',
          ]"
          :disabled="stateProcessing"
        />
      </v-col>

      <v-col cols="6">
        <crud-input
          v-model.number="model.work_to"
          label="Работает до (час)"
          type="number"
          :rules="[
            (val) =>
              val === null
              || val === undefined
              || (val >= 0 && val <= 23)
              || 'Час от 0 до 23',
          ]"
          :disabled="stateProcessing"
        />
      </v-col>

      <v-col cols="4">
        <crud-checkbox
          v-model="model.is_available"
          label="Доступно"
          :disabled="stateProcessing"
        />
      </v-col>

      <v-col cols="12">
        <crud-input
          v-model="model.description"
          label="Описание"
          type="textarea"
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
import CrudCheckbox from '@crudui/components/Inputs/CrudCheckbox.vue'
import CreateButton from '@crudui/components/buttons/CreateButton.vue'
import { createStandardActions } from '@crudui/components/table/buttons/rowActionsFactory'
import { useCrudDialogProvider } from '@crudui/providers/useCrudDialogProvider'
import CrudDialog from '@crudui/components/dialogs/CrudDialog.vue'
import PageTitle from '@crudui/components/templates/PageTitle.vue'

interface PlaceItem {
  id: number | null
  title: string
  description: string
  address: string
  is_available: boolean
  work_from: number | null
  work_to: number | null
}

const meStore = useMeStore()

const getWorkHours = (item: any): string => {
  if (
    item?.work_from !== null &&
    item?.work_from !== undefined &&
    item?.work_to !== null &&
    item?.work_to !== undefined
  ) {
    return `${String(item.work_from).padStart(2, '0')}:00 - ${String(item.work_to).padStart(2, '0')}:00`
  }

  return '-'
}

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
    name: 'address',
    required: false,
    label: 'Адрес',
    align: 'left',
    field: 'address',
    sortable: true,
  },
  {
    name: 'is_available',
    required: false,
    label: 'Доступно',
    align: 'center',
    field: 'is_available',
    sortable: true,
    headerStyle: 'width: 100px',
  },
  {
    name: 'work_hours',
    required: false,
    label: 'Часы работы',
    align: 'left',
    sortable: false,
    headerStyle: 'width: 150px',
  },
]

// Создаем dataListProvider
const dataListProvider: UseCrudDataListReturn<PlaceItem> =
  useCrudDataList<PlaceItem>({
    mode: 'table',
    urlBase: '/places',
    pk: 'id',
    columns,
    rowActions: [
      ...createStandardActions<PlaceItem>({
        editDialog: {
          show: () => meStore.userCan('places_update'),
          handler: (item: PlaceItem) => dialogProvider.openEditDialog(item.id),
        },
        delete: {
          show: () => meStore.userCan('places_delete'),
          onDelete: (item: PlaceItem) => {
            console.log('Delete item:', item.id)
          },
        },
      }),
    ],
  })

// Создаем dialogProvider с колбеком
const dialogProvider = useCrudDialogProvider<PlaceItem>({
  formConfig: {
    prefixUrl: '/places',
    model: ref({
      id: null,
      title: '',
      description: '',
      address: '',
      is_available: true,
      work_from: null,
      work_to: null,
    }),
  },
  onItemSaved: () => {
    void dataListProvider.refresh()
  },
})

const model = dialogProvider.model

provide('dataListProvider', dataListProvider)
provide('dialogProvider', dialogProvider)
</script>
