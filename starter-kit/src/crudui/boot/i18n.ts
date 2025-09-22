import { createI18n } from 'vue-i18n'
import messages from '@crudui/i18n'

// Get stored locale from localStorage or use default
const getInitialLocale = () => {
  if (typeof window !== 'undefined') {
    const storedLocale = localStorage.getItem('app-locale')
    if (storedLocale) {
      // Remove quotes if present (from JSON storage)
      return storedLocale.replace(/^"(.*)"$/, '$1')
    }
  }
  return 'ru' // Default locale
}

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en-US',
  globalInjection: true,
  messages,
})

export default i18n
