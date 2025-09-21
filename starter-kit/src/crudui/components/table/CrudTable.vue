<script setup lang="ts">
import { computed, inject, ref, useSlots } from 'vue'
import type { CrudRowAction, UseCrudDataListReturn } from '@crudui/providers/useCrudDataList'
import ButtonBatchDelete from '@crudui/components/table/buttons/ButtonBatchDelete.vue'
import ButtonAction from '@crudui/components/table/buttons/ButtonAction.vue'
import CrudButtonPrimary from '@crudui/components/buttons/CrudButtonPrimary.vue'
import CrudButtonSecondary from '@crudui/components/buttons/CrudButtonSecondary.vue'
import CrudConfirmDialog from '@crudui/components/dialogs/CrudConfirmDialog.vue'

const filterPanel = ref(false)
const slots = useSlots()

// Delete confirmation dialog state
const deleteDialog = ref(false)
const itemToDelete = ref<unknown | null>(null)
const deleteAction = ref<CrudRowAction<unknown> | null>(null)

const dataListProvider = inject<UseCrudDataListReturn>('dataListProvider')

if (!dataListProvider) throw new Error('dataListProvider not provided')

const {
  listItems,
  selectedItems,
  selectedIds,
  pagination,
  loading,
  total,
  columns,
  pk,
  filter,
  rowActions,
  loadList,
  refresh,
  remove,
  updatePagination,
  updateSorting,
} = dataListProvider

const filterFormRef = ref()

// Convert columns to Vuetify headers format
const tableHeaders = computed(() => {
  const headers = columns.map(col => ({
    title: col.label || col.name,
    key: col.field || col.name, // Use field for sorting key, fallback to name
    value: col.field || col.name,
    sortable: col.sortable !== false,
    align: col.align || 'start',
    width: col.style?.includes('width') ? undefined : col.style,
  }))

  // Add actions column if there are row actions
  if (rowActions.length > 0) {
    headers.push({
      title: 'Действия',
      key: 'actions',
      value: 'actions',
      sortable: false,
      align: 'end',
      width: '100px',
    })
  }

  return headers
})

// Sort by for v-data-table
const sortBy = ref([])

// Filter columns that have custom slots
const columnsWithSlots = computed(() => {
  return columns.filter(col => col.name && slots[`body-cell-${col.name}`])
})

const getVisibleActions = (item: unknown): CrudRowAction<unknown>[] => {
  return rowActions.filter(action => !action.show || action.show(item))
}

const handleActionClick = (action: CrudRowAction<unknown>, item: unknown) => {
  if (action.name === 'delete') {
    // Show confirmation dialog for delete action
    itemToDelete.value = item
    deleteAction.value = action
    deleteDialog.value = true
  } else {
    // Execute other actions directly
    action.handler(item)
  }
}

const confirmDelete = async () => {
  if (!itemToDelete.value || !deleteAction.value) return

  try {
    // Call original handler if provided
    if (deleteAction.value.handler) {
      await deleteAction.value.handler(itemToDelete.value)
    }

    // Call dataListProvider remove method
    const itemId = (itemToDelete.value as any)[pk]
    if (itemId) {
      await remove([itemId])
    }
  } catch (error) {
    console.error('Failed to delete item:', error)
  } finally {
    cancelDelete()
  }
}

const cancelDelete = () => {
  deleteDialog.value = false
  itemToDelete.value = null
  deleteAction.value = null
}

const handleDeleteConfirm = async () => {
  await confirmDelete()
}

const onOptionsUpdate = async (options: any) => {
  const { page, itemsPerPage } = options

  // Update pagination state
  updatePagination({
    page,
    rowsPerPage: itemsPerPage,
    sortBy: pagination.value.sortBy,
    descending: pagination.value.descending,
  })

  await loadList()
}

const onSortByUpdate = async (newSortBy: any) => {
  if (newSortBy && newSortBy.length > 0) {
    const sortKey = newSortBy[0].key
    let isDescending = newSortBy[0].order === 'desc'

    // Handle 3-state toggle logic: asc -> desc -> none -> asc...
    if (pagination.value.sortBy === sortKey) {
      if (!pagination.value.descending) {
        // Currently ascending, switch to descending
        isDescending = true
      } else {
        // Currently descending, remove sorting
        updateSorting('', false)
        sortBy.value = []
        await loadList()

        return
      }
    } else {
      // Different column, start with ascending
      isDescending = false
    }

    // Update sorting state and sortBy ref
    updateSorting(sortKey, isDescending)
    sortBy.value = [
      {
        key: sortKey,
        order: isDescending ? 'desc' : 'asc',
      },
    ]

    await loadList()
  } else {
    // Clear sorting if no sort specified
    updateSorting('', false)
    sortBy.value = []
    await loadList()
  }
}

