<template>
  <VanCell
    v-bind="vanCellProps as any"
    :class="['yhm-cell', customClass]"
  >
    <template #right-icon>
      <span
        v-if="isLink || hasRightIconSlot"
        class="van-cell__right-icon yhm-cell__right-wrapper"
      >
        <slot name="right-icon">
          <YhmIcon
            v-if="isLink"
            :name="rightIconName"
            size="16"
          />
        </slot>
      </span>
    </template>
  </VanCell>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { Cell as VanCell } from 'vant'
import YhmIcon from '../icon/icon.vue'

defineOptions({
  name: 'YhmCell',
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

const slots = useSlots()
const hasRightIconSlot = computed(() => !!slots['right-icon'])

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
.yhm-cell__right-wrapper {
  display: inline-flex;
  align-items: center;
  height: var(--van-cell-line-height, 24px);
}
</style>
