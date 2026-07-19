<template>
  <VanDialog
    v-bind="dialogProps as any"
    :show="show"
    @update:show="$emit('update:show', $event)"
    @confirm="$emit('confirm')"
    @cancel="$emit('cancel')"
    @open="$emit('open')"
    @close="$emit('close')"
    @opened="$emit('opened')"
    @closed="$emit('closed')">
    <slot />
  </VanDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Dialog as VanDialog } from 'vant';

defineOptions({
  name: 'YhmDialog',
});

const props = withDefaults(
  defineProps<{
    show?: boolean;
    /** 标题 */
    title?: string;
    /** 内容 */
    message?: string;
    /** 主题: default / round-button */
    theme?: 'default' | 'round-button';
    /** 宽度 */
    width?: number | string;
    /** 是否显示取消按钮 */
    showCancelButton?: boolean;
    /** 取消按钮文字 */
    cancelButtonText?: string;
    /** 取消按钮颜色 */
    cancelButtonColor?: string;
    /** 取消按钮是否禁用 */
    cancelButtonDisabled?: boolean;
    /** 确认按钮文字 */
    confirmButtonText?: string;
    /** 确认按钮颜色 */
    confirmButtonColor?: string;
    /** 确认按钮是否禁用 */
    confirmButtonDisabled?: boolean;
    /** 是否允许 HTML */
    allowHtml?: boolean;
    /** 内容对齐方式 */
    messageAlign?: 'left' | 'center' | 'right';
    /** 关闭前的回调 */
    beforeClose?: (action: string) => Promise<boolean> | boolean;
    /** 点击遮罩层是否关闭 */
    closeOnClickOverlay?: boolean;
    /** 是否在 popstate 时关闭 */
    closeOnPopstate?: boolean;
    /** 动画过渡 */
    transition?: string;
    /** 是否懒渲染 */
    lazyRender?: boolean;
  }>(),
  {
    theme: 'default',
    showCancelButton: false,
    allowHtml: false,
    closeOnPopstate: true,
    closeOnClickOverlay: false,
    lazyRender: true,
    cancelButtonDisabled: false,
    confirmButtonDisabled: false,
    transition: 'van-dialog-bounce',
  },
);

defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
  (e: 'open'): void;
  (e: 'close'): void;
  (e: 'opened'): void;
  (e: 'closed'): void;
}>();

const dialogProps = computed(() => {
  const result: Record<string, unknown> = {};
  const keys: (keyof typeof props)[] = [
    'title',
    'message',
    'theme',
    'width',
    'showCancelButton',
    'cancelButtonText',
    'cancelButtonColor',
    'cancelButtonDisabled',
    'confirmButtonText',
    'confirmButtonColor',
    'confirmButtonDisabled',
    'allowHtml',
    'messageAlign',
    'beforeClose',
    'closeOnClickOverlay',
    'closeOnPopstate',
    'transition',
    'lazyRender',
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
