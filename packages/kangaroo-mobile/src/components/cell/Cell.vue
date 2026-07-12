<template>
  <!--
    薄封装：
    - 所有 props 透传给 VanCell（Vant 原生渲染 title/label/value/icon）
    - 只覆盖 right-icon slot（使用 YhmIcon）
    - 其他 slot 不覆盖，让 Vant 完全控制 DOM
    - 如需自定义 title/label/value，用户可在父组件使用 #title/#label/#value slot
  -->
  <VanCell
    v-bind="vanCellProps as any"
    :class="['yhm-cell', customClass]"
  >
    <template #right-icon>
      <span class="van-cell__right-icon">
        <slot name="right-icon">
          <YhmIcon
            v-if="isLink"
            :name="rightIconName"
            size="16"
            class="yhm-cell__arrow"
          />
        </slot>
      </span>
    </template>
  </VanCell>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Cell as VanCell } from 'vant'
import YhmIcon from '../icon/icon.vue'

defineOptions({
  name: 'YhmCell',
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    icon?: string
    title?: string | number
    value?: string | number
    label?: string | number
    isLink?: boolean
    arrowDirection?: 'up' | 'down' | 'left' | 'right'
    center?: boolean
    border?: boolean
    required?: boolean | 'auto'
    size?: 'normal' | 'large'
    iconSize?: string | number
    rightIconSize?: string | number
    customClass?: string
    clickable?: boolean
    to?: string | Record<string, unknown>
    replace?: boolean
  }>(),
  {
    isLink: false,
    border: true,
    center: false,
    iconSize: 16,
    rightIconSize: 16,
  }
)

const rightIconName = computed(() => {
  if (!props.arrowDirection || props.arrowDirection === 'right') {
    return 'arrow'
  }
  return `arrow-${props.arrowDirection}`
})

const vanCellProps = computed(() => {
  const result: Record<string, unknown> = {}
  const keys: (keyof typeof props)[] = [
    'icon', 'title', 'value', 'label',
    'isLink', 'arrowDirection', 'center', 'border',
    'required', 'size', 'clickable', 'to', 'replace',
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
.yhm-cell__arrow {
  line-height: var(--van-cell-line-height, 24px);
}
</style>
