// src/virtual-modules.d.ts
// 为虚拟模块提供 TypeScript 类型声明

declare module 'virtual:greeting' {
  export const greeting: string;
  export const version: string;
  export function getTime(): string;
}

declare module 'virtual:routes' {
  import type { Component } from 'vue';

  interface RouteConfig {
    path: string;
    component: () => Promise<{ default: Component }>;
  }

  export const routes: RouteConfig[];
}

declare module 'virtual:app-config' {
  export const appConfig: {
    title: string;
    description: string;
    author: string;
    base: string;
    theme: {
      primaryColor: string;
      darkMode: boolean;
    };
    layout: 'side' | 'top' | 'mix';
    noNavPages: string[];
    request: {
      baseURL: string;
    };
    /**
     * SM4 加密密钥（hex 格式，32 位十六进制字符串）
     * 不配置则不启用请求/响应加解密
     * PC 端可使用同一密钥配合 sm-crypto 做加解密
     */
    sm4Key?: string;
    /** 国际化 i18n 配置 */
    i18n?: {
      /** 默认语言，如 'zh-CN' */
      locale: string;
      /** 回退语言 */
      fallbackLocale?: string;
      /** vue-i18n 格式的翻译文案 */
      messages?: Record<string, Record<string, Record<string, string>>>;
    };
  };
}

declare module 'virtual:layout-registry' {
  import type { Component } from 'vue';

  export const layoutRegistry: Record<string, Component>;
}

declare module 'virtual:api' {
  /** API 模块定义：每个 .ts 文件导出的函数签名 */
  type ApiModule<T> = (inject: {
    $get: <T = unknown>(url: string, config?: import('axios').AxiosRequestConfig) => Promise<T>;
    $post: <T = unknown>(url: string, data?: unknown, config?: import('axios').AxiosRequestConfig) => Promise<T>;
    $put: <T = unknown>(url: string, data?: unknown, config?: import('axios').AxiosRequestConfig) => Promise<T>;
    $delete: <T = unknown>(url: string, config?: import('axios').AxiosRequestConfig) => Promise<T>;
  }) => T;

  export const api: {
    [moduleName: string]: Record<string, (...args: any[]) => Promise<any>>;
    user: {
      login: (data: { username: string; password: string }) => Promise<{ status: number; data: { token: string } }>;
      getProfile: (id: number) => Promise<{ status: number; data: { id: number; name: string; email: string } }>;
    };
  };
}
