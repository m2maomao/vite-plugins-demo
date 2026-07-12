<template>
  <VanImage
    v-bind="imageProps as any"
    :class="['yhm-image', customClass]"
    @click="$emit('click', $event)"
    @load="$emit('load', $event)"
    @error="$emit('error', $event)"
  >
    <template v-if="hasLoadingSlot" #loading>
      <slot name="loading" />
    </template>
    <template v-if="hasErrorSlot" #error>
      <slot name="error" />
    </template>
  </VanImage>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { Image as VanImage } from 'vant'

defineOptions({
  name: 'YhmImage',
  inheritAttrs: false,
})

const slots = useSlots()
const hasLoadingSlot = computed(() => !!slots.loading)
const hasErrorSlot = computed(() => !!slots.error)

const props = withDefaults(
  defineProps<{
    src?: string
    fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
    position?: string
    alt?: string
    width?: string | number
    height?: string | number
    radius?: string | number
    round?: boolean
    lazyLoad?: boolean
    showError?: boolean
    showLoading?: boolean
    errorIcon?: string
    loadingIcon?: string
    iconSize?: string | number
    iconPrefix?: string
    block?: boolean
    customClass?: string
  }>(),
  {
    fit: 'fill',
    round: false,
    lazyLoad: false,
    showError: true,
    showLoading: true,
    block: true,
  }
)

defineEmits<{
  (e: 'click', event: MouseEvent): void
  (e: 'load', event: Event): void
  (e: 'error', event: Event): void
}>()

const imageProps = computed(() => {
  const result: Record<string, unknown> = {}
  const keys: (keyof typeof props)[] = [
    'src', 'fit', 'position', 'alt', 'width', 'height', 'radius',
    'round', 'lazyLoad', 'showError', 'showLoading',
    'errorIcon', 'loadingIcon', 'iconSize', 'iconPrefix', 'block',
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
.yhm-image {
  display: inline-block;
}
</style>
