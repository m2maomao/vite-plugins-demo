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
import { computed, h } from 'vue';
import { Icon } from '@iconify/vue';
import { Icon as VanIcon } from 'vant';
import { resolveIconName, isVantIcon } from './icon-map';
import type { Component } from 'vue';

/**
 * Deer 图标 SVG 组件（内联，避免依赖 unplugin-icons 虚拟模块）
 * 原始 SVG 文件: src/assets/icons/mingcute--deer-line.svg
 */
const DeerMingcuteDeerLine: Component = {
  name: 'DeerMingcuteDeerLine',
  props: {
    width: { type: [String, Number], default: '1em' },
    height: { type: [String, Number], default: '1em' },
    color: { type: String, default: 'currentColor' },
  },
  setup(props) {
    return () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 24 24',
          width: props.width,
          height: props.height,
          fill: props.color,
        },
        [
          h('g', { fill: 'none' }, [
            h('path', {
              d: 'M12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z',
            }),
            h('path', {
              fill: 'currentColor',
              d: 'M4 3a1 1 0 0 1 1 1c0 .996.427 2.063 1.086 3.077a6 6 0 0 1 1.207-1.784a1 1 0 0 1 1.414 1.414c-.659.66-.965 1.525-1.146 2.187c.38.385.75.713 1.073.967A7 7 0 0 1 12 9c1.22 0 2.367.312 3.366.86c.323-.253.694-.58 1.073-.966c-.181-.662-.487-1.528-1.146-2.187a1 1 0 0 1 1.414-1.414a6 6 0 0 1 1.207 1.784C18.574 6.063 19 4.996 19 4a1 1 0 1 1 2 0c0 1.814-.895 3.526-1.887 4.85a14.5 14.5 0 0 1-2.11 2.254A6.98 6.98 0 0 1 19 16c0 1.792-.675 3.43-1.783 4.667a1 1 0 1 1-1.49-1.334a5 5 0 1 0-7.454 0a1 1 0 1 1-1.49 1.334A6.98 6.98 0 0 1 5 16c0-1.906.762-3.634 1.997-4.896a14.5 14.5 0 0 1-2.11-2.254C3.896 7.526 3 5.814 3 4a1 1 0 0 1 1-1',
            }),
          ]),
        ],
      );
  },
};

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
