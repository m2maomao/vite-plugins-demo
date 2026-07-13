<template>
  <VanArea
    v-bind="areaProps as any"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @confirm="$emit('confirm', $event)"
    @cancel="$emit('cancel', $event)"
    @change="$emit('change', $event)"
  >
    <template v-if="$slots['title']" #title>
      <slot name="title" />
    </template>
    <template v-if="$slots['toolbar']" #toolbar>
      <slot name="toolbar" />
    </template>
    <template v-if="$slots['cancel']" #cancel>
      <slot name="cancel" />
    </template>
    <template v-if="$slots['confirm']" #confirm>
      <slot name="confirm" />
    </template>
    <template v-if="$slots['columns-top']" #columns-top>
      <slot name="columns-top" />
    </template>
    <template v-if="$slots['columns-bottom']" #columns-bottom>
      <slot name="columns-bottom" />
    </template>
  </VanArea>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Area as VanArea } from 'vant'

defineOptions({
  name: 'YhmArea',
})

const props = withDefaults(
  defineProps<{
    modelValue?: string
    /** 省市区数据 */
    areaList?: Record<string, any>
    /** 显示列数 */
    columnsNum?: number | string
    /** 列占位提示文字 */
    columnsPlaceholder?: string[]
    /** 标题 */
    title?: string
    /** 加载中 */
    loading?: boolean
    /** 只读 */
    readonly?: boolean
    /** 选项高度 */
    optionHeight?: number | string
    /** 可见选项个数 */
    visibleOptionNum?: number | string
    /** 取消按钮文字 */
    cancelButtonText?: string
    /** 确认按钮文字 */
    confirmButtonText?: string
  }>(),
  {
    loading: false,
    readonly: false,
    columnsNum: 3,
    columnsPlaceholder: () => [],
    optionHeight: 44,
    visibleOptionNum: 6,
    cancelButtonText: '取消',
    confirmButtonText: '确认',
  }
)

defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'confirm', value: any): void
  (e: 'cancel', value: any): void
  (e: 'change', value: any): void
}>()

const areaProps = computed(() => {
  const result: Record<string, unknown> = {}
  const keys: (keyof typeof props)[] = [
    'areaList', 'columnsNum', 'columnsPlaceholder',
    'title', 'loading', 'readonly',
    'optionHeight', 'visibleOptionNum',
    'cancelButtonText', 'confirmButtonText',
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
