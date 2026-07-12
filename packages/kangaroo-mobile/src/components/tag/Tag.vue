<template>
  <VanTag v-bind="$attrs" class="yhm-tag">
    <slot />
  </VanTag>
</template>

<script setup lang="ts">
import { Tag as VanTag } from 'vant'

defineOptions({
  name: 'YhmTag',
})
</script>
