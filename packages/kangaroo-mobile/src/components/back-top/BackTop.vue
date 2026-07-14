<template>
  <VanBackTop
    v-bind="backTopProps as any"
    :right="right"
    :bottom="bottom"
    :z-index="zIndex"
    :target="target"
    :offset="offset"
    :immediate="immediate"
    :teleport="teleport"
    @click="$emit('click', $event)"
  >
    <slot />
  </VanBackTop>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BackTop as VanBackTop } from 'vant'

defineOptions({
  name: 'YhmBackTop',
})

const props = withDefaults(
  defineProps<{
    right?: number | string
    bottom?: number | string
    zIndex?: number | string
    target?: string | any
    offset?: number | string
    immediate?: boolean
    teleport?: string | any
  }>(),
  {
    offset: 200,
    immediate: false,
    teleport: 'body',
  }
)

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const backTopProps = computed(() => {
  const result: Record<string, unknown> = {}
  const keys: (keyof typeof props)[] = [
    'right', 'bottom', 'zIndex', 'target', 'offset',
    'immediate', 'teleport',
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
