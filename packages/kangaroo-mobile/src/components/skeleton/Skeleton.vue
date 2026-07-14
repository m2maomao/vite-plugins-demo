<template>
  <VanSkeleton
    v-bind="skeletonProps as any"
    :loading="loading"
    :title="title"
    :avatar="avatar"
    :row="row"
    :round="round"
    :title-width="titleWidth"
    :avatar-size="avatarSize"
    :avatar-shape="avatarShape"
    :animate="animate"
    :row-width="rowWidth"
  >
    <slot />
    <template v-if="$slots.template" #template>
      <slot name="template" />
    </template>
  </VanSkeleton>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Skeleton as VanSkeleton } from 'vant'

defineOptions({
  name: 'YhmSkeleton',
})

const props = withDefaults(
  defineProps<{
    loading?: boolean
    title?: boolean
    avatar?: boolean
    row?: number | string
    round?: boolean
    titleWidth?: number | string
    avatarSize?: number | string
    avatarShape?: 'round' | 'square'
    animate?: boolean
    rowWidth?: number | string | (number | string)[]
  }>(),
  {
    loading: true,
    title: false,
    avatar: false,
    row: 0,
    round: false,
    animate: true,
    avatarShape: 'round',
  }
)

const skeletonProps = computed(() => {
  const result: Record<string, unknown> = {}
  const keys: (keyof typeof props)[] = [
    'loading', 'title', 'avatar', 'row', 'round',
    'titleWidth', 'avatarSize', 'avatarShape', 'animate', 'rowWidth',
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
