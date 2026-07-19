<template>
  <VanToast v-bind="toastProps as any" :show="show" @update:show="$emit('update:show', $event)">
    <template v-if="$slots['message']" #message>
      <slot name="message" />
    </template>
  </VanToast>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Toast as VanToast } from 'vant';

defineOptions({
  name: 'YhmToast',
});

const props = withDefaults(
  defineProps<{
    show?: boolean;
    /** 提示类型 */
    type?: 'loading' | 'success' | 'fail' | 'html' | 'text';
    /** 提示文案 */
    message?: string;
    /** 展示时长(ms)，0 表示不消失 */
    duration?: number;
    /** 是否禁止点击背景 */
    forbidClick?: boolean;
    /** 是否显示关闭按钮 */
    closeable?: boolean;
    /** 自定义图标 */
    icon?: string;
    /** 图标大小 */
    iconSize?: number | string;
    /** 位置 */
    position?: 'top' | 'bottom' | 'middle';
    /** 过渡动画 */
    transition?: string;
    /** 是否留白 */
    wordBreak?: string;
    /** 是否允许重复展示 */
    allowHtml?: boolean;
    /** 是否锁定滚动 */
    lockScroll?: boolean;
    /** 加载图标类型 */
    loadingType?: string;
  }>(),
  {
    type: 'text',
    duration: 2000,
    forbidClick: false,
    closeable: false,
    position: 'middle',
    allowHtml: false,
    lockScroll: false,
  },
);

defineEmits<{
  (e: 'update:show', value: boolean): void;
}>();

const toastProps = computed(() => {
  const result: Record<string, unknown> = {};
  const keys: (keyof typeof props)[] = [
    'type',
    'message',
    'duration',
    'forbidClick',
    'closeable',
    'icon',
    'iconSize',
    'position',
    'transition',
    'wordBreak',
    'allowHtml',
    'lockScroll',
    'loadingType',
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
