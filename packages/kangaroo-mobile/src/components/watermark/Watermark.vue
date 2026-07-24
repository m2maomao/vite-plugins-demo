<template>
  <VanWatermark v-bind="vanProps" :class="['yhm-watermark', customClass]" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Watermark as VanWatermark } from 'vant';

defineOptions({ name: 'YhmWatermark' });

const props = withDefaults(
  defineProps<{
    gapX?: number;
    gapY?: number;
    image?: string;
    width?: number;
    height?: number;
    rotate?: string | number;
    zIndex?: string | number;
    content?: string;
    opacity?: string | number;
    fullPage?: boolean;
    textColor?: string;
    customClass?: string;
  }>(),
  { gapX: 0, gapY: 0, width: 100, height: 100, rotate: -22, fullPage: true, textColor: '#dcdee0' },
);

const vanProps = computed(() => {
  const { customClass, ...rest } = props;
  return Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined));
});
</script>
