<template>
  <VanImagePreview
    v-bind="imagePreviewProps"
    :show="show"
    :images="images"
    :loop="loop"
    :min-zoom="minZoom"
    :max-zoom="maxZoom"
    :overlay="overlay"
    :vertical="vertical"
    :closeable="closeable"
    :show-index="showIndex"
    :close-icon="closeIcon"
    :start-position="startPosition"
    :show-indicators="showIndicators"
    :close-on-click-image="closeOnClickImage"
    :close-on-click-overlay="closeOnClickOverlay"
    :before-close="beforeClose"
    :teleport="teleport"
    @update:show="$emit('update:show', $event)"
    @change="$emit('change', $event)"
    @close="$emit('close')"
    @closed="$emit('closed')"
    @long-press="$emit('longPress', $event)"
    @scale="$emit('scale', $event)">
    <template v-if="$slots.index" #index="slotProps">
      <slot name="index" v-bind="slotProps" />
    </template>
    <template v-if="$slots.image" #image="slotProps">
      <slot name="image" v-bind="slotProps" />
    </template>
    <template v-if="$slots.cover" #cover>
      <slot name="cover" />
    </template>
  </VanImagePreview>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ImagePreview as VanImagePreview } from 'vant';

defineOptions({
  name: 'YhmImagePreview',
});

const props = withDefaults(
  defineProps<{
    show?: boolean;
    images?: string[];
    loop?: boolean;
    minZoom?: number | string;
    maxZoom?: number | string;
    overlay?: boolean;
    vertical?: boolean;
    closeable?: boolean;
    showIndex?: boolean;
    className?: any;
    closeIcon?: string;
    beforeClose?: (active: number) => boolean | Promise<boolean>;
    doubleScale?: boolean;
    overlayClass?: any;
    overlayStyle?: Record<string, any>;
    swipeDuration?: number | string;
    startPosition?: number | string;
    showIndicators?: boolean;
    closeOnPopstate?: boolean;
    closeOnClickImage?: boolean;
    closeOnClickOverlay?: boolean;
    closeIconPosition?: string;
    teleport?: string | any;
    transition?: string;
  }>(),
  {
    loop: true,
    overlay: true,
    vertical: false,
    closeable: false,
    showIndex: true,
    doubleScale: true,
    closeIcon: 'clear',
    showIndicators: false,
    closeOnPopstate: true,
    closeOnClickImage: true,
    closeOnClickOverlay: true,
    closeIconPosition: 'top-right',
    minZoom: 1 / 3,
    maxZoom: 3,
    swipeDuration: 300,
    startPosition: 0,
  },
);

defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'change', index: number): void;
  (e: 'close'): void;
  (e: 'closed'): void;
  (e: 'longPress', event: any): void;
  (e: 'scale', event: any): void;
}>();

const imagePreviewProps = computed(() => {
  const result: Record<string, unknown> = {};
  const keys: (keyof typeof props)[] = [
    'loop',
    'minZoom',
    'maxZoom',
    'overlay',
    'vertical',
    'closeable',
    'showIndex',
    'className',
    'closeIcon',
    'beforeClose',
    'doubleScale',
    'overlayClass',
    'overlayStyle',
    'swipeDuration',
    'startPosition',
    'showIndicators',
    'closeOnPopstate',
    'closeOnClickImage',
    'closeOnClickOverlay',
    'closeIconPosition',
    'teleport',
    'transition',
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
