# Kangaroo Mobile — Vue 3 移动端组件库开发路线图

> **定位**: 基于 Vant 二次封装的 Vue 3 移动端组件库，统一设计风格，提供开箱即用的业务组件
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

## 二、kangaroo-mobile 架构总览

```
kangaroo-mobile
├── 组件层 (基于 Vant 二次封装)
│   ├── 导航类：NavBar, TabBar, Tab
│   ├── 展示类：Cell, List, Card, Tag, Badge, Collapse
│   ├── 反馈类：Toast, Dialog, ActionSheet, Popup, Notify
│   ├── 表单类：Button, Input, Picker, Switch, Stepper
│   ├── 业务类：Empty, Skeleton, Result, Exception
│   └── 基础类：Icon (已完成), Layout, Space
│
├── 主题系统
│   ├── variables.less — 全局设计变量
│   ├── index.less — 组件样式入口
│   └── dark.less — 暗黑模式覆盖
│
├── 工具函数
│   └── 组件复用逻辑、hooks
│
└── 入口
    └── index.ts — install 注册所有组件 + 导出
```

---

## 三、分阶段开发计划

### Phase 1 — 主题体系完善 (先做，所有组件依赖)

#### 1.1 `theme/variables.less` — 设计变量
- 定义全局设计 Token，覆盖 Vant 的 Less 变量

```less
// Vant 官方支持的自定义变量（全部可覆盖）
@primary-color: #1989fa;
@text-color: #323233;
@background-color: #f7f8fa;
@border-color: #ebedf0;

// kangaroo-mobile 扩展变量
@yh-primary-color: #1677ff;
@yh-success-color: #00b578;
@yh-warning-color: #ff8f1f;
@yh-danger-color: #ff3141;
@yh-font-size-xs: 10px;
@yh-font-size-sm: 12px;
@yh-font-size-md: 14px;
@yh-font-size-lg: 16px;
@yh-font-size-xl: 18px;
@yh-radius-sm: 4px;
@yh-radius-md: 8px;
@yh-radius-lg: 12px;
@yh-radius-xl: 16px;
@yh-space: 8px;    // 基础间距单位
```

#### 1.2 `theme/index.less` — 组件入口
- 按需加载各组件样式
- 提供全量导入入口

#### 1.3 `theme/dark.less` — 暗黑模式（可选）
- 暗黑模式下的变量覆盖

---

### Phase 2 — 导航类组件 (优先级最高)

#### 2.1 `YhmNavBar` — 导航栏
- 基于 Vant `NavBar`，封装统一导航行为
- 支持：标题、返回按钮、右侧操作区、透明模式
- 自动处理返回逻辑（`router.back()`）

#### 2.2 `YhmTabBar` — 标签栏
- 基于 Vant `TabBar`，封装底部导航
- 支持：徽标、自定义图标、路由模式绑定

#### 2.3 `YhmTabs` — 选项卡
- 基于 Vant `Tabs`，封装页面切换
- 支持：粘性布局、滑动切换、徽章

---

### Phase 3 — 展示类组件

#### 3.1 `YhmCell` — 单元格
- 基于 Vant `Cell`，扩展业务常用布局
- 支持：左侧图标、右侧箭头、插槽自定义

#### 3.2 `YhmCard` — 卡片
- 基于 Vant `Card`，统一商品/内容卡片

#### 3.3 `YhmTag` — 标签
- 基于 Vant `Tag`，扩展业务状态标签
- 预定义色值：success/warning/danger/info

#### 3.4 `YhmBadge` — 徽标
- 基于 Vant `Badge`，直接包装

#### 3.5 `YhmCollapse` — 折叠面板
- 基于 Vant `Collapse`

---

### Phase 4 — 反馈类组件

#### 4.1 `YhmToast` — 轻提示
- 基于 Vant `showToast`，封装为函数调用 + 组件式
- 支持：loading/success/fail 等类型

#### 4.2 `YhmDialog` — 弹窗
- 基于 Vant `showDialog`，封装为函数调用
- 扩展：表单弹窗、确认删除等业务场景

#### 4.3 `YhmPopup` — 弹出层
- 基于 Vant `Popup`，方向预设

#### 4.4 `YhmActionSheet` — 动作面板
- 基于 Vant `ActionSheet`

