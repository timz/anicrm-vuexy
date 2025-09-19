<template>
  <div>
    <VSnackbar
      v-for="(notification, index) in notifications"
      :key="`${notification.timestamp}-${index}`"
      v-model="notification.show"
      :timeout="notification.timeout"
      :color="getColor(notification.type)"
      location="top right"
      multi-line
      @update:model-value="val => !val && remove(index)"
    >
      {{ notification.message }}
      <template #actions>
        <VBtn
          variant="text"
          @click="notification.show = false"
        >
          Закрыть
        </VBtn>
      </template>
    </VSnackbar>
  </div>
</template>

<script setup lang="ts">
import { useNotifications } from '@crudui/composables/useNotifications'

const { notifications, remove } = useNotifications()

const getColor = (type: string) => {
  switch (type) {
    case 'success': return 'success'
    case 'error': return 'error'
    case 'warning': return 'warning'
    case 'info': return 'info'
    default: return 'primary'
  }
}
</script>