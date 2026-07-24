# kangaroo-mobile 缺失组件补充方案

## 目标

封装 Vant 4 的 9 个缺失组件 + 对应 playground demo。

## 完整清单

| # | 组件 | 文件 | Demo |
|---|------|------|------|
| 1 | YhmPullRefresh | `pull-refresh/PullRefresh.vue` + `index.ts` | `playground/components/pull-refresh/index.vue` |
| 2 | YhmList | `list/List.vue` + `index.ts` | `playground/components/list/index.vue` |
| 3 | YhmIndexBar | `index-bar/IndexBar.vue` + `index.ts` | `playground/components/index-bar/index.vue` |
| 4 | YhmSidebar | `sidebar/Sidebar.vue` + `index.ts` | `playground/components/sidebar/index.vue` |
| 5 | YhmNumberKeyboard | `number-keyboard/NumberKeyboard.vue` + `index.ts` | `playground/components/number-keyboard/index.vue` |
| 6 | YhmPasswordInput | `password-input/PasswordInput.vue` + `index.ts` | `playground/components/password-input/index.vue` |
| 7 | YhmCountDown | `count-down/CountDown.vue` + `index.ts` | `playground/components/count-down/index.vue` |
| 8 | YhmWaterMark | `watermark/Watermark.vue` + `index.ts` | `playground/components/watermark/index.vue` |
| 9 | YhmFloatingPanel | `floating-panel/FloatingPanel.vue` + `index.ts` | `playground/components/floating-panel/index.vue` |

## 封装模式

每个组件 3 个文件：

**组件 SFC** `src/components/{name}/{Name}.vue`：
```vue
<template>
  <VanComponent v-bind="vanProps" :class="['yhm-component', customClass]" @...>
    <slot />
  </VanComponent>
</template>
```

**导出** `src/components/{name}/index.ts`：
```typescript
import YhmComponent from './Component.vue';
export { YhmComponent };
export default YhmComponent;
```

**Demo** `playground/components/{name}/index.vue`：
```vue
<template>
  <demo-block title="..." />
</template>
```

## 入口导出更新

`src/components/index.ts` — 添加 9 个组件的 named export。
