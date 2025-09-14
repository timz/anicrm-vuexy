<template>
  <PageTitle>Источники рекламы</PageTitle>
  <crud-table>
    <template #actionsSection>
      <crud-button-primary
        label="Создать"
        v-if="meStore.userCan('adv_sources_create')"
        @click="dialogProvider.openCreateDialog"
      >
        Создать
      </crud-button-primary>
    </template>
    <template #filterForm>
      <v-col cols="12" md="6">
        <crud-input
          type="number"
          v-model="dataListProvider.filter.value.id"
          label="Ид"
        />
      </v-col>
      <v-col cols="12" md="6">
        <crud-input
          v-model="dataListProvider.filter.value.title"
          label="Название"
        />
      </v-col>
    </template>
  </crud-table>

  <!-- Диалог редактирования -->
  <crud-dialog>
    <template #default="{ stateProcessing }">
      <crud-input
        v-model="model.title"
        label="Название"
        :rules="[
          (val) => !!val || 'Название обязательно',
          (val) => val.length >= 2 || 'Минимум 2 символа',
        ]"
        :disabled="stateProcessing"
      />
    </template>
  </crud-dialog>
</template>

<script setup lang="ts">
import { provide, ref } from "vue";
import { useMeStore } from "@crud/stores/meStore";
import CrudTable from "@crud/components/table/CrudTable.vue";
import type { UseCrudDataListReturn } from "@crud/providers/useCrudDataList";
import { useCrudDataList } from "@crud/providers/useCrudDataList";
import CrudInput from "@crud/components/Inputs/CrudInput.vue";
import CrudButtonPrimary from "@crud/components/buttons/CrudButtonPrimary.vue";
import { createStandardActions } from "@crud/components/table/buttons/rowActionsFactory";
import { useCrudDialogProvider } from "@crud/providers/useCrudDialogProvider";
import CrudDialog from "@crud/components/dialogs/CrudDialog.vue";
import PageTitle from "@crud/components/templates/PageTitle.vue";

interface AdvSourceItem {
  id: number | null;
  title: string;
}

const meStore = useMeStore();

const columns = [
  {
    name: "title",
    required: true,
    label: "Название",
    align: "left",
    field: "title",
    sortable: true,
  },
];

// Создаем dataListProvider
const dataListProvider: UseCrudDataListReturn<AdvSourceItem> =
  useCrudDataList<AdvSourceItem>({
    mode: "table",
    urlBase: "/adv-sources",
    pk: "id",
    columns,
    rowActions: [
      ...createStandardActions<AdvSourceItem>({
        editDialog: {
          show: () => meStore.userCan("adv_sources_update"),
          handler: (item: AdvSourceItem) =>
            dialogProvider.openEditDialog(item.id),
        },
        delete: {
          show: () => meStore.userCan("adv_sources_delete"),
          onDelete: (item: AdvSourceItem) => {
            console.log("Delete item:", item.id);
          },
        },
      }),
    ],
  });

// Создаем dialogProvider с колбеком
const dialogProvider = useCrudDialogProvider<AdvSourceItem>({
  formConfig: {
    prefixUrl: "/adv-sources",
    model: ref({ id: null, title: "" }),
  },
  onItemSaved: () => {
    void dataListProvider.refresh();
  },
});

const model = dialogProvider.model;

provide("dataListProvider", dataListProvider);
provide("dialogProvider", dialogProvider);
</script>
