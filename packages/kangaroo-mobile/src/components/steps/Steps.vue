<template>
  <VanSteps v-bind="stepsProps" :active="active" @click-step="$emit('clickStep', $event)">
    <slot />
  </VanSteps>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Steps as VanSteps } from 'vant';

defineOptions({
  name: 'YhmSteps',
});

const props = withDefaults(
  defineProps<{
    active?: number | string;
    direction?: 'horizontal' | 'vertical';
    activeIcon?: string;
    iconPrefix?: string;
    finishIcon?: string;
    activeColor?: string;
    inactiveIcon?: string;
    inactiveColor?: string;
  }>(),
  {
    active: 0,
    direction: 'horizontal',
    activeIcon: 'checked',
  },
);

defineEmits<{
  (e: 'clickStep', index: number): void;
}>();

const stepsProps = computed(() => {
  const result: Record<string, unknown> = {};
  const keys: (keyof typeof props)[] = [
    'direction',
    'activeIcon',
    'iconPrefix',
    'finishIcon',
    'activeColor',
    'inactiveIcon',
    'inactiveColor',
  ];
  for (const key of keys) {
    const val = props[key];
    if (val !== undefined) {
      result[key] = val;
    }
  }
  return result as any;
});
</script>
