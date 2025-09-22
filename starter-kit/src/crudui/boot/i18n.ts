import { createI18n } from 'vue-i18n'
import messages from '@crudui/i18n'
import LocaleService from '@crudui/services/LocaleService'

export const i18n = createI18n({
  legacy: false,
  locale: LocaleService.getInitialLocale(),
  fallbackLocale: 'en-US',
  globalInjection: true,
  messages,
})

export default i18n
