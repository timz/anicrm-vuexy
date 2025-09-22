<template>
  <crud-table>
    <template #actionsSection>
      <create-button v-if="meStore.userCan('clients_update')" @click="dialogProvider.openCreateDialog" />
    </template>
    <template #body-cell-birthday="{ value }">
      {{ parseDateISOToLocal(value) }}
    </template>
  </crud-table>
  <crud-dialog>
    <template #default="{ stateProcessing }">
      <v-col cols="12">
        <crud-input
          v-model="model.name"
          :label="$t('common.fields.name')"
          :rules="[rules.required(), rules.minLength(2), rules.maxLength(100)]"
        />
      </v-col>
      <v-col cols="12">
        <crud-select
          v-model="model.sex"
          :label="$t('modules.clientKids.fields.sex')"
          :items="[
            { title: $t('common.sex.male'), value: 'm' },
            { title: $t('common.sex.female'), value: 'f' },
          ]"
          :rules="[rules.required()]"
        />
      </v-col>
      <v-col cols="12">
        <crud-date-picker v-model="model.birthday" :label="$t('common.fields.birthday')" :disable="stateProcessing" />
      </v-col>
    </template>
  </crud-dialog>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'
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
import { useTabParentProvider } from '@crudui/components/forms/tabs/useTabParentProvider'
import CrudSelect from '@crudui/components/Inputs/CrudSelect.vue'
import { rules } from '@crudui/utils/validation/rules'
import CrudDatePicker from '@crudui/components/Inputs/CrudDatePicker.vue'
import { useTimezone } from '@crudui/composables/useTimezone'

const { parseDateISOToLocal } = useTimezone()

interface ClientKidItem {
  id: number | null
  name: string
  sex: string
  birthday: string
}

const meStore = useMeStore()
const { t } = useI18n()

// Используем композабл для получения данных родительской модели
const { parentId } = useTabParentProvider()

const columns = [
  {
    name: 'name',
    required: true,
    label: t('common.fields.name'),
    align: 'left',
    field: 'name',
    sortable: true,
  },
  {
    name: 'birthday',
    required: true,
    label: t('common.fields.birthday'),
    align: 'left',
    field: 'birthday',
    sortable: true,
    headerStyle: 'width: 150px',
  },
]

// Создаем dataListProvider
const dataListProvider: UseCrudDataListReturn<ClientKidItem> = useCrudDataList<ClientKidItem>({
  mode: 'table',
  urlBase: '/client-kids',
  columns,
  persistentFilter: computed(() => ({ parent_id: parentId.value })),
  rowActions: [
    ...createStandardActions<ClientKidItem>({
      editDialog: {
        show: () => meStore.userCan('clients_view'),
        handler: (item: ClientKidItem) => dialogProvider.openEditDialog(item.id),
      },
      delete: {
        show: () => meStore.userCan('clients_update'),
        onDelete: (item: ClientKidItem) => {
          console.log('Delete item:', item.id)
        },
      },
    }),
  ],
})

// Создаем dialogProvider с колбеком
const dialogProvider = useCrudDialogProvider<ClientKidItem>({
  formConfig: {
    prefixUrl: '/client-kids',
    model: ref({
      id: null,
      name: null,
      sex: null,
      birthday: null,
    }),
    transformOut: (model: ClientKidItem) => ({
      ...model,
      parent_id: parentId.value,
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
