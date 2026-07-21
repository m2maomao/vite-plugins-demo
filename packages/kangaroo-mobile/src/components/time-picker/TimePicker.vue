<template>
  <VanTimePicker
    v-bind="timePickerProps"
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
  </VanTimePicker>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { TimePicker as VanTimePicker } from 'vant';

defineOptions({
  name: 'YhmTimePicker',
});

const props = withDefaults(
  defineProps<{
    modelValue?: string[];
    /** 列类型 */
    columnsType?: ('hour' | 'minute' | 'second')[];
    /** 标题 */
    title?: string;
    /** 加载中 */
    loading?: boolean;
    /** 只读 */
    readonly?: boolean;
    /** 显示顶部栏 */
    showToolbar?: boolean;
    /** 顶部栏位置 */
    toolbarPosition?: 'top' | 'bottom';
    /** 取消按钮文字 */
    cancelButtonText?: string;
    /** 确认按钮文字 */
    confirmButtonText?: string;
    /** 选项高度 */
    optionHeight?: number | string;
    /** 可见选项个数 */
    visibleOptionNum?: number | string;
    /** 最小小时 */
    minHour?: number | string;
    /** 最大小时 */
    maxHour?: number | string;
    /** 最小分钟 */
    minMinute?: number | string;
    /** 最大分钟 */
    maxMinute?: number | string;
    /** 最小秒 */
    minSecond?: number | string;
    /** 最大秒 */
    maxSecond?: number | string;
    /** 最小时间（整体时间范围） */
    minTime?: string;
    /** 最大时间（整体时间范围） */
    maxTime?: string;
    /** 过滤函数 */
    filter?: (type: string, options: any[], values: string[]) => any[];
    /** 格式化函数 */
    formatter?: (type: string, option: any) => any;
  }>(),
  {
    loading: false,
    readonly: false,
    showToolbar: true,
    toolbarPosition: 'top',
    cancelButtonText: '取消',
    confirmButtonText: '确认',
    optionHeight: 44,
    visibleOptionNum: 6,
    columnsType: () => ['hour', 'minute'],
    minHour: 0,
    maxHour: 23,
    minMinute: 0,
    maxMinute: 59,
    minSecond: 0,
    maxSecond: 59,
  },
);

defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
  (e: 'confirm', value: any): void;
  (e: 'cancel', value: any): void;
  (e: 'change', value: any): void;
}>();

const timePickerProps = computed(() => {
  const result: Record<string, unknown> = {};
  const keys: (keyof typeof props)[] = [
    'columnsType',
    'title',
    'loading',
    'readonly',
    'showToolbar',
    'toolbarPosition',
    'cancelButtonText',
    'confirmButtonText',
    'optionHeight',
    'visibleOptionNum',
    'minHour',
    'maxHour',
    'minMinute',
    'maxMinute',
    'minSecond',
    'maxSecond',
    'minTime',
    'maxTime',
    'filter',
    'formatter',
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
