import { createI18n } from 'vue-i18n'
import messages from '@crudui/i18n'

export const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  fallbackLocale: 'ru',
  globalInjection: true,
  messages,
})

export default i18n
