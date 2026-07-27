# 环境变量

## .env 文件

框架使用 Vite 的 `.env` 文件体系，支持以下文件：

| 文件 | 说明 |
|------|------|
| `.env` | 通用变量（提交到 Git） |
| `.env.development` | 开发环境（提交到 Git） |
| `.env.production` | 生产环境（提交到 Git） |
| `.env.local` | 本地覆盖（.gitignore） |

## 声明式映射

通过 `deer()` 的 `env` 选项声明需要暴露的环境变量：

```typescript
deer({
  env: {
    apiBaseUrl: 'VITE_API_BASE_URL',
    appVersion: 'VITE_APP_VERSION',
  },
})
```

## 运行时访问

```typescript
import { appConfig } from 'virtual:app-config';

console.log(appConfig.env.apiBaseUrl);  // 类型安全
console.log(appConfig.env.appVersion);
```

## 自动暴露

默认情况下，所有 `VITE_` 前缀的变量会自动暴露（转为驼峰命名）：

```
VITE_API_URL=https://api.example.com
→ appConfig.env.apiUrl
```

通过 `envFallback: false` 可关闭自动暴露。
