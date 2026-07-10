import type { App } from 'vue'
import * as components from './components'
import './theme/index.less'
import 'vant/lib/index.css'

const install = (app: App) => {
  Object.values(components).forEach((component: any) => {
    if (component.name) {
      app.component(component.name, component)
    }
  })
}

export default { install }
export * from './components'