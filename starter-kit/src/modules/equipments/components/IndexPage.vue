<template>
  <crud-table>
    <template #actionsSection>
      <create-button
        v-if="meStore.userCan('equipment_create')"
        @click="dialogProvider.openCreateDialog"
      />
    </template>
    <template #filterForm>
      <v-col cols="12" md="4">
        <crud-input v-model="dataListProvider.filter.value.title" />
      </v-col>
      <v-col cols="12" md="2">
        <crud-boolean-select v-model="dataListProvider.filter.value.is_available" />
      </v-col>
      <v-col cols="12" md="6">
        <crud-input v-model="dataListProvider.filter.value.state_id" type="number" />
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
          <crud-input
            v-model="model.title"
            :label="$t('modules.equipments.form.title')"
            :rules="[(val) => !!val || $t('modules.equipments.validation.titleRequired'), (val) => val && val.length >= 2 || $t('modules.equipments.validation.titleMinLength')]"
            :disabled="stateProcessing"
          />
        </v-col>

        <v-col cols="12">
          <crud-input
            v-model.number="model.state_id"
            :label="$t('modules.equipments.form.stateId')"
            type="number"
            :disabled="stateProcessing"
          />
        </v-col>

        <v-col cols="12">
          <crud-input
            v-model="model.description"
            :label="$t('modules.equipments.form.description')"
            type="textarea"
            :disabled="stateProcessing"
          />
        </v-col>
      </v-row>
    </template>
  </crud-dialog>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMeStore } from '@crudui/stores/meStore'
import CrudTable from '@crudui/components/table/CrudTable.vue'
import type { UseCrudDataListReturn } from '@crudui/providers/useCrudDataList'
import { useCrudDataList } from '@crudui/providers/useCrudDataList'
import CrudInput from '@crudui/components/Inputs/CrudInput.vue'
import CreateButton from '@crudui/components/buttons/CreateButton.vue'
import { createStandardActions } from '@crudui/components/table/buttons/rowActionsFactory'
import { useCrudDialogProvider } from '@crudui/providers/useCrudDialogProvider'
import CrudDialog from '@crudui/components/dialogs/CrudDialog.vue'
import CrudBooleanSelect from '@crudui/components/Inputs/CrudBooleanSelect.vue'
import { useTimezone } from '@crudui/composables/useTimezone'

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
const { t } = useI18n()

const columns = [
  {
    name: 'title',
    required: true,
    label: t('modules.equipments.table.title'),
    align: 'left',
    field: 'title',
    sortable: true,
  },
  {
    name: 'state_id',
    required: false,
    label: t('modules.equipments.table.stateId'),
    align: 'left',
    field: 'state_id',
    sortable: true,
    headerStyle: 'width: 100px',
  },
  {
    name: 'description',
    required: false,
    label: t('modules.equipments.table.description'),
    align: 'left',
    field: 'description',
    sortable: false,
  },
  {
    name: 'created',
    required: false,
    label: t('modules.equipments.table.created'),
    align: 'left',
    field: 'created',
    sortable: true,
    headerStyle: 'width: 150px',
  },
  {
    name: 'edited',
    required: false,
    label: t('modules.equipments.table.edited'),
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
    }),
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
      edited: '',
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
