# Kangaroo Mobile — Vue 3 移动端组件库开发路线图

> **定位**: 基于 Vant 4 二次封装的 Vue 3 移动端组件库，统一设计风格，提供开箱即用的业务组件
> **当前状态**: 已完成项目骨架 + Icon / NavBar / Button / TabBar / Cell / CellGroup / Tag / Field / Switch / Image / Stepper / Checkbox / Radio / Rate / Slider / Uploader / Form / Picker / Popup / TimePicker / Area / Calendar / Search 组件

---

## 一、当前已完成 ✅

| 模块 | 状态 | 说明 |
|------|------|------|
| 项目脚手架 | ✅ | package.json / tsconfig / vite.config (库模式) |
| `YhmIcon` 组件 | ✅ | Iconify + Vant 兜底 + 本地 deer 自定义图标 |
| `YhmNavBar` 组件 | ✅ | 基于 Vant NavBar，封装返回、插槽等 |
| `YhmButton` 组件 | ✅ | 基于 Vant Button，品牌色预设、loading 态 |
| `YhmTabBar` + `YhmTabbarItem` | ✅ | 基于 Vant TabBar，items 数组配置 + 路由绑定 |
| `YhmCell` + `YhmCellGroup` | ✅ | 基于 Vant Cell/CellGroup，薄封装 + 右侧箭头用 YhmIcon |
| `YhmTag` 组件 | ✅ | 基于 Vant Tag，薄封装 |
| `YhmField` 组件 | ✅ | 基于 Vant Field，支持 v-model + 图标插槽 |
| `YhmSwitch` 组件 | ✅ | 基于 Vant Switch，支持 v-model + 自定义颜色/大小 |
| `YhmImage` 组件 | ✅ | 基于 Vant Image，支持 loading/error 占位 + lazy-load + position |
| `YhmStepper` 组件 | ✅ | 基于 Vant Stepper，支持 v-model + 步长/范围/整数/异步变更 |
| `YhmCheckbox` + `YhmCheckboxGroup` | ✅ | 基于 Vant Checkbox/CheckboxGroup，支持 v-model + 全选/反选/限制/不确定状态 |
| `YhmRadio` + `YhmRadioGroup` | ✅ | 基于 Vant Radio/RadioGroup，支持 v-model + 自定义形状/颜色/图标 |
| `YhmRate` 组件 | ✅ | 基于 Vant Rate，支持 v-model + 半星/自定义图标/只读/清除 |
| `YhmSlider` 组件 | ✅ | 基于 Vant Slider，支持 v-model + 双滑块/范围/步长/垂直 |
| `YhmUploader` 组件 | ✅ | 基于 Vant Uploader，支持 v-model + 多文件/预览/上传状态/限制 |
| `YhmForm` 组件 | ✅ | 基于 Vant Form，支持表单校验/提交/验证规则 |
| `YhmPicker` 组件 | ✅ | 基于 Vant Picker，支持单列/多列/级联/自定义字段名 |
| `YhmPopup` 组件 | ✅ | 基于 Vant Popup，支持 v-model:show + 位置/圆角/关闭图标 |
| `YhmTimePicker` 组件 | ✅ | 基于 Vant TimePicker，支持时/分/秒选择、时间范围、过滤/格式化 |
| `YhmArea` 组件 | ✅ | 基于 Vant Area，支持省市区三级联动、v-model、自定义列数/占位符 |
| `YhmCalendar` 组件 | ✅ | 基于 Vant Calendar，支持单选/多选/区间、自定义颜色/范围/文案 |
| `YhmSearch` 组件 | ✅ | 基于 Vant Search，支持 v-model、事件监听、自定义按钮/背景 |
| `YhmToast` 组件 | ✅ | 基于 Vant Toast，提供 showToast/showSuccessToast/showFailToast/showLoadingToast 函数 + 组件模式 |
| `YhmDialog` 组件 | ✅ | 基于 Vant Dialog，提供 showDialog/showConfirmDialog 函数 + 组件模式，支持圆角按钮/异步关闭 |
| `YhmActionSheet` 组件 | ✅ | 基于 Vant ActionSheet，支持选项列表/图标/取消按钮/描述/状态/自定义面板 |
| `YhmSteps` + `YhmStep` | ✅ | 基于 Vant Steps/Step，支持水平/垂直步骤条、自定义图标/颜色 |
| `YhmTabs` + `YhmTab` | ✅ | 基于 Vant Tabs/Tab，支持 line/card 风格、粘性/动画/滑动/滚动导航/异步切换 |
| `YhmCard` 组件 | ✅ | 基于 Vant Card，支持商品卡片展示、价格/标签/营销信息/自定义内容 |
| 主题变量占位 | ✅ | `theme/variables.less` 和 `theme/index.less` |
| 类型声明 | ✅ | `.vue` 模块声明 |
| Vue 插件入口 | ✅ | `install` 函数自动注册所有组件 |
| 库构建输出 | ✅ | ES + CJS 双格式构建 |
| Playground 演示 | ✅ | 组件 Demo 页面（Icon / NavBar / Button / TabBar / Cell / Tag / Field / Switch / Image / Stepper / Checkbox / Radio / Rate / Slider / Uploader / Form / Picker / Popup / TimePicker / Area / Calendar / Search） |

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
│   ├── 导航类：NavBar, TabBar, Tabs, Steps, BackTop
│   ├── 展示类：Cell/CellGroup, Card, Tag, Badge, Collapse, Divider, Image
│   ├── 反馈类：Toast, Dialog, Popup, ActionSheet, ImagePreview
│   ├── 表单类：Button, Form/Field, Picker, DateTimePicker, Switch, Search, Stepper
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
- 基于 Vant [`Tabbar`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/tabbar) + [`TabbarItem`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/tabbar-item)
- 封装底部导航栏，支持 `items` 数组配置模式和路由绑定
- 图标统一使用 `YhmIcon`，支持激活态/未激活态双图标
- 支持徽标（badge）和小红点（dot）

