<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import type { CrudRowAction, UseCrudDataListReturn } from '@crudui/providers/useCrudDataList'
import ButtonBatchDelete from '@crudui/components/table/buttons/ButtonBatchDelete.vue'
import ButtonAction from '@crudui/components/table/buttons/ButtonAction.vue'
import CrudButtonPrimary from '@crudui/components/buttons/CrudButtonPrimary.vue'
import CrudButtonSecondary from '@crudui/components/buttons/CrudButtonSecondary.vue'
import CrudConfirmDialog from '@crudui/components/dialogs/CrudConfirmDialog.vue'

const filterPanel = ref(false)

// Delete confirmation dialog state
const deleteDialog = ref(false)
const itemToDelete = ref<unknown | null>(null)
const deleteAction = ref<CrudRowAction<unknown> | null>(null)

const dataListProvider = inject<UseCrudDataListReturn<Record<string, unknown>>>('dataListProvider')

if (!dataListProvider)
  throw new Error('dataListProvider not provided')

const {
  listItems,
  selectedItems,
  selectedIds,
  pagination,
  loading,
  total,
  pk,
  filter,
  rowActions,
  loadList,
  refresh,
  remove,
  updatePagination,
  toggleSelection,
  isSelected,
} = dataListProvider

const filterFormRef = ref()

// Load data on component mount
onMounted(() => {
  loadList()
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
  }
  else {
    // Execute other actions directly
    action.handler(item)
  }
}

const cancelDelete = () => {
  deleteDialog.value = false
  itemToDelete.value = null
  deleteAction.value = null
}

const confirmDelete = async () => {
  if (!itemToDelete.value || !deleteAction.value)
    return

  try {
    // Call original handler if provided
    if (deleteAction.value.handler)
      await deleteAction.value.handler(itemToDelete.value)

    // Call dataListProvider remove method
    const itemId = (itemToDelete.value as any)[pk]
    if (itemId)
      await remove([itemId])
  }
  catch (error) {
    console.error('Failed to delete item:', error)
  }
  finally {
    cancelDelete()
  }
}

const handleDeleteConfirm = async () => {
  await confirmDelete()
}

const deleteSelected = async (): Promise<void> => {
  if (selectedIds.value.length === 0)
    return

  try {
    await remove(selectedIds.value)
  }
  catch (error) {
    console.error('Failed to delete items:', error)
  }
}

const applyFilter = async (): Promise<void> => {
  if (!filterFormRef.value)
    return

  const { valid } = await filterFormRef.value.validate()
  if (!valid)
    return

  // Get filter data from form elements
  const formElement = filterFormRef.value.$el as HTMLFormElement
  const formData = new FormData(formElement)
  const filterData: Record<string, unknown> = {}

  for (const [key, value] of formData.entries()) filterData[key] = value

  // Also collect data from v-model fields
  const inputs = formElement.querySelectorAll('input, select, textarea')

  inputs.forEach((input: Element) => {
    const htmlInput = input as HTMLInputElement
    if (htmlInput.name && htmlInput.value !== undefined)
      filterData[htmlInput.name] = htmlInput.value
  })

  Object.assign(filter.value, filterData)
  await loadList()
}

const resetFilter = async (): Promise<void> => {
  if (filterFormRef.value)
    filterFormRef.value.reset()

  filter.value = {}
  await loadList()
}

// Pagination
const currentPage = computed({
  get: () => pagination.value.page,
  set: async (newPage: number) => {
    updatePagination({
      page: newPage,
      rowsPerPage: pagination.value.rowsPerPage,
      sortBy: pagination.value.sortBy,
      descending: pagination.value.descending,
    })
    await loadList()
  },
})

const itemsPerPage = computed({
  get: () => pagination.value.rowsPerPage,
  set: async (newItemsPerPage: number) => {
    updatePagination({
      page: 1,
      rowsPerPage: newItemsPerPage,
      sortBy: pagination.value.sortBy,
      descending: pagination.value.descending,
    })
    await loadList()
  },
})

