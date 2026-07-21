<template>
  <VanSearch
    v-bind="searchProps"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @search="$emit('search', $event)"
    @cancel="$emit('cancel')"
    @clear="$emit('clear', $event)"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
    @click-input="$emit('clickInput', $event)"
    @click-left-icon="$emit('clickLeftIcon')"
    @click-right-icon="$emit('clickRightIcon')">
    <template v-if="$slots['left']" #left>
      <slot name="left" />
    </template>
    <template v-if="$slots['action']" #action>
      <slot name="action" />
    </template>
    <template v-if="$slots['label']" #label>
      <slot name="label" />
    </template>
    <template v-if="$slots['left-icon']" #left-icon>
      <slot name="left-icon" />
    </template>
    <template v-if="$slots['right-icon']" #right-icon>
      <slot name="right-icon" />
    </template>
  </VanSearch>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Search as VanSearch } from 'vant';

defineOptions({
  name: 'YhmSearch',
});

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    /** 搜索框左侧文本 */
    label?: string;
    /** 搜索框形状 */
    shape?: 'square' | 'round';
    /** 左侧图标 */
    leftIcon?: string;
    /** 是否启用清除按钮 */
    clearable?: boolean;
    /** 右侧按钮文字 */
    actionText?: string;
    /** 搜索框背景色 */
    background?: string;
    /** 是否显示右侧按钮 */
    showAction?: boolean;
    /** 占位符 */
    placeholder?: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 最大长度 */
    maxlength?: number | string;
    /** 输入框内容对齐 */
    inputAlign?: string;
    /** 只读 */
    readonly?: boolean;
    /** 是否显示错误 */
    error?: boolean;
    /** 错误提示 */
    errorMessage?: string;
  }>(),
  {
    shape: 'square',
    leftIcon: 'search',
    clearable: true,
    showAction: false,
    disabled: false,
    readonly: false,
    error: false,
  },
);

defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search', value: string): void;
  (e: 'cancel'): void;
  (e: 'clear', event: MouseEvent): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'clickInput', event: MouseEvent): void;
  (e: 'clickLeftIcon'): void;
  (e: 'clickRightIcon'): void;
}>();

const searchProps = computed(() => {
  const result: Record<string, unknown> = {};
  const keys: (keyof typeof props)[] = [
    'label',
    'shape',
    'leftIcon',
    'clearable',
    'actionText',
    'background',
    'showAction',
    'placeholder',
    'disabled',
    'maxlength',
    'inputAlign',
    'readonly',
    'error',
    'errorMessage',
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
