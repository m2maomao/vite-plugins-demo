<template>
  <VanCheckboxGroup
    ref="vanGroupRef"
    v-bind="groupProps"
    :class="mergedClass"
    :style="mergedStyle"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @change="$emit('change', $event)">
    <slot />
  </VanCheckboxGroup>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import { CheckboxGroup as VanCheckboxGroup } from 'vant';
import type { CheckboxGroupInstance } from 'vant';

defineOptions({
  name: 'YhmCheckboxGroup',
  inheritAttrs: false,
});

const $attrs = useAttrs();
const vanGroupRef = ref<CheckboxGroupInstance>();

defineExpose({
  toggleAll: (options?: boolean) => vanGroupRef.value?.toggleAll(options),
});

const props = withDefaults(
  defineProps<{
    modelValue?: unknown[];
    max?: string | number;
    shape?: 'round' | 'square';
    disabled?: boolean;
    iconSize?: string | number;
    direction?: 'horizontal' | 'vertical';
    checkedColor?: string;
  }>(),
  {
    modelValue: () => [],
    disabled: false,
  },
);

defineEmits<{
  (e: 'update:modelValue', value: unknown[]): void;
  (e: 'change', value: unknown[]): void;
}>();

const mergedClass = computed(() => ['yhm-checkbox-group', $attrs.class as string]);
const mergedStyle = computed(() => $attrs.style as any);

const groupProps = computed(() => {
  const result: Record<string, unknown> = {};
  const keys: (keyof typeof props)[] = ['max', 'shape', 'disabled', 'iconSize', 'direction', 'checkedColor'];
  for (const key of keys) {
    const val = props[key];
    if (val !== undefined) {
      result[key] = val;
    }
  }
  return result as any;
});
</script>
