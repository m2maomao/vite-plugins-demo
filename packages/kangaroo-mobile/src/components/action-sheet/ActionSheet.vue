<template>
  <VanActionSheet
    v-bind="actionSheetProps"
    :show="show"
    @update:show="$emit('update:show', $event)"
    @select="$emit('select', $event)"
    @cancel="$emit('cancel')">
    <slot />
  </VanActionSheet>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ActionSheet as VanActionSheet } from 'vant';

defineOptions({
  name: 'YhmActionSheet',
});

const props = withDefaults(
  defineProps<{
    show?: boolean;
    /** 选项数组 */
    actions?: any[];
    /** 标题 */
    title?: string;
    /** 取消按钮文字 */
    cancelText?: string;
    /** 描述信息 */
    description?: string;
    /** 是否显示关闭图标 */
    closeable?: boolean;
    /** 关闭图标名称 */
    closeIcon?: string;
    /** 点击选项后是否关闭 */
    closeOnClickAction?: boolean;
    /** 是否圆角 */
    round?: boolean;
    /** 是否在 popstate 时关闭 */
    closeOnPopstate?: boolean;
    /** 是否开启底部安全区适配 */
    safeAreaInsetBottom?: boolean;
    /** 遮罩层是否可关闭 */
    closeOnClickOverlay?: boolean;
    /** 是否锁定滚动 */
    lockScroll?: boolean;
    /** 挂载节点 */
    teleport?: string | any;
  }>(),
  {
    closeable: true,
    closeIcon: 'cross',
    round: true,
    closeOnPopstate: true,
    safeAreaInsetBottom: true,
    closeOnClickAction: false,
    closeOnClickOverlay: true,
    lockScroll: true,
  },
);

defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'select', action: any): void;
  (e: 'cancel'): void;
}>();

const actionSheetProps = computed(() => {
  const result: Record<string, unknown> = {};
  const keys: (keyof typeof props)[] = [
    'actions',
    'title',
    'cancelText',
    'description',
    'closeable',
    'closeIcon',
    'closeOnClickAction',
    'round',
    'closeOnPopstate',
    'safeAreaInsetBottom',
    'closeOnClickOverlay',
    'lockScroll',
    'teleport',
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
