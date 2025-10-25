<script setup lang="ts">
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import { Underline } from '@tiptap/extension-underline'
import { StarterKit } from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { VForm } from 'vuetify/components/VForm'
import type { EditKanbanItem, KanbanItem } from './types'
import { requiredValidator } from '@crudui/utils/validators'
import AppDrawerHeaderSection from '@crudui/components/AppDrawerHeaderSection.vue'

// Placeholder avatar URLs
const avatar1 = 'https://ui-avatars.com/api/?name=John+Doe&background=random'
const avatar2 = 'https://ui-avatars.com/api/?name=Jane+Smith&background=random'
const avatar3 = 'https://ui-avatars.com/api/?name=Robert+Johnson&background=random'
const avatar4 = 'https://ui-avatars.com/api/?name=Lucy+Brown&background=random'
const avatar5 = 'https://ui-avatars.com/api/?name=Mike+White&background=random'
const avatar6 = 'https://ui-avatars.com/api/?name=Anna+Black&background=random'

interface Emit {
  (e: 'update:isDrawerOpen', value: boolean): void
  (e: 'update:kanbanItem', value: EditKanbanItem): void
  (e: 'deleteKanbanItem', value: EditKanbanItem): void
}

const props = withDefaults(defineProps<{
  kanbanItem?: EditKanbanItem | undefined
  isDrawerOpen: boolean
}>(), {
  kanbanItem: () => ({
    item: {
      title: '',
      dueDate: '2022-01-01T00:00:00Z',
      labels: [],
      members: [],
      id: 0,
      attachments: 0,
      commentsCount: 0,
      image: '',
      comments: '',
    },
    boardId: 0,
    boardName: '',
  }),
})

const emit = defineEmits<Emit>()

const refEditTaskForm = ref<VForm>()
const labelOptions = ['UX', 'Image', 'Code Review', 'Dashboard', 'App', 'Charts & Maps']

const localKanbanItem = ref<KanbanItem>(JSON.parse(JSON.stringify(props.kanbanItem.item)))

const handleDrawerModelValueUpdate = (val: boolean) => {
  emit('update:isDrawerOpen', val)

  if (!val)
    refEditTaskForm.value?.reset()
}

// kanban item watcher
watch(() => props.kanbanItem, () => {
  localKanbanItem.value = JSON.parse(JSON.stringify(props.kanbanItem.item))
}, { deep: true })

const updateKanbanItem = () => {
  refEditTaskForm.value?.validate().then(async valid => {
    if (valid.valid) {
      emit('update:kanbanItem', { item: localKanbanItem.value, boardId: props.kanbanItem.boardId, boardName: props.kanbanItem.boardName })
      emit('update:isDrawerOpen', false)
      await nextTick()
      refEditTaskForm.value?.reset()
    }
  })
}

// delete kanban item
const deleteKanbanItem = () => {
  emit('deleteKanbanItem', { item: localKanbanItem.value, boardId: props.kanbanItem.boardId, boardName: props.kanbanItem.boardName })
  emit('update:isDrawerOpen', false)
}

// 👉 label/chip color
const resolveLabelColor: any = {
  'UX': 'success',
  'Image': 'warning',
  'Code Review': 'error',
  'Dashboard': 'info',
  'App': 'secondary',
  'Charts & Maps': 'primary',
}

const users = [
  { img: avatar1, name: 'John Doe' },
  { img: avatar2, name: 'Jane Smith' },
  { img: avatar3, name: 'Robert Johnson' },
  { img: avatar4, name: 'Lucy Brown' },
  { img: avatar5, name: 'Mike White' },
  { img: avatar6, name: 'Anna Black' },
]

const fileAttached = ref()

const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Placeholder.configure({
      placeholder: 'Write a Comment...',
    }),
    Underline,
  ],
})
</script>

