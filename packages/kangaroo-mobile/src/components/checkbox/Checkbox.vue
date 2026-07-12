<template>
  <VanCheckbox
    ref="vanCheckboxRef"
    v-bind="checkboxProps as any"
    :class="['yhm-checkbox', customClass]"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @change="$emit('change', $event)"
  >
    <template v-if="hasIconSlot" #icon="slotProps">
      <slot name="icon" v-bind="slotProps" />
    </template>
    <slot />
  </VanCheckbox>
</template>

<script setup lang="ts">
import { computed, useSlots, ref } from 'vue'
import { Checkbox as VanCheckbox } from 'vant'
import type { CheckboxInstance } from 'vant'

defineOptions({
  name: 'YhmCheckbox',
  inheritAttrs: false,
})

const slots = useSlots()
const hasIconSlot = computed(() => !!slots.icon)

const vanCheckboxRef = ref<CheckboxInstance>()

defineExpose({
  toggle: () => vanCheckboxRef.value?.toggle(),
})

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    name?: unknown
    disabled?: boolean
    shape?: 'round' | 'square'
    iconSize?: string | number
    checkedColor?: string
    labelPosition?: 'left' | 'right'
    labelDisabled?: boolean
    bindGroup?: boolean
    indeterminate?: boolean | null
    customClass?: string
  }>(),
  {
    disabled: false,
    bindGroup: true,
  }
)

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const checkboxProps = computed(() => {
  const result: Record<string, unknown> = {}
  const keys: (keyof typeof props)[] = [
    'name', 'disabled', 'shape', 'iconSize', 'checkedColor',
    'labelPosition', 'labelDisabled', 'bindGroup', 'indeterminate',
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
