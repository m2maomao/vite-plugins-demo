<template>
  <VanRadio
    ref="vanRadioRef"
    v-bind="radioProps as any"
    :class="['yhm-radio', customClass]"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-if="hasIconSlot" #icon="slotProps">
      <slot name="icon" v-bind="slotProps" />
    </template>
    <slot />
  </VanRadio>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { Radio as VanRadio } from 'vant'

defineOptions({
  name: 'YhmRadio',
  inheritAttrs: false,
})

const slots = useSlots()
const hasIconSlot = computed(() => !!slots.icon)

const props = withDefaults(
  defineProps<{
    modelValue?: unknown
    name?: unknown
    disabled?: boolean
    shape?: 'round' | 'square' | 'dot'
    iconSize?: string | number
    checkedColor?: string
    labelPosition?: 'left' | 'right'
    labelDisabled?: boolean
    customClass?: string
  }>(),
  {
    disabled: false,
  }
)

defineEmits<{
  (e: 'update:modelValue', value: unknown): void
}>()

const radioProps = computed(() => {
  const result: Record<string, unknown> = {}
  const keys: (keyof typeof props)[] = [
    'name', 'disabled', 'shape', 'iconSize', 'checkedColor',
    'labelPosition', 'labelDisabled',
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