---

### Phase 5 — 表单类组件

#### 5.1 `YhmButton` — 按钮
- 基于 Vant `Button`，扩展 loading 状态、权限控制
- 预定义：主色/成功/警告/危险/文字按钮

#### 5.2 `YhmForm` + `YhmField` — 表单
- 基于 Vant `Form` + `Field`
- 封装表单校验、提交逻辑

#### 5.3 `YhmPicker` — 选择器
- 基于 Vant `Picker`

#### 5.4 `YhmSwitch` — 开关
- 基于 Vant `Switch`

---

### Phase 6 — 业务组件

#### 6.1 `YhmEmpty` — 空状态
- 基于 Vant `Empty`，统一缺省页
- 支持自定义图片、描述、操作按钮

#### 6.2 `YhmSkeleton` — 骨架屏
- 基于 Vant `Skeleton`
- 支持列表/卡片/自定义骨架

#### 6.3 `YhmResult` — 结果页
- 自定义组件（Vant 无此组件）
- success/error/warning/info 四种状态
- 可自定义操作按钮

#### 6.4 `YhmException` — 异常页
- 自定义组件
- 403/404/500 状态 + 返回首页按钮

---

## 四、推荐执行顺序

```
Phase 1 ─── 主题系统 (variables.less)
  │
  ▼
Phase 2 ─── 导航类 (NavBar → TabBar → Tabs)
  │
  ▼
Phase 3 ─── 展示类 (Cell → Card → Tag → Badge → Collapse)
  │
  ▼
Phase 4 ─── 反馈类 (Toast → Dialog → Popup → ActionSheet)
  │
  ▼
Phase 5 ─── 表单类 (Button → Form/Field → Picker → Switch)
  │
  ▼
Phase 6 ─── 业务类 (Empty → Skeleton → Result → Exception)
```

---

## 五、每个组件的实现模板

所有组件参照 `YhmIcon` 的结构：

```
src/components/xxx/
├── index.ts       # 导出 + install
├── xxx.vue        # 组件实现
└── README.md      # 可选：组件文档
```

建议每个组件：
1. **命名前缀 `Yhm`**（保持一致）
2. **保留 Vant 原始 props**（通过 `v-bind="$attrs"` 透传）
3. **提供更友好的默认值**（减少用户配置）
4. **组件支持 `v-model`**（对于表单类组件）
5. **导出 TypeScript 类型**（props/emits/slots 类型）

---

## 六、YhmIcon 现有问题改进

当前 [`icon.vue`](packages/kangaroo-mobile/src/components/icon/icon.vue) 有两个小问题可优化：

### 问题 1：`isVant` 逻辑冗余 ([第 43-46 行](packages/kangaroo-mobile/src/components/icon/icon.vue:43))

```typescript
// 当前
const isVant = computed(() => {
  return resolved.value === '' || isVantIcon(props.name)
})

// 建议简化（resolved.value === '' 已经覆盖了 Vant 兜底判断）
const isVant = computed(() => resolved.value === '')
```

### 问题 2：`vantIconName` 两个分支返回值相同 ([第 54-59 行](packages/kangaroo-mobile/src/components/icon/icon.vue:54))

```typescript
// 当前 - 两个分支都是 props.name
const vantIconName = computed(() => {
  if (resolved.value === '') return props.name
  return props.name // 和上面一样
})

// 建议简化
const vantIconName = computed(() => props.name)
// 或者直接去掉这个 computed，模板里直接用 props.name
```

### 问题 3：`ICON_MAP` 需要补全 ([icon-map.ts:3-7](packages/kangaroo-mobile/src/components/icon/icon-map.ts:3))

目前只有 3 个映射，建议至少补充以下常用图标：

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
}
```

---

## 七、依赖 & 构建注意事项

1. **Vant 作为 dependencies**（已正确配置），会被打包进 kangaroo-mobile
2. **Vue 作为 peerDependencies**（已正确配置），外部化
3. **主题定制**：用户通过 Vite 配置覆盖 Less 变量即可自定义主题
4. **按需加载**：目前是全量导入，后续可考虑支持 tree-shaking
5. **`src/assets/icons` 目录**：`package.json` 的 `files` 字段已包含，需要创建此目录并放入自定义 SVG
