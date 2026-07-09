# Kangaroo Mobile — Vue 3 移动端组件库开发路线图

> **定位**: 基于 Vant 4 二次封装的 Vue 3 移动端组件库，统一设计风格，提供开箱即用的业务组件
> **当前状态**: 极早期 — 已完成项目骨架 + `YhmIcon` 图标组件

---

## 一、当前已完成 ✅

| 模块 | 状态 | 说明 |
|------|------|------|
| 项目脚手架 | ✅ | package.json / tsconfig / vite.config (库模式) |
| `YhmIcon` 组件 | ✅ | Iconify + Vant 兜底的智能图标组件 |
| 主题变量占位 | ✅ | `theme/variables.less` 和 `theme/index.less` 空文件 |
| 类型声明 | ✅ | `global.d.ts` (`.vue` 模块声明) |
| Vue 插件入口 | ✅ | `install` 函数自动注册所有组件 |
| 库构建输出 | ✅ | ES + CJS 双格式构建 |

---

## 二、Vant 4 主题机制 (你必须了解)

Vant 4 **不再使用 Less 变量**进行主题定制，而是全部改用 **CSS 自定义属性（CSS Variables）**。

### 核心机制

Vant 4 在 [`css-variables.less`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/style/css-variables.less) 中定义所有设计 Token：

```less
:root {
  --van-black: #000;
  --van-white: #fff;
  --van-blue: #1989fa;           // 主色
  --van-red: #ee0a24;            // 危险色
  --van-green: #07c160;          // 成功色
  --van-orange: #ff976a;         // 警告色
  --van-gray-1: #f7f8fa;         // 背景色
  --van-gray-8: #323233;         // 文字色
  --van-primary-color: var(--van-blue);
  --van-success-color: var(--van-green);
  --van-danger-color: var(--van-red);
  --van-warning-color: var(--van-orange);
  --van-text-color: var(--van-gray-8);
  --van-background: var(--van-gray-1);
  --van-border-color: var(--van-gray-3);
  --van-font-size-md: 14px;
  --van-radius-md: 4px;
  // ... 更多
}

.van-theme-dark {                // 暗黑模式
  --van-text-color: #f5f5f5;
  --van-background: #000;
  --van-background-2: #1c1c1e;
  // ...
}
```

### 三种主题覆盖方式

| 方式 | 作用域 | 实现 |
|------|--------|------|
| **全局覆盖** | 整个应用 | 在 `:root` 重新声明 `--van-primary-color: #1677ff` |
| **组件级覆盖** | 组件子树 | `<van-config-provider :theme-vars="themeVars">` |
| **暗黑模式** | 全局类名 | 添加 `.van-theme-dark` 到 `document.documentElement` |

### TypeScript 类型支持

```typescript
import type { ConfigProviderThemeVars } from 'vant'

const themeVars: ConfigProviderThemeVars = {
  primaryColor: '#1677ff',    // 驼峰命名，会自动转成 --van-primary-color
  radiusMd: '8px',
  cellFontSize: '16px',
}
```

---

## 三、kangaroo-mobile 架构总览

```
kangaroo-mobile
├── 组件层 (基于 Vant 4 二次封装)
│   ├── 导航类：NavBar, TabBar, Tabs
│   ├── 展示类：Cell, Card, Tag, Badge, Collapse
│   ├── 反馈类：Toast, Dialog, Popup, ActionSheet
│   ├── 表单类：Button, Form/Field, Picker, Switch
│   ├── 业务类：Empty, Skeleton, Result, Exception
│   └── 基础类：Icon (已完成)
│
├── 主题系统
│   ├── index.less      — 覆盖 Vant 的 CSS 变量，定义品牌色
│   └── variables.less  — (可选) kangaroo-mobile 内部 Less 变量
│
├── composables/
│   └── useThemeVars.ts — 提供 Kangaroo 默认 ThemeVars
│
└── 入口
    └── index.ts — install 注册所有组件 + 导出
```

---

## 四、分阶段开发计划

### Phase 1 — 主题体系完善 ⭐ (先做，所有组件依赖)

#### 1.1 `theme/index.less` — 覆盖 Vant CSS 变量

