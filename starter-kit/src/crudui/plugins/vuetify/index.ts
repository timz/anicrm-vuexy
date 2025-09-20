import { deepMerge } from '@antfu/utils'
import type { App } from 'vue'
import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components/VBtn'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { ru } from 'vuetify/locale'
import defaults from './defaults'
import { icons } from './icons'
import { staticPrimaryColor, staticPrimaryDarkenColor, themes } from './theme'
import { themeConfig } from '@themeConfig'
// Styles
import '@crudui/styles/template/libs/vuetify/index.scss'
import 'vuetify/styles'
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
      locale: 'ru',
      fallback: 'en',
      messages: { ru },
    },
  })
  app.use(vuetify)
}
