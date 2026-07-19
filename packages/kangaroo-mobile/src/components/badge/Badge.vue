<template>
  <VanBadge
    v-if="$slots.default"
    v-bind="badgeProps as any"
    :dot="dot"
    :content="content"
    :max="max"
    :color="color"
    :position="position"
    :tag="tag"
    :offset="offset"
    :show-zero="showZero">
    <slot />
    <template v-if="$slots.content" #content>
      <slot name="content" />
    </template>
  </VanBadge>
  <VanBadge
    v-else
    v-bind="badgeProps as any"
    :dot="dot"
    :content="content"
    :max="max"
    :color="color"
    :position="position"
    :tag="tag"
    :offset="offset"
    :show-zero="showZero">
    <template v-if="$slots.content" #content>
      <slot name="content" />
    </template>
  </VanBadge>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Badge as VanBadge } from 'vant';

defineOptions({
  name: 'YhmBadge',
});

const props = withDefaults(
  defineProps<{
    dot?: boolean;
    content?: number | string;
    max?: number | string;
    color?: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    tag?: string;
    offset?: [number | string, number | string];
    showZero?: boolean;
  }>(),
  {
    dot: false,
    showZero: true,
    tag: 'div',
    position: 'top-right',
  },
);

const badgeProps = computed(() => {
  const result: Record<string, unknown> = {};
  const keys: (keyof typeof props)[] = ['dot', 'content', 'max', 'color', 'position', 'tag', 'offset', 'showZero'];
  for (const key of keys) {
    const val = props[key];
    if (val !== undefined) {
      result[key] = val;
    }
  }
  return result;
});
</script>