<template>
  <VNavigationDrawer
    data-allow-mismatch
    location="end"
    :width="370"
    temporary
    border="0"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 Header -->
    <AppDrawerHeaderSection
      title="Правка заадчи"
      @cancel="$emit('update:isDrawerOpen', false)"
    />

    <VDivider />

    <div
      class="pa-4"
      style="max-height: calc(100vh - 5rem); overflow-y: auto;"
    >
      <VForm
        v-if="localKanbanItem"
        ref="refEditTaskForm"
        @submit.prevent="updateKanbanItem"
      >
        <VCardText class="kanban-editor-drawer">
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="localKanbanItem.title"
                label="Title"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol cols="12">
              <VTextField
                v-model="localKanbanItem.dueDate"
                label="Due date"
                type="date"
              />
            </VCol>

            <VCol cols="12">
              <VSelect
                v-model="localKanbanItem.labels"
                :items="labelOptions"
                label="Label"
                multiple
                eager
              >
                <template #chip="{ item }">
                  <VChip :color="resolveLabelColor[item.raw]">
                    {{ item.raw }}
                  </VChip>
                </template>
              </VSelect>
            </VCol>

            <VCol cols="12">
              <p
                class="mb-1 text-body-2 text-high-emphasis"
                style="line-height: 15px;"
              >
                Assigned
              </p>

              <div>
                <VSelect
                  v-model="localKanbanItem.members"
                  :items="users"
                  item-title="name"
                  item-value="name"
                  multiple
                  return-object
                  variant="plain"
                  :menu-props="{
                    offset: 10,
                  }"
                  class="assignee-select"
                >
                  <template #selection="{ item }">
                    <VAvatar size="26">
                      <VImg :src="item.raw.img" />

                      <VTooltip activator="parent">
                        {{ item.raw.name }}
                      </VTooltip>
                    </VAvatar>
                  </template>

                  <template #prepend-inner>
                    <IconBtn
                      size="26"
                      variant="tonal"
                      color="secondary"
                    >
                      <VIcon
                        size="20"
                        icon="tabler-plus"
                      />
                    </IconBtn>
                  </template>
                </VSelect>
              </div>
            </VCol>

            <VCol cols="12">
              <VFileInput
                v-model="fileAttached"
                prepend-icon=""
                multiple
                variant="outlined"
                label="No file chosen"
                clearable
              >
                <template #append>
                  <VBtn variant="tonal">
                    Choose
                  </VBtn>
                </template>
              </VFileInput>
            </VCol>

            <VCol cols="12">
              <p
                class="text-body-2 text-high-emphasis mb-1"
                style="line-height: 15px;"
              >
                COMMENT
              </p>
              <div class="border rounded px-3 py-2">
                <EditorContent :editor="editor" />
                <div
                  v-if="editor"
                  class="d-flex justify-end flex-wrap gap-x-2"
                >
                  <VIcon
                    icon="tabler-bold"
                    :color="editor.isActive('bold') ? 'primary' : 'secondary'"
                    size="20"
                    @click="editor.chain().focus().toggleBold().run()"
                  />

                  <VIcon
                    :color="editor.isActive('underline') ? 'primary' : 'secondary'"
                    icon="tabler-underline"
                    size="20"
                    @click="editor.commands.toggleUnderline()"
                  />

                  <VIcon
                    :color="editor.isActive('italic') ? 'primary' : 'secondary'"
                    icon="tabler-italic"
                    size="20"
                    @click="editor.chain().focus().toggleItalic().run()"
                  />

                  <VIcon
                    :color="editor.isActive({ textAlign: 'left' }) ? 'primary' : 'secondary'"
                    icon="tabler-align-left"
                    size="20"
                    @click="editor.chain().focus().setTextAlign('left').run()"
                  />

                  <VIcon
                    :color="editor.isActive({ textAlign: 'center' }) ? 'primary' : 'secondary'"
                    icon="tabler-align-center"
                    size="20"
                    @click="editor.chain().focus().setTextAlign('center').run()"
                  />

                  <VIcon
                    :color="editor.isActive({ textAlign: 'right' }) ? 'primary' : 'secondary'"
                    icon="tabler-align-right"
                    size="20"
                    @click="editor.chain().focus().setTextAlign('right').run()"
                  />
                </div>
              </div>
            </VCol>

            <VCol cols="12">
              <VBtn
                type="submit"
                class="me-4"
              >
                Update
              </VBtn>
              <VBtn
                color="error"
                variant="tonal"
                @click="deleteKanbanItem"
              >
                Delete
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>
      </VForm>
    </div>
  </VNavigationDrawer>
</template>

<style lang="scss">
.kanban-editor-drawer {
  .assignee-select {
    .v-field__append-inner {
      .v-select__menu-icon {
        display: none;
      }
    }
  }

  .ProseMirror {
    padding: 0;
    min-block-size: 7vh !important;

    p {
      margin-block-end: 0;
    }
  }

  .ProseMirror-focused {
    outline: none !important;
  }
}
</style>
