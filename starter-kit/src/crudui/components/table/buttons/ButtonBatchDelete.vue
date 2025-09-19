<template>
  <v-btn
    color="error"
    variant="text"
    size="small"
    @click="showConfirmDialog = true"
  >
    <v-icon>mdi-delete</v-icon>
    Удалить выбранные
  </v-btn>

  <v-dialog v-model="showConfirmDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">
        Подтверждение удаления
      </v-card-title>
      <v-card-text>
        Вы действительно хотите удалить выбранные элементы?
        Это действие нельзя отменить.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="showConfirmDialog = false"
        >
          Отмена
        </v-btn>
        <v-btn
          color="error"
          @click="confirmDelete"
        >
          Удалить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['confirmDelete'])

const showConfirmDialog = ref(false)

const confirmDelete = () => {
  emit('confirmDelete')
  showConfirmDialog.value = false
}
</script>
