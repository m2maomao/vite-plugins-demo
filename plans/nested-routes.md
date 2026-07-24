# 嵌套路由（子路由支持）方案

## 目标

通过目录结构自动生成 vue-router 嵌套路由。当目录下有 `index.tsx` 时，该目录下的其他页面自动作为其子路由。

## 目录 → 路由映射

```
src/pages/
├── index.tsx          →  / (component: __page0)
├── about.tsx          →  /about (component: __page1)
├── user/
│   ├── index.tsx      →  /user (parent, component: __page2)
│   ├── profile.tsx    →  child of /user → /user/profile
│   ├── setting.tsx    →  child of /user → /user/setting
│   ├── [id].tsx       →  child of /user → /user/:id
│   └── info/
│       └── index.tsx  →  child of /user → /user/info
```

## 生成的路由代码

```javascript
import __page0 from '/src/pages/index.tsx'
import __page1 from '/src/pages/about.tsx'
import __page2 from '/src/pages/user/index.tsx'
import __page3 from '/src/pages/user/profile.tsx'
import __page4 from '/src/pages/user/setting.tsx'
import __page5 from '/src/pages/user/[id].tsx'
import __page6 from '/src/pages/user/info/index.tsx'

export const routes = [
  { path: '/', component: __page0, meta: { ... } },
  { path: '/about', component: __page1, meta: { ... } },
  {
    path: '/user',
    component: __page2,
    meta: { ... },
    children: [
      { path: 'profile', component: __page3, meta: { ... } },
      { path: 'setting', component: __page4, meta: { ... } },
      { path: ':id', component: __page5, meta: { ... } },
      { path: 'info', component: __page6, meta: { ... } },
    ],
  },
]
```

## 算法

1. 扫描 `src/pages/**/*.tsx`
2. 以 `/` 分割路径，构建目录树
3. 对每个目录：
   - 如果有 `index.tsx` ⇒ 该目录是父路由节点
   - 该目录下其他文件 ⇒ 子路由
   - 子路徑中再嵌套的目录递归处理
4. 子路由的 `path` 使用相对路径（无 `/` 前缀）
5. 保留现有的导出规则（`redirect`、`meta` 等）

## 改动文件

| 文件 | 变更 |
|------|------|
| [`scan-pages-plugin/index.ts`](../packages/deer-mobile/plugins/scan-pages-plugin/index.ts) | 重写 `generateRoutesCode()`：从 flat 改为 tree-based 代码生成 |

## 不兼容变更

- `user/index.tsx` 现在变成了父路由组件，**必须渲染 `<router-view>`** 才能显示子页面
- 如果 `user/index.tsx` 不存在，`user/profile` 等仍然是扁平路由（向后兼容）
