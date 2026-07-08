<template>
  <!-- Iconify -->
  <Icon
    v-if="!isVant"
    :icon="iconName"
    :width="size"
    :height="size"
    :color="color"
    aria-hidden="true"
    class="yhm-icon"
  />

  <!-- Vant 兜底 -->
  <VanIcon
    v-else
    :name="vantIconName"
    :size="size"
    :color="color"
    aria-hidden="true"
    class="yhm-icon"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { Icon as VanIcon } from 'vant'
import { resolveIconName, isVantIcon } from './icon-map'

const props = withDefaults(
  defineProps<{
    name: string
    size?: string | number
    color?: string
  }>(),
  { size: 16, color: 'currentColor' }
)

// 解析后的图标名（一定是 string）
const resolved = computed(() => resolveIconName(props.name))

// ✅ 判断是否是 Vant 兜底
const isVant = computed(() => {
  // 空字符串 或 明确在兜底白名单里
  return resolved.value === '' || isVantIcon(props.name)
})

// ✅ Iconify 图标名
const iconName = computed(() => {
  return isVant.value ? '' : resolved.value
})

// ✅ Vant 图标名
const vantIconName = computed(() => {
  if (resolved.value === '') {
    return props.name // vant:xxx 或 coupon-o
  }
  return props.name
})
</script>

<style scoped>
.yhm-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  line-height: 1;
  flex-shrink: 0;
}
</style>