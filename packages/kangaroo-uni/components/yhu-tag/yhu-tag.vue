<template>
  <wd-tag :type="uiType" :plain="plain" :round="round" :mark="mark" :closable="closable" @close="onClose">
    <slot />
  </wd-tag>
</template>

<script setup>
/**
 * k-tag：基于 wot-ui wd-tag 二次封装
 * biz 业务态 -> wd-tag type 映射（注意 wd-tag 用 danger 而非 error）
 */
import { computed } from 'vue';

defineOptions({ name: 'YhuTag', inheritAttrs: false });

const props = defineProps({
  biz: { type: String, default: 'default' }, // default / primary / success / warning / danger
  plain: { type: Boolean, default: false },
  round: { type: Boolean, default: false },
  mark: { type: Boolean, default: false },
  closable: { type: Boolean, default: false },
});

const emit = defineEmits(['close']);

const BIZ_TYPE = {
  default: 'default',
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
};

const uiType = computed(() => BIZ_TYPE[props.biz] || 'default');
const onClose = (e) => emit('close', e);
</script>
