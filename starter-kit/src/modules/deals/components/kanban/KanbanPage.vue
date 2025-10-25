<script setup lang="ts">
import KanbanBoard from './KanbanBoard.vue'
import type { AddNewKanbanItem, EditKanbanItem, KanbanState } from './types'
import { useKanban } from './useKanban'

// 👉 Use kanban composable
const {
  kanban,
  addNewBoard,
  addNewItem,
  editItemFn,
  deleteItemFn,
  updateItemState,
} = useKanban()

// 👉 adding new board
const handleAddNewBoard = async (newBoardName: string) => {
  try {
    await addNewBoard(newBoardName)
  }
  catch (error) {
    console.error('Error adding new board:', error)
  }
}

// 👉 add new item
const handleAddNewItem = async (newItem: AddNewKanbanItem) => {
  try {
    await addNewItem(newItem)
  }
  catch (error) {
    console.error('Error adding new item:', error)
  }
}

const handleEditItem = async (editItem: EditKanbanItem) => {
  await editItemFn(editItem)
}

// 👉 delete item
const handleDeleteItem = async (deleteItem: EditKanbanItem) => {
  await deleteItemFn(deleteItem)
}

// 👉 update item state
const handleUpdateItemState = async (kanbanState: KanbanState) => {
  await updateItemState(kanbanState)
}
</script>

<template>
  <KanbanBoard
    v-if="kanban"
    :kanban-data="kanban"
    @add-new-board="handleAddNewBoard"
    @add-new-item="handleAddNewItem"
    @edit-item="handleEditItem"
    @delete-item="handleDeleteItem"
    @update-items-state="handleUpdateItemState"
  />
</template>
