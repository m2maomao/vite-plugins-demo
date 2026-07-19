<template>
  <VanEmpty v-if="$slots.default" v-bind="emptyProps as any">
    <slot />
    <template v-if="$slots.image" #image>
      <slot name="image" />
    </template>
    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>
  </VanEmpty>
  <VanEmpty v-else v-bind="emptyProps as any">
    <template v-if="$slots.image" #image>
      <slot name="image" />
    </template>
    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>
  </VanEmpty>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Empty as VanEmpty } from 'vant';

defineOptions({
  name: 'YhmEmpty',
});

const props = defineProps<{
  image?: string;
  imageSize?: number | string | [number, number];
  description?: string;
}>();

const emptyProps = computed(() => {
  const result: Record<string, unknown> = {};
  const keys: (keyof typeof props)[] = ['image', 'imageSize', 'description'];
  for (const key of keys) {
    const val = props[key];
    if (val !== undefined) {
      result[key] = val;
    }
  }
  return result;
});
</script>