```vue
<template>
  <van-tabbar
    v-model="current"
    :route="route"
    :placeholder="placeholder"
    :safe-area-inset-bottom="safeAreaInsetBottom"
    v-bind="$attrs"
  >
    <van-tabbar-item
      v-for="item in items"
      :key="item.name"
      :name="item.name"
      :to="item.to"
      :badge="item.badge"
      :dot="item.dot"
    >
      <template #icon="props">
        <YhmIcon
          v-if="current === item.name && item.activeIcon"
          :name="item.activeIcon"
        />
        <YhmIcon v-else-if="item.icon" :name="item.icon" />
        <slot v-else :name="`icon-${item.name}`" v-bind="props" />
      </template>
      <slot :name="`title-${item.name}`">
        {{ item.label }}
      </slot>
    </van-tabbar-item>
  </van-tabbar>
</template>
```

**`YhmTabBar` Props**:

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `items` | `TabItem[]` | `[]` | 标签页配置数组 |
| `route` | `boolean` | `false` | 是否启用路由模式 |
| `placeholder` | `boolean` | `true` | 是否在标签栏下方生成占位元素 |
| `safe-area-inset-bottom` | `boolean` | `true` | 是否开启底部安全区适配 |
| `modelValue` | `string \| number` | `0` | 当前选中标签的标识（v-model） |

**`TabItem` 类型定义**:

```typescript
interface TabItem {
  name: string               // 唯一标识
  label: string              // 显示文本
  icon?: string              // YhmIcon 名称（未选中态）
  activeIcon?: string        // YhmIcon 名称（激活态，可选）
  to?: string | Record<string, unknown>  // 路由路径（route 模式下使用）
  badge?: string | number    // 徽标内容
  dot?: boolean              // 是否显示小红点
}
```

#### 2.3 `YhmTabs` — 选项卡
- 基于 Vant [`Tabs`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/tabs) + [`Tab`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/tab)
- 支持粘性布局、滑动切换、徽章
- 封装 `items` 数组配置模式，简化使用
- 自定义标签标题（支持 `YhmIcon` + 文本组合）

```vue
<template>
  <van-tabs
    v-model:active="current"
    :sticky="sticky"
    :swipeable="swipeable"
    :ellipsis="ellipsis"
    v-bind="$attrs"
    @change="onChange"
  >
    <van-tab
      v-for="tab in items"
      :key="tab.name"
      :name="tab.name"
      :title="tab.label"
      :disabled="tab.disabled"
      :badge="tab.badge"
      :dot="tab.dot"
    >
      <slot :name="tab.name" />
    </van-tab>
  </van-tabs>
</template>
```

#### 2.4 `YhmSteps` — 步骤条
- 基于 Vant [`Steps`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/steps) + [`Step`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/step)
- 支持横向、纵向布局
- 自定义步骤图标（使用 `YhmIcon`）
- 扩展：流程状态追踪、订单进度展示

