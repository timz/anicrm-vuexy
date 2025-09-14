import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { mdi } from 'vuetify/iconsets/mdi'
import { customTheme } from './theme'
import { ru } from 'vuetify/locale'

import { VDateInput } from 'vuetify/labs/VDateInput'

export default createVuetify({
  components: {
    VDateInput,
  },
  theme: {
    defaultTheme: 'light',
    themes: customTheme
  },
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi,
    },
  },
  locale: {
    locale: 'ru',
    fallback: 'en',
    messages: { ru }
  }
})