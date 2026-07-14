<template>
  <VanSkeletonImage
    v-bind="skeletonImageProps as any"
    :image-size="imageSize"
    :image-shape="imageShape"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SkeletonImage as VanSkeletonImage } from 'vant'

defineOptions({
  name: 'YhmSkeletonImage',
})

const props = withDefaults(
  defineProps<{
    imageSize?: number | string
    imageShape?: 'square' | 'round'
  }>(),
  {
    imageShape: 'square',
  }
)

const skeletonImageProps = computed(() => {
  const result: Record<string, unknown> = {}
  const keys: (keyof typeof props)[] = ['imageSize', 'imageShape']
  for (const key of keys) {
    const val = props[key]
    if (val !== undefined) {
      result[key] = val
    }
  }
  return result
})
</script>
