# 单元测试方案

## 1. 测试框架选型：Vitest

### 为什么选择 Vitest？

| 因素 | 分析 |
|------|------|
| **与 Vite 深度集成** | 项目已全面使用 Vite（root `package.json`、`kangaroo-mobile/vite.config.ts`、`example/vite.config.ts`），Vitest 共享同一套 Vite 配置/插件/转换管线，零额外构建开销 |
| **原生 TypeScript 支持** | 无须额外配置 `ts-jest` 或 `@babel/preset-typescript`，直接解析 `.ts/.tsx` |
| **Vue/JSX 支持** | 项目使用 Vue 3 + JSX（`jsx: "preserve"`），Vitest 通过 `@vitejs/plugin-vue` / `@vitejs/plugin-vue-jsx` 原生支持组件渲染 |
| **ESM 优先** | 项目 `"type": "module"`，Vitest 原生支持 ESM |
| **monorepo 友好** | 支持工作空间级别的测试配置和运行 |
| **高性能** | 基于 esbuild 的依赖预打包 + 按需编译，远快于 Jest |
| **API 兼容 Jest** | `describe`/`it`/`expect`/`vi.mock` 等 API 与 Jest 一致，迁移成本低 |
| **生态成熟** | `@vue/test-utils`、`@testing-library/vue`、`jsdom`/`happy-dom` 均完美支持 |

### 结论：**是，使用 Vitest 作为单元测试框架**

---

## 2. 项目架构概览

```
vite-plugins-demo/                     # 根目录 (pnpm workspace root)
├── packages/
│   ├── deer-mobile/                   # 移动端框架（核心）
│   │   ├── src/
│   │   │   ├── utils/                 # 纯工具函数 [高优先级测试]
│   │   │   │   ├── status.ts          # 状态码工具函数
│   │   │   │   ├── request.ts         # HttpClient 封装
│   │   │   │   ├── flexible.ts        # 移动端适配
│   │   │   │   └── index.ts           # 导出聚合
│   │   │   ├── runtime/               # 运行时系统 [高优先级测试]
│   │   │   │   ├── types.ts           # 类型定义
│   │   │   │   ├── plugin-manager.ts  # 插件管理器
│   │   │   │   ├── create-app.ts      # 应用创建
│   │   │   │   └── index.ts
│   │   │   ├── stores/                # Pinia stores [中优先级测试]
│   │   │   │   └── userStore.ts
│   │   │   ├── composables/           # Vue composables [中优先级测试]
│   │   │   │   ├── useApi.ts
│   │   │   │   └── useHttp.ts
│   │   │   ├── layouts/               # 布局组件
│   │   │   └── build/                 # 构建相关
│   │   └── plugins/                   # 构建时/运行时插件 [中优先级测试]
│   │       ├── runtime/               # 运行时插件
│   │       └── setup-plugin/          # 构建时插件
│   │
│   ├── kangaroo-mobile/              # 移动端 UI 组件库
│   │   ├── src/
│   │   │   ├── components/            # Vue 组件 [中优先级测试]
│   │   │   │   ├── badge/
│   │   │   │   ├── count-down/
│   │   │   │   ├── icon/
│   │   │   │   ├── tag/
│   │   │   │   ├── picker/
│   │   │   │   ├── time-picker/
│   │   │   │   └── ... (更多组件)
│   │   │   └── locale/                # 国际化
│   │   └── playground/                # 开发示例（非测试目标）
│   │
│   └── create-deer-mobile/           # 脚手架工具（低优先级）
│
└── apps/
    └── example/                       # 演示应用（低优先级）
```

---

## 3. 测试优先级矩阵

