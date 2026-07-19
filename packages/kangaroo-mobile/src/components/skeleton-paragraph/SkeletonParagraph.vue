<template>
  <VanSkeletonParagraph :row-width="rowWidth" :round="round" />
</template>

<script setup lang="ts">
import { SkeletonParagraph as VanSkeletonParagraph } from 'vant';

defineOptions({
  name: 'YhmSkeletonParagraph',
});

withDefaults(
  defineProps<{
    rowWidth?: number | string;
    round?: boolean;
  }>(),
  {
    rowWidth: '100%',
    round: false,
  },
);
</script>
