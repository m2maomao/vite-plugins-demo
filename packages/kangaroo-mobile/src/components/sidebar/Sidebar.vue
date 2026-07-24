<template>
  <VanSidebar
    v-bind="vanProps"
    :class="['yhm-sidebar', customClass]"
    @change="emit('change', $event)"
    @update:model-value="emit('update:modelValue', $event)">
    <slot />
  </VanSidebar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Sidebar as VanSidebar } from 'vant';

defineOptions({ name: 'YhmSidebar' });

const props = defineProps<{ modelValue?: number; customClass?: string }>();

const emit = defineEmits<{
  (e: 'change', value: number): void;
  (e: 'update:modelValue', value: number): void;
}>();

const vanProps = computed(() => {
  const { customClass, ...rest } = props;
  return Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined));
});
</script>
