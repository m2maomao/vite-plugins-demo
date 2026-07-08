import type { App } from 'vue'
import { YhmIcon } from './components/icon'

const components = [YhmIcon]

export function install(app: App) {
  components.forEach((c) => {
    app.component(c.name!, c)
  })
}

export { YhmIcon }
export default { install }