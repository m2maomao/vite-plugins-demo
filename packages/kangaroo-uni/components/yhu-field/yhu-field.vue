<template>
  <wd-input
    :model-value="modelValue"
    :label="label"
    :placeholder="placeholder"
    :type="type"
    :disabled="disabled"
    :clearable="clearable"
    :maxlength="maxlength"
    :readonly="readonly"
    @update:model-value="onUpdate">
    <slot />
  </wd-input>
</template>

<script setup>
/**
 * k-field：基于 wot-ui wd-input 二次封装
 * v-model 转发：wd-input 的 update:model-value 事件 -> 父组件 update:modelValue
 */
defineOptions({ name: 'YhuField', inheritAttrs: false });

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  maxlength: { type: Number, default: -1 },
  readonly: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);
const onUpdate = (v) => emit('update:modelValue', v);
</script>
