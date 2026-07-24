<template>
  <VanPasswordInput v-bind="vanProps" :class="['yhm-password-input', customClass]" @focus="emit('focus', $event)" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PasswordInput as VanPasswordInput } from 'vant';

defineOptions({ name: 'YhmPasswordInput' });

const props = withDefaults(
  defineProps<{
    value?: string;
    info?: string;
    mask?: boolean;
    length?: string | number;
    gutter?: string | number;
    focused?: boolean;
    errorInfo?: string;
    customClass?: string;
  }>(),
  { value: '', mask: true, length: 6, focused: false },
);

const emit = defineEmits<{ (e: 'focus', v: Event): void }>();

const vanProps = computed(() => {
  const { customClass, ...rest } = props;
  return Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined));
});
</script>
