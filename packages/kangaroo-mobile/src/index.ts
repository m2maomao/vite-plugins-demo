import type { App } from 'vue'
import * as components from './components'
import './theme/index.less'
import 'vant/lib/index.css'
import 'vant/lib/image/index.css'
import 'vant/lib/checkbox/index.css'

const install = (app: App) => {
  Object.values(components).forEach((component: any) => {
    if (component.name) {
      app.component(component.name, component)
    }
  })
}

export default { install }
export * from './components'
export { setLocale, getLocale, createTranslate, onLocaleChange, i18nPlugin, I18N_KEY } from './locale'
export type { LocaleLang, LocaleMessages, Translate } from './locale'