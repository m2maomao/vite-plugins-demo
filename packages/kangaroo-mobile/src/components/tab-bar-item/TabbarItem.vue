<template>
  <!--
    =========================
    YhmTabbarItem — 标签栏项
    =========================

    YhmTabBar 插槽模式的配套组件。
    包装 VanTabbarItem，统一使用 YhmIcon 渲染图标，
    支持 active/inactive 双态图标切换。

    使用方式：
    <YhmTabBar>
      <YhmTabbarItem name="home" icon="home" label="首页" />
      <YhmTabbarItem name="search" icon="search" active-icon="bell" />
    </YhmTabBar>
  -->

  <VanTabbarItem
    v-bind="itemProps"
    @click="emit('click', $event)"
  >
    <template #icon="iconProps">
      <YhmIcon
        v-if="iconProps.active && props.activeIcon"
        :name="props.activeIcon"
        :size="props.iconSize"
      />
      <YhmIcon
        v-else-if="props.icon"
        :name="props.icon"
        :size="props.iconSize"
      />
      <slot v-else name="icon" v-bind="iconProps" />
    </template>
    <slot />
  </VanTabbarItem>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TabbarItem as VanTabbarItem } from 'vant'
import YhmIcon from '../icon/icon.vue'

defineOptions({
  name: 'YhmTabbarItem',
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    /** 唯一标识 */
    name?: string | number
    /** YhmIcon 名称（未选中态） */
    icon?: string
    /** YhmIcon 名称（激活态，选中时替换 icon） */
    activeIcon?: string
    /** 图标尺寸 */
    iconSize?: string | number
    /** 路由路径 */
    to?: string | Record<string, unknown>
    /** 跳转链接 */
    url?: string
    /** 是否替换当前路由 */
    replace?: boolean
    /** 徽标内容 */
    badge?: string | number
    /** 是否显示小红点 */
    dot?: boolean
    /** Badge 组件 Props */
    badgeProps?: Record<string, unknown>
    /** 图标类名前缀 */
    iconPrefix?: string
  }>(),
  {
    iconSize: 20,
  }
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const itemProps = computed(() => {
  const {
    icon,
    activeIcon,
    iconSize,
    ...rest
  } = props
  return rest as Record<string, unknown>
})
</script>
