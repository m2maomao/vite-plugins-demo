import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import {
  scanPagesPlugin,
  builtinPlugin,
  mockPlugin,
  apiPlugin,
  deer,
  piniaRuntimePlugin,
  authRuntimePlugin,
  apiRuntimePlugin,
  themeRuntimePlugin,
  createIMPlugin,
} from 'deer-mobile';

export default defineConfig({
  plugins: [
    tailwindcss(),
    Vue(),
    VueJsx(),
    // 约定式路由扫描（src/pages/ → 路由表，顶层单文件避免嵌套布局问题）
    scanPagesPlugin({
      // 404 兜底
      pluginRoutes: [
        // 登录/协议页已用约定式路由（src/pages/login/phone.tsx、src/pages/agreement.tsx）
        { path: '/:pathMatch(.*)*', file: 'virtual:builtin/404' },
      ],
    }),
    builtinPlugin(),
    apiPlugin(),
    // 开发期 Mock：mock/*.json 自动扫描（登录/健康档案/文章/实名/OCR 等）
    mockPlugin({ enabled: true }),
    // deer() 配置：路由/布局/TabBar/IM/OCR/Chart/业务模块等
    deer({
      config: {
        title: 'CHS 健康服务',
        description: '居民健康服务 H5',
        author: 'yh-rm-chs',
        theme: {
          primaryColor: '#096aff',
          darkMode: false,
        },
        // 布局由页面 routeMeta.layout 指定（tabs/default/blank），不设全局默认
        // 关闭远程路由拉取（CHS 用约定式静态路由，避免启动时 fetch /api/routes 无后端 502 警告）
        remoteRoutes: false,
        // auth 守卫未登录跳转登录页
        loginPath: '/login/phone',
        request: {
          baseURL: '/api',
          // Authorization 不带 Bearer 前缀（YH 网关直接放 token）
          tokenPrefix: '',
          // token 存储 key（对齐原项目 TOKEN_KEY）
          tokenKey: 'chs-auth-token',
          timeout: 60000,
        },
        // TabBar 配置（首页/沟通/消息/我的）
        tabs: [
          { name: 'home', label: '首页', icon: 'wap-home-o', activeIcon: 'wap-home', to: '/' },
          { name: 'chat', label: '沟通', icon: 'chat-o', activeIcon: 'chat', to: '/chat' },
          { name: 'message', label: '消息', icon: 'bell-o', activeIcon: 'bell', to: '/message' },
          { name: 'user', label: '我的', icon: 'user-o', activeIcon: 'user', to: '/user' },
        ],
      },
      runtimePlugins: [
        piniaRuntimePlugin,
        authRuntimePlugin,
        apiRuntimePlugin,
        themeRuntimePlugin,
        // IM 能力（可选）：登录后自动初始化，登出自动销毁
        createIMPlugin({
          config: {
            systemId: '1293839010327486466',
            baseUrl: () => (window as any).projectConfig?.ip || 'http://localhost:8080',
          },
          getUser: () => {
            try {
              const user = JSON.parse(localStorage.getItem('USER_KEY') || '{}');
              return { userId: user.idCard || '', userName: user.name || '' };
            } catch {
              return null;
            }
          },
        }),
      ],
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  // 预构建配置：exclude 排除 vite.config 中 import 'deer-mobile' 主入口（其导出的 setup-plugin/pwa 构建插件
  // 引入的 vite/esbuild/rollup 等 node 构建工具）。这些 node 模块被 Vite 8 自动发现预构建成 node-*.js chunk 时，
  // __vite__injectQuery 辅助函数会重复声明导致 SyntaxError。浏览器实际不需要它们（业务代码不 import 主入口）。
  // deer-mobile 本身（features/im 含 .tsx）不走预构建，由 @vitejs/plugin-vue-jsx 按源码 transform。
  optimizeDeps: {
    exclude: [
      'vite',
      'vite-plugin-pwa',
      'fast-glob',
      'esbuild',
      'rollup',
      'jiti',
      'postcss',
      'postcss-import',
      'detect-libc',
      '@babel/core',
    ],
  },
  build: {
    rolldownOptions: {
      // fsevents 为 macOS 专属可选模块，Windows 下需 external 避免解析失败
      external: ['fsevents'],
    },
  },
  server: {
    host: true,
    open: true,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
