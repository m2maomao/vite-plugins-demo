# Vue 文件语法着色问题 — 根因与修复计划

## 问题描述

`.vue` 文件中只有 `<template>` 前半部分有语法着色，`<script>` 及 `<template>` 后半部分（从 `<slot />` 开始）均无语法着色。VSCode 控制台报错：
```
Document not found in AST tracker
```

## 根因

**Volar（Vue - Official 扩展）的模板表达式解析器不支持在 `<template>` 中使用 TypeScript 的 `as` 类型断言语法。**

项目中大量 `.vue` 文件在模板中使用了 `as any`：

```vue
<!-- ❌ 错误写法：as 断言在模板中，Volar 无法解析 -->
<VanCollapseItem v-bind="collapseItemProps as any">
```

当 Volar 遇到 `v-bind="xxx as any"` 时，模板 AST 解析失败，导致：
1. `<script>` 区域完全失去语义着色
2. `<template>` 中从特定位置（如 `<slot />`）开始断色
3. 控制台报 `AST tracker` 错误

## 修复模式

将 `as any` 从模板表达式**移入 `<script>` 中的 computed 返回值**：

```vue
<!-- ✅ 正确写法 -->
<template>
  <VanCollapseItem v-bind="collapseItemProps">
    ...
  </VanCollapseItem>
</template>

<script setup lang="ts">
const collapseItemProps = computed(() => {
  const result: Record<string, unknown> = {};
  // ... 组装 props ...
  return result as any;  // ← as any 移到这里
});
</script>
```

## 受影响文件清单

统计发现共 **36 个 `.vue` 文件**需要修复：

### 类型 A：简单 `v-bind="xxxProps as any"`（34 个文件）

| # | 文件 | 模板中 as any |
|---|------|--------------|
| 1 | [`Area.vue`](../packages/kangaroo-mobile/src/components/area/Area.vue:3) | `v-bind="areaProps as any"` |
| 2 | [`BackTop.vue`](../packages/kangaroo-mobile/src/components/back-top/BackTop.vue:3) | `v-bind="backTopProps as any"` |
| 3 | [`Badge.vue`](../packages/kangaroo-mobile/src/components/badge/Badge.vue:4) | `v-bind="badgeProps as any"`（两处） |
| 4 | [`Calendar.vue`](../packages/kangaroo-mobile/src/components/calendar/Calendar.vue:3) | `v-bind="calendarProps as any"` |
| 5 | [`Card.vue`](../packages/kangaroo-mobile/src/components/card/Card.vue:3) | `v-bind="cardProps as any"` |
| 6 | [`Cell.vue`](../packages/kangaroo-mobile/src/components/cell/Cell.vue:2) | `v-bind="vanCellProps as any"` |
| 7 | [`Checkbox.vue`](../packages/kangaroo-mobile/src/components/checkbox/Checkbox.vue:4) | `v-bind="checkboxProps as any"` |
| 8 | [`Collapse.vue`](../packages/kangaroo-mobile/src/components/collapse/Collapse.vue:4) | `v-bind="collapseProps as any"` |
| 9 | [`CollapseItem.vue`](../packages/kangaroo-mobile/src/components/collapse-item/CollapseItem.vue:3) | `v-bind="collapseItemProps as any"` |
| 10 | [`Dialog.vue`](../packages/kangaroo-mobile/src/components/dialog/Dialog.vue:3) | `v-bind="dialogProps as any"` |
| 11 | [`Divider.vue`](../packages/kangaroo-mobile/src/components/divider/Divider.vue:3) | `v-bind="dividerProps as any"` |
| 12 | [`Empty.vue`](../packages/kangaroo-mobile/src/components/empty/Empty.vue:2) | `v-bind="emptyProps as any"`（两处） |
| 13 | [`Field.vue`](../packages/kangaroo-mobile/src/components/field/Field.vue:3) | `v-bind="vanFieldProps as any"` |
| 14 | [`Form.vue`](../packages/kangaroo-mobile/src/components/form/Form.vue:2) | `v-bind="formProps as any"` |
| 15 | [`Image.vue`](../packages/kangaroo-mobile/src/components/image/Image.vue:3) | `v-bind="imageProps as any"` |
| 16 | [`ImagePreview.vue`](../packages/kangaroo-mobile/src/components/image-preview/ImagePreview.vue:3) | `v-bind="imagePreviewProps as any"` |
| 17 | [`Loading.vue`](../packages/kangaroo-mobile/src/components/loading/Loading.vue:4) | `v-bind="loadingProps as any"`（两处） |
| 18 | [`Picker.vue`](../packages/kangaroo-mobile/src/components/picker/Picker.vue:3) | `v-bind="pickerProps as any"` |
| 19 | [`Popup.vue`](../packages/kangaroo-mobile/src/components/popup/Popup.vue:3) | `v-bind="popupProps as any"` |
| 20 | [`Radio.vue`](../packages/kangaroo-mobile/src/components/radio/Radio.vue:2) | `v-bind="mergedProps as any"` |
| 21 | [`Rate.vue`](../packages/kangaroo-mobile/src/components/rate/Rate.vue:3) | `v-bind="rateProps as any"` |
| 22 | [`Search.vue`](../packages/kangaroo-mobile/src/components/search/Search.vue:3) | `v-bind="searchProps as any"` |
| 23 | [`Skeleton.vue`](../packages/kangaroo-mobile/src/components/skeleton/Skeleton.vue:3) | `v-bind="skeletonProps as any"` |
| 24 | [`SkeletonImage.vue`](../packages/kangaroo-mobile/src/components/skeleton-image/SkeletonImage.vue:2) | `v-bind="skeletonImageProps as any"` |
| 25 | [`Slider.vue`](../packages/kangaroo-mobile/src/components/slider/Slider.vue:3) | `v-bind="sliderProps as any"` |
| 26 | [`Stepper.vue`](../packages/kangaroo-mobile/src/components/stepper/Stepper.vue:3) | `v-bind="stepperProps as any"` |
| 27 | [`Steps.vue`](../packages/kangaroo-mobile/src/components/steps/Steps.vue:2) | `v-bind="stepsProps as any"` |
| 28 | [`Switch.vue`](../packages/kangaroo-mobile/src/components/switch/Switch.vue:3) | `v-bind="switchProps as any"` |
| 29 | [`Tab.vue`](../packages/kangaroo-mobile/src/components/tab/Tab.vue:3) | `v-bind="tabProps as any"` |
| 30 | [`Tabs.vue`](../packages/kangaroo-mobile/src/components/tabs/Tabs.vue:3) | `v-bind="tabsProps as any"` |
| 31 | [`TimePicker.vue`](../packages/kangaroo-mobile/src/components/time-picker/TimePicker.vue:3) | `v-bind="timePickerProps as any"` |
| 32 | [`Uploader.vue`](../packages/kangaroo-mobile/src/components/uploader/Uploader.vue:3) | `v-bind="uploaderProps as any"` |
| 33 | [`Toast.vue`](../packages/kangaroo-mobile/src/components/toast/Toast.vue:2) | `v-bind="toastProps as any"` |
| 34 | [`ActionSheet.vue`](../packages/kangaroo-mobile/src/components/action-sheet/ActionSheet.vue:3) | ✅ **已修复**（用户已手动修复） |

