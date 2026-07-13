<template>
  <VanCheckbox
    ref="vanCheckboxRef"
    v-bind="checkboxProps as any"
    @update:model-value="$emit('update:modelValue', $event)"
    @change="$emit('change', $event)"
  >
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </VanCheckbox>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Checkbox as VanCheckbox } from 'vant'
import type { CheckboxInstance } from 'vant'

defineOptions({
  name: 'YhmCheckbox',
})

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
  if (props.modelValue !== undefined) {
    result['modelValue'] = props.modelValue
  }
  return result
})
</script>
