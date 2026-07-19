<template>
  <VanCalendar
    v-bind="calendarProps as any"
    :show="show"
    @update:show="$emit('update:show', $event)"
    @confirm="$emit('confirm', $event)"
    @close="$emit('close')"
    @closed="$emit('closed')"
    @open="$emit('open')"
    @opened="$emit('opened')"
    @unselect="$emit('unselect', $event)"
    @select="$emit('select', $event)" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Calendar as VanCalendar } from 'vant';

defineOptions({
  name: 'YhmCalendar',
});

const props = withDefaults(
  defineProps<{
    show?: boolean;
    /** 选择类型: single 单选, multiple 多选, range 区间 */
    type?: 'single' | 'multiple' | 'range';
    /** 标题 */
    title?: string;
    /** 主题色 */
    color?: string;
    /** 是否圆角 */
    round?: boolean;
    /** 是否可弹出 */
    poppable?: boolean;
    /** 弹出位置 */
    position?: 'left' | 'right' | 'bottom' | 'top' | 'center';
    /** 挂载节点 */
    teleport?: string | any;
    /** 最小日期 */
    minDate?: Date;
    /** 最大日期 */
    maxDate?: Date;
    /** 最大范围 */
    maxRange?: number | string;
    /** 日期格式化函数 */
    formatter?: (item: any) => any;
    /** 行高 */
    rowHeight?: number | string;
    /** 确认按钮文字 */
    confirmText?: string;
    /** 确认按钮禁用文字 */
    confirmDisabledText?: string;
    /** 范围选择提示 */
    rangePrompt?: string;
    /** 是否显示确认按钮 */
    showConfirm?: boolean;
    /** 默认日期 */
    defaultDate?: Date | Date[] | null;
    /** 区间选择是否允许同一天 */
    allowSameDay?: boolean;
    /** 是否显示副标题 */
    showSubtitle?: boolean;
    /** 是否显示月份标记 */
    showMark?: boolean;
    /** 周起始日: 0=周日, 1=周一 ... 6=周六 */
    firstDayOfWeek?: number;
    /** 是否只读 */
    readonly?: boolean;
    /** 是否懒渲染 */
    lazyRender?: boolean;
    /** 是否在 popstate 时关闭 */
    closeOnPopstate?: boolean;
    /** 是否显示范围提示 */
    showRangePrompt?: boolean;
    /** 点击遮罩层是否关闭 */
    closeOnClickOverlay?: boolean;
  }>(),
  {
    type: 'single',
    round: true,
    poppable: true,
    position: 'bottom',
    showConfirm: true,
    showSubtitle: true,
    showMark: true,
    firstDayOfWeek: 0,
    readonly: false,
    lazyRender: true,
    closeOnPopstate: true,
    showRangePrompt: true,
    closeOnClickOverlay: true,
  },
);

defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'confirm', value: Date | Date[]): void;
  (e: 'close'): void;
  (e: 'closed'): void;
  (e: 'open'): void;
  (e: 'opened'): void;
  (e: 'unselect', value: Date): void;
  (e: 'select', value: any): void;
}>();

const calendarProps = computed(() => {
  const result: Record<string, unknown> = {};
  const keys: (keyof typeof props)[] = [
    'type',
    'title',
    'color',
    'round',
    'poppable',
    'position',
    'teleport',
    'minDate',
    'maxDate',
    'maxRange',
    'formatter',
    'rowHeight',
    'confirmText',
    'confirmDisabledText',
    'rangePrompt',
    'showConfirm',
    'defaultDate',
    'allowSameDay',
    'showSubtitle',
    'showMark',
    'firstDayOfWeek',
    'readonly',
    'lazyRender',
    'closeOnPopstate',
    'showRangePrompt',
    'closeOnClickOverlay',
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
