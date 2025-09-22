<template>
  <PageTitle>{{ $t('modules.rejectionReasons.title') }}</PageTitle>
  <crud-table>
    <template #actionsSection>
      <create-button
        v-if="meStore.userCan('rejection_reasons_create')"
        @click="dialogProvider.openCreateDialog"
      />
    </template>
    <template #filterForm>
      <v-col cols="12" md="6">
        <crud-input v-model="dataListProvider.filter.value.title" :label="$t('modules.rejectionReasons.table.title')" />
      </v-col>
    </template>
  </crud-table>

  <!-- Диалог редактирования -->
  <crud-dialog>
    <template #default="{ stateProcessing }">
      <v-col cols="12">
        <crud-input
          v-model="model.title"
          :label="$t('modules.rejectionReasons.form.title')"
          :rules="[val => !!val || $t('modules.rejectionReasons.validation.titleRequired'), val => val.length >= 2 || $t('modules.rejectionReasons.validation.titleMinLength')]"
          :disabled="stateProcessing"
        />
      </v-col>
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
import PageTitle from '@crudui/components/templates/PageTitle.vue'

interface RejectionReasonItem {
  id: number | null
  title: string
}

const meStore = useMeStore()
const { t } = useI18n()

const columns = [
  {
    name: 'title',
    required: true,
    label: t('modules.rejectionReasons.table.title'),
    align: 'left',
    field: 'title',
    sortable: true,
  },
]

// Создаем dataListProvider
const dataListProvider: UseCrudDataListReturn<RejectionReasonItem> = useCrudDataList<RejectionReasonItem>({
  mode: 'table',
  urlBase: '/rejection-reasons',
  pk: 'id',
  columns,
  rowActions: [
    ...createStandardActions<RejectionReasonItem>({
      editDialog: {
        show: () => meStore.userCan('rejection_reasons_update'),
        handler: (item: RejectionReasonItem) => dialogProvider.openEditDialog(item.id),
      },
      delete: {
        show: () => meStore.userCan('rejection_reasons_delete'),
        onDelete: (item: RejectionReasonItem) => {
          console.log('Delete item:', item.id)
        },
      },
    }),
  ],
})

// Создаем dialogProvider с колбеком
const dialogProvider = useCrudDialogProvider<RejectionReasonItem>({
  formConfig: {
    prefixUrl: '/rejection-reasons',
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
