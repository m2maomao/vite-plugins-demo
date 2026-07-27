# 布局

## 自动扫描

`src/layouts/` 目录下的布局文件会被自动注册：

```
src/layouts/
├── default.tsx    → 'default' 布局（默认）
├── user.tsx       → 'user' 布局
├── blank.tsx      → 'blank' 布局
└── tab-bar.tsx    → 'tab-bar' 布局
```

## 内置布局

| 布局 | 说明 |
|------|------|
| `default-layout` | 默认布局，含导航栏 + 内容区 + KeepAlive |
| `blank-layout` | 空白布局，无任何装饰 |
| `tab-bar` | 底部 Tab 导航布局 |
| `user-layout` | 用户中心布局 |

## 指定布局

在页面组件中通过 `routeMeta.layout` 指定：

```typescript
// 使用 blank 布局（适合登录页）
export const routeMeta = { layout: 'blank' };

// 使用 user 布局
export const routeMeta = { layout: 'user' };
```

## 嵌套布局

布局可以嵌套组合：

```
UserLayout
└── TabBarLayout
    └── DefaultLayout
        └── 页面内容
```

## 布局插槽

布局组件可以定义插槽区域，通过 `LayoutResolver` 调度。
