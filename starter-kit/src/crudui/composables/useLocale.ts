import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useLocale as useVuetifyLocale } from 'vuetify'
import LocaleService, { type LocaleConfig } from '@crudui/services/LocaleService'

export { type LocaleConfig }
export const availableLocales = LocaleService.availableLocales

export const useLocale = () => {
  const vuetifyLocale = useVuetifyLocale()
  const { locale: i18nLocale } = useI18n({ useScope: 'global' })

  // Persistent storage for locale using LocaleService key
  const storedLocale = useStorage(
    'app-locale',
    LocaleService.getInitialLocale(),
  )

  // Current locale config (using shallowRef for better performance)
  const currentLocaleConfig = shallowRef<LocaleConfig | null>(
    LocaleService.getLocaleConfig(i18nLocale.value),
  )

  // Update current config when locale changes
  watchEffect(() => {
    currentLocaleConfig.value = LocaleService.getLocaleConfig(i18nLocale.value)
  })

  // Sync Vuetify locale with i18n locale
  const syncVuetifyLocale = (locale: string) => {
    const vuetifyCode = LocaleService.getVuetifyLocale(locale)
    if (vuetifyLocale.current) {
      vuetifyLocale.current.value = vuetifyCode
    }
  }

  // Set locale for both i18n and Vuetify
  const setLocale = (locale: string) => {
    // Validate locale using LocaleService
    locale = LocaleService.validateLocale(locale)

    // Update i18n locale
    i18nLocale.value = locale

    // Update Vuetify locale
    syncVuetifyLocale(locale)

    // Store in localStorage using LocaleService
    LocaleService.saveLocale(locale)
    storedLocale.value = locale

    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', locale)
    }

    return locale
  }

  // Initialize locale on first load
  const initializeLocale = () => {
    const initialLocale = LocaleService.getInitialLocale()

    setLocale(initialLocale)
  }

  // Auto-detect browser locale
  const detectAndSetBrowserLocale = () => {
    const detectedLocale = LocaleService.detectBrowserLocale()
    if (detectedLocale) {
      setLocale(detectedLocale)

      return detectedLocale
    }

    return null
  }

  // Watch for i18n locale changes and sync with Vuetify
  watch(i18nLocale, newLocale => {
    if (newLocale !== storedLocale.value) {
      syncVuetifyLocale(newLocale)
      LocaleService.saveLocale(newLocale)
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
    currentLocaleConfig: readonly(currentLocaleConfig),
    setLocale,
    initializeLocale,
    detectAndSetBrowserLocale,
    storedLocale: readonly(storedLocale),
    getShortCode: LocaleService.getShortCode,
  }
}
