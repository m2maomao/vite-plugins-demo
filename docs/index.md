---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Deer Mobile"
  text: "企业级移动端 Vite 框架"
  tagline: 基于 Vite 8 + Vue 3 + TypeScript 6，开箱即用的移动端开发框架
  image:
    src: /logo.svg
    alt: Deer Mobile
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 配置指南
      link: /guide/configuration

features:
  - title: 🚀 约定式路由
    details: 文件系统自动扫描，支持动态路由、嵌套路由、路由元数据，无需手动配置路由表
  - title: 🧩 插件系统
    details: BuildPlugin（构建时）+ RuntimePlugin（运行时），双阶段插件架构，覆盖应用全生命周期
  - title: 🎨 多布局系统
    details: LayoutResolver 调度器 + 自动扫描 + 嵌套布局链 + KeepAlive + 滚动恢复
  - title: 📦 UI 组件库
    details: 集成 kangaroo-mobile，54 个 Vant 4 二次封装组件，开箱即用
  - title: 🔐 企业级能力
    details: SM4 加解密、业务状态码体系、Token 管理、Loading 队列、自动注入 API 模块
  - title: 🌐 国际化
    details: vue-i18n 集成，框架层 + UI 层双语言切换，自动同步
---
