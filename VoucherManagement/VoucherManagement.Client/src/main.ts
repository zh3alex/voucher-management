import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { setAuth0Client } from './auth0Client'

const pinia = createPinia()
const app = createApp(App)

app.use(router).use(pinia)

app.mount('#app')

setAuth0Client(app.config.globalProperties.$auth0)