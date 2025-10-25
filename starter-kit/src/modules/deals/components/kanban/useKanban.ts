import { ref } from 'vue'
import { database } from './db'
import type { AddNewKanbanItem, EditKanbanItem, KanbanData, KanbanState, RenameKanbanBoard } from './types'

export function useKanban() {
  const kanban = ref<KanbanData>(JSON.parse(JSON.stringify(database)))

  // 👉 adding new board
  const addNewBoard = async (newBoardName: string) => {
    const getNewBoardId = () => {
      const newBoardId = kanban.value.boards.length + 1
      if (!(kanban.value.boards.some(board => board.id === newBoardId)))
        return newBoardId
      else
        return newBoardId + 1
    }

    if (kanban.value.boards.some(board => board.title === newBoardName)) {
      throw new Error('Board with this name already exists')
    }
    else {
      kanban.value.boards.push({
        id: getNewBoardId(),
        title: newBoardName,
        itemsIds: [],
      })
    }
  }

  // 👉 delete board
  const deleteBoard = async (boardId: number) => {
    kanban.value.boards = kanban.value.boards.filter(board => board.id !== boardId)
  }

  // 👉 rename board
  const renameTheBoard = async (kanbanBoard: RenameKanbanBoard) => {
    kanban.value.boards = kanban.value.boards.map(board => {
      if (board.id === kanbanBoard.boardId)
        board.title = kanbanBoard.newName

      return board
    })
  }

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
    addNewBoard,
    deleteBoard,
    renameTheBoard,
    addNewItem,
    editItemFn,
    deleteItemFn,
    updateItemState,
  }
}
