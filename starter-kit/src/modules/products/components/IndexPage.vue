<template>
  <PageTitle>{{ $t('modules.products.title') }}</PageTitle>
  <crud-table>
    <template #actionsSection>
      <create-button
        v-if="meStore.userCan('products_create')"
        :to="{ name: 'productCreate' }"
      />
    </template>
    <template #filterForm>
      <v-col cols="12" md="4">
        <crud-input v-model="dataListProvider.filter.value.id" :label="$t('modules.products.filter.id')" />
      </v-col>
      <v-col cols="12" md="4">
        <crud-input
          v-model="dataListProvider.filter.value.title"
          :label="$t('modules.products.filter.title')"
        />
      </v-col>
      <v-col cols="12" md="4">
        <crud-input
          v-model="dataListProvider.filter.value.measure_id"
          :label="$t('modules.products.filter.measure')"
          type="number"
        />
      </v-col>
    </template>

    <!-- Custom title column with icon -->
    <template #body-cell-title="{ value }">
      <div class="d-flex align-center ga-2">
        <v-icon color="primary" size="small">
          mdi-package-variant
        </v-icon>
        <span>{{ value }}</span>
      </div>
    </template>
  </crud-table>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { useMeStore } from '@crudui/stores/meStore'
import CrudTable from '@crudui/components/table/CrudTable.vue'
import type { UseCrudDataListReturn } from '@crudui/providers/useCrudDataList'
import { useCrudDataList } from '@crudui/providers/useCrudDataList'
import CrudInput from '@crudui/components/Inputs/CrudInput.vue'
import CreateButton from '@crudui/components/buttons/CreateButton.vue'
import { createStandardActions } from '@crudui/components/table/buttons/rowActionsFactory'
import PageTitle from '@crudui/components/templates/PageTitle.vue'

interface ProductItem {
  id: number | null
  title: string
  measure_id: number | null
  measure_title?: string
  description?: string
}

const meStore = useMeStore()

const columns = [
  {
    name: 'title',
    required: true,
    label: 'modules.products.table.title',
    align: 'left',
    field: 'title',
    sortable: true,
  },
  {
    name: 'measure_title',
    required: false,
    label: 'modules.products.table.measure',
    align: 'left',
    field: 'measure_title',
    sortable: true,
  },
]

// Создаем dataListProvider
const dataListProvider: UseCrudDataListReturn<ProductItem> =
  useCrudDataList<ProductItem>({
    mode: 'table',
    urlBase: '/products',
    pk: 'id',
    columns,
    rowActions: [
      ...createStandardActions<ProductItem>({
        edit: {
          routeName: 'productEdit',
          show: () => meStore.userCan('products_update'),
        },
        delete: {
          show: () => meStore.userCan('products_delete'),
          onDelete: (item: ProductItem) => {
            console.log('Delete item:', item.id)
          },
        },
      }),
    ],
  })

provide('dataListProvider', dataListProvider)
</script>