```vue
<template>
  <van-steps
    :active="active"
    :direction="direction"
    :active-icon="activeIcon"
    :inactive-icon="inactiveIcon"
    v-bind="$attrs"
  >
    <van-step
      v-for="(step, index) in steps"
      :key="index"
    >
      <template #active-icon>
        <YhmIcon v-if="step.activeIcon" :name="step.activeIcon" />
      </template>
      <template #inactive-icon>
        <YhmIcon v-if="step.icon" :name="step.icon" />
      </template>
      <slot :name="`step-${index}`">
        {{ step.label }}
      </slot>
    </van-step>
  </van-steps>
</template>
```

#### 2.5 `YhmBackTop` — 回到顶部
- 基于 Vant [`BackTop`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/back-top)
- 封装滚动容器监听和点击回到顶部行为
- 自定义按钮内容（默认使用 `YhmIcon` 向上箭头）
- 扩展：可配置滚动高度阈值、底部偏移

```vue
<template>
  <van-back-top
    v-model:visible="visible"
    :target="target"
    :offset="offset"
    :bottom="bottom"
    :right="right"
    v-bind="$attrs"
    @click="onClick"
  >
    <slot>
      <YhmIcon name="back-top" />
    </slot>
  </van-back-top>
</template>
```

---

### Phase 3 — 展示类组件

#### 3.1 `YhmCell` + `YhmCellGroup` — 单元格 & 单元格组
- 基于 Vant [`Cell`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/cell) + [`CellGroup`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/cell-group)
- 扩展：左侧图标（`YhmIcon`）、右侧箭头、多种预设样式
- `YhmCellGroup` 提供分组标题、圆角等样式预设

```vue
<template>
  <van-cell-group :title="groupTitle" :border="border" v-bind="$attrs">
    <YhmCell
      v-for="item in items"
      :key="item.key"
      :title="item.title"
      :label="item.label"
      :value="item.value"
      :icon="item.icon"
      :is-link="item.isLink"
      v-bind="$attrs"
    />
    <slot />
  </van-cell-group>
</template>
```

#### 3.2 `YhmCard` — 卡片
- 基于 Vant [`Card`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/card)

#### 3.3 `YhmTag` — 标签
- 基于 Vant [`Tag`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/tag)
- 预定义品牌色值

#### 3.4 `YhmBadge` — 徽标 (透传)
- 直接包装 Vant [`Badge`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/badge)

#### 3.5 `YhmCollapse` — 折叠面板
- 基于 Vant [`Collapse`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/collapse) + [`CollapseItem`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/collapse-item)
- 支持手风琴模式（`accordion`）
- 自定义标题区域（支持 `YhmIcon` + 文本）
- 扩展：预设常见场景样式（表单分组、帮助 FAQ）

```vue
<template>
  <van-collapse
    v-model="activeNames"
    :accordion="accordion"
    :border="border"
    v-bind="$attrs"
  >
    <van-collapse-item
      v-for="item in items"
      :key="item.name"
      :name="item.name"
      :disabled="item.disabled"
    >
      <template #title>
        <YhmIcon v-if="item.icon" :name="item.icon" />
        <span>{{ item.title }}</span>
      </template>
      <slot :name="item.name">
        {{ item.content }}
      </slot>
    </van-collapse-item>
  </van-collapse>
</template>
```

#### 3.6 `YhmDivider` — 分割线
- 基于 Vant [`Divider`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/divider)
- 支持实线/虚线、文字位置（left/center/right）
- 扩展：品牌色预设、自定义间距

```vue
<template>
  <van-divider
    :dashed="dashed"
    :hairline="hairline"
    :content-position="contentPosition"
    v-bind="$attrs"
  >
    <slot />
  </van-divider>
</template>
```

#### 3.7 `YhmImage` — 图片
- 基于 Vant [`Image`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/image)
- 封装统一的图片加载行为：loading 占位、error 兜底、懒加载
- 扩展：统一使用 Kangaroo 品牌加载/错误图标

```vue
<template>
  <van-image
    :src="src"
    :fit="fit"
    :lazy-load="lazyLoad"
    :radius="radius"
    v-bind="$attrs"
    @load="onLoad"
    @error="onError"
  >
    <template #loading>
      <YhmIcon name="image-loading" />
    </template>
    <template #error>
      <YhmIcon name="image-error" />
    </template>
  </van-image>
</template>
```

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

