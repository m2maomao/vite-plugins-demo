import { createApp } from 'vue'
import KangarooMobile from '@/index'
import '@/theme/index.less'
import './playground-vars.less'
import App from './App.vue'
import router from './router'
import DemoBlock from './components/DemoBlock.vue'
import DemoNav from './components/DemoNav.vue'
import DemoSection from './components/DemoSection.vue'
import { addGlobalMessages } from '@/locale'

// 所有 demo 共享的通用国际化字段
addGlobalMessages({
  'zh-CN': {
    cancel: '取消',
    confirm: '确认',
    loading: '加载中...',
    title: '标题',
    search: '搜索',
    content: '内容',
  },
  'en-US': {
    cancel: 'Cancel',
    confirm: 'Confirm',
    loading: 'Loading...',
    title: 'Title',
    search: 'Search',
    content: 'Content',
  },
})

const app = createApp(App)
app.component('DemoBlock', DemoBlock)
app.component('DemoNav', DemoNav)
app.component('DemoSection', DemoSection)
app.use(KangarooMobile)
app.use(router)
app.mount('#app')
