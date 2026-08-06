// src/virtual-modules.d.ts
// 为虚拟模块提供 TypeScript 类型声明

declare namespace JSX {
  interface IntrinsicElements {
    [elem: string]: any;
  }
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
    layout: string;
    tabs?: Array<{
      name: string | number;
      label?: string;
      icon?: string;
      activeIcon?: string;
      to?: string;
      badge?: string | number;
      dot?: boolean;
    }>;
    noNavPages: string[];
    loginPath?: string;
    remoteRoutes?: boolean;
    sm4Key?: string;
    request?: {
      baseURL: string;
      tokenPrefix?: string;
      tokenKey?: string;
      timeout?: number;
    };
  };
}

declare module 'virtual:api' {
  export const api: any;
}

declare module 'virtual:setup-app' {
  const setup: () => void;
  export default setup;
}
