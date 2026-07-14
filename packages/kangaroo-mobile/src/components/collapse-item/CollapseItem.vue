<template>
  <VanCollapseItem
    v-bind="collapseItemProps as any"
    :name="name"
    :title="title"
    :value="value"
    :label="label"
    :icon="icon"
    :disabled="disabled"
    :readonly="readonly"
    :is-link="isLink"
    :lazy-render="lazyRender"
  >
    <slot />
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <template v-if="$slots.value" #value>
      <slot name="value" />
    </template>
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    <template v-if="$slots['right-icon']" #right-icon>
      <slot name="right-icon" />
    </template>
  </VanCollapseItem>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CollapseItem as VanCollapseItem } from 'vant'

defineOptions({
  name: 'YhmCollapseItem',
})

const props = withDefaults(
  defineProps<{
    name?: number | string
    title?: string
    value?: string | number
    label?: string
    icon?: string
    disabled?: boolean
    readonly?: boolean
    isLink?: boolean
    lazyRender?: boolean
  }>(),
  {
    disabled: false,
    readonly: false,
    isLink: true,
    lazyRender: true,
  }
)

const collapseItemProps = computed(() => {
  const result: Record<string, unknown> = {}
  const keys: (keyof typeof props)[] = [
    'name', 'title', 'value', 'label', 'icon',
    'disabled', 'readonly', 'isLink', 'lazyRender',
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
