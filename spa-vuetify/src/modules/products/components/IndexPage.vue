<template>
  <PageTitle>Продукты</PageTitle>
  <crud-table>
    <template #actionsSection>
      <crud-button-primary
        label="Создать"
        v-if="meStore.userCan('products_create')"
        :to="{ name: 'productCreate' }"
      >
        Создать
      </crud-button-primary>
    </template>
    <template #filterForm>
      <v-col cols="12" md="4">
        <crud-input v-model="dataListProvider.filter.value.id" label="Ид" />
      </v-col>
      <v-col cols="12" md="4">
        <crud-input
          v-model="dataListProvider.filter.value.title"
          label="Название"
        />
      </v-col>
      <v-col cols="12" md="4">
        <crud-input
          v-model="dataListProvider.filter.value.measure_id"
          label="Мера"
          type="number"
        />
      </v-col>
    </template>

    <!-- Custom title column with icon -->
    <template #body-cell-title="{ value }">
      <div class="d-flex align-center ga-2">
        <v-icon color="primary" size="small">mdi-package-variant</v-icon>
        <span>{{ value }}</span>
      </div>
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
import PageTitle from "@crud/components/templates/PageTitle.vue";

interface ProductItem {
  id: number | null;
  title: string;
  measure_id: number | null;
  measure_title?: string;
  description?: string;
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
    name: "measure_title",
    required: false,
    label: "Единица измерения",
    align: "left",
    field: "measure_title",
    sortable: true,
  },
];

// Создаем dataListProvider
const dataListProvider: UseCrudDataListReturn<ProductItem> =
  useCrudDataList<ProductItem>({
    mode: "table",
    urlBase: "/products",
    pk: "id",
    columns,
    rowActions: [
      ...createStandardActions<ProductItem>({
        edit: {
          routeName: "productEdit",
          show: () => meStore.userCan("products_update"),
        },
        delete: {
          show: () => meStore.userCan("products_delete"),
          onDelete: (item: ProductItem) => {
            console.log("Delete item:", item.id);
          },
        },
      }),
    ],
  });

provide("dataListProvider", dataListProvider);
</script>
