<template>
  <wd-cell
    v-bind="$attrs"
    :title="title"
    :value="value"
    :is-link="isLink"
    :label="label"
    :required="required"
    :border="border"
    @click="onClick">
    <slot />
  </wd-cell>
</template>

<script setup>
/**
 * k-cell：基于 wot-ui wd-cell 二次封装
 * 收敛业务常用字段（title/value/isLink/required），v-bind="$attrs" 透传其余属性
 */
defineOptions({ name: 'YhuCell', inheritAttrs: false });

const props = defineProps({
  title: { type: String, default: '' },
  value: { type: [String, Number], default: '' },
  isLink: { type: Boolean, default: false },
  label: { type: String, default: '' },
  required: { type: Boolean, default: false },
  border: { type: Boolean, default: true },
});

const emit = defineEmits(['click']);
const onClick = (e) => emit('click', e);
</script>
