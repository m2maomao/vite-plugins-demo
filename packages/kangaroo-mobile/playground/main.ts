import { createApp } from 'vue'
import KangarooMobile from '@/index'
import '@/theme/index.less'
import './playground-vars.less'
import App from './App.vue'
import DemoBlock from './components/DemoBlock.vue'
import DemoNav from './components/DemoNav.vue'
import DemoSection from './components/DemoSection.vue'

const app = createApp(App)
app.component('DemoBlock', DemoBlock)
app.component('DemoNav', DemoNav)
app.component('DemoSection', DemoSection)
app.use(KangarooMobile)
app.mount('#app')