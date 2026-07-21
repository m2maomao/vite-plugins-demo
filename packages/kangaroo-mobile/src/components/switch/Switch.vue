<template>
  <VanSwitch
    v-bind="switchProps"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @change="$emit('change', $event)">
    <template #node>
      <slot name="node"></slot>
    </template>
  </VanSwitch>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Switch as VanSwitch } from 'vant';

defineOptions({
  name: 'YhmSwitch',
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    modelValue?: unknown;
    disabled?: boolean;
    loading?: boolean;
    size?: string | number;
    activeColor?: string;
    inactiveColor?: string;
    activeValue?: unknown;
    inactiveValue?: unknown;
  }>(),
  {
    disabled: false,
    loading: false,
  },
);

defineEmits<{
  (e: 'update:modelValue', value: unknown): void;
  (e: 'change', value: unknown): void;
}>();

const switchProps = computed(() => {
  const result: Record<string, unknown> = {};
  const keys: (keyof typeof props)[] = [
    'disabled',
    'loading',
    'size',
    'activeColor',
    'inactiveColor',
    'activeValue',
    'inactiveValue',
  ];
  for (const key of keys) {
    const val = props[key];
    if (val !== undefined) {
      result[key] = val;
    }
  }
  return result as any;
});
</script>
