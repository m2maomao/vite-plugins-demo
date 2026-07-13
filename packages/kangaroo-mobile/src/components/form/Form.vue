<template>
  <VanForm
    v-bind="formProps as any"
    @submit="$emit('submit', $event)"
    @failed="$emit('failed', $event)"
  >
    <slot />
  </VanForm>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Form as VanForm } from 'vant'

defineOptions({
  name: 'YhmForm',
})

const props = withDefaults(
  defineProps<{
    colon?: boolean
    disabled?: boolean
    readonly?: boolean
    required?: boolean | 'auto'
    showError?: boolean
    labelWidth?: string | number
    labelAlign?: string
    inputAlign?: string
    scrollToError?: boolean
    scrollToErrorPosition?: string
    validateFirst?: boolean
    submitOnEnter?: boolean
    showErrorMessage?: boolean
    errorMessageAlign?: string
    validateTrigger?: string | string[]
  }>(),
  {
    disabled: false,
    readonly: false,
    submitOnEnter: true,
    showErrorMessage: true,
    validateTrigger: 'onBlur',
  }
)

defineEmits<{
  (e: 'submit', values: Record<string, string>): void
  (e: 'failed', errorInfo: { values: Record<string, string>; errors: any[] }): void
}>()

const formProps = computed(() => {
  const result: Record<string, unknown> = {}
  const keys: (keyof typeof props)[] = [
    'colon', 'disabled', 'readonly', 'required', 'showError',
    'labelWidth', 'labelAlign', 'inputAlign', 'scrollToError',
    'scrollToErrorPosition', 'validateFirst', 'submitOnEnter',
    'showErrorMessage', 'errorMessageAlign', 'validateTrigger',
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
