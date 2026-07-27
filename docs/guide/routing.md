# 路由

## 约定式路由

`src/pages/` 目录下的文件会被自动扫描生成路由表：

```
src/pages/
├── index.tsx          →  /
├── about.tsx          →  /about
├── user/
│   ├── index.tsx      →  /user
│   ├── [id].tsx       →  /user/:id
│   ├── profile.tsx    →  /user/profile
│   └── setting.tsx    →  /user/setting
└── settings/
    └── index.tsx      →  /settings
```

### 动态路由

使用 `[param].tsx` 语法声明动态参数：

```typescript
// src/pages/user/[id].tsx
export default function UserDetail() {
  return <div>User ID: {useRoute().params.id}</div>;
}
```

### 路由元数据

页面组件可导出 `routeMeta` 对象来配置路由元信息：

```typescript
// src/pages/user/profile.tsx
export const routeMeta = {
  title: '个人资料',         // 页面标题
  layout: 'user',           // 指定布局
  auth: true,               // 需要登录
  transition: 'slide',      // 切换动画
  keepAlive: true,          // 保持存活
  params: {                 // 参数校验规则
    id: { type: 'number', required: true },
  },
};
```

## 嵌套路由

目录嵌套会自动生成父子路由关系：

```
src/pages/
├── user/
│   ├── index.tsx      →  /user（父路由）
│   └── info/
│       └── index.tsx  →  /user/info（子路由）
```

## 布局关联

默认情况下，路由会使用 `default` 布局。通过 `routeMeta.layout` 可以指定布局：

```typescript
// 使用 user 布局
export const routeMeta = { layout: 'user' };
```

布局组件放在 `src/layouts/` 目录，自动注册。