```less
// packages/kangaroo-mobile/src/theme/index.less

// 1. Kangaroo 品牌色 CSS 变量
:root {
  --yh-primary-color: #1677ff;
  --yh-success-color: #00b578;
  --yh-warning-color: #ff8f1f;
  --yh-danger-color: #ff3141;
  --yh-text-color: #333333;
  --yh-bg-color: #f5f6fa;
  --yh-font-size-xs: 10px;
  --yh-font-size-sm: 12px;
  --yh-font-size-md: 14px;
  --yh-font-size-lg: 16px;
  --yh-font-size-xl: 18px;
  --yh-radius-sm: 4px;
  --yh-radius-md: 8px;
  --yh-radius-lg: 12px;
  --yh-radius-xl: 16px;
}

// 2. 覆盖 Vant 默认变量 → 匹配 Kangaroo 品牌
:root {
  --van-primary-color: var(--yh-primary-color);
  --van-success-color: var(--yh-success-color);
  --van-danger-color: var(--yh-danger-color);
  --van-warning-color: var(--yh-warning-color);
  --van-text-color: var(--yh-text-color);
  --van-background: var(--yh-bg-color);
  --van-font-size-xs: var(--yh-font-size-xs);
  --van-font-size-sm: var(--yh-font-size-sm);
  --van-font-size-md: var(--yh-font-size-md);
  --van-font-size-lg: var(--yh-font-size-lg);
  --van-radius-sm: var(--yh-radius-sm);
  --van-radius-md: var(--yh-radius-md);
  --van-radius-lg: var(--yh-radius-lg);
}

// 3. 暗黑模式
.van-theme-dark {
  --yh-text-color: #f5f5f5;
  --yh-bg-color: #000;
  --van-text-color: #f5f5f5;
  --van-background: #000;
  --van-background-2: #1c1c1e;
  --van-background-3: #37363b;
  --van-border-color: #3a3a3c;
}
```

#### 1.2 `composables/useThemeVars.ts` — 提供 Kangaroo 默认主题变量

```typescript
import type { ConfigProviderThemeVars } from 'vant'

export function useKangarooThemeVars(): ConfigProviderThemeVars {
  return {
    primaryColor: 'var(--yh-primary-color)',
    successColor: 'var(--yh-success-color)',
    dangerColor: 'var(--yh-danger-color)',
    warningColor: 'var(--yh-warning-color)',
    radiusMd: 'var(--yh-radius-md)',
    radiusLg: 'var(--yh-radius-lg)',
  }
}
```

---

### Phase 2 — 导航类组件 (优先级最高)

#### 2.1 `YhmNavBar` — 导航栏
- 基于 Vant [`NavBar`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/nav-bar)
- 封装统一导航行为：标题、返回、右侧操作区
- 自动处理返回逻辑 (`router.back()`)
- 支持透明模式、吸顶效果

```vue
<template>
  <div class="yhm-nav-bar" :class="{ 'yhm-nav-bar--fixed': fixed }">
    <van-nav-bar v-bind="$attrs" :title="title" @click-left="handleClickLeft">
      <!-- 默认返回按钮 -->
      <template #left>
        <YhmIcon v-if="showBack" name="back" />
      </template>
      <!-- 右侧插槽透传 -->
      <template #right>
        <slot name="right" />
      </template>
    </van-nav-bar>
  </div>
</template>
```

#### 2.2 `YhmTabBar` — 标签栏
- 基于 Vant [`TabBar`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/tabbar)
- 封装底部导航，支持路由绑定
- 自定义图标（使用 `YhmIcon`）

#### 2.3 `YhmTabs` — 选项卡
- 基于 Vant [`Tabs`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/tabs)
- 粘性布局、滑动切换、徽章

---

### Phase 3 — 展示类组件

#### 3.1 `YhmCell` — 单元格
- 基于 Vant [`Cell`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/cell)
- 扩展：左侧图标（`YhmIcon`）、右侧箭头、多种预设样式

#### 3.2 `YhmCard` — 卡片
- 基于 Vant [`Card`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/card)

#### 3.3 `YhmTag` — 标签
- 基于 Vant [`Tag`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/tag)
- 预定义品牌色值

#### 3.4 `YhmBadge` — 徽标 (透传)
- 直接包装 Vant [`Badge`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/badge)

---

### Phase 4 — 反馈类组件

#### 4.1 `YhmToast` — 轻提示
- 基于 Vant [`showToast`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/toast)
- 封装为统一函数调用
- 内置 loading / success / fail / text 类型

#### 4.2 `YhmDialog` — 弹窗
- 基于 Vant [`showDialog`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/dialog)
- 扩展：确认删除、表单弹窗等业务场景

#### 4.3 `YhmPopup` — 弹出层
- 基于 Vant [`Popup`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/popup)
- 预设上下左右四个方向的弹出

---

### Phase 5 — 表单类组件

#### 5.1 `YhmButton` — 按钮
- 基于 Vant [`Button`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/button)
- 扩展 loading 态、品牌色预设

