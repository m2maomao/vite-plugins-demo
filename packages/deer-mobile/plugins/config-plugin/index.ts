/**
 * Deer Mobile — Config Plugin
 *
 * 负责暴露 virtual:app-config 虚拟模块。
 * 注意：configPlugin 不再负责注册 FrameworkPlugin，
 * 请使用 deer() 入口统一管理。
 */

import type { Plugin } from 'vite';
import type { AppConfig } from '../../src/build/types';

// 默认配置
const DEFAULT_CONFIG: AppConfig = {
  title: 'My App',
  description: 'A Vite-powered app',
  author: 'zhangguolong',
  base: '/',
  theme: {
    primaryColor: '#1890ff',
    darkMode: false,
  },
  layout: 'side',
  noNavPages: ['/login', '/404'],
  request: {
    baseURL: '/api',
  },
};

const VIRTUAL_MODULE_ID = 'virtual:app-config';
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;

export default function configPlugin(options: Partial<AppConfig> = {}): Plugin {
  const mergedConfig: AppConfig = {
    ...DEFAULT_CONFIG,
    ...options,
    theme: { ...DEFAULT_CONFIG.theme, ...options.theme },
    request: { ...DEFAULT_CONFIG.request, ...options.request },
  };

  return {
    name: 'config-plugin',

    config() {
      return {
        base: mergedConfig.base,
      };
    },

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID;
      }
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return `export const appConfig = ${JSON.stringify(mergedConfig)}`;
      }
    },
  };
}
