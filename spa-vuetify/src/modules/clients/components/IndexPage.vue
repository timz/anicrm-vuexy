<template>
  <PageTitle>Клиенты</PageTitle>

  <crud-table>
    <template #actionsSection>
      <crud-button-primary
        v-if="meStore.userCan('clients_create')"
        :to="{ name: 'clientCreate' }"
      >
        Создать
      </crud-button-primary>
    </template>
    <template #filterForm>
      <v-col cols="12" md="4">
        <crud-input
          v-model="dataListProvider.filter.value.title"
          label="Название"
        />
      </v-col>
      <v-col cols="12" md="3">
        <crud-date-range-picker-2
          v-model="dataListProvider.filter.value.created"
          label="Дата создания"
        />

      </v-col>
    </template>

    <template #body-cell-created="{ value }">
      {{ formatTableDate(value) }}
    </template>

    <template #body-cell-edited="{ value }">
      {{ formatTableDate(value) }}
    </template>
  </crud-table>
</template>

<script setup lang="ts">
import { provide } from "vue";
import { useMeStore } from "@crud/stores/meStore";
import CrudTable from "@crud/components/table/CrudTable.vue";
import type { UseCrudDataListReturn } from "@crud/providers/useCrudDataList";
import { useCrudDataList } from "@crud/providers/useCrudDataList";
import CrudInput from "@crud/components/Inputs/CrudInput.vue";
import CrudButtonPrimary from "@crud/components/buttons/CrudButtonPrimary.vue";
import { createStandardActions } from "@crud/components/table/buttons/rowActionsFactory";
import { useTimezone } from "@crud/composables/useTimezone";
import PageTitle from "@crud/components/templates/PageTitle.vue";
import CrudDatePicker from "@crud/components/Inputs/CrudDatePicker.vue";
import CrudDateRangePicker from "@crud/components/Inputs/CrudDateRangePicker.vue";
import CrudDateRangePicker2 from "@crud/components/Inputs/CrudDateRangePicker2.vue";

const { formatTableDate } = useTimezone();

interface ClientItem {
  id: number | null;
  title: string;
  created: string;
  edited: string;
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
  {
    name: "created",
    label: "Создан",
    align: "left",
    field: "created",
    sortable: true,
    style: "width: 120px",
  },
  {
    name: "edited",
    label: "Правки",
    align: "left",
    field: "edited",
    sortable: true,
    style: "width: 120px",
  },
];

// Создаем dataListProvider
const dataListProvider: UseCrudDataListReturn<ClientItem> =
  useCrudDataList<ClientItem>({
    mode: "table",
    urlBase: "/clients",
    columns,
    rowActions: [
      ...createStandardActions<ClientItem>({
        edit: {
          routeName: "clientEdit",
          show: () => meStore.userCan("clients_update"),
        },
        delete: {
          show: () => meStore.userCan("clients_delete"),
          onDelete: (item: ClientItem) => {
            console.log("Delete item:", item.id);
          },
        },
      }),
    ],
  });

provide("dataListProvider", dataListProvider);
</script>