### 类型 B：模板中还有 `$attrs.class as string` 和 `$attrs.style as any`（2 个文件）

| # | 文件 | 额外问题 |
|---|------|---------|
| 35 | [`CheckboxGroup.vue`](../packages/kangaroo-mobile/src/components/checkbox-group/CheckboxGroup.vue:5) | `:class="['...', $attrs.class as string]"` + `:style="$attrs.style as any"` |
| 36 | [`RadioGroup.vue`](../packages/kangaroo-mobile/src/components/radio-group/RadioGroup.vue:4) | `:class="['...', $attrs.class as string]"` + `:style="$attrs.style as any"` |

### 类型 C：已正确（1 个文件）

[`Button.vue`](../packages/kangaroo-mobile/src/components/button/Button.vue:2) — 模板中无 `as`，computed 返回已用 `as any` ✅

---

## 执行方案

### 方案 A：批量替换（推荐，由 Code 模式执行）

对类型 A 的 33 个文件执行相同的两步操作：

1. **模板中**：`v-bind="xxxProps as any"` → `v-bind="xxxProps"`
2. **脚本中**：computed 的 `return result;` → `return result as any;`

对类型 B 的 2 个文件（CheckboxGroup、RadioGroup）需要更精细的修改：
- 将 `$attrs.class as string` 和 `$attrs.style as any` 迁移到 computed 属性中

### 方案 B：为 Volar 提 Issue

Volar 作为 Vue 官方扩展，应支持模板中的 `as` 类型断言。可向 https://github.com/vuejs/language-tools 提交 issue。

---

## 验证方法

修复后，打开任意 `.vue` 文件确认：
- [x] `<template>` 区域从头到尾完整着色
- [x] `<script setup lang="ts">` 区域有完整语义着色（变量、类型高亮）
- [x] VSCode 控制台无 `AST tracker` 报错
- [x] 重新 `pnpm dev:play` 确认构建无异常