| 模块 | 优先级 | 文件 | 说明 |
|------|--------|------|------|
| **`status.ts`** | 🔴 高 | `deer-mobile/src/utils/status.ts` | 纯函数，无依赖，最适合入门，覆盖率高 |
| **`PluginManager`** | 🔴 高 | `deer-mobile/src/runtime/plugin-manager.ts` | 核心逻辑，类 + 方法，依赖可 mock |
| **`HttpClient`** | 🔴 高 | `deer-mobile/src/utils/request.ts` | HTTP 封装，需 mock axios，测试拦截器逻辑 |
| **`useHttp`** | 🟡 中 | `deer-mobile/src/composables/useHttp.ts` | Vue composable，需 Vue 环境 |
| **`userStore`** | 🟡 中 | `deer-mobile/src/stores/userStore.ts` | Pinia store，需 Pinia 测试环境 |
| **运行时插件** | 🟡 中 | `deer-mobile/plugins/runtime/*.ts` | 依赖 RuntimeContext，需 mock |
| **Vue 组件** | 🟡 中 | `kangaroo-mobile/src/components/*/` | Vue 组件渲染和交互测试 |
| **布局组件** | 🟢 低 | `deer-mobile/src/layouts/*.tsx` | JSX 组件，复杂度较高 |
| **构建插件** | 🟢 低 | `deer-mobile/plugins/setup-plugin/` | Node 端 Vite 插件，需 Node 环境 |

---

## 4. 依赖安装

### 根目录（通用依赖）

```bash
# 进入项目根目录
pnpm add -D -w vitest @vitest/runner @vitest/coverage-v8
```

### per-package 依赖

```bash
# deer-mobile: 测试工具函数 + Vue composables
pnpm add -D --filter deer-mobile \
  @vue/test-utils \
  happy-dom \
  vitest \
  axios-mock-adapter    # 用于 mock HttpClient 中的 axios

# kangaroo-mobile: 测试 Vue 组件
pnpm add -D --filter kangaroo-mobile \
  @vue/test-utils \
  happy-dom \
  vitest
```

> **为什么用 happy-dom 而不是 jsdom？**
> - happy-dom 更快，且对 Vue 组件测试场景完全够用
> - 项目需要 `localStorage` 支持（`request.ts`/`userStore.ts`），happy-dom 提供
> - 如果后续需要 Canvas/WebGL 等，可降级到 jsdom

---

## 5. 配置文件

### 5.1 根级别 [`vitest.workspace.ts`](vitest.workspace.ts)

```typescript
// vitest.workspace.ts
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/deer-mobile',
  'packages/kangaroo-mobile',
  // apps/example 可以后续加入
]);
```

### 5.2 [`packages/deer-mobile/vitest.config.ts`](packages/deer-mobile/vitest.config.ts)

```typescript
import { defineConfig } from 'vitest/config';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  plugins: [vueJsx()],
  resolve: {
    alias: {
      // 解决 virtual 模块的 mock
      'virtual:app-config': __dirname + '/test/mocks/virtual-app-config.ts',
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'plugins/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts', 'plugins/**/*.ts'],
      exclude: ['src/**/*.d.ts'],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
    globals: true,  // 全局注入 describe/it/expect
  },
});
```

### 5.3 [`packages/kangaroo-mobile/vitest.config.ts`](packages/kangaroo-mobile/vitest.config.ts)

```typescript
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.{test,spec}.{ts,tsx,vue}'],
    exclude: ['node_modules', 'dist', 'playground'],
    coverage: {
      provider: 'v8',
      include: ['src/components/**/*.ts', 'src/components/**/*.vue'],
      thresholds: {
        statements: 70,
        branches: 65,
        functions: 70,
        lines: 70,
      },
    },
    globals: true,
  },
});
```

### 5.4 更新 [`turbo.json`](turbo.json)

添加 `test` 任务到 Turbo 管线：

```json
{
  "tasks": {
    "test": {
      "dependsOn": [],
      "inputs": ["src/**", "test/**", "vitest.config.*"],
      "outputs": []
    },
    // ... 现有任务
  }
}
```

### 5.5 更新 package.json scripts

**根目录 [`package.json`](package.json)**：
```json
{
  "scripts": {
    "test": "turbo run test",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage"
  }
}
```

**每个 package 的 [`package.json`](packages/deer-mobile/package.json)**：
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## 6. Mock 策略

### 6.1 虚拟模块 Mock

项目使用了 Vite 虚拟模块（`virtual:app-config`、`virtual:api`），需要在测试环境中提供 mock：

```typescript
// packages/deer-mobile/test/mocks/virtual-app-config.ts
export const appConfig = {
  request: {
    baseURL: '/api',
  },
  sm4Key: '',
};
```