#### 4.4 `YhmActionSheet` — 动作面板
- 基于 Vant [`ActionSheet`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/action-sheet)
- 封装统一的 actions 配置，支持 `YhmIcon` 图标
- 内置取消按钮、标题栏、描述文字
- 扩展：危险操作红色警示项

```vue
<template>
  <van-action-sheet
    v-model:show="visible"
    :title="title"
    :description="description"
    :actions="actions"
    :cancel-text="cancelText"
    :close-on-click-action="closeOnClickAction"
    v-bind="$attrs"
    @select="onSelect"
  >
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </van-action-sheet>
</template>
```

#### 4.5 `YhmImagePreview` — 图片预览
- 基于 Vant [`ImagePreview`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/image-preview)
- 封装为函数调用模式：`showImagePreview(images, startPosition)`
- 支持图片缩放、滑动切换、关闭方式自定义

```typescript
import { showImagePreview } from 'vant'

// 函数式调用，保持 Vant 原始 API
export function useImagePreview() {
  const preview = (images: string[], startPosition = 0) => {
    return showImagePreview({ images, startPosition })
  }
  return { preview }
}
```

---

### Phase 5 — 表单类组件

#### 5.1 `YhmButton` — 按钮
- 基于 Vant [`Button`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/button)
- 扩展 loading 态、品牌色预设

#### 5.2 `YhmForm` + `YhmField` — 表单
- 基于 Vant [`Form`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/form) + [`Field`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/field)
- 封装表单校验、提交逻辑、错误提示

#### 5.3 `YhmPicker` — 选择器
- 基于 Vant [`Picker`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/picker)
- 支持单列、多列、级联选择
- 结合 Popup 封装为底部弹窗选择模式
- 扩展：表单场景下 `YhmField` + `YhmPicker` 联动选择

```vue
<template>
  <van-popup v-model:show="visible" position="bottom" round>
    <van-picker
      :columns="columns"
      :title="title"
      :toolbar="toolbar"
      @confirm="onConfirm"
      @cancel="onCancel"
      @change="onChange"
      v-bind="$attrs"
    />
  </van-popup>
</template>
```

#### 5.4 `YhmSwitch` — 开关
- 基于 Vant [`Switch`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/switch)
- 支持 `v-model` 双向绑定
- 自定义大小、颜色
- 扩展：带文字描述的开关项（常与 Cell 组合使用）

```vue
<template>
  <van-switch
    :model-value="modelValue"
    :size="size"
    :active-color="activeColor"
    :inactive-color="inactiveColor"
    :disabled="disabled"
    v-bind="$attrs"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
```

#### 5.5 `YhmSearch` — 搜索
- 基于 Vant [`Search`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/search)
- 支持 `v-model` 双向绑定
- 自定义搜索图标（使用 `YhmIcon`）、清除按钮、取消按钮
- 扩展：联想建议列表、防抖搜索

```vue
<template>
  <van-search
    v-model="value"
    :placeholder="placeholder"
    :shape="shape"
    :clearable="clearable"
    :show-action="showAction"
    :action-text="actionText"
    :left-icon="leftIcon"
    v-bind="$attrs"
    @search="onSearch"
    @cancel="onCancel"
    @clear="onClear"
    @input="onInput"
    @focus="onFocus"
    @blur="onBlur"
  >
    <template #left-icon>
      <YhmIcon name="search" />
    </template>
  </van-search>
</template>
```

#### 5.7 `YhmStepper` — 步进器
- 基于 Vant [`Stepper`](C:/Users/maoma/Develop/Personal/vant/packages/vant/src/stepper)
- 支持 `v-model` 双向绑定
- 自定义步长、最小值/最大值、整数/小数模式
- 扩展：搭配 Cell 用于购物车数量选择等场景

```vue
<template>
  <van-stepper
    :model-value="modelValue"
    :min="min"
    :max="max"
    :step="step"
    :integer="integer"
    :disabled="disabled"
    :input-width="inputWidth"
    :button-size="buttonSize"
    v-bind="$attrs"
    @update:model-value="$emit('update:modelValue', $event)"
    @plus="onPlus"
    @minus="onMinus"
    @focus="onFocus"
    @blur="onBlur"
    @change="onChange"
  />
</template>
```

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

## 五、组件封装优先级（按重要程度排序）

