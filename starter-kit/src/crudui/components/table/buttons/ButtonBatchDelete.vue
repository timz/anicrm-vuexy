<template>
  <v-btn
    color="error"
    variant="text"
    size="small"
    @click="showConfirmDialog = true"
  >
    <v-icon>mdi-delete</v-icon>
    {{ $t('common.deleteSelected') }}
  </v-btn>

  <v-dialog v-model="showConfirmDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">
        {{ $t('common.deleteConfirmation') }}
      </v-card-title>
      <v-card-text>
        {{ $t('common.deleteConfirmMessage') }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="showConfirmDialog = false"
        >
          {{ $t('common.cancel') }}
        </v-btn>
        <v-btn
          color="error"
          @click="confirmDelete"
        >
          {{ $t('common.delete') }}
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
