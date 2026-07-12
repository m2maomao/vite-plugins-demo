<template>
  <VanStepper
    v-bind="stepperProps as any"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @change="$emit('change', $event)"
    @overlimit="$emit('overlimit', $event)"
    @plus="$emit('plus', $event)"
    @minus="$emit('minus', $event)"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Stepper as VanStepper } from 'vant'

defineOptions({
  name: 'YhmStepper',
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    min?: string | number
    max?: string | number
    step?: string | number
    name?: string
    disabled?: boolean
    inputWidth?: string | number
    buttonSize?: string | number
    showPlus?: boolean
    showMinus?: boolean
    showInput?: boolean
    longPress?: boolean
    allowEmpty?: boolean
    placeholder?: string
    integer?: boolean
    decimalLength?: string | number
    theme?: 'default' | 'round'
    disablePlus?: boolean
    disableMinus?: boolean
    disableInput?: boolean
    beforeChange?: (value: string | number) => boolean | Promise<boolean>
  }>(),
  {
    disabled: false,
    integer: false,
    longPress: true,
    showPlus: true,
    showMinus: true,
    showInput: true,
    theme: 'default',
    disableInput: false,
  }
)

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'overlimit', action: string): void
  (e: 'plus', value: string | number): void
  (e: 'minus', value: string | number): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const stepperProps = computed(() => {
  const result: Record<string, unknown> = {}
  const keys: (keyof typeof props)[] = [
    'min', 'max', 'step', 'name', 'disabled',
    'inputWidth', 'buttonSize', 'showPlus', 'showMinus', 'showInput',
    'longPress', 'allowEmpty', 'placeholder', 'integer',
    'decimalLength', 'theme', 'disablePlus', 'disableMinus',
    'disableInput', 'beforeChange',
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
