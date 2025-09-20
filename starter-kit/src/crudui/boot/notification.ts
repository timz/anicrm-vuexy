// Notification service for Vuetify using composable
import { useNotifications } from '@crudui/composables/useNotifications'

const { positive, negative, warning, info } = useNotifications()

export const notifications = {
  positive,
  negative,
  warning,
  info,
}

export default notifications
