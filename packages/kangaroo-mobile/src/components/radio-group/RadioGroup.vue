<template>
  <VanRadioGroup
    v-bind="groupProps as any"
    :class="['yhm-radio-group', $attrs.class as string]"
    :style="$attrs.style as any"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @change="$emit('change', $event)">
    <slot />
  </VanRadioGroup>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { RadioGroup as VanRadioGroup } from 'vant';

defineOptions({
  name: 'YhmRadioGroup',
  inheritAttrs: false,
});

const $attrs = useAttrs();

const props = withDefaults(
  defineProps<{
    modelValue?: unknown;
    disabled?: boolean;
    iconSize?: string | number;
    direction?: 'horizontal' | 'vertical';
    checkedColor?: string;
    shape?: 'round' | 'square' | 'dot';
  }>(),
  {
    disabled: false,
  },
);

defineEmits<{
  (e: 'update:modelValue', value: unknown): void;
  (e: 'change', value: unknown): void;
}>();

const groupProps = computed(() => {
  const result: Record<string, unknown> = {};
  const keys: (keyof typeof props)[] = ['disabled', 'iconSize', 'direction', 'checkedColor', 'shape'];
  for (const key of keys) {
    const val = props[key];
    if (val !== undefined) {
      result[key] = val;
    }
  }
  return result;
});
</script>
