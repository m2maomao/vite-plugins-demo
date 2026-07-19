import YhmIcon from './icon.vue';
import type { App } from 'vue';

YhmIcon.install = (app: App) => {
  app.component('YhmIcon', YhmIcon);
};

export { YhmIcon };
export default YhmIcon;
