<template>
  <VanNumberKeyboard
    v-bind="vanProps"
    :class="['yhm-number-keyboard', customClass]"
    @input="emit('input', $event)"
    @delete="emit('delete')"
    @close="emit('close')"
    @blur="emit('blur')"
    @update:model-value="emit('update:modelValue', $event)"
    @update:show="emit('update:show', $event)">
    <template v-if="hasTitleSlot" #title><slot name="title" /></template>
    <template v-if="hasExtraSlot" #extra><slot name="extra" /></template>
  </VanNumberKeyboard>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { NumberKeyboard as VanNumberKeyboard } from 'vant';

defineOptions({ name: 'YhmNumberKeyboard' });

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    show?: boolean;
    title?: string;
    zIndex?: string | number;
    transition?: boolean;
    theme?: 'default' | 'custom';
    maxlength?: string | number;
    deleteButtonText?: string;
    closeButtonText?: string;
    randomOrder?: boolean;
    safeAreaInsetBottom?: boolean;
    hideOnClickOutside?: boolean;
    customClass?: string;
  }>(),
  { modelValue: '', show: false, transition: true, safeAreaInsetBottom: true, hideOnClickOutside: true },
);

const emit = defineEmits<{
  (e: 'input', v: string): void;
  (e: 'delete'): void;
  (e: 'close'): void;
  (e: 'blur'): void;
  (e: 'update:modelValue', v: string): void;
  (e: 'update:show', v: boolean): void;
}>();

const slots = useSlots();
const hasTitleSlot = !!slots.title;
const hasExtraSlot = !!slots.extra;

const vanProps = computed(() => {
  const { customClass, ...rest } = props;
  return Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined));
});
</script>