在 [`vitest.config.ts`](packages/deer-mobile/vitest.config.ts) 中配置别名映射。

### 6.2 axios Mock

[`HttpClient`](packages/deer-mobile/src/utils/request.ts) 内部使用 axios，使用 `axios-mock-adapter` 拦截请求：

```typescript
import MockAdapter from 'axios-mock-adapter';
import { HttpClient } from '@/utils/request';

const client = new HttpClient({ baseURL: 'http://test' });
const mock = new MockAdapter(client.getInstance());
```

### 6.3 localStorage Mock

happy-dom 已原生支持 `localStorage`，无需额外 mock。

### 6.4 动态导入 Mock

`request.ts` 中动态 `import('kangaroo-mobile')`，在测试中 mock：

```typescript
vi.mock('kangaroo-mobile', () => ({
  showToast: vi.fn(),
  showDialog: vi.fn(),
}));
```

---

## 7. 示例测试用例

### 7.1 纯函数测试 —— [`status.ts`](packages/deer-mobile/src/utils/status.ts)

```typescript
// packages/deer-mobile/src/utils/__tests__/status.test.ts
import { describe, it, expect } from 'vitest';
import { getStatusMsg, isSuccessStatus, isWarningStatus, isAuthError, isTokenExpired } from '../status';

describe('getStatusMsg', () => {
  it('应返回对应 HTTP 状态码的中文提示', () => {
    expect(getStatusMsg(400)).toBe('请求参数错误');
    expect(getStatusMsg(500)).toBe('服务器内部错误');
  });

  it('应返回授权异常提示', () => {
    expect(getStatusMsg(712)).toBe('身份验证失败，请重新登录');
  });

  it('未知状态码应返回兜底提示', () => {
    expect(getStatusMsg(999)).toBe('系统服务异常，请联系维护人员');
  });
});

describe('isSuccessStatus', () => {
  it('1xx 应返回 true', () => {
    expect(isSuccessStatus(100)).toBe(true);
    expect(isSuccessStatus(199)).toBe(true);
  });

  it('非 1xx 应返回 false', () => {
    expect(isSuccessStatus(200)).toBe(false);
    expect(isSuccessStatus(712)).toBe(false);
  });
});

describe('isAuthError', () => {
  it('授权异常状态码应返回 true', () => {
    expect(isAuthError(110)).toBe(true);
    expect(isAuthError(205)).toBe(true);
  });

  it('非授权异常状态码应返回 false', () => {
    expect(isAuthError(400)).toBe(false);
  });
});

describe('isTokenExpired', () => {
  it('应判断 Token 是否过期', () => {
    expect(isTokenExpired(110)).toBe(true);
    expect(isTokenExpired(112)).toBe(true);
    expect(isTokenExpired(205)).toBe(false);
  });
});
```

### 7.2 类测试 —— [`PluginManager`](packages/deer-mobile/src/runtime/plugin-manager.ts)

```typescript
// packages/deer-mobile/src/runtime/__tests__/plugin-manager.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PluginManager } from '../plugin-manager';

// Mock RuntimePlugin
const createMockPlugin = (name: string, priority = 10, hooks = {}) => ({
  name,
  priority,
  ...hooks,
});

describe('PluginManager', () => {
  let manager: PluginManager;

  beforeEach(() => {
    manager = new PluginManager({} as any);
  });

  describe('use()', () => {
    it('应注册插件并按 priority 排序', () => {
      const pluginA = createMockPlugin('A', 20);
      const pluginB = createMockPlugin('B', 5);
      const pluginC = createMockPlugin('C', 10);

      manager.use(pluginA);
      manager.use(pluginB);
      manager.use(pluginC);

      const plugins = manager.getPlugins();
      expect(plugins[0].name).toBe('B');
      expect(plugins[1].name).toBe('C');
      expect(plugins[2].name).toBe('A');
    });

    it('应支持链式调用', () => {
      const plugin = createMockPlugin('A');
      expect(manager.use(plugin)).toBe(manager);
    });
  });

  describe('callHook()', () => {
    it('应按优先级顺序执行钩子', async () => {
      const order: string[] = [];
      const pluginA = createMockPlugin('A', 20, {
        onAppCreated: async () => { order.push('A'); },
      });
      const pluginB = createMockPlugin('B', 5, {
        onAppCreated: async () => { order.push('B'); },
      });

      manager.use(pluginA);
      manager.use(pluginB);
      await manager.callHook('onAppCreated');

      expect(order).toEqual(['B', 'A']);
    });

    it('插件钩子抛出异常不应影响其他插件', async () => {
      const pluginA = createMockPlugin('A', 10, {
        onAppCreated: async () => { throw new Error('A failed'); },
      });
      const pluginB = createMockPlugin('B', 10, {
        onAppCreated: vi.fn(),
      });

      manager.use(pluginA);
      manager.use(pluginB);
      await manager.callHook('onAppCreated');

      expect(pluginB.onAppCreated).toHaveBeenCalled();
    });
  });

  describe('composeRootContainer()', () => {
    it('应正确嵌套 Provider', () => {
      const renderApp = vi.fn();
      const outerPlugin = createMockPlugin('Outer', 10, {
        outerProvider: (container: () => any) => container,
      });
      const rootPlugin = createMockPlugin('Root', 10, {
        rootContainer: (container: () => any) => container,
      });

      manager.use(outerPlugin);
      manager.use(rootPlugin);
      const composed = manager.composeRootContainer(renderApp);

      expect(typeof composed).toBe('function');
    });
  });
});
```

