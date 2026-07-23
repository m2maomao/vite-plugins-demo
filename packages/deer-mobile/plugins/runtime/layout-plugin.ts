/**
 * Deer Mobile — Layout RuntimePlugin
 *
 * 使用 rootContainer 注入 DefaultLayout（含头部/底部导航）。
 * 使用 defineAsyncComponent 延迟加载 layout，避免 build 时打包 virtual:app-config。
 */

import { h, defineAsyncComponent } from 'vue';
import type { RuntimePlugin } from '../../src/runtime/types';

const AsyncLayout = defineAsyncComponent(() => import('../../src/layouts/index'));

const layoutRuntimePlugin: RuntimePlugin = {
  name: 'deer:layout',
  priority: 0,
  rootContainer() {
    return () => h(AsyncLayout);
  },
};

export default layoutRuntimePlugin;
