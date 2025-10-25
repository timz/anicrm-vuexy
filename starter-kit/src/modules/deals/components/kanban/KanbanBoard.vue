<script setup lang="ts">
import KanbanBoardEditDialog from './KanbanBoardEditDialog.vue'
import KanbanItems from './KanbanItems.vue'
import type { AddNewKanbanItem, EditKanbanItem, KanbanBoard, KanbanData, KanbanState } from './types'

const props = withDefaults(defineProps<{
  kanbanData: KanbanData
  groupName?: string
}>(), {
  groupName: 'kanban',
})

const emit = defineEmits<{
  (e: 'addNewItem', value: AddNewKanbanItem): void
  (e: 'editItem', value: EditKanbanItem): void
  (e: 'deleteItem', value: EditKanbanItem): void
  (e: 'updateItemsState', value: KanbanState): void
}>()

const localKanbanData = ref<KanbanBoard[]>(props.kanbanData.boards)
const isKanbanBoardEditVisible = ref(false)
const editKanbanItem = ref<EditKanbanItem>()

// 👉 emit add new task event
const addNewItem = (item: AddNewKanbanItem) => {
  emit('addNewItem', item)
}

// 👉 edit kanban item
const editKanbanItemFn = (item: EditKanbanItem | undefined) => {
  if (item) {
    editKanbanItem.value = item
    isKanbanBoardEditVisible.value = true
  }
}

// 👉 update kanban ids
const updateStateFn = (kanbanState: KanbanState) => {
  emit('updateItemsState', kanbanState)
}

// assign the new kanban data to the local kanban data
watch(() => props.kanbanData.boards, (newBoards) => {
  localKanbanData.value = newBoards
}, { deep: true })

// 👉 emit updated task to parent
const emitUpdatedTaskFn = (item: EditKanbanItem) => {
  emit('editItem', item)
}

// 👉  delete kanban item
const deleteKanbanItemFn = (item: EditKanbanItem) => {
  emit('deleteItem', item)
}
</script>

<template>
  <div class="kanban-main-wrapper d-flex gap-4 h-100">
    <!-- 👉 kanban render  -->
    <div class="d-flex ga-6">
      <template
        v-for="kb in localKanbanData"
        :key="kb.id"
      >
        <!-- 👉 kanban task render -->
        <KanbanItems
          :group-name="groupName"
          :kanban-ids="kb.itemsIds"
          :board-name="kb.title"
          :board-id="kb.id"
          :kanban-items="kanbanData.items"
          :kanban-data="kanbanData"
          @add-new-item="addNewItem"
          @edit-item="editKanbanItemFn"
          @update-items-state="updateStateFn"
          @delete-item="deleteKanbanItemFn"
        />
      </template>
    </div>
  </div>

  <!-- kanban edit dialog -->
  <KanbanBoardEditDialog
    v-model:is-dialog-open="isKanbanBoardEditVisible"
    :kanban-item="editKanbanItem"
    @update:kanban-item="emitUpdatedTaskFn"
    @delete-kanban-item="deleteKanbanItemFn"
  />
</template>

<style lang="scss">
.kanban-main-wrapper {
  overflow: auto hidden;
  margin-inline-start: -0.6rem;
  min-block-size: calc(100vh - 10.5rem);
  padding-inline-start: 0.6rem;

  .kanban-board {
    inline-size: 16.875rem;
    min-inline-size: 16.875rem;

    .kanban-board-drop-zone {
      min-block-size: 100%;
    }
  }
}
</style>
