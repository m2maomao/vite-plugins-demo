<template>
  <VanField
    v-bind="vanFieldProps as any"
    :model-value="modelValue"
    :class="['yhm-field', customClass]"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <!-- 左侧图标：只有有内容时才渲染，不占用多余宽度 -->
    <template v-if="leftIcon || hasLeftIconSlot" #left-icon>
      <slot name="left-icon">
        <YhmIcon
          :name="leftIcon!"
          :size="iconSize"
          class="yhm-field__left-icon"
        />
      </slot>
    </template>

    <!-- 右侧图标：只有有内容时才渲染 -->
    <template v-if="rightIcon || hasRightIconSlot" #right-icon>
      <slot name="right-icon">
        <YhmIcon
          :name="rightIcon!"
          :size="iconSize"
        />
      </slot>
    </template>

    <!-- 按钮（如发送验证码） → 只有有内容时才渲染 -->
    <template v-if="hasButtonSlot" #button>
      <slot name="button" />
    </template>

    <!-- 额外内容 -->
    <template #extra>
      <slot name="extra" />
    </template>
  </VanField>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { Field as VanField } from 'vant'
import YhmIcon from '../icon/icon.vue'

defineOptions({
  name: 'YhmField',
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    label?: string
    placeholder?: string
    type?: string
    name?: string
    leftIcon?: string
    rightIcon?: string
    clearable?: boolean
    clearIcon?: string
    disabled?: boolean
    readonly?: boolean
    maxlength?: string | number
    max?: number
    min?: number
    autofocus?: boolean
    required?: boolean | 'auto'
    center?: boolean
    border?: boolean
    isLink?: boolean
    error?: boolean
    errorMessage?: string
    labelAlign?: string
    inputAlign?: string
    labelWidth?: string | number
    iconSize?: string | number
    customClass?: string
    colon?: boolean
    showWordLimit?: boolean
    rows?: string | number
    autosize?: boolean | { maxHeight?: number; minHeight?: number }
    rules?: unknown[]
    placeholderStyle?: string
  }>(),
  {
    modelValue: '',
    iconSize: 18,
    clearable: false,
    disabled: false,
    readonly: false,
    border: true,
    center: false,
    isLink: false,
    error: false,
    colon: false,
    showWordLimit: false,
  }
)

const slots = useSlots()
const hasLeftIconSlot = computed(() => !!slots['left-icon'])
const hasRightIconSlot = computed(() => !!slots['right-icon'])
const hasButtonSlot = computed(() => !!slots['button'])

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'click-input', event: MouseEvent): void
  (e: 'click-left-icon'): void
  (e: 'click-right-icon'): void
  (e: 'clear'): void
}>()

/** 过滤私有 props */
const vanFieldProps = computed(() => {
  const result: Record<string, unknown> = {}
  const keys: (keyof typeof props)[] = [
    'label', 'placeholder', 'type', 'name',
    'leftIcon', 'rightIcon', 'clearable', 'clearIcon',
    'disabled', 'readonly', 'maxlength', 'max', 'min',
    'autofocus', 'required', 'center', 'border', 'isLink',
    'error', 'errorMessage', 'labelAlign', 'inputAlign',
    'labelWidth', 'colon', 'showWordLimit', 'rows', 'autosize',
    'rules', 'placeholderStyle',
  ]
  for (const key of keys) {
    const val = props[key]
    if (val !== undefined) {
      result[key] = val
    }
  }
  return result
})
</script>

<style lang="less" scoped>
// 间距由 VanField 的 flex 布局控制，无需额外 margin
</style>
