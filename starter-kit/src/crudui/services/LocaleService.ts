export interface LocaleConfig {
  code: string
  name: string
  isRTL?: boolean
  vuetifyCode?: string
  flag?: string
}

class LocaleService {
  private static readonly LOCALE_STORAGE_KEY = 'app-locale'
  private static readonly DEFAULT_LOCALE = 'ru'
  private static readonly FALLBACK_LOCALE = 'en-US'

  static readonly availableLocales: LocaleConfig[] = [
    {
      code: 'ru',
      name: 'Русский',
      isRTL: false,
      vuetifyCode: 'ru',
      flag: '🇷🇺',
    },
    {
      code: 'en-US',
      name: 'English',
      isRTL: false,
      vuetifyCode: 'en',
      flag: '🇬🇧',
    },
    {
      code: 'uk',
      name: 'Українська',
      isRTL: false,
      vuetifyCode: 'uk',
      flag: '🇺🇦',
    },
  ]

  static readonly localeToVuetifyMap: Record<string, string> = {
    'ru': 'ru',
    'en-US': 'en',
    'uk': 'uk',
  }

  static getInitialLocale(): string {
    if (typeof window === 'undefined') {
      return this.DEFAULT_LOCALE
    }

    const storedLocale = this.getStoredLocale()
    if (storedLocale && this.isValidLocale(storedLocale)) {
      return storedLocale
    }

    const browserLocale = this.detectBrowserLocale()
    if (browserLocale && this.isValidLocale(browserLocale)) {
      return browserLocale
    }

    return this.DEFAULT_LOCALE
  }

  static getStoredLocale(): string | null {
    if (typeof window === 'undefined') {
      return null
    }

    const stored = localStorage.getItem(this.LOCALE_STORAGE_KEY)
    if (stored) {
      return stored.replace(/^"(.*)"$/, '$1')
    }

    return null
  }

  static saveLocale(locale: string): void {
    if (typeof window === 'undefined') {
      return
    }

    localStorage.setItem(this.LOCALE_STORAGE_KEY, locale)
  }

  static isValidLocale(locale: string): boolean {
    return this.availableLocales.some(l => l.code === locale)
  }

  static validateLocale(locale: string): string {
    if (this.isValidLocale(locale)) {
      return locale
    }

    console.warn(`Invalid locale: ${locale}. Falling back to ${this.DEFAULT_LOCALE}`)

    return this.DEFAULT_LOCALE
  }

  static getVuetifyLocale(locale: string): string {
    const config = this.availableLocales.find(l => l.code === locale)

    return config?.vuetifyCode || this.localeToVuetifyMap[locale] || 'en'
  }

  static getInitialVuetifyLocale(): string {
    const locale = this.getInitialLocale()

    return this.getVuetifyLocale(locale)
  }

  static detectBrowserLocale(): string | null {
    if (typeof navigator === 'undefined') {
      return null
    }

    const browserLanguage = navigator.language

    const exactMatch = this.availableLocales.find(
      locale => locale.code.toLowerCase() === browserLanguage.toLowerCase(),
    )

    if (exactMatch) {
      return exactMatch.code
    }

    const languageCode = browserLanguage.split('-')[0].toLowerCase()

    const partialMatch = this.availableLocales.find(
      locale => locale.code.toLowerCase().startsWith(languageCode),
    )

    if (partialMatch) {
      return partialMatch.code
    }

    return null
  }

  static getLocaleConfig(locale: string): LocaleConfig | null {
    return this.availableLocales.find(l => l.code === locale) || null
  }

  static getShortCode(locale: string): string {
    const codes: Record<string, string> = {
      'ru': 'RU',
      'en-US': 'EN',
      'uk': 'UA',
    }

    return codes[locale] || locale.toUpperCase().slice(0, 2)
  }
}

export default LocaleService
