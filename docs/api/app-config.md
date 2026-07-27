# AppConfig

应用配置对象，贯穿构建时和运行时。

## 完整定义

```typescript
interface AppConfig {
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
  sm4Key?: string;
  i18n?: {
    locale: string;
    fallbackLocale?: string;
    messages?: Record<string, Record<string, Record<string, string>>>;
  };
  mock?: {
    enabled?: boolean;
    dir?: string;
  };
  loading?: {
    enabled?: boolean;
    color?: string;
    height?: string;
    mode?: 'top' | 'fullscreen';
  };
  env: Record<string, string>;
  [key: string]: unknown;  // 插件扩展
}
```

## 运行时访问

```typescript
import { appConfig } from 'virtual:app-config';
console.log(appConfig.title);
console.log(appConfig.env.apiBaseUrl);
```

## 在插件中访问

```typescript
// BuildPlugin
api.modifyConfig((config) => ({ ...config, title: 'New Title' }));

// RuntimePlugin
const plugin: RuntimePlugin = {
  name: 'example',
  onAppCreated: (app, ctx) => {
    console.log(ctx.config.title);
  },
};
```
