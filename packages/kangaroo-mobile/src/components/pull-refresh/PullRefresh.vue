<template>
  <VanPullRefresh
    v-bind="vanProps"
    :class="['yhm-pull-refresh', customClass]"
    @change="emit('change', $event)"
    @refresh="emit('refresh')"
    @update:model-value="emit('update:modelValue', $event)">
    <slot />
    <template v-if="hasPullingSlot" #pulling="scope"><slot name="pulling" v-bind="scope" /></template>
    <template v-if="hasLoosingSlot" #loosing="scope"><slot name="loosing" v-bind="scope" /></template>
    <template v-if="hasLoadingSlot" #loading="scope"><slot name="loading" v-bind="scope" /></template>
  </VanPullRefresh>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { PullRefresh as VanPullRefresh } from 'vant';

defineOptions({ name: 'YhmPullRefresh' });

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    disabled?: boolean;
    headHeight?: string | number;
    pullDistance?: string | number;
    pullingText?: string;
    loosingText?: string;
    loadingText?: string;
    successText?: string;
    successDuration?: string | number;
    animationDuration?: string | number;
    customClass?: string;
  }>(),
  { modelValue: false, disabled: false, headHeight: 50, successDuration: 500, animationDuration: 300 },
);

const emit = defineEmits<{
  (e: 'change', v: boolean): void;
  (e: 'refresh'): void;
  (e: 'update:modelValue', v: boolean): void;
}>();

const slots = useSlots();
const hasPullingSlot = !!slots.pulling;
const hasLoosingSlot = !!slots.loosing;
const hasLoadingSlot = !!slots.loading;

const vanProps = computed(() => {
  const { customClass, ...rest } = props;
  return Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined));
});
</script>
