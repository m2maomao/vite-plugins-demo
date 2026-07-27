import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Deer Mobile',
  description: '企业级移动端 Vite 框架',
  lang: 'zh-CN',
  lastUpdated: true,

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: '指南', link: '/guide/', activeMatch: '/guide/' },
      { text: 'API 参考', link: '/api/deer', activeMatch: '/api/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '简介', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
          ],
        },
        {
          text: '指南',
          items: [
            { text: '配置', link: '/guide/configuration' },
            { text: '路由', link: '/guide/routing' },
            { text: '布局', link: '/guide/layout' },
            { text: '插件系统', link: '/guide/plugin-system' },
            { text: 'HTTP 封装', link: '/guide/http-client' },
            { text: '鉴权', link: '/guide/auth' },
            { text: '状态管理', link: '/guide/state-management' },
            { text: '国际化', link: '/guide/i18n' },
            { text: '环境变量', link: '/guide/env' },
            { text: 'PWA 离线访问', link: '/guide/pwa' },
            { text: '部署', link: '/guide/deployment' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: 'deer()', link: '/api/deer' },
            { text: 'AppConfig', link: '/api/app-config' },
            { text: 'BuildPlugin API', link: '/api/build-plugin' },
            { text: 'RuntimePlugin API', link: '/api/runtime-plugin' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/maomao/vite-plugins-demo' }],

    footer: {
      message: 'MIT License',
      copyright: 'Copyright 2026 Deer Mobile',
    },

    search: {
      provider: 'local',
    },
  },
});
