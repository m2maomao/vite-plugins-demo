<template>
  <VanList
    v-bind="vanProps"
    :class="['yhm-list', customClass]"
    @load="emit('load')"
    @update:loading="emit('update:loading', $event)"
    @update:error="emit('update:error', $event)">
    <slot />
    <template v-if="hasLoadingSlot" #loading><slot name="loading" /></template>
    <template v-if="hasFinishedSlot" #finished><slot name="finished" /></template>
    <template v-if="hasErrorSlot" #error><slot name="error" /></template>
  </VanList>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { List as VanList } from 'vant';

defineOptions({ name: 'YhmList' });

const props = withDefaults(
  defineProps<{
    loading?: boolean;
    finished?: boolean;
    error?: boolean;
    offset?: string | number;
    direction?: 'up' | 'down';
    immediateCheck?: boolean;
    finishedText?: string;
    loadingText?: string;
    errorText?: string;
    customClass?: string;
  }>(),
  { loading: false, finished: false, error: false, offset: 300, direction: 'down', immediateCheck: true },
);

const emit = defineEmits<{
  (e: 'load'): void;
  (e: 'update:loading', v: boolean): void;
  (e: 'update:error', v: boolean): void;
}>();

const slots = useSlots();
const hasLoadingSlot = !!slots.loading;
const hasFinishedSlot = !!slots.finished;
const hasErrorSlot = !!slots.error;

const vanProps = computed(() => {
  const { customClass, ...rest } = props;
  return Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined));
});
</script>
