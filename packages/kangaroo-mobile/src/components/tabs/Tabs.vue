<template>
  <VanTabs
    v-bind="tabsProps as any"
    :active="active"
    @update:active="$emit('update:active', $event)"
    @change="$emit('change', $event)"
    @click-tab="$emit('clickTab', $event)"
    @scroll="$emit('scroll', $event)"
    @rendered="$emit('rendered', $event)">
    <slot />
  </VanTabs>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Tabs as VanTabs } from 'vant';

defineOptions({
  name: 'YhmTabs',
});

const props = withDefaults(
  defineProps<{
    active?: number | string;
    type?: 'line' | 'card';
    color?: string;
    border?: boolean;
    sticky?: boolean;
    shrink?: boolean;
    duration?: number | string;
    animated?: boolean;
    ellipsis?: boolean;
    swipeable?: boolean;
    scrollspy?: boolean;
    offsetTop?: number | string;
    background?: string;
    lazyRender?: boolean;
    showHeader?: boolean;
    lineWidth?: number | string;
    lineHeight?: number | string;
    beforeChange?: (name: number | string) => boolean | Promise<boolean>;
    swipeThreshold?: number | string;
    titleActiveColor?: string;
    titleInactiveColor?: string;
  }>(),
  {
    type: 'line',
    active: 0,
    border: false,
    sticky: false,
    shrink: false,
    duration: 0.3,
    animated: false,
    ellipsis: true,
    swipeable: false,
    scrollspy: false,
    offsetTop: 0,
    lazyRender: true,
    showHeader: true,
    swipeThreshold: 5,
  },
);

defineEmits<{
  (e: 'update:active', value: number | string): void;
  (e: 'change', name: number | string): void;
  (e: 'clickTab', value: any): void;
  (e: 'scroll', value: any): void;
  (e: 'rendered', value: any): void;
}>();

const tabsProps = computed(() => {
  const result: Record<string, unknown> = {};
  const keys: (keyof typeof props)[] = [
    'type',
    'color',
    'border',
    'sticky',
    'shrink',
    'duration',
    'animated',
    'ellipsis',
    'swipeable',
    'scrollspy',
    'offsetTop',
    'background',
    'lazyRender',
    'showHeader',
    'lineWidth',
    'lineHeight',
    'beforeChange',
    'swipeThreshold',
    'titleActiveColor',
    'titleInactiveColor',
  ];
  for (const key of keys) {
    const val = props[key];
    if (val !== undefined) {
      result[key] = val;
    }
  }
  return result;
});
</script>