| 优先级 | 组件 | 理由 | 状态 |
|--------|------|------|------|
| 🥇 1 | **NavBar** 导航栏 | 页面导航核心，几乎每个页面都需要 | ✅ 已完成 |
| 🥇 2 | **Button** 按钮 | 最基础的交互组件，品牌样式起点 | ✅ 已完成 |
| 🥇 3 | **TabBar** 标签栏 | 底部导航核心，多数移动 App 标配 | ✅ 已完成 |
| 🥇 4 | **Icon** 图标 | 基础图形元素，所有组件依赖 | ✅ 已完成 |
| 🥇 5 | **Cell / CellGroup** 单元格 + 组 | 列表页、设置页的核心布局单元 | ✅ 已完成 |
| 🥇 6 | **Tag** 标签 | 状态标记、分类标识 | ✅ 已完成 |
| 🥇 7 | **Field** 输入框 | 表单输入核心，依赖 Cell 布局 | ✅ 已完成 |
| 🥇 8 | **Switch** 开关 | 表单最简组件，设置项开关控制 | ✅ 已完成 |
| 🥇 9 | **Image** 图片 | 图片展示基础组件 | ✅ 已完成 |
| 🥇 10 | **Stepper** 步进器 | 数量选择、购物车等场景 | ✅ 已完成 |
| 🥇 11 | **Checkbox / CheckboxGroup** 复选框 | 多选场景，Form 子组件 | ✅ 已完成 |
| 🥇 12 | **Radio / RadioGroup** 单选框 | 单选场景，Form 子组件 | ✅ 已完成 |
| 🥇 13 | **Rate** 评分 | 评分选择，Form 子组件 | ✅ 已完成 |
| 🥇 14 | **Slider** 滑块 | 范围选择，Form 子组件 | ✅ 已完成 |
| 🥇 15 | **Uploader** 文件上传 | 文件上传，Form 子组件 | ✅ 已完成 |
| 🥇 16 | **Form** 表单 | 表单容器，依赖以上子组件 | ✅ 已完成 |
| 🥇 17 | **Search** 搜索 | 列表搜索、筛选场景核心 | ✅ 已完成 |
| 🥇 18 | **Picker** 选择器 | 表单选择场景（地区/时间/选项） | ✅ 已完成 |
| 🥇 19 | **TimePicker** 时间选择 | 时分秒时间选择 | ✅ 已完成 |
| 🥇 20 | **Area** 地区选择 | 省市区选择 | ✅ 已完成 |
| 🥇 21 | **Calendar** 日历 | 日期选择 | ✅ 已完成 |
| 🥇 22 | **Toast** 轻提示 | 操作反馈基础组件 | ✅ 已完成 |
| 🥇 23 | **Dialog** 对话框 | 确认弹窗、提示弹窗 | ✅ 已完成 |
| 🥈 24 | **Popup** 弹出层 | 底部弹窗、筛选面板 | ✅ 已完成 |
| 🥈 25 | **ActionSheet** 动作面板 | 操作菜单选择 | ✅ 已完成 |
| 🥈 26 | **Steps** 步骤条 | 流程引导、多步表单 | ✅ 已完成 |
| 🥈 27 | **Tabs** 标签页 | 内容分类切换 | ✅ 已完成 |
| 🥈 28 | **Card** 卡片 | 商品/内容卡片展示 | ✅ 已完成 |
| 🥈 29 | **Loading** 加载中 | 页面/按钮加载状态 | ✅ 已完成 |
| 🥈 30 | **Empty** 空状态 | 列表无数据占位 | ⏳ |
| 🥈 31 | **Skeleton** 骨架屏 | 页面加载过渡 | ⏳ |
| 🥈 32 | **Badge** 徽标 | 消息/通知角标 | ⏳ |
| 🥈 33 | **Collapse** 折叠面板 | 帮助 FAQ、表单分组展示 | ⏳ |
| 🥈 34 | **ImagePreview** 图片预览 | 图片放大查看 | ⏳ |
| 🥈 35 | **BackTop** 回到顶部 | 长列表快速回到顶部 | ⏳ |
| 🥈 36 | **Divider** 分割线 | 内容分组、视觉分隔 | ⏳ |
| 🥉 37 | **Result** 结果页 | 操作结果反馈 | ⏳ |
| 🥉 38 | **Exception** 异常页 | 403 / 404 / 500 | ⏳ |

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
