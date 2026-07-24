<template>
  <VanCountDown
    ref="countDownRef"
    v-bind="vanProps"
    :class="['yhm-count-down', customClass]"
    @change="emit('change', $event)"
    @finish="emit('finish')">
    <template v-if="hasDefaultSlot" #default="scope">
      <slot v-bind="scope" />
    </template>
  </VanCountDown>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue';

const slots = useSlots();
const hasDefaultSlot = !!slots.default;
import { CountDown as VanCountDown } from 'vant';
import type { CountDownInstance } from 'vant';

defineOptions({ name: 'YhmCountDown' });

const countDownRef = ref<CountDownInstance>();

const props = withDefaults(
  defineProps<{
    time?: string | number;
    format?: string;
    autoStart?: boolean;
    millisecond?: boolean;
    customClass?: string;
  }>(),
  { time: 0, format: 'HH:mm:ss', autoStart: true, millisecond: false },
);

const emit = defineEmits<{
  (
    e: 'change',
    v: { total: number; days: number; hours: number; minutes: number; seconds: number; milliseconds: number },
  ): void;
  (e: 'finish'): void;
}>();

const vanProps = computed(() => {
  const { customClass, ...rest } = props;
  return Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined));
});

defineExpose({
  start: () => countDownRef.value?.start(),
  pause: () => countDownRef.value?.pause(),
  reset: () => countDownRef.value?.reset(),
});
</script>
