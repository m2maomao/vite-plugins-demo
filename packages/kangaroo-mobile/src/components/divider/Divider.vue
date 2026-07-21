<template>
  <VanDivider
    v-bind="dividerProps"
    :dashed="dashed"
    :hairline="hairline"
    :vertical="vertical"
    :content-position="contentPosition">
    <slot />
  </VanDivider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Divider as VanDivider } from 'vant';

defineOptions({
  name: 'YhmDivider',
});

const props = withDefaults(
  defineProps<{
    dashed?: boolean;
    hairline?: boolean;
    vertical?: boolean;
    contentPosition?: 'left' | 'center' | 'right';
  }>(),
  {
    hairline: true,
    vertical: false,
    dashed: false,
    contentPosition: 'center',
  },
);

const dividerProps = computed(() => {
  const result: Record<string, unknown> = {};
  const keys: (keyof typeof props)[] = ['dashed', 'hairline', 'vertical', 'contentPosition'];
  for (const key of keys) {
    const val = props[key];
    if (val !== undefined) {
      result[key] = val;
    }
  }
  return result as any;
});
</script>
