import { createApp } from 'vue'
import KangarooMobile from '@/index'
import '@/theme/index.less'
import App from './App.vue'

const app = createApp(App)
app.use(KangarooMobile)
app.mount('#app')