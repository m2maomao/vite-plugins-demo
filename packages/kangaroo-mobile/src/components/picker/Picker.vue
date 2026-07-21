<template>
  <VanPicker
    v-bind="pickerProps"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @confirm="$emit('confirm', $event)"
    @cancel="$emit('cancel', $event)"
    @change="$emit('change', $event)">
    <template v-if="$slots['title']" #title>
      <slot name="title" />
    </template>
    <template v-if="$slots['toolbar']" #toolbar>
      <slot name="toolbar" />
    </template>
    <template v-if="$slots['option']" #option="slotProps">
      <slot name="option" v-bind="slotProps" />
    </template>
    <template v-if="$slots['columns-top']" #columns-top>
      <slot name="columns-top" />
    </template>
    <template v-if="$slots['columns-bottom']" #columns-bottom>
      <slot name="columns-bottom" />
    </template>
    <template v-if="$slots['empty']" #empty>
      <slot name="empty" />
    </template>
  </VanPicker>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Picker as VanPicker } from 'vant';

defineOptions({
  name: 'YhmPicker',
});

const props = withDefaults(
  defineProps<{
    modelValue?: string[];
    columns?: any[];
    title?: string;
    loading?: boolean;
    readonly?: boolean;
    allowHtml?: boolean;
    optionHeight?: number | string;
    visibleOptionNum?: number | string;
    swipeDuration?: number | string;
    columnsFieldNames?: Record<string, string>;
    toolbarPosition?: 'top' | 'bottom';
    showToolbar?: boolean;
    cancelButtonText?: string;
    confirmButtonText?: string;
  }>(),
  {
    loading: false,
    readonly: false,
    allowHtml: false,
    showToolbar: true,
    toolbarPosition: 'top',
    cancelButtonText: '取消',
    confirmButtonText: '确认',
    optionHeight: 44,
    visibleOptionNum: 6,
  },
);

defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
  (e: 'confirm', value: any): void;
  (e: 'cancel', value: any): void;
  (e: 'change', value: any): void;
}>();

const pickerProps = computed(() => {
  const result: Record<string, unknown> = {};
  const keys: (keyof typeof props)[] = [
    'columns',
    'title',
    'loading',
    'readonly',
    'allowHtml',
    'optionHeight',
    'visibleOptionNum',
    'swipeDuration',
    'columnsFieldNames',
    'toolbarPosition',
    'showToolbar',
    'cancelButtonText',
    'confirmButtonText',
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
