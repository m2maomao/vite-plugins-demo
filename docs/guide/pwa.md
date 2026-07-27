# PWA 离线访问

## 启用

```typescript
import { defineConfig } from 'vite';
import { deer, pwa } from 'deer-mobile';

export default defineConfig({
  plugins: [
    deer({ config: { title: 'My App' } }),
    pwa({ enabled: true }),
  ],
});
```

## 完整配置

```typescript
pwa({
  enabled: true,
  manifest: {
    name: 'My App',
    short_name: 'App',
    theme_color: '#1890ff',
    display: 'standalone',
    icons: [
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  runtimeCaching: [
    {
      urlPattern: /\/api\/public\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'public-api',
        expiration: { maxEntries: 50, maxAgeSeconds: 300 },
      },
    },
  ],
})
```

## 安全说明

::: warning 注意
默认**不缓存**任何 API 请求。如需缓存，请确保：
- 仅缓存 `GET` 请求
- **排除**登录、Token 刷新等认证相关路径
- 设置合理的过期时间
:::
