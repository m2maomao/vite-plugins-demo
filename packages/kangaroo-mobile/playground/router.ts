import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from './HomePage.vue'
import DemoPage from './DemoPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  // 所有 demo 路由使用同一个 DemoPage 组件，根据路径动态加载
  {
    path: '/:demo',
    name: 'demo',
    component: DemoPage,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
