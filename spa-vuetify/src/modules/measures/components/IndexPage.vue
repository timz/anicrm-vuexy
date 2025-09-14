<template>
  <PageTitle>Единицы измерения</PageTitle>
  <crud-table>
    <template #actionsSection>
      <crud-button-primary
        v-if="meStore.userCan('measures_create')"
        :to="{ name: 'measureCreate' }"
      >
        Создать
      </crud-button-primary>
      <crud-button-primary
        v-if="meStore.userCan('measures_create')"
        @click="dialogProvider.openCreateDialog"
      >
        Создать в диалоге
      </crud-button-primary>
    </template>
    <template #filterForm>
      <v-col cols="12" md="6">
        <crud-input v-model="dataListProvider.filter.value.id" label="Ид" />
      </v-col>
      <v-col cols="12" md="6">
        <crud-input
          v-model="dataListProvider.filter.value.title"
          label="Название"
        />
      </v-col>
    </template>

    <!-- Кастомная верстка для колонки title с иконкой -->
    <template #body-cell-title="{ value }">
      <div class="d-flex align-center ga-2">
        <v-icon color="primary" size="small">mdi-ruler</v-icon>
        <span>{{ value }}</span>
      </div>
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

interface MeasureItem {
  id: number | null;
  title: string;
}

const meStore = useMeStore();

const columns = [
  {
    name: "id",
    required: true,
    label: "Ид",
    align: "left",
    field: "id",
    sortable: true,
    headerStyle: "width: 50px",
  },
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
const dataListProvider: UseCrudDataListReturn<MeasureItem> =
  useCrudDataList<MeasureItem>({
    mode: "table",
    urlBase: "/measures",
    pk: "id",
    columns,
    rowActions: [
      ...createStandardActions<MeasureItem>({
        edit: {
          routeName: "measureEdit",
          show: () => meStore.userCan("measures_update"),
        },
        editDialog: {
          show: () => meStore.userCan("measures_update"),
          handler: (item: MeasureItem) =>
            dialogProvider.openEditDialog(item.id),
        },
        delete: {
          show: () => meStore.userCan("measures_delete"),
          onDelete: (item: MeasureItem) => {
            console.log("Delete item:", item.id);
          },
        },
      }),
      {
        name: "custom-print",
        icon: "mdi-printer",
        color: "grey-darken-1",
        class: "text-orange-600",
        label: "Печать",
        show: () => meStore.userCan("measures_view"),
        handler: (item: MeasureItem) => {
          // Кастомная логика печати
          console.log("Custom print for:", item.title);
        },
      },
    ],
  });

// Создаем dialogProvider с колбеком
const dialogProvider = useCrudDialogProvider<MeasureItem>({
  formConfig: {
    prefixUrl: "/measures",
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
