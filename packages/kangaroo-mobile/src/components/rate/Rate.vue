<template>
  <VanRate
    v-bind="rateProps as any"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @change="$emit('change', $event)" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Rate as VanRate } from 'vant';

defineOptions({
  name: 'YhmRate',
});

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    count?: number;
    size?: string | number;
    gutter?: string | number;
    color?: string;
    voidColor?: string;
    disabledColor?: string;
    icon?: string;
    voidIcon?: string;
    iconPrefix?: string;
    allowHalf?: boolean;
    clearable?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    touchable?: boolean;
  }>(),
  {
    count: 5,
    allowHalf: false,
    clearable: false,
    readonly: false,
    disabled: false,
    touchable: true,
  },
);

defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'change', value: number): void;
}>();

const rateProps = computed(() => {
  const result: Record<string, unknown> = {};
  const keys: (keyof typeof props)[] = [
    'count',
    'size',
    'gutter',
    'color',
    'voidColor',
    'disabledColor',
    'icon',
    'voidIcon',
    'iconPrefix',
    'allowHalf',
    'clearable',
    'readonly',
    'disabled',
    'touchable',
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
