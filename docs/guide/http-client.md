# HTTP 封装

基于 axios 的企业级 HTTP 封装，提供开箱即用的请求/响应拦截器。

## 特性

- 自动注入 Token
- 业务状态码映射
- Loading 队列控制
- SM4 加解密
- 自动错误提示

## 配置

```typescript
// 通过 AppConfig 配置
deer({
  config: {
    request: {
      baseURL: '/api',
    },
  },
})
```

## 使用

```typescript
import { useHttp } from 'deer-mobile';

const http = useHttp();

// GET 请求
const data = await http.get('/user/profile');

// POST 请求
const result = await http.post('/api/login', {
  username: 'admin',
  password: '***',
});
```

## 业务状态码

系统内置状态码体系：

| 状态码 | 含义 |
|--------|------|
| 1xx | 成功 |
| 2xx | 业务告警 |
| 712/205/209 | 登录超时 |
| 110/112 | Token 失效 |
