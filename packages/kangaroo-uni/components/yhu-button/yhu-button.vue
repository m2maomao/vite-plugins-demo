<template>
  <wd-button
    v-bind="$attrs"
    :type="uiType"
    :size="size"
    :plain="plain"
    :block="block"
    :disabled="disabled"
    :loading="loading"
    :round="round"
    @click="onClick">
    <slot />
  </wd-button>
</template>

<script setup>
/**
 * k-button：基于 wot-ui wd-button 二次封装
 * 核心价值：业务态(biz) -> wot-ui type 统一映射，收敛设计规范
 * v-bind="$attrs" 透传其余 wd-button 属性
 */
import { computed } from 'vue';

defineOptions({ name: 'YhuButton', inheritAttrs: false });

const props = defineProps({
  // 业务态：统一映射到 wot-ui 类型（设计规范收敛点）
  biz: { type: String, default: 'primary' },
  size: { type: String, default: 'medium' },
  plain: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  round: { type: Boolean, default: true },
});

const emit = defineEmits(['click']);

const BIZ_TYPE = {
  primary: 'primary',
  success: 'success',
  cancel: 'info',
  warning: 'warning',
  danger: 'error',
};

const uiType = computed(() => BIZ_TYPE[props.biz] || 'primary');
const onClick = (e) => emit('click', e);
</script>
