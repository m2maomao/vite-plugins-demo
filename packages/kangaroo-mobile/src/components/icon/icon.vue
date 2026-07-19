<template>
  <!-- 自定义 deer 图标：通过 unplugin-icons 虚拟模块加载 -->
  <component
    :is="deerIconComponent"
    v-if="isDeerIcon"
    :width="iconSize"
    :height="iconSize"
    :color="color"
    aria-hidden="true"
    class="yhm-icon" />

  <!-- Iconify -->
  <Icon
    v-else-if="!isVant"
    :icon="iconifyName"
    :width="iconSize"
    :height="iconSize"
    :color="color"
    aria-hidden="true"
    class="yhm-icon" />

  <!-- Vant 兜底 -->
  <VanIcon v-else :name="vantIconName" :size="iconSize" aria-hidden="true" class="yhm-icon" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { Icon as VanIcon } from 'vant';
import { resolveIconName, isVantIcon } from './icon-map';
import type { Component } from 'vue';

// unplugin-icons 虚拟模块：导入 deer 集合中的本地 SVG
// @ts-expect-error - unplugin-icons 在 Vite 构建时提供此模块
import DeerMingcuteDeerLine from '~icons/deer/mingcute--deer-line';

// deer 图标映射表：key 为图标名（不含 deer: 前缀）
const DEER_ICON_MAP: Record<string, Component> = {
  'mingcute--deer-line': DeerMingcuteDeerLine,
};

defineOptions({
  name: 'YhmIcon',
});

const props = withDefaults(
  defineProps<{
    name: string;
    size?: string | number;
    color?: string;
  }>(),
  { size: 16, color: 'currentColor' },
);

// 统一处理 size：数字转为 px 字符串
const iconSize = computed(() => {
  const n = Number(props.size);
  return Number.isNaN(n) ? props.size : `${n}px`;
});

// 解析后的图标名
const resolved = computed(() => resolveIconName(props.name));

// 判断是否是 deer 自定义图标（解析结果以 deer: 开头）
const isDeerIcon = computed(() => {
  return resolved.value.startsWith('deer:');
});

// 对应的 deer 组件
const deerIconComponent = computed(() => {
  if (!isDeerIcon.value) return null;
  const iconName = resolved.value.replace('deer:', '');
  return DEER_ICON_MAP[iconName] || null;
});

// 判断是否是 Vant 兜底
const isVant = computed(() => {
  return resolved.value === '' || isVantIcon(props.name);
});

// Iconify 图标名
const iconifyName = computed(() => {
  return isVant.value || isDeerIcon.value ? '' : resolved.value;
});

// Vant 图标名
const vantIconName = computed(() => {
  const vantNameMap: Record<string, string> = {
    back: 'arrow-left',
    search: 'search',
    'chevron-right': 'arrow',
  };

  if (vantNameMap[props.name]) {
    return vantNameMap[props.name];
  }

  if (resolved.value === '') {
    return props.name;
  }

  return props.name;
});
</script>

<style scoped>
.yhm-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  line-height: 1;
  flex-shrink: 0;
}
</style>