const totalPages = computed(() => {
  return Math.ceil(total.value / pagination.value.rowsPerPage)
})

const itemsPerPageOptions = [
  { value: 5, title: '5' },
  { value: 10, title: '10' },
  { value: 12, title: '12' },
  { value: 20, title: '20' },
  { value: 50, title: '50' },
]
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
            <CrudButtonPrimary :disabled="loading" @click="applyFilter">
              {{ $t('common.filter') }}
            </CrudButtonPrimary>
            <CrudButtonSecondary :disabled="loading" @click="resetFilter">
              {{ $t('common.reset') }}
            </CrudButtonSecondary>
          </div>
        </v-form>
      </div>
    </v-expand-transition>

    <!-- List -->
    <div class="pa-4">
      <v-list v-if="!loading || listItems.length > 0">
        <template v-for="(item, index) in listItems" :key="(item as any)[pk]">
          <v-list-item>
            <!-- Checkbox -->
            <!--
              <template #prepend>
              <v-checkbox
              :model-value="isSelected((item as any)[pk])"
              hide-details
              density="compact"
              @update:model-value="toggleSelection(item)"
              />
              </template>
            -->

            <!-- Custom content slot -->
            <div v-if="$slots['list-item']">
              <slot name="list-item" :item="item" :index="index" />
            </div>

            <!-- Default content if no slot provided -->
            <div v-else>
              <v-list-item-title>{{ $t('common.item') }} #{{ (item as any)[pk] }}</v-list-item-title>
            </div>

            <!-- Actions -->
            <template v-if="rowActions.length > 0" #append>
              <div class="d-flex gap-x-1">
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
          </v-list-item>
        </template>
      </v-list>

      <!-- Loading state -->
      <div v-if="loading && listItems.length === 0" class="d-flex justify-center align-center pa-6">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <!-- Empty state -->
      <div v-if="!loading && listItems.length === 0" class="text-center pa-6">
        <div class="text-h6 text-grey">
          {{ $t('common.noData') }}
        </div>
      </div>
    </div>

    <div v-if="!loading && listItems.length > 0" class="d-flex justify-space-between align-center flex-wrap gap-4 ma-6">
      <!-- Items info -->
      <div class="text-body-2 text-medium-emphasis">
        {{ $t('common.showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }} -
        {{ Math.min(currentPage * itemsPerPage, total) }} {{ $t('common.of') }} {{ total }}
      </div>

      <div class="d-flex align-center gap-4">
        <!-- Items per page selector -->
        <v-select
          v-model="itemsPerPage"
          :items="itemsPerPageOptions"
          :label="$t('common.itemsPerPage')"
          density="compact"
          variant="outlined"
          hide-details
          style="max-width: 150px"
          :disabled="loading"
        />

        <!-- Pagination -->
        <v-pagination
          v-if="totalPages > 1"
          v-model="currentPage"
          :length="totalPages"
          :total-visible="5"
          :disabled="loading"
          density="comfortable"
        />
      </div>
    </div>
  </v-card>

  <!-- Delete Confirmation Dialog -->
  <crud-confirm-dialog
    v-model="deleteDialog"
    :title="$t('common.deleteConfirmation.title')"
    :message="$t('common.deleteConfirmation.message')"
    :confirm-text="$t('common.deleteConfirmation.confirm')"
    confirm-color="error"
    :cancel-text="$t('common.deleteConfirmation.cancel')"
    @confirm="handleDeleteConfirm"
    @cancel="cancelDelete"
  />
</template>

<style lang="scss" scoped>
// Стили для списка
:deep(.v-list) {
  .v-list-item {
    //padding: 12px 16px;
  }

  .v-checkbox {
    .v-input__control {
      flex: 0 0 auto;
    }
  }
}
</style>
