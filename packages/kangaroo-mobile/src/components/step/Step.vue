<template>
  <VanStep>
    <template v-if="$slots['active-icon']" #active-icon>
      <slot name="active-icon" />
    </template>
    <template v-if="$slots['inactive-icon']" #inactive-icon>
      <slot name="inactive-icon" />
    </template>
    <template v-if="$slots['finish-icon']" #finish-icon>
      <slot name="finish-icon" />
    </template>
    <slot />
  </VanStep>
</template>

<script setup lang="ts">
import { Step as VanStep } from 'vant'

defineOptions({
  name: 'YhmStep',
})
</script>
