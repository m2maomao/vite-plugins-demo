<template>
  <VanCellGroup v-bind="vanCellGroupAttrs" class="yhm-cell-group">
    <slot />
  </VanCellGroup>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { CellGroup as VanCellGroup } from 'vant';

defineOptions({
  name: 'YhmCellGroup',
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    title?: string;
    inset?: boolean;
    border?: boolean;
  }>(),
  {
    title: '',
    border: true,
    inset: false,
  },
);

const attrs = useAttrs();

const vanCellGroupAttrs = computed(
  () =>
    ({
      ...props,
      ...attrs,
    }) as Record<string, unknown>,
);
</script>
