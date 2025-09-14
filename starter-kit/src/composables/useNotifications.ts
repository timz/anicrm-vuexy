import { ref } from "vue";

export interface NotificationItem {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  timeout?: number;
}

// Глобальное состояние уведомлений
const notifications = ref<NotificationItem[]>([]);

let nextId = 1;

export const useNotifications = () => {
  const add = (
    message: string,
    type: NotificationItem["type"],
    timeout = 5000,
  ) => {
    const id = `notification-${nextId++}`;
    const notification: NotificationItem = {
      id,
      message,
      type,
      timeout,
    };

    notifications.value.push(notification);

    // Автоматическое удаление
    if (timeout > 0) {
      setTimeout(() => {
        remove(id);
      }, timeout);
    }

    return id;
  };

  const remove = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  const clear = () => {
    notifications.value.length = 0;
  };

  const positive = (message: string, timeout?: number) =>
    add(message, "success", timeout);
  const negative = (message: string, timeout?: number) =>
    add(message, "error", timeout);
  const warning = (message: string, timeout?: number) =>
    add(message, "warning", timeout);
  const info = (message: string, timeout?: number) =>
    add(message, "info", timeout);

  return {
    notifications,
    add,
    remove,
    clear,
    positive,
    negative,
    warning,
    info,
  };
};