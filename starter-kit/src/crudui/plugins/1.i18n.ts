import type { App } from 'vue'
import { i18n } from '@crudui/boot/i18n'

export default function (app: App) {
  app.use(i18n)
}
