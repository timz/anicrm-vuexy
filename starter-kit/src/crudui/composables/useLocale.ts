import { useStorage } from '@vueuse/core'
import type { I18n } from 'vue-i18n'
import { useI18n } from 'vue-i18n'
import { useLocale as useVuetifyLocale } from 'vuetify'

const LOCALE_STORAGE_KEY = 'app-locale'
const DEFAULT_LOCALE = 'ru'
const FALLBACK_LOCALE = 'en-US'

export interface LocaleConfig {
  code: string
  name: string
  isRTL?: boolean
  vuetifyCode?: string
}

export const availableLocales: LocaleConfig[] = [
  { code: 'ru', name: 'Русский', isRTL: false, vuetifyCode: 'ru' },
  { code: 'en-US', name: 'English', isRTL: false, vuetifyCode: 'en' },
]

export const useLocale = () => {
  const vuetifyLocale = useVuetifyLocale()
  const { locale: i18nLocale, availableLocales: i18nAvailableLocales } = useI18n({ useScope: 'global' })

  // Persistent storage for locale
  const storedLocale = useStorage(LOCALE_STORAGE_KEY, DEFAULT_LOCALE)

  // Current locale config
  const currentLocaleConfig = computed(() => {
    return availableLocales.find(l => l.code === i18nLocale.value) || availableLocales[0]
  })

  // Sync Vuetify locale with i18n locale
  const syncVuetifyLocale = (locale: string) => {
    const config = availableLocales.find(l => l.code === locale)
    if (config && config.vuetifyCode && vuetifyLocale.current) {
      vuetifyLocale.current.value = config.vuetifyCode
    }
  }

  // Set locale for both i18n and Vuetify
  const setLocale = (locale: string) => {
    // Validate locale
    const isValidLocale = availableLocales.some(l => l.code === locale)
    if (!isValidLocale) {
      console.warn(`Invalid locale: ${locale}. Falling back to ${DEFAULT_LOCALE}`)
      locale = DEFAULT_LOCALE
    }

    // Update i18n locale
    i18nLocale.value = locale

    // Update Vuetify locale
    syncVuetifyLocale(locale)

    // Store in localStorage
    storedLocale.value = locale

    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', locale)
    }

    return locale
  }

  // Initialize locale on first load
  const initializeLocale = () => {
    const initialLocale = storedLocale.value || DEFAULT_LOCALE
    setLocale(initialLocale)
  }

  // Watch for i18n locale changes and sync with Vuetify
  watch(i18nLocale, (newLocale) => {
    if (newLocale !== storedLocale.value) {
      syncVuetifyLocale(newLocale)
      storedLocale.value = newLocale

      // Update HTML lang attribute
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', newLocale)
      }
    }
  })

  return {
    locale: i18nLocale,
    availableLocales,
    currentLocaleConfig,
    setLocale,
    initializeLocale,
    storedLocale: readonly(storedLocale),
  }
}