const deleteSelected = async (): Promise<void> => {
  if (selectedIds.value.length === 0) return

  try {
    await remove(selectedIds.value)
  } catch (error) {
    console.error('Failed to delete items:', error)
  }
}

const applyFilter = async (): Promise<void> => {
  if (!filterFormRef.value) return

  const { valid } = await filterFormRef.value.validate()
  if (!valid) return

  // Get filter data from form elements
  const formElement = filterFormRef.value.$el as HTMLFormElement
  const formData = new FormData(formElement)
  const filterData: Record<string, unknown> = {}

  for (const [key, value] of formData.entries()) filterData[key] = value

  // Also collect data from v-model fields
  const inputs = formElement.querySelectorAll('input, select, textarea')

  inputs.forEach((input: Element) => {
    const htmlInput = input as HTMLInputElement
    if (htmlInput.name && htmlInput.value !== undefined) filterData[htmlInput.name] = htmlInput.value
  })

  Object.assign(filter.value, filterData)
  await loadList()
}

const resetFilter = async (): Promise<void> => {
  if (filterFormRef.value) filterFormRef.value.reset()

  filter.value = {}
  await loadList()
}
</script>

<template>
  <v-card>
    <!-- Actions Bar -->
    <div class="d-flex flex-wrap gap-4 ma-6">
      <div class="d-flex align-center gap-2">
        <slot v-if="$slots.actionsSection" name="actionsSection" />

        <template v-if="dataListProvider.selectedIds.value.length > 0">
          <ButtonBatchDelete @confirm-delete="deleteSelected" />
        </template>
      </div>

      <v-spacer />

      <div class="d-flex gap-2 align-center">
        <v-btn variant="text" icon="mdi-refresh" color="default" :disabled="loading" @click="refresh" />

        <v-btn
          v-if="$slots.filterForm"
          variant="text"
          icon="mdi-filter-variant"
          :color="filterPanel ? 'primary' : 'default'"
          @click="filterPanel = !filterPanel"
        />
      </div>
    </div>

    <v-divider v-if="$slots.filterForm && filterPanel" />

    <!-- Filter Panel -->
    <v-expand-transition>
      <div v-if="$slots.filterForm && filterPanel" class="ma-6">
        <v-form ref="filterFormRef" @submit.prevent="applyFilter">
          <v-row class="form-row">
            <slot name="filterForm" />
          </v-row>

          <div class="d-flex mt-4 gap-2">
            <CrudButtonPrimary :disabled="loading" @click="applyFilter"> Применить </CrudButtonPrimary>
            <CrudButtonSecondary :disabled="loading" @click="resetFilter"> Сброс </CrudButtonSecondary>
          </div>
        </v-form>
      </div>
    </v-expand-transition>

    <v-divider />

    <!-- Data Table Server -->
    <v-data-table-server
      v-model="selectedItems"
      v-model:page="pagination.page"
      v-model:items-per-page="pagination.rowsPerPage"
      :sort-by="sortBy"
      :headers="tableHeaders"
      :items="listItems"
      :loading="loading"
      :items-length="total"
      :items-per-page-options="[
        { value: 10, title: '10' },
        { value: 12, title: '12' },
        { value: 20, title: '20' },
        { value: 50, title: '50' },
      ]"
      item-value="id"
      show-select
      @update:options="onOptionsUpdate"
      @update:sort-by="onSortByUpdate"
    >
      <!-- Custom column slots -->
      <template v-for="col in columnsWithSlots" :key="col.name" #[`item.${col.name}`]="{ item, value }">
        <slot :name="`body-cell-${col.name}`" :row="item" :value="value" :col="col" />
      </template>

      <!-- Actions column -->
      <template #item.actions="{ item }">
        <div class="d-flex justify-end gap-x-1">
          <ButtonAction
            v-for="action in getVisibleActions(item)"
            :key="action.name"
            :icon="action.icon"
            :color="action.color"
            :tooltip="action.tooltip"
            @click="handleActionClick(action, item)"
          />
        </div>
      </template>
    </v-data-table-server>
  </v-card>

  <!-- Delete Confirmation Dialog -->
  <crud-confirm-dialog
    v-model="deleteDialog"
    title="Подтверждение удаления"
    message="Вы уверены, что хотите удалить эту запись? Это действие необратимо."
    confirm-text="Подтвердить"
    confirm-color="error"
    cancel-text="Отмена"
    @confirm="handleDeleteConfirm"
    @cancel="cancelDelete"
  />
</template>

<style lang="scss" scoped>
// Применяем стили таблицы из Vuexy
:deep(.v-data-table) {
  // Стили для заголовков таблицы
  .v-data-table__th {
    font-weight: 600;
  }
}
</style>
