// src/virtual-modules.d.ts
// 为虚拟模块提供 TypeScript 类型声明

declare module 'virtual:greeting' {
  export const greeting: string
  export const version: string
  export function getTime(): string
}


declare module 'virtual:routes' {
  import type { Component } from 'vue'

  interface RouteConfig {
    path: string
    component: () => Promise<{ default: Component }>
  }

  export const routes: RouteConfig[]
}

declare module 'virtual:app-config' {
  export const appConfig: {
    title: string
    description: string
    author: string
    base: string
    theme: {
      primaryColor: string
      darkMode: boolean
    }
    layout: 'side' | 'top' | 'mix'
  }
}