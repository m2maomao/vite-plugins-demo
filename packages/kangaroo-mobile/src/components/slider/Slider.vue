<template>
  <VanSlider
    v-bind="sliderProps as any"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @change="$emit('change', $event)"
    @drag-start="$emit('dragStart', $event)"
    @drag-end="$emit('dragEnd', $event)"
  >
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </VanSlider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Slider as VanSlider } from 'vant'

defineOptions({
  name: 'YhmSlider',
})

const props = withDefaults(
  defineProps<{
    modelValue?: number | [number, number]
    min?: number
    max?: number
    step?: number
    barHeight?: string | number
    activeColor?: string
    inactiveColor?: string
    disabled?: boolean
    readonly?: boolean
    range?: boolean
    vertical?: boolean
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    readonly: false,
    range: false,
    vertical: false,
  }
)

defineEmits<{
  (e: 'update:modelValue', value: number | [number, number]): void
  (e: 'change', value: number | [number, number]): void
  (e: 'dragStart', event: TouchEvent): void
  (e: 'dragEnd', event: TouchEvent): void
}>()

const sliderProps = computed(() => {
  const result: Record<string, unknown> = {}
  const keys: (keyof typeof props)[] = [
    'min', 'max', 'step', 'barHeight', 'activeColor', 'inactiveColor',
    'disabled', 'readonly', 'range', 'vertical',
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
