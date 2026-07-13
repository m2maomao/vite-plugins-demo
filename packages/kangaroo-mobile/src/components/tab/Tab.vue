<template>
  <VanTab
    v-bind="tabProps as any"
    :title="title"
    :name="name"
    :disabled="disabled"
    :dot="dot"
    :badge="badge"
    :title-class="titleClass"
    :title-style="titleStyle"
  >
    <template v-if="$slots['title']" #title>
      <slot name="title" />
    </template>
    <slot />
  </VanTab>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Tab as VanTab } from 'vant'

defineOptions({
  name: 'YhmTab',
})

const props = withDefaults(
  defineProps<{
    title?: string
    name?: number | string
    disabled?: boolean
    dot?: boolean
    badge?: number | string
    titleClass?: any
    titleStyle?: any
  }>(),
  {
    disabled: false,
    dot: false,
  }
)

const tabProps = computed(() => {
  const result: Record<string, unknown> = {}
  const keys: (keyof typeof props)[] = [
    'name', 'disabled', 'dot', 'badge',
    'titleClass', 'titleStyle',
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
