<script setup lang="ts">
import { animations, handleEnd, performTransfer } from '@formkit/drag-and-drop'
import { dragAndDrop } from '@formkit/drag-and-drop/vue'
import { VForm } from 'vuetify/components/VForm'
import type { AddNewKanbanItem, EditKanbanItem, KanbanData, KanbanState } from './types'
import KanbanCard from './KanbanCard.vue'
import { requiredValidator } from '@crudui/utils/validators'

const props = defineProps<{
  kanbanIds: number[]
  groupName: string
  boardName: string
  boardId: number
  kanbanData: KanbanData
  kanbanItems: any[]
  canAddItems: boolean
}>()

const emit = defineEmits<{
  (e: 'addNewItem', value: AddNewKanbanItem): void
  (e: 'editItem', value: EditKanbanItem | undefined): void
  (e: 'updateItemsState', value: KanbanState): void
  (e: 'deleteItem', value: EditKanbanItem): void
}>()

const refKanbanBoard = ref<HTMLElement>()
const localIds = ref<number[]>(props.kanbanIds)

const isAddNewFormVisible = ref(false)
const refForm = ref<VForm>()
const newTaskTitle = ref<string>('')

// 👉 emit add new item event
const addNewItem = () => {
  refForm.value?.validate().then(valid => {
    if (valid.valid) {
      emit('addNewItem', { itemTitle: newTaskTitle.value, boardName: props.boardName, boardId: props.boardId })
      isAddNewFormVisible.value = false
      newTaskTitle.value = ''
    }
  })
}

// 👉 initialize draggable
dragAndDrop({
  parent: refKanbanBoard,
  values: localIds,
  group: props.groupName,
  draggable: child => child.classList.contains('kanban-card'),
  plugins: [animations()],
  performTransfer: (state, data) => {
    performTransfer(state, data)

    // 👉 update items state after transfer perform
    emit('updateItemsState', { boardId: props.boardId, ids: localIds.value })
  },
  handleEnd: data => {
    handleEnd(data)

    // 👉 update items state after sorting perform
    emit('updateItemsState', { boardId: props.boardId, ids: localIds.value })
  },
})

// 👉 watch kanbanIds its is useful when you add new task
watch(() => props.kanbanIds, (newIds) => {
  localIds.value = newIds
}, { immediate: true })

// 👉 resolve item using id
const resolveItemUsingId = (id: number) => props.kanbanData.items.find(item => item.id === id)

const deleteItem = (item: EditKanbanItem) => {
  emit('deleteItem', item)
}

// 👉 reset add new item form when esc or close
const hideAddNewForm = () => {
  isAddNewFormVisible.value = false
  refForm.value?.reset()
}

// close add new item form when you loose focus from the form
onClickOutside(refForm, hideAddNewForm)

// 👉 submit form on enter and new line on shift-enter
const handleEnterKeydown = (event: { key: string; shiftKey: any }) => {
  if (event.key === 'Enter' && !event.shiftKey)
    addNewItem()
}
</script>

<template>
  <div class="kanban-board">
    <!-- 👉 board heading and title -->
    <div class="kanban-board-header pb-4">
      <h4 class="text-lg font-weight-medium text-truncate">
        {{ boardName }}
      </h4>
    </div>

    <!-- 👉 draggable task start here -->
    <div
      v-if="localIds"
      ref="refKanbanBoard"
      class="kanban-board-drop-zone rounded d-flex flex-column gap-4"
      :class="localIds.length ? 'mb-4' : ''"
    >
      <template
        v-for="id in localIds"
        :key="id"
      >
        <KanbanCard
          :item="resolveItemUsingId(id)"
          :board-id="props.boardId"
          :board-name="props.boardName"
          @delete-kanban-item="deleteItem"
          @click="emit('editItem', { item: resolveItemUsingId(id), boardId: props.boardId, boardName: props.boardName })"
        />
      </template>

      <!-- 👉 Add new Form -->
      <div
        v-if="canAddItems"
        class="add-new-form"
      >
        <h6
          class="text-base font-weight-regular cursor-pointer ms-4"
          @click="isAddNewFormVisible = !isAddNewFormVisible"
        >
          <VIcon
            size="15"
            icon="tabler-plus"
          /> Add New Item
        </h6>

        <VForm
          v-if="isAddNewFormVisible"
          ref="refForm"
          class="mt-4"
          validate-on="submit"
          @submit.prevent="addNewItem"
        >
          <div class="mb-4">
            <VTextarea
              v-model="newTaskTitle"
              :rules="[requiredValidator]"
              placeholder="Add Content"
              autofocus
              rows="2"
              @keydown.enter="handleEnterKeydown"
              @keydown.esc="hideAddNewForm"
            />
          </div>
          <div class="d-flex gap-4 flex-wrap">
            <VBtn
              size="small"
              type="submit"
            >
              Add
            </VBtn>
            <VBtn
              size="small"
              variant="tonal"
              color="secondary"
              @click="hideAddNewForm"
            >
              Cancel
            </VBtn>
          </div>
        </VForm>
      </div>
    </div>
  </div>
</template>

