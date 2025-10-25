<script setup lang="ts">
import KanbanBoard from './KanbanBoard.vue'
import type { AddNewKanbanItem, EditKanbanItem, KanbanState, RenameKanbanBoard } from './types'
import { useKanban } from './useKanban'

// 👉 Use kanban composable
const {
  kanban,
  addNewBoard,
  deleteBoard,
  renameTheBoard,
  addNewItem,
  editItemFn,
  deleteItemFn,
  updateItemState,
  updateBoardState,
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

// 👉 delete board
const handleDeleteBoard = async (boardId: number) => {
  await deleteBoard(boardId)
}

// 👉 rename board
const handleRenameBoard = async (kanbanBoard: RenameKanbanBoard) => {
  await renameTheBoard(kanbanBoard)
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

// 👉 update board state
const handleUpdateBoardState = async (kanbanBoardIds: number[]) => {
  await updateBoardState(kanbanBoardIds)
}
</script>

<template>
  <KanbanBoard
    v-if="kanban"
    :kanban-data="kanban"
    @add-new-board="handleAddNewBoard"
    @delete-board="handleDeleteBoard"
    @rename-board="handleRenameBoard"
    @add-new-item="handleAddNewItem"
    @edit-item="handleEditItem"
    @delete-item="handleDeleteItem"
    @update-items-state="handleUpdateItemState"
    @update-board-state="handleUpdateBoardState"
  />
</template>
