import type { App, Component } from 'vue';
import * as components from './components';
import './theme/index.less';
import './vant-layer.css';

const install = (app: App) => {
  Object.values(components).forEach((component: Component) => {
    if (component.name) {
      app.component(component.name, component);
    }
  });
};

export default { install };
export * from './components';
export { setLocale, getLocale, createTranslate, onLocaleChange, i18nPlugin, I18N_KEY } from './locale';
export type { LocaleLang, LocaleMessages, Translate } from './locale';
