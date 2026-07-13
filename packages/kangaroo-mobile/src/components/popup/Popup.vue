<template>
  <VanPopup
    v-bind="popupProps as any"
    :show="show"
    @update:show="$emit('update:show', $event)"
    @open="$emit('open')"
    @close="$emit('close')"
    @opened="$emit('opened')"
    @closed="$emit('closed')"
    @click-overlay="$emit('clickOverlay')"
    @click-close-icon="$emit('clickCloseIcon')"
  >
    <slot />
    <template v-if="$slots['close-icon']" #close-icon>
      <slot name="close-icon" />
    </template>
  </VanPopup>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Popup as VanPopup } from 'vant'

defineOptions({
  name: 'YhmPopup',
})

const props = withDefaults(
  defineProps<{
    show?: boolean
    overlay?: boolean
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center'
    duration?: number | string
    round?: boolean
    destroyOnClose?: boolean
    closeable?: boolean
    closeIcon?: string
    closeIconPosition?: string
    closeOnClickOverlay?: boolean
    closeOnPopstate?: boolean
    overlayStyle?: Record<string, any>
    overlayClass?: string
    transition?: string
    transitionAppear?: boolean
    lockScroll?: boolean
    safeAreaInsetTop?: boolean
    safeAreaInsetBottom?: boolean
    teleport?: string | any
    iconPrefix?: string
  }>(),
  {
    overlay: true,
    position: 'center',
    closeOnClickOverlay: true,
    lockScroll: true,
    transitionAppear: false,
  }
)

defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'open'): void
  (e: 'close'): void
  (e: 'opened'): void
  (e: 'closed'): void
  (e: 'clickOverlay'): void
  (e: 'clickCloseIcon'): void
}>()

const popupProps = computed(() => {
  const result: Record<string, unknown> = {}
  const keys: (keyof typeof props)[] = [
    'overlay', 'position', 'duration', 'round', 'destroyOnClose',
    'closeable', 'closeIcon', 'closeIconPosition',
    'closeOnClickOverlay', 'closeOnPopstate', 'overlayStyle',
    'overlayClass', 'transition', 'transitionAppear', 'lockScroll',
    'safeAreaInsetTop', 'safeAreaInsetBottom', 'teleport', 'iconPrefix',
  ]
  for (const key of keys) {
    const val = props[key]
    if (val !== undefined) {
      result[key] = val
    }
  }
  return result
})
</script>
