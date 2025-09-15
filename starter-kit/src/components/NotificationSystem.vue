<template>
  <div>
    <VSnackbar
      v-for="notification in visibleNotifications"
      :key="notification.id"
      v-model="notification.visible"
      :timeout="notification.timeout"
      :color="getColor(notification.type)"
      location="top right"
      multi-line
    >
      {{ notification.message }}
      <template #actions>
        <VBtn
          variant="text"
          @click="remove(notification.id)"
        >
          Закрыть
        </VBtn>
      </template>
    </VSnackbar>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNotifications, type NotificationItem } from '@crudui/composables/useNotifications'

interface NotificationWithVisible extends NotificationItem {
  visible: boolean
}

const { notifications, remove } = useNotifications()
const notificationStates = ref<Record<string, boolean>>({})

// Создаем вычисляемое свойство для уведомлений с visible
const visibleNotifications = computed(() => {
  return notifications.value.map(notification => ({
    ...notification,
    visible: notificationStates.value[notification.id] !== false
  } as NotificationWithVisible))
})

// Отслеживаем новые уведомления и добавляем их в состояния
watch(notifications, (newNotifications) => {
  newNotifications.forEach(notification => {
    if (!(notification.id in notificationStates.value)) {
      notificationStates.value[notification.id] = true
    }
  })
  
  // Удаляем старые состояния
  const currentIds = newNotifications.map(n => n.id)
  Object.keys(notificationStates.value).forEach(id => {
    if (!currentIds.includes(id)) {
      delete notificationStates.value[id]
    }
  })
}, { deep: true, immediate: true })

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