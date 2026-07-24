<template>
  <VanFloatingPanel
    v-bind="vanProps"
    :class="['yhm-floating-panel', customClass]"
    @height-change="emit('heightChange', $event)"
    @update:height="emit('update:height', $event)">
    <slot />
  </VanFloatingPanel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { FloatingPanel as VanFloatingPanel } from 'vant';

defineOptions({ name: 'YhmFloatingPanel' });

const props = withDefaults(
  defineProps<{
    height?: string | number;
    anchors?: number[];
    duration?: string | number;
    magnetic?: boolean;
    draggable?: boolean;
    contentDraggable?: boolean;
    lockScroll?: boolean;
    safeAreaInsetBottom?: boolean;
    customClass?: string;
  }>(),
  { height: 0, duration: 0.3, magnetic: true, draggable: true, contentDraggable: true, safeAreaInsetBottom: true },
);

const emit = defineEmits<{ (e: 'heightChange', v: number): void; (e: 'update:height', v: number): void }>();

const vanProps = computed(() => {
  const { customClass, ...rest } = props;
  return Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined));
});
</script>
