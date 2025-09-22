import { deepMerge } from '@antfu/utils'
import type { App } from 'vue'
import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components/VBtn'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { en, ru } from 'vuetify/locale'
import defaults from './defaults'
import { icons } from './icons'
import { staticPrimaryColor, staticPrimaryDarkenColor, themes } from './theme'
import { themeConfig } from '@themeConfig'

// Styles
import '@crudui/styles/template/libs/vuetify/index.scss'
import 'vuetify/styles'

// Get initial locale from localStorage
const getInitialVuetifyLocale = () => {
  if (typeof window !== 'undefined') {
    const storedLocale = localStorage.getItem('app-locale')
    if (storedLocale) {
      const locale = storedLocale.replace(/^"(.*)"$/, '$1')
      // Map i18n locale to Vuetify locale
      return locale === 'en-US' ? 'en' : 'ru'
    }
  }
  return 'ru' // Default to Russian
}

export default function (app: App) {
  const cookieThemeValues = {
    defaultTheme: resolveVuetifyTheme(themeConfig.app.theme),
    themes: {
      light: {
        colors: {
          'primary': staticPrimaryColor,
          'primary-darken-1': staticPrimaryDarkenColor,
        },
      },
      dark: {
        colors: {
          'primary': staticPrimaryColor,
          'primary-darken-1': staticPrimaryDarkenColor,
        },
      },
    },
  }

  const optionTheme = deepMerge({ themes }, cookieThemeValues)

  const vuetify = createVuetify({
    aliases: {
      IconBtn: VBtn,
    },
    components: {
      VDateInput,
    },
    defaults,
    icons,
    theme: optionTheme,
    locale: {
      locale: getInitialVuetifyLocale(),
      fallback: 'en',
      messages: { en, ru },
    },
  })

  app.use(vuetify)
}
