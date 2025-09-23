<template>
  <div>
    <VSnackbar
      v-for="(notification, index) in notifications"
      :key="`${notification.timestamp}-${index}`"
      v-model="notification.show"
      :timeout="notification.timeout"
      :color="getColor(notification.type)"
      location="bottom center"
      multi-line
      @update:model-value="val => !val && remove(index)"
    >
      <div
        class="text-subtitle-1"
        v-html="notification.message"
      />
      <template #actions>
        <VBtn
          color="secondary"
          variant="flat"
          @click="notification.show = false"
        >
          {{ $t('common.close') }}
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
