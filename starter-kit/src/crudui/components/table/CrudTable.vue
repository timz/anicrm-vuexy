<template>
  <v-card>
    <!-- Actions Bar -->
    <div class="d-flex flex-wrap gap-4 ma-6">
      <div class="d-flex align-center gap-2">
        <slot v-if="$slots['actionsSection']" name="actionsSection" />

        <template v-if="dataListProvider.selectedIds.value.length > 0">
          <button-batch-delete @confirmDelete="deleteSelected()" />
        </template>
      </div>

      <v-spacer />

      <div class="d-flex gap-2 align-center">
        <v-btn
          variant="text"
          icon="mdi-refresh"
          color="default"
          :disabled="loading"
          @click="refresh()"
        />

        <v-btn
          v-if="$slots['filterForm']"
          variant="text"
          icon="mdi-filter-variant"
          :color="filterPanel ? 'primary' : 'default'"
          @click="filterPanel = !filterPanel"
        />
      </div>
    </div>

    <v-divider v-if="$slots['filterForm'] && filterPanel" />

    <!-- Filter Panel -->
    <v-expand-transition>
      <div
        v-if="$slots['filterForm'] && filterPanel"
        class="ma-6"
      >
        <v-form ref="filterFormRef" @submit.prevent="applyFilter">
          <v-row class="v-row-form">
            <slot name="filterForm" />
          </v-row>

          <div class="d-flex mt-4 gap-2">
            <crud-button-primary :disabled="loading" @click="applyFilter()">
              Применить
            </crud-button-primary>
            <crud-button-secondary :disabled="loading" @click="resetFilter()">
              Сброс
            </crud-button-secondary>
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
      density="comfortable"
      @update:options="onOptionsUpdate"
      @update:sort-by="onSortByUpdate"
    >
      <!-- Custom column slots -->
      <template
        v-for="col in columnsWithSlots"
        :key="col.name"
        #[`item.${col.name}`]="{ item, value }"
      >
        <slot
          :name="`body-cell-${col.name}`"
          :row="item"
          :value="value"
          :col="col"
        />
      </template>

      <!-- Actions column -->
      <template #item.actions="{ item }">
        <div class="d-flex align-center justify-end ga-1">
          <v-btn
            icon
            v-for="action in getVisibleActions(item)"
            :key="action.name"
            :color="action.color"
            class="pa-0 ma-0"
            density="compact"
            variant="text"
            @click="action.handler(item)"
          >
            <v-icon>{{ action.icon }}</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script setup lang="ts">
import { computed, inject, type Ref, ref, useSlots } from "vue";
import type {
  CrudRowAction,
  UseCrudDataListReturn,
} from "@crudui/providers/useCrudDataList";
import ButtonBatchDelete from "@crudui/components/table/buttons/ButtonBatchDelete.vue";
import CrudButtonPrimary from "@crudui/components/buttons/CrudButtonPrimary.vue";
import CrudButtonSecondary from "@crudui/components/buttons/CrudButtonSecondary.vue";

const filterPanel = ref(false);
const slots = useSlots();

const dataListProvider = inject<UseCrudDataListReturn>("dataListProvider");

if (!dataListProvider) {
  throw new Error("dataListProvider not provided");
}

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
} = dataListProvider;

const filterFormRef = ref();

// Convert columns to Vuetify headers format
const tableHeaders = computed(() => {
  const headers = columns.map((col) => ({
    title: col.label || col.name,
    key: col.field || col.name, // Use field for sorting key, fallback to name
    value: col.field || col.name,
    sortable: col.sortable !== false,
    align: col.align || "start",
    width: col.style?.includes("width") ? undefined : col.style,
  }));

  // Add actions column if there are row actions
  if (rowActions.length > 0) {
    headers.push({
      title: "Действия",
      key: "actions",
      value: "actions",
      sortable: false,
      align: "end",
      width: "100px",
    });
  }

  return headers;
});

// Sort by for v-data-table
const sortBy = ref([]);