#### 5.2 `YhmForm` + `YhmField` — 表单
- 基于 Vant [`Form`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/form) + [`Field`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/field)
- 封装表单校验、提交逻辑、错误提示

---

### Phase 6 — 业务组件

#### 6.1 `YhmEmpty` — 空状态
- 基于 Vant [`Empty`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/empty)
- 统一业务缺省页

#### 6.2 `YhmSkeleton` — 骨架屏
- 基于 Vant [`Skeleton`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/skeleton)
- 列表/卡片/自定义骨架预设

#### 6.3 `YhmResult` — 结果页 (自定义)
- **Vant 没有的组件**
- success / error / warning / info 四种状态
- 自定义操作按钮

#### 6.4 `YhmException` — 异常页 (自定义)
- **Vant 没有的组件**
- 403 / 404 / 500 页面
- 返回首页按钮

---

## 五、推荐封装顺序

建议按以下顺序逐个封装组件，每个组件都可在完成后立即使用，互不阻塞：

```
Phase 1 ─── 主题系统 (theme/index.less → CSS 变量覆盖 Vant)
               ↓
Phase 2 ─── 导航类 (NavBar → TabBar → Tabs)
               ↓
Phase 3 ─── 展示类 (Cell → Card → Tag → Badge)
               ↓
Phase 4 ─── 反馈类 (Toast → Dialog → Popup)
               ↓
Phase 5 ─── 表单类 (Button → Form/Field)
               ↓
Phase 6 ─── 业务类 (Empty → Skeleton → Result → Exception)
```

---

## 六、每个组件模板

```
src/components/xxx/
├── index.ts       # export { YhmXxx } + install
├── xxx.vue        # 组件实现（基于 Vant + $attrs 透传）
```

**组件实现原则**:
1. 命名前缀 `Yhm`
2. 用 `v-bind="$attrs"` 透传 Vant 原始 props（兼容 Vant 全部 API）
3. 提供 Kangaroo 品牌默认值
4. 表单类组件支持 `v-model`
5. 导出 TypeScript 类型

---

## 七、YhmIcon 组件优化建议

### 1. `isVant` 简化 ([`icon.vue:43`](packages/kangaroo-mobile/src/components/icon/icon.vue#43))
```typescript
// 当前（冗余了 isVantIcon 判断）
const isVant = computed(() => resolved.value === '' || isVantIcon(props.name))

// 改为
const isVant = computed(() => resolved.value === '')
```

### 2. `vantIconName` 简化 ([`icon.vue:54`](packages/kangaroo-mobile/src/components/icon/icon.vue#54))
```typescript
// 两个分支都返回 props.name，直接去掉此 computed
// 模板中 <VanIcon :name="props.name" />
```

### 3. `ICON_MAP` 补全 ([`icon-map.ts:3`](packages/kangaroo-mobile/src/components/icon/icon-map.ts#3))

建议一次性补全 25+ 个常用图标映射：

```typescript
export const ICON_MAP: Record<string, string> = {
  'back': 'mdi:arrow-left',
  'home': 'mdi:home',
  'close': 'mdi:close',
  'search': 'mdi:magnify',
  'user': 'mdi:account-circle-outline',
  'settings': 'mdi:cog-outline',
  'cart': 'mdi:cart-outline',
  'more': 'mdi:dots-horizontal',
  'add': 'mdi:plus',
  'edit': 'mdi:pencil',
  'delete': 'mdi:delete-outline',
  'success': 'mdi:check-circle-outline',
  'warning': 'mdi:alert-circle-outline',
  'error': 'mdi:close-circle-outline',
  'info': 'mdi:information-outline',
  'arrow-right': 'mdi:chevron-right',
  'arrow-down': 'mdi:chevron-down',
  'arrow-up': 'mdi:chevron-up',
  'phone': 'mdi:phone-outline',
  'location': 'mdi:map-marker-outline',
  'scan': 'mdi:qrcode-scan',
  'message': 'mdi:message-text-outline',
  'share': 'mdi:share-variant-outline',
  'like': 'mdi:heart-outline',
  'star': 'mdi:star-outline',
  'shop': 'mdi:store-outline',
  'notification': 'mdi:bell-outline',
  'clock': 'mdi:clock-outline',
}
```

---

## 八、构建注意事项

1. **Vant 4 主题定制**：不再覆盖 Less 变量，而是**覆盖 CSS 变量**
2. **`src/assets/icons/` 目录**：`package.json` 的 `files` 字段已包含此路径，需要手动创建
3. **Vue 外部化**：已正确配置为 `peerDependencies`，不会打包进库
4. **Vant 打包**：作为 `dependencies` 会被打包进 kangaroo-mobile，用户无需额外安装 Vant