### 7.3 Vue 组件测试 —— [`Badge`](packages/kangaroo-mobile/src/components/badge/Badge.vue)

```typescript
// packages/kangaroo-mobile/src/components/badge/__tests__/Badge.test.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Badge from '../Badge.vue';

describe('Badge', () => {
  it('应渲染默认插槽内容', () => {
    const wrapper = mount(Badge, {
      slots: { default: '通知' },
    });
    expect(wrapper.text()).toContain('通知');
  });

  it('设置 type 应应用对应 class', () => {
    const wrapper = mount(Badge, {
      props: { type: 'danger' },
    });
    expect(wrapper.classes()).toContain('k-badge--danger');
  });

  it('max 属性应截断数值', () => {
    const wrapper = mount(Badge, {
      props: { content: 100, max: 99 },
    });
    expect(wrapper.text()).toContain('99+');
  });

  it('当 content 为 0 且 show-zero 为 false 时应隐藏', () => {
    const wrapper = mount(Badge, {
      props: { content: 0 },
    });
    expect(wrapper.element.style.display).toBe('none');
    // 或判断是否渲染隐藏类
  });
});
```

---

## 8. 实施步骤

```mermaid
flowchart LR
    A[安装依赖] --> B[创建配置文件]
    B --> C1[编写纯函数测试]
    C1 --> C2[编写类/服务测试]
    C2 --> C3[编写Vue组件测试]
    C3 --> D[配置CI流水线]
    D --> E[持续迭代提升覆盖率]
    
    B --> F[创建Mock辅助模块]
    F --> C1
```

### 步骤 1：基础设施搭建

| 序号 | 动作 | 文件 |
|------|------|------|
| 1.1 | 安装 root 级别依赖 | `pnpm add -D -w vitest @vitest/coverage-v8` |
| 1.2 | 创建 workspace 配置 | [`vitest.workspace.ts`](vitest.workspace.ts) |
| 1.3 | 创建 deer-mobile vitest 配置 | [`packages/deer-mobile/vitest.config.ts`](packages/deer-mobile/vitest.config.ts) |
| 1.4 | 创建 kangaroo-mobile vitest 配置 | [`packages/kangaroo-mobile/vitest.config.ts`](packages/kangaroo-mobile/vitest.config.ts) |
| 1.5 | 更新 turbo.json 添加 test 任务 | [`turbo.json`](turbo.json) |
| 1.6 | 更新各个 package.json 添加 test scripts | 各 `package.json` |
| 1.7 | 创建 mock 目录和文件 | `packages/deer-mobile/test/mocks/` |
| 1.8 | 更新 `.gitignore` 添加覆盖率目录 | `.gitignore` |

### 步骤 2：编写测试用例（按优先级）

