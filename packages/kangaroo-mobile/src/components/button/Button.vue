<template>
  <VanButton v-bind="buttonProps" @click="emit('click', $event)">
    <template v-for="(_, name) in $slots" #[name]>
      <slot :name="name" />
    </template>
  </VanButton>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Button as VanButton } from 'vant';

defineOptions({
  name: 'YhmButton',
});

const props = withDefaults(
  defineProps<{
    type?: 'default' | 'primary' | 'success' | 'danger' | 'warning';
    size?: 'large' | 'normal' | 'small' | 'mini';
    text?: string;
    icon?: string;
    iconPosition?: 'left' | 'right';
    color?: string;
    iconPrefix?: string;
    plain?: boolean;
    round?: boolean;
    square?: boolean;
    hairline?: boolean;
    block?: boolean;
    disabled?: boolean;
    loading?: boolean;
    loadingType?: 'circular' | 'spinner';
    loadingText?: string;
    loadingSize?: string | number;
    url?: string;
    to?: string | Record<string, any>;
    replace?: boolean;
  }>(),
  {
    type: 'default',
    size: 'normal',
    iconPosition: 'left',
  },
);

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const buttonProps = computed(() => {
  const { ...rest } = props;
  return rest as any;
});
</script>
