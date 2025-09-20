# Задача: Рефакторинг системы уведомлений

## Цель
Упростить существующую систему уведомлений, убрав оверинжиниринг и используя встроенные возможности Vuetify Snackbar.

## Текущие проблемы
1. Двойное управление состоянием (notifications + notificationStates)
2. Излишняя сложность с computed свойством visibleNotifications
3. Ручная генерация и управление ID уведомлений
4. Дублирование логики timeout

## Требования к новой реализации

### 1. Упростить composable `useNotifications.ts`
- Убрать генерацию ID - использовать индексы массива или timestamp
- Упростить структуру NotificationItem - убрать лишние поля
- Сохранить существующий API (positive, negative, warning, info)
- **УБРАТЬ ручное автоудаление через setTimeout** - VSnackbar делает это сам

### 2. Переписать компонент `NotificationSystem.vue`
- Использовать одно состояние вместо двух
- Убрать сложную логику с watch и computed
- Использовать v-model напрямую с массивом уведомлений
- Реализовать стек уведомлений (несколько одновременно видимых)
- Полагаться на встроенный timeout VSnackbar для автоскрытия

### 3. Сохранить совместимость
- API composable должен остаться прежним
- Все существующие вызовы notifications.positive/negative/warning/info должны продолжать работать
- Timeout передается в VSnackbar, который сам управляет автоскрытием

## Пример желаемой реализации

### useNotifications.ts (упрощенный):
```typescript
interface NotificationItem {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  timeout: number
  show: boolean
  timestamp: number // для уникального key в v-for
}

const notifications = ref<NotificationItem[]>([])

const add = (message: string, type: NotificationItem['type'], timeout = 5000) => {
  const notification: NotificationItem = {
    message,
    type,
    timeout,
    show: true,
    timestamp: Date.now()
  }

  notifications.value.push(notification)

  // НЕ нужен setTimeout - VSnackbar сам вызовет update:modelValue
}

const remove = (index: number) => {
  notifications.value.splice(index, 1)
}
```

### NotificationSystem.vue (упрощенный):
```vue
<template>
  <div>
    <VSnackbar
      v-for="(notification, index) in notifications"
      :key="`${notification.timestamp}-${index}`"
      v-model="notification.show"
      :timeout="notification.timeout"
      :color="notification.type"
      location="top right"
      @update:model-value="(val) => !val && remove(index)"
    >
      {{ notification.message }}
    </VSnackbar>
  </div>
</template>
```

**ВАЖНО**: При `@update:model-value` с `false` (когда timeout истекает или пользователь закрывает) - ОБЯЗАТЕЛЬНО удалять элемент из массива, иначе будет утечка памяти!

## Важные моменты
1. Проверить, что все места использования продолжают работать
2. Убедиться, что уведомления корректно отображаются и исчезают
3. Протестировать одновременный показ нескольких уведомлений
4. Сохранить существующий функционал кнопки "Закрыть"

## Файлы для изменения
- `starter-kit/src/crudui/composables/useNotifications.ts`
- `starter-kit/src/crudui/components/templates/NotificationSystem.vue`
- НЕ трогать `starter-kit/src/crudui/boot/notification.ts` и места использования