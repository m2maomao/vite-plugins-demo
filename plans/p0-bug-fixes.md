# P0 Bug 修复计划（✅ 已完成 2026-07-24）

## 全部 4 个 Bug 已修复 ✅

---

## Bug 1: builtin-plugin 路径计算错误 ✅

**文件：** [`plugins/builtin-plugin/index.ts`](../packages/deer-mobile/plugins/builtin-plugin/index.ts)

**修复：** 将 5 个内置页面（login、404、loading、error、pinia-demo）从独立的 `.tsx` 文件改为**内联字符串**。消除了对 `fs.readFileSync`、`esbuild.transform`、`fileURLToPath`、`path` 的依赖。

- 移除 `import fs from 'fs'`、`import path from 'path'`、`import { fileURLToPath } from 'url'`、`import { transform } from 'esbuild'`
- 删除 `plugins/builtin-plugin/pages/` 目录
- 页面代码通过 `BUILTIN_PAGE_CODES` 字典直接返回给 Vite 处理

---

## Bug 2: Loading 队列竞态条件 ✅

**文件：** [`src/utils/request.ts`](../packages/deer-mobile/src/utils/request.ts)

**修复：** 用 `Set<string>` 追踪活跃请求替代计数器：

| 改前 | 改后 |
|------|------|
| `loadingCount` 计数器，`loadingDebounce` 重置逻辑 | `activeRequests: Set<string>` + `requestIdCounter` |
| 请求开始：`loadingCount += 1` | 请求开始：生成唯一 ID → `activeRequests.add(id)` |
| 请求完成：`loadingCount -= 1` | 请求完成：`activeRequests.delete(id)` |
| 竞态：间隔超过 debounce 时重置计数器 | ✅ 无竞态：Set 精确追踪每个请求 |

---

## Bug 3: SM4 加密未生效 ✅

**文件：** [`src/utils/request.ts`](../packages/deer-mobile/src/utils/request.ts)

**修复：** 请求拦截器改为 `async`，`await` 加密结果：

```diff
- if (config.data && this.sm4EncryptAsync) {
-   this.sm4EncryptAsync(config.data).then((encrypted) => {
-     config.data = encrypted;  // ❌ 请求已发出
-   });
- }
+ if (config.data) {
+   config.data = await this.sm4EncryptAsync(config.data);  // ✅ 等待加密完成
+ }
```

---

## Bug 4: API DI 模式无类型声明 ✅

**文件：** [`plugins/api-plugin/index.ts`](../packages/deer-mobile/plugins/api-plugin/index.ts)、[`src/virtual-modules.d.ts`](../packages/deer-mobile/src/virtual-modules.d.ts)

**修复：** 
- 生成的 `virtual:api` 代码中添加 `ApiGet` / `ApiPost` / `ApiPut` / `ApiDelete` 类型声明
- `$get` / `$post` / `$put` / `$delete` 获得完整的泛型签名
- `virtual-modules.d.ts` 中添加 `ApiModule<T>` 类型描述 API 文件编写规范