| 序号 | 测试目标 | 文件 | 预计用例数 |
|------|----------|------|-----------|
| 2.1 | `status.ts` 纯函数 | `packages/deer-mobile/src/utils/__tests__/status.test.ts` | ~15 |
| 2.2 | `PluginManager` 类 | `packages/deer-mobile/src/runtime/__tests__/plugin-manager.test.ts` | ~10 |
| 2.3 | `HttpClient` HTTP 封装 | `packages/deer-mobile/src/utils/__tests__/request.test.ts` | ~12 |
| 2.4 | `useHttp` composable | `packages/deer-mobile/src/composables/__tests__/useHttp.test.ts` | ~5 |
| 2.5 | `userStore` Pinia store | `packages/deer-mobile/src/stores/__tests__/userStore.test.ts` | ~6 |
| 2.6 | `Badge` Vue 组件 | `packages/kangaroo-mobile/src/components/badge/__tests__/Badge.test.ts` | ~8 |
| 2.7 | `CountDown` Vue 组件 | `packages/kangaroo-mobile/src/components/count-down/__tests__/CountDown.test.ts` | ~6 |
| 2.8 | `Tag` Vue 组件 | `packages/kangaroo-mobile/src/components/tag/__tests__/Tag.test.ts` | ~5 |
| 2.9 | 运行时插件 | `packages/deer-mobile/plugins/runtime/__tests__/*.test.ts` | 按需 |
| 2.10 | 布局组件 | `packages/deer-mobile/src/layouts/__tests__/*.test.ts` | 按需 |

### 步骤 3：CI 集成

在 `.github/workflows/ci.yml` 中添加：

```yaml
- name: Run Tests
  run: pnpm test

- name: Upload Coverage
  uses: codecov/codecov-action@v4
  with:
    directory: ./packages/deer-mobile/coverage
```

---

## 9. 关键注意事项

### 9.1 虚拟模块处理

`deer-mobile` 大量使用 Vite 虚拟模块（`virtual:app-config`、`virtual:api`）。测试时有两种策略：

**策略 A：别名替换（推荐）**
在 `vitest.config.ts` 中配置 `resolve.alias` 将虚拟模块指向 mock 文件。

**策略 B：`vi.mock` 动态 mock**
在测试文件中使用 `vi.mock('virtual:app-config', () => ({ appConfig: {...} }))`。

建议优先使用策略 A，在 vitest.config.ts 层面统一处理。

### 9.2 coverage 阈值

建议初始阶段设置较为宽松的阈值，逐步收紧：

| 阶段 | statements | branches | functions | lines |
|------|-----------|----------|-----------|-------|
| Phase 1（基础设施） | 无阈值 | 无阈值 | 无阈值 | 无阈值 |
| Phase 2（核心模块） | 60% | 50% | 60% | 60% |
| Phase 3（全覆盖） | 80% | 75% | 80% | 80% |

### 9.3 测试文件命名约定

- 测试文件与被测试文件同级目录，放在 `__tests__/` 文件夹下
- 命名模式：`[module].test.ts`（推荐）或 `[module].spec.ts`
- Vue 组件测试：`[ComponentName].test.ts`

### 9.4 测试运行方式

| 命令 | 用途 |
|------|------|
| `pnpm test` | 全量运行（通过 Turbo 并行） |
| `pnpm --filter deer-mobile test` | 只跑某个 package |
| `pnpm --filter deer-mobile test:watch` | watch 模式 |
| `pnpm --filter deer-mobile test -- --coverage` | 带覆盖率报告 |

---

## 10. 总结

| 维度 | 结论 |
|------|------|
| **测试框架** | ✅ **Vitest** — 与 Vite 生态深度集成，项目已有 Vite，零额外成本 |
| **Test Runner** | Vitest 内置，不需要额外 runner |
| **DOM 环境** | happy-dom — 轻量快速，满足 Vue 组件测试需求 |
| **Vue 组件测试** | `@vue/test-utils` — 官方推荐，Vue 3 原生支持 |
| **HTTP Mock** | `axios-mock-adapter` — 针对 axios 的专用 mock 库 |
| **Mock 策略** | `vi.mock()` + vitest.config.ts 别名替换 |
| **Monorepo 集成** | Vitest Workspace + Turbo pipeline 并行执行 |
| **覆盖率** | `@vitest/coverage-v8` — V8 原生覆盖率，速度快 |
