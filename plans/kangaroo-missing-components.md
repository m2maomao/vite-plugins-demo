# kangaroo-mobile 缺失组件补充方案

## 目标

封装 Vant 4 的 9 个缺失组件 + 对应 playground demo。

## 完整清单（2026-07-24 已全部完成 ✅）

| # | 组件 | 文件 | Demo | 状态 |
|---|------|------|------|------|
| 1 | YhmPullRefresh | `pull-refresh/PullRefresh.vue` + `index.ts` | `playground/components/pull-refresh/index.vue` | ✅ |
| 2 | YhmList | `list/List.vue` + `index.ts` | `playground/components/list/index.vue` | ✅ |
| 3 | YhmIndexBar | `index-bar/IndexBar.vue` + `index.ts` | `playground/components/index-bar/index.vue` | ✅ |
| 4 | YhmSidebar | `sidebar/Sidebar.vue` + `index.ts` | `playground/components/sidebar/index.vue` | ✅ |
| 5 | YhmNumberKeyboard | `number-keyboard/NumberKeyboard.vue` + `index.ts` | `playground/components/number-keyboard/index.vue` | ✅ |
| 6 | YhmPasswordInput | `password-input/PasswordInput.vue` + `index.ts` | `playground/components/password-input/index.vue` | ✅ |
| 7 | YhmCountDown | `count-down/CountDown.vue` + `index.ts` | `playground/components/count-down/index.vue` | ✅ |
| 8 | YhmWaterMark | `watermark/Watermark.vue` + `index.ts` | `playground/components/watermark/index.vue` | ✅ |
| 9 | YhmFloatingPanel | `floating-panel/FloatingPanel.vue` + `index.ts` | `playground/components/floating-panel/index.vue` | ✅ |

## 封装模式（注意：default slot 转发需要条件渲染）

### 通用模式

每个组件 3 个文件：

**组件 SFC** `src/components/{name}/{Name}.vue`：
```vue
<template>
  <VanComponent v-bind="vanProps" :class="['yhm-component', customClass]">
    <template v-if="hasDefaultSlot" #default="scope">
      <slot v-bind="scope" />
    </template>
    <template v-if="hasTitleSlot" #title>
      <slot name="title" />
    </template>
  </VanComponent>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
const slots = useSlots();
const hasDefaultSlot = !!slots.default;
const hasTitleSlot = !!slots.title;
</script>
```

**⚠️ 关键：default slot 必须使用 `<template v-if #default>` 语法而非 `<slot v-if>`**
- `<slot v-if>` 在 Vue 3 编译后仍会创建 slot wrapper 函数传递给子组件，导致 Vant 的 `slots.default` 始终为 truthy
- `<template v-if #default>` 在条件为 false 时**完全省略**该 slot 项，Vant 走默认渲染逻辑

### 场景一：条件 slot 转发（有内容投影时才透传）

适用：PullRefresh（`#pulling/#loosing/#loading`）、List（`#loading/#finished/#error`）、NumberKeyboard（`#title/#extra`）、CountDown（`#default`）

```vue
<template>
  <VanComponent>
    <template v-if="hasXxxSlot" #xxx="scope">
      <slot name="xxx" v-bind="scope" />
    </template>
  </VanComponent>
</template>
```

### 场景二：无条件 slot 转发（始终透传）

适用：Watermark（`#content`）、PasswordInput（无命名 slot）

```vue
<template>
  <VanComponent>
    <template #content="scope">
      <slot name="content" v-bind="scope" />
    </template>
  </VanComponent>
</template>
```

## Demo 编写规范

所有 playground demo 必须严格参考 Vant 4 官方 demo 源码（`packages/vant/src/{component}/demo/index.vue`）：

| 要求 | 说明 |
|------|------|
| **Tabs 布局** | 如官方使用 `<van-tabs>`，demo 也必须使用 `<yhm-tabs>` |
| **DemoBlock 分组** | 保持与官方一致的 demo-block 分组和标题 |
| **Grid 布局** | 手动控制等场景使用 `<van-grid>` / `<van-grid-item>` |
| **CSS 变量** | 使用 `var(--van-primary-color)` 等 CSS 变量而非硬编码颜色 |
| **样式作用域** | 使用 `.demo-{name}` 类名前缀包裹 |
| **Slot 状态文本** | 确保 prop text（如 `pullingText`/`loadingText`）能正常显示，避免无条件 slot 转发吞掉 prop |

## 入口导出更新

`src/components/index.ts` — 添加 9 个组件的 named export。

## 后续改进

- [ ] 添加 Grid/GridItem 组件封装（`YhmGrid` / `YhmGridItem`），目前 demo 中直接使用 Vant 原生组件
- [ ] Playground CSS normalize 已通过 `playground-vars.less` 补齐（2026-07-24）
