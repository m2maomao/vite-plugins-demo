<template>
  <VanCard
    v-bind="cardProps as any"
    :num="num"
    :price="price"
    :desc="desc"
    :title="title"
    :thumb="thumb"
    :tag="tag"
    :origin-price="originPrice"
    :centered="centered"
    :lazy-load="lazyLoad"
    :currency="currency"
    :thumb-link="thumbLink"
    @click-thumb="$emit('clickThumb', $event)"
  >
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <template v-if="$slots.desc" #desc>
      <slot name="desc" />
    </template>
    <template v-if="$slots.price" #price>
      <slot name="price" />
    </template>
    <template v-if="$slots['origin-price']" #origin-price>
      <slot name="origin-price" />
    </template>
    <template v-if="$slots.num" #num>
      <slot name="num" />
    </template>
    <template v-if="$slots.bottom" #bottom>
      <slot name="bottom" />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
    <template v-if="$slots.tags" #tags>
      <slot name="tags" />
    </template>
    <template v-if="$slots.thumb" #thumb>
      <slot name="thumb" />
    </template>
    <template v-if="$slots.tag" #tag>
      <slot name="tag" />
    </template>
    <template v-if="$slots['price-top']" #price-top>
      <slot name="price-top" />
    </template>
  </VanCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card as VanCard } from 'vant'

defineOptions({
  name: 'YhmCard',
})

const props = withDefaults(
  defineProps<{
    num?: number | string
    price?: number | string
    desc?: string
    title?: string
    thumb?: string
    tag?: string
    originPrice?: number | string
    centered?: boolean
    lazyLoad?: boolean
    currency?: string
    thumbLink?: string
  }>(),
  {
    currency: '¥',
    centered: false,
    lazyLoad: false,
  }
)

defineEmits<{
  (e: 'clickThumb', event: MouseEvent): void
}>()

const cardProps = computed(() => {
  const result: Record<string, unknown> = {}
  const keys: (keyof typeof props)[] = [
    'num', 'price', 'desc', 'title', 'thumb', 'tag',
    'originPrice', 'centered', 'lazyLoad', 'currency', 'thumbLink',
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
