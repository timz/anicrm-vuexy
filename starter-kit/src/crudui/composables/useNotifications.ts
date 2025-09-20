import { ref } from 'vue'

export interface NotificationItem {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  timeout: number
  show: boolean
  timestamp: number
}

// Глобальное состояние уведомлений
const notifications = ref<NotificationItem[]>([])

export const useNotifications = () => {
  const add = (
    message: string,
    type: NotificationItem['type'],
    timeout = 5000,
  ) => {
    const notification: NotificationItem = {
      message,
      type,
      timeout,
      show: true,
      timestamp: Date.now(),
    }

    notifications.value.push(notification)
  }

  const remove = (index: number) => {
    notifications.value.splice(index, 1)
  }

  const clear = () => {
    notifications.value.length = 0
  }

  const positive = (message: string, timeout?: number) =>
    add(message, 'success', timeout)

  const negative = (message: string, timeout?: number) =>
    add(message, 'error', timeout)

  const warning = (message: string, timeout?: number) =>
    add(message, 'warning', timeout)

  const info = (message: string, timeout?: number) =>
    add(message, 'info', timeout)

  return {
    notifications,
    add,
    remove,
    clear,
    positive,
    negative,
    warning,
    info,
  }
}
