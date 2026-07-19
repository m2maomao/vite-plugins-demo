<template>
  <VanLoading
    v-if="text || $slots.icon"
    v-bind="loadingProps as any"
    :size="size"
    :type="type"
    :color="color"
    :vertical="vertical"
    :text-size="textSize"
    :text-color="textColor">
    {{ text }}
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>
  </VanLoading>
  <VanLoading
    v-else
    v-bind="loadingProps as any"
    :size="size"
    :type="type"
    :color="color"
    :vertical="vertical"
    :text-size="textSize"
    :text-color="textColor" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Loading as VanLoading } from 'vant';

defineOptions({
  name: 'YhmLoading',
});

const props = withDefaults(
  defineProps<{
    size?: number | string;
    type?: 'circular' | 'spinner';
    color?: string;
    vertical?: boolean;
    textSize?: number | string;
    textColor?: string;
    text?: string;
  }>(),
  {
    type: 'circular',
    vertical: false,
  },
);

const loadingProps = computed(() => {
  const result: Record<string, unknown> = {};
  const keys: (keyof typeof props)[] = ['size', 'type', 'color', 'vertical', 'textSize', 'textColor'];
  for (const key of keys) {
    const val = props[key];
    if (val !== undefined) {
      result[key] = val;
    }
  }
  return result;
});
</script>
