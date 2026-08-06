/**
 * Deer Mobile — IM Runtime Plugin
 * createIMPlugin：IM 全局生命周期管理
 *  - 登录后自动 initIM / 登出自动 destroyIM（监听 userStore.token）
 *  - 注册 KICKED_OUT / 异地登录等全局事件处理器
 *  - 未启用 IM 的项目：不注册此插件即可，零影响
 */

import { watch } from 'vue';
import { useUserStore } from '../../src/stores';
import type { RuntimePlugin } from '../../src/runtime/types';
import { im, initIM, destroyIM, setIMHandlers } from './state';
import type { DeerIMConfig, DeerIMPluginOptions } from './types';

/**
 * 创建 IM 运行时插件
 * @example
 * ```ts
 * deer({
 *   config: { ... },
 *   runtimePlugins: [
 *     createIMPlugin({
 *       config: {
 *         systemId: '1293839010327486466',
 *         baseUrl: () => (window as any).projectConfig?.ip,
 *       },
 *       getUser: () => ({ userId: user.idCard, userName: user.name }),
 *     }),
 *   ],
 * });
 * ```
 */
export default function createIMPlugin(options: DeerIMPluginOptions = {}): RuntimePlugin {
  const autoInit = options.autoInit !== false;

  return {
    name: 'deer:im',
    priority: 3,

    // 插件工厂来源标记：code-gen 生成「import + createIMPlugin(options)」调用，保留闭包配置（如 getUser/baseUrl）
    __factory: { module: 'deer-mobile/im', name: 'createIMPlugin', args: options },

    onAppCreated: () => {
      // 注册全局事件处理器
      setIMHandlers({
        onKickedOut: options.onKickedOut,
        onLoginConflict: options.onLoginConflict,
      });
    },

    onRouterCreated: () => {
      if (!autoInit) return;
      const userStore = useUserStore();

      // 登录态联动：token 变化时自动初始化 / 销毁 IM
      watch(
        () => userStore.token,
        async (token) => {
          if (token && !im.value) {
            const user = options.getUser
              ? options.getUser()
              : ((userStore as any).user as { userId?: string; userName?: string } | undefined);
            const base = options.config as Omit<DeerIMConfig, 'userId' | 'userName'> | undefined;
            const imConfig: DeerIMConfig = {
              systemId: '',
              baseUrl: '',
              ...(base || {}),
              userId: user?.userId || '',
              userName: user?.userName || '',
            };
            // 未显式配置 token 时，默认读取 userStore.token
            if (!base?.token) {
              imConfig.token = () => userStore.token;
            }
            await initIM(imConfig);
          } else if (!token) {
            destroyIM();
          }
        },
        { immediate: true },
      );
    },
  };
}
