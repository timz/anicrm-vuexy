<template>
  <crud-table>
    <template #actionsSection>
      <crud-button-primary
        label="Создать"
        v-if="meStore.userCan('equipment_create')"
        @click="dialogProvider.openCreateDialog"/>
    </template>
    <template #filterForm>
      <v-col cols="12" md="4">
        <crud-input v-model="dataListProvider.filter.value.title" label="Название"/>
      </v-col>
      <v-col cols="12" md="2">
        <crud-boolean-select v-model="dataListProvider.filter.value.is_available" label="Доступно" />
      </v-col>
      <v-col cols="12" md="6">
        <crud-input type="number" v-model="dataListProvider.filter.value.state_id" label="Статус"/>
      </v-col>
    </template>

    <!-- Custom formatting for date columns -->
    <template #body-cell-created="{ value }">
      {{ formatTableDate(value) }}
    </template>
    
    <template #body-cell-edited="{ value }">
      {{ formatTableDate(value) }}
    </template>
  </crud-table>

  <!-- Диалог редактирования -->
  <crud-dialog>
    <template #default="{ stateProcessing }">
      <v-row>
        <v-col cols="12">
          <crud-input v-model="model.title" label="Название"
                      :rules="[(val) => !!val || 'Название обязательно', (val) => val && val.length >= 2 || 'Минимум 2 символа']"
                      :disabled="stateProcessing"/>
        </v-col>

        <v-col cols="12">
          <crud-input v-model.number="model.state_id" label="Статус"
                      type="number"
                      :disabled="stateProcessing"/>
        </v-col>

        <v-col cols="12">
          <crud-input v-model="model.description" label="Описание"
                      type="textarea"
                      :disabled="stateProcessing"/>
        </v-col>
      </v-row>
    </template>
  </crud-dialog>
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { useMeStore } from '@crud/stores/meStore'
import CrudTable from '@crud/components/table/CrudTable.vue'
import type { UseCrudDataListReturn } from '@crud/providers/useCrudDataList'
import { useCrudDataList } from '@crud/providers/useCrudDataList'
import CrudInput from '@crud/components/Inputs/CrudInput.vue'
import CrudButtonPrimary from '@crud/components/buttons/CrudButtonPrimary.vue'
import { createStandardActions } from '@crud/components/table/buttons/rowActionsFactory'
import { useCrudDialogProvider } from '@crud/providers/useCrudDialogProvider'
import CrudDialog from '@crud/components/dialogs/CrudDialog.vue'
import CrudBooleanSelect from '@crud/components/Inputs/CrudBooleanSelect.vue'
import { useTimezone } from '@crud/composables/useTimezone'

const { formatTableDate } = useTimezone()

interface EquipmentItem {
  id: number | null
  title: string
  state_id: number | null
  description: string
  created: string
  edited: string
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
    name: 'state_id',
    required: false,
    label: 'Статус',
    align: 'left',
    field: 'state_id',
    sortable: true,
    headerStyle: 'width: 100px',
  },
  {
    name: 'description',
    required: false,
    label: 'Описание',
    align: 'left',
    field: 'description',
    sortable: false,
  },
  {
    name: 'created',
    required: false,
    label: 'Создано',
    align: 'left',
    field: 'created',
    sortable: true,
    headerStyle: 'width: 150px',
  },
  {
    name: 'edited',
    required: false,
    label: 'Изменено',
    align: 'left',
    field: 'edited',
    sortable: true,
    headerStyle: 'width: 150px',
  },
]

// Создаем dataListProvider
const dataListProvider: UseCrudDataListReturn<EquipmentItem> = useCrudDataList<EquipmentItem>({
  mode: 'table',
  urlBase: '/equipment',
  pk: 'id',
  columns,
  rowActions: [
    ...createStandardActions<EquipmentItem>({
      editDialog: {
        show: () => meStore.userCan('equipment_update'),
        handler: (item: EquipmentItem) => dialogProvider.openEditDialog(item.id),
      },
      delete: {
        show: () => meStore.userCan('equipment_delete'),
        onDelete: (item: EquipmentItem) => {
          console.log('Delete item:', item.id)
        },
      },
    })
  ],
})

// Создаем dialogProvider с колбеком
const dialogProvider = useCrudDialogProvider<EquipmentItem>({
  formConfig: {
    prefixUrl: '/equipment',
    model: ref({
      id: null,
      title: '',
      state_id: null,
      description: '',
      created: '',
      edited: ''
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
