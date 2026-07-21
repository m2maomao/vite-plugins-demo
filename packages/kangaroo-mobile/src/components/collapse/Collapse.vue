<template>
  <VanCollapse
    ref="vanCollapseRef"
    v-bind="collapseProps"
    :model-value="modelValue"
    :accordion="accordion"
    :border="border"
    @update:model-value="$emit('update:modelValue', $event)"
    @change="$emit('change', $event)">
    <slot />
  </VanCollapse>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Collapse as VanCollapse } from 'vant';
import type { CollapseInstance } from 'vant';

defineOptions({
  name: 'YhmCollapse',
});

const vanCollapseRef = ref<CollapseInstance>();

defineExpose({
  toggleAll: (options?: boolean | { expanded?: boolean; skipDisabled?: boolean }) => {
    vanCollapseRef.value?.toggleAll?.(options);
  },
});

const props = withDefaults(
  defineProps<{
    modelValue?: number | string | (number | string)[];
    accordion?: boolean;
    border?: boolean;
  }>(),
  {
    accordion: false,
    border: true,
  },
);

defineEmits<{
  (e: 'update:modelValue', value: number | string | (number | string)[]): void;
  (e: 'change', value: number | string | (number | string)[]): void;
}>();

const collapseProps = computed(() => {
  const result: Record<string, unknown> = {};
  const keys: (keyof typeof props)[] = ['accordion', 'border'];
  for (const key of keys) {
    const val = props[key];
    if (val !== undefined) {
      result[key] = val;
    }
  }
  return result as any;
});
</script>
