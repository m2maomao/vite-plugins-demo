/**
 * Deer Mobile — API Runtime Plugin
 *
 * 将 API 对象注入到 Vue 全局属性 $api 中。
 * 依赖 api-plugin（VitePlugin）生成 virtual:api 模块。
 *
 * api 对象通过 PluginManager 的 context.data 传入，
 * 由 setup-plugin 的代码生成器负责从 virtual:api 导入并注入。
 *
 * 优先级: 10
 * 钩子: onAppCreated（注入 $api）
 */

import type { RuntimePlugin } from '../../src/runtime/types';

const apiRuntimePlugin: RuntimePlugin = {
  name: 'deer:api',
  priority: 10,

  onAppCreated: async (app, ctx) => {
    // 从插件共享数据空间获取 api 对象
    // 由 setup-plugin 的代码生成器负责填充 ctx.data.set('api', api)
    const api = ctx.data.get('api');

    if (api) {
      app.config.globalProperties.$api = api;
      app.provide('$api', api);
    }
  },
};

export default apiRuntimePlugin;
