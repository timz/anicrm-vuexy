import { ref } from 'vue'
import { database } from './db'
import type { AddNewKanbanItem, EditKanbanItem, KanbanData, KanbanState } from './types'

export function useKanban() {
  const kanban = ref<KanbanData>(JSON.parse(JSON.stringify(database)))

  // 👉 add new item
  const addNewItem = async (newItem: AddNewKanbanItem) => {
    const itemId = kanban.value.items[kanban.value.items.length - 1].id + 1

    if (newItem.itemTitle && newItem.boardName) {
      // Add the new item to the items list
      kanban.value.items.push({
        id: itemId,
        title: newItem.itemTitle,
        attachments: 0,
        comments: '',
        commentsCount: 0,
        dueDate: '',
        labels: [],
        members: [],
      })

      // find the index of board in the database
      const boardId = kanban.value.boards.findIndex(board => board.id === newItem.boardId)

      // Add the new item to the board
      kanban.value.boards[boardId].itemsIds.push(itemId)
    }
    else {
      throw new Error('Item title and board name are required')
    }
  }

  const editItemFn = async (editItem: EditKanbanItem) => {
    kanban.value.items.forEach(item => {
      if (editItem.item && item.id === editItem.item.id) {
        item.title = editItem.item.title
        item.attachments = editItem.item.attachments
        item.comments = editItem.item.comments
        item.commentsCount = editItem.item.commentsCount
        item.dueDate = editItem.item.dueDate
        item.labels = editItem.item.labels
        item.members = editItem.item.members
      }
    })
  }

  // 👉 delete item
  const deleteItemFn = async (deleteItem: EditKanbanItem) => {
    if (deleteItem.item && deleteItem.item.id) {
      const itemId = deleteItem.item.id
      kanban.value.items = kanban.value.items.filter(item => item.id !== itemId)

      kanban.value.boards.forEach(board => {
        board.itemsIds = board.itemsIds.filter(id => id !== itemId)
      })
    }
  }

  // 👉 update item state
  const updateItemState = async (kanbanState: KanbanState) => {
    kanban.value.boards.forEach(board => {
      if (board.id === kanbanState.boardId)
        board.itemsIds = kanbanState.ids
    })
  }

  return {
    kanban,
    addNewItem,
    editItemFn,
    deleteItemFn,
    updateItemState,
  }
}
