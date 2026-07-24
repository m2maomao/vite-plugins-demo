<template>
  <VanIndexBar
    v-bind="vanProps"
    :class="['yhm-index-bar', customClass]"
    @change="emit('change', $event)"
    @select="emit('select', $event)"
    @update:model-value="emit('update:modelValue', $event)">
    <slot />
  </VanIndexBar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IndexBar as VanIndexBar } from 'vant';

defineOptions({ name: 'YhmIndexBar' });

const props = withDefaults(
  defineProps<{
    modelValue?: string | number;
    sticky?: boolean;
    stickyOffset?: number;
    zIndex?: string | number;
    highlightColor?: string;
    stickyColor?: string;
    customClass?: string;
  }>(),
  { sticky: true, stickyOffset: 0 },
);

const emit = defineEmits<{
  (e: 'change', v: string | number): void;
  (e: 'select', v: string | number): void;
  (e: 'update:modelValue', v: string | number): void;
}>();

const vanProps = computed(() => {
  const { customClass, ...rest } = props;
  return Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined));
});
</script>
