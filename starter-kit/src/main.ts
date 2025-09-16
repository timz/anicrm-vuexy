import { createApp } from 'vue'

import App from '@/App.vue'
import { registerPlugins } from '@crudui/utils/plugins'

// Styles
import '@crudui/styles/template/index.scss'
import '@styles/styles.scss'

// Create vue app
const app = createApp(App)

// Register plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')
