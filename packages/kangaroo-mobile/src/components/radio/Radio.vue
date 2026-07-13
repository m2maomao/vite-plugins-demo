<template>
  <VanRadio
    v-bind="mergedProps as any"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </VanRadio>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Radio as VanRadio } from 'vant'

defineOptions({
  name: 'YhmRadio',
})

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
  }>(),
  {
    disabled: false,
  }
)

defineEmits<{
  (e: 'update:modelValue', value: unknown): void
}>()

const mergedProps = computed(() => {
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
  if (props.modelValue !== undefined) {
    result['modelValue'] = props.modelValue
  }
  return result
})
</script>
