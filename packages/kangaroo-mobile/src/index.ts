import type { App } from 'vue'
import * as components from './components'
import './theme/index.less'

const install = (app: App) => {
  Object.values(components).forEach((component: any) => {
    if (component.name) {
      app.component(component.name, component)
    }
  })
}

export default { install }
export * from './components'