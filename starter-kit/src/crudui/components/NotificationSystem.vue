<template>
  <v-snackbar
    v-if="currentNotification"
    v-model="showSnackbar"
    :timeout="currentNotification.timeout"
    :color="getColor(currentNotification.type)"
    location="bottom right"
    variant="elevated"
  >
    <div class="d-flex align-center">
      <v-icon class="me-2">{{ getIcon(currentNotification.type) }}</v-icon>
      {{ currentNotification.message }}
    </div>
    
    <template #actions>
      <v-btn
        icon="mdi-close"
        size="small"
        variant="text"
        @click="closeCurrentNotification"
      />
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useNotifications } from '@crudui/composables/useNotifications'

const { notifications, remove } = useNotifications()

const showSnackbar = ref(false)
const currentNotification = computed(() => notifications.value[0] || null)

// Показываем snackbar когда есть уведомления
watch(currentNotification, (newNotification) => {
  if (newNotification) {
    showSnackbar.value = true
  } else {
    showSnackbar.value = false
  }
}, { immediate: true })

// Когда snackbar закрывается, удаляем текущее уведомление
watch(showSnackbar, (newValue) => {
  if (!newValue && currentNotification.value) {
    remove(currentNotification.value.id)
  }
})

const getColor = (type: string) => {
  switch (type) {
    case 'success': return 'success'
    case 'error': return 'error'
    case 'warning': return 'warning'
    case 'info': return 'info'
    default: return 'primary'
  }
}

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return 'mdi-check-circle'
    case 'error': return 'mdi-alert-circle'
    case 'warning': return 'mdi-alert'
    case 'info': return 'mdi-information'
    default: return 'mdi-bell'
  }
}

const closeCurrentNotification = () => {
  showSnackbar.value = false
}
</script>