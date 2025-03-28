import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import axios from 'axios'

// Configure axios
axios.defaults.baseURL = 'https://opentdb.com/'

// Configure Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Create Vue app
const app = createApp(App)
app.use(pinia)
app.mount('#app') 