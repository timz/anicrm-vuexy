import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import pinia from './stores'
import './styles.scss'
import i18n  from '@crud/boot/i18n'


const app = createApp(App)
app.use(i18n)
app.use(vuetify)
app.use(router())
app.use(pinia)
app.mount('#app')
