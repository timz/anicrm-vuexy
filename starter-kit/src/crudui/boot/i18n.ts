import { createI18n } from 'vue-i18n'
import messages from '@crudui/i18n'

export const i18n = createI18n({
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'en-US',
  globalInjection: false,
  messages
})

export default i18n