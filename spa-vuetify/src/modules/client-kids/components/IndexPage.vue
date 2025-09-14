<template>
  <div>
    <crud-table>
      <template #actionsSection>
        <crud-button-primary
          label="Создать"
          v-if="meStore.userCan('clients_update')"
          @click="dialogProvider.openCreateDialog"
        >
          Создать
        </crud-button-primary>
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
            label="Имя"
            :rules="[r.required(), r.strMinLength(3), r.strMaxLength(100)]"
          />
        </v-col>
        <v-col cols="12">
          <crud-select
            v-model="model.sex"
            label="Пол"
            :items="[{title: 'Мальчик', value: 'm'}, {title: 'Девочка', value: 'f'}]"
            :rules="[r.required()]"
          />

        </v-col>
        <v-col cols="12">
          <crud-date-picker
            v-model="model.birthday"
            label="Дата рождения"
            :disable="stateProcessing"
          />
        </v-col>
      </template>
    </crud-dialog>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, computed } from "vue";
import { useMeStore } from "@crud/stores/meStore";
import CrudTable from "@crud/components/table/CrudTable.vue";
import type { UseCrudDataListReturn } from "@crud/providers/useCrudDataList";
import { useCrudDataList } from "@crud/providers/useCrudDataList";
import CrudInput from "@crud/components/Inputs/CrudInput.vue";
import CrudButtonPrimary from "@crud/components/buttons/CrudButtonPrimary.vue";
import { createStandardActions } from "@crud/components/table/buttons/rowActionsFactory";
import { useCrudDialogProvider } from "@crud/providers/useCrudDialogProvider";
import CrudDialog from "@crud/components/dialogs/CrudDialog.vue";
import { useTabParentProvider } from "@crud/components/forms/tabs/useTabParentProvider";
import CrudSelect from "@crud/components/Inputs/CrudSelect.vue";
import r from "@crud/services/RulesService";
import CrudDatePicker from "@crud/components/Inputs/CrudDatePicker.vue";
import { useTimezone } from "@crud/composables/useTimezone";
const { parseDateISOToLocal } = useTimezone();

interface ClientKidItem {
  id: number | null;
  name: string;
  sex: string;
  birthday: string;
}

const meStore = useMeStore();

// Используем композабл для получения данных родительской модели
const { parentId } = useTabParentProvider();

const columns = [
  {
    name: "name",
    required: true,
    label: "Имя",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "birthday",
    required: true,
    label: "День рождения",
    align: "left",
    field: "birthday",
    sortable: true,
    headerStyle: "width: 150px",
  },
];

// Создаем dataListProvider
const dataListProvider: UseCrudDataListReturn<ClientKidItem> =
  useCrudDataList<ClientKidItem>({
    mode: "table",
    urlBase: "/client-kids",
    columns,
    persistentFilter: computed(() => ({ parent_id: parentId.value })),
    rowActions: [
      ...createStandardActions<ClientKidItem>({
        editDialog: {
          show: () => meStore.userCan("clients_view"),
          handler: (item: ClientKidItem) =>
            dialogProvider.openEditDialog(item.id),
        },
        delete: {
          show: () => meStore.userCan("clients_update"),
          onDelete: (item: ClientKidItem) => {
            console.log("Delete item:", item.id);
          },
        },
      }),
    ],
  });

// Создаем dialogProvider с колбеком
const dialogProvider = useCrudDialogProvider<ClientKidItem>({
  formConfig: {
    prefixUrl: "/client-kids",
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
    void dataListProvider.refresh();
  },
});

const model = dialogProvider.model;

provide("dataListProvider", dataListProvider);
provide("dialogProvider", dialogProvider);
</script>
