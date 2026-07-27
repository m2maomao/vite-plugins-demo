<template>
  <VanIndexAnchor v-bind="vanProps" :class="['yhm-index-anchor', customClass]">
    <template v-if="hasDefaultSlot" #default>
      <slot />
    </template>
  </VanIndexAnchor>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { IndexAnchor as VanIndexAnchor } from 'vant';

const slots = useSlots();
const hasDefaultSlot = !!slots.default;

defineOptions({ name: 'YhmIndexAnchor' });

const props = withDefaults(
  defineProps<{
    index?: string | number;
    customClass?: string;
  }>(),
  {},
);

const vanProps = computed(() => {
  const { customClass, ...rest } = props;
  return Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined));
});
</script>