// Filter columns that have custom slots
const columnsWithSlots = computed(() => {
  return columns.filter((col) => col.name && slots[`body-cell-${col.name}`]);
});

const getVisibleActions = (item: unknown): CrudRowAction<unknown>[] => {
  return rowActions.filter((action) => !action.show || action.show(item));
};
const onOptionsUpdate = async (options: any) => {
  const { page, itemsPerPage } = options;

  // Update pagination state
  updatePagination({
    page,
    rowsPerPage: itemsPerPage,
    sortBy: pagination.value.sortBy,
    descending: pagination.value.descending,
  });

  await loadList();
};

const onSortByUpdate = async (newSortBy: any) => {
  if (newSortBy && newSortBy.length > 0) {
    const sortKey = newSortBy[0].key;
    let isDescending = newSortBy[0].order === "desc";

    // Handle 3-state toggle logic: asc -> desc -> none -> asc...
    if (pagination.value.sortBy === sortKey) {
      if (!pagination.value.descending) {
        // Currently ascending, switch to descending
        isDescending = true;
      } else {
        // Currently descending, remove sorting
        updateSorting("", false);
        sortBy.value = [];
        await loadList();
        return;
      }
    } else {
      // Different column, start with ascending
      isDescending = false;
    }

    // Update sorting state and sortBy ref
    updateSorting(sortKey, isDescending);
    sortBy.value = [
      {
        key: sortKey,
        order: isDescending ? "desc" : "asc",
      },
    ];

    await loadList();
  } else {
    // Clear sorting if no sort specified
    updateSorting("", false);
    sortBy.value = [];
    await loadList();
  }
};

const deleteSelected = async (): Promise<void> => {
  if (selectedIds.value.length === 0) return;

  try {
    await remove(selectedIds.value);
  } catch (error) {
    console.error("Failed to delete items:", error);
  }
};

const applyFilter = async (): Promise<void> => {
  if (!filterFormRef.value) return;

  const { valid } = await filterFormRef.value.validate();
  if (!valid) return;

  // Get filter data from form elements
  const formElement = filterFormRef.value.$el as HTMLFormElement;
  const formData = new FormData(formElement);
  const filterData: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    filterData[key] = value;
  }

  // Also collect data from v-model fields
  const inputs = formElement.querySelectorAll("input, select, textarea");
  inputs.forEach((input: Element) => {
    const htmlInput = input as HTMLInputElement;
    if (htmlInput.name && htmlInput.value !== undefined) {
      filterData[htmlInput.name] = htmlInput.value;
    }
  });

  Object.assign(filter.value, filterData);
  await loadList();
};

const resetFilter = async (): Promise<void> => {
  if (filterFormRef.value) {
    filterFormRef.value.reset();
  }
  filter.value = {}
  await loadList();
};
</script>

<style lang="scss" scoped>
// Применяем стили таблицы из Vuexy
:deep(.v-data-table) {
  // Стили для заголовков таблицы
  .v-data-table__th {
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity)) !important;
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.2px;
    text-transform: uppercase;

    .v-data-table-header__content {
      display: flex;
      justify-content: space-between;
    }

    // Правильные отступы для первой и последней колонки
    &:first-child {
      padding-inline-start: 24px !important;

      &:has(.v-checkbox-btn) {
        padding-inline-start: 13px !important;
      }
    }

    &:last-child {
      padding-inline-end: 24px !important;
    }
  }

  // Стили для ячеек таблицы
  .v-data-table__td {
    padding: 12px 16px;

    // Правильные отступы для первой и последней колонки
    &:first-child {
      padding-inline-start: 24px !important;

      &:has(.v-checkbox-btn) {
        padding-inline-start: 13px !important;
      }
    }

    &:last-child {
      padding-inline-end: 24px !important;
    }
  }

  // Убираем нижний border у таблицы
  tbody tr:last-child td {
    border-bottom: none !important;
  }
}

// Класс text-no-wrap для таблицы
:deep(.text-no-wrap) {
  white-space: nowrap;
}
</style>
