<template>
  <!--
    =========================
    YhmTabBar 实现说明
    =========================

    支持两种使用模式：
    a) **声明式模式** — 通过 `items` 数组配置
       <YhmTabBar :items="tabs" v-model="active" />
    b) **插槽模式** — 手动插入 VanTabbarItem
       <YhmTabBar v-model="active">
         <VanTabbarItem name="home">首页</VanTabbarItem>
       </YhmTabBar>

    插槽模式原理：YhmTabBar 通过 provide(TABBAR_KEY) 转发，
    让 VanTabbarItem 的 useParent(TABBAR_KEY) 能找到父级。
  -->

  <VanTabbar
    v-bind="tabbarProps"
    @change="emit('change', $event)"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <!-- ===== 声明式模式：items 数组 ===== -->
    <template v-if="items.length">
      <VanTabbarItem
        v-for="item in items"
        :key="item.name"
        v-bind="getItemProps(item)"
        @click="handleItemClick(item)"
      >
        <!-- icon 插槽：active/inactive 双态图标 -->
        <template #icon="{ active }">
          <YhmIcon
            v-if="active && item.activeIcon"
            :name="item.activeIcon"
            :size="item.iconSize ?? iconSize"
          />
          <YhmIcon
            v-else-if="item.icon"
            :name="item.icon"
            :size="item.iconSize ?? iconSize"
          />
        </template>
        <!-- 标题插槽 -->
        <slot :name="`title-${item.name}`">
          {{ item.label }}
        </slot>
      </VanTabbarItem>
    </template>

    <!-- ===== 插槽模式：透传默认插槽 ===== -->
    <slot v-else />
  </VanTabbar>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { Tabbar as VanTabbar, TabbarItem as VanTabbarItem } from 'vant'
import { TABBAR_KEY } from 'vant/es/tabbar/Tabbar'
import type { Numeric } from 'vant/es/utils'
import YhmIcon from '../icon/icon.vue'

/*
  =========================
  工具函数
  =========================
*/
function pickDefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {}
  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key]
    }
  }
  return result
}

/*
  =========================
  TabItem 类型定义
  =========================
*/
export interface TabItem {
  name: string | number
  label?: string
  icon?: string
  activeIcon?: string
  iconSize?: string | number
  to?: string | Record<string, unknown>
  url?: string
  replace?: boolean
  badge?: string | number
  dot?: boolean
  badgeProps?: Record<string, unknown>
}

defineOptions({
  name: 'YhmTabBar',
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    items?: TabItem[]
    route?: boolean
    fixed?: boolean
    border?: boolean
    zIndex?: string | number
    placeholder?: boolean
    activeColor?: string
    inactiveColor?: string
    beforeChange?: (active: string | number) => boolean | Promise<boolean>
    safeAreaInsetBottom?: boolean | null
    iconSize?: string | number
  }>(),
  {
    modelValue: 0,
    items: () => [],
    route: false,
    fixed: true,
    border: true,
    placeholder: true,
    iconSize: 20,
    safeAreaInsetBottom: null,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'item-click', item: TabItem): void
}>()

/*
  =========================
  provide 转发 — 支持插槽模式
  =========================
  转发 TABBAR_KEY，让使用者可以在 YhmTabBar 内直接放
  <van-tabbar-item>，它内部 useParent(TABBAR_KEY) 能找到我们。

  注意：TabbarProvide.props 需要的是响应式 props 对象（非 ComputedRef），
  因为 VanTabbarItem 直接读取 parent.props.route / modelValue 等。
  这里直接透传 props（额外 items/iconSize 不影响 VanTabbarItem）。
*/
provide(TABBAR_KEY, {
  props,
  setActive: (active: Numeric, afterChange: () => void) => {
    emit('update:modelValue', active as any)
    emit('change', active as any)
    afterChange()
  },
} as any)

/*
  =========================
  计算属性
  =========================
*/
const tabbarProps = computed(() => {
  const {
    items,
    iconSize,
    ...rest
  } = props
  return pickDefined(rest as Record<string, unknown>)
})

function getItemProps(item: TabItem): Record<string, unknown> {
  return pickDefined({
    name: item.name,
    to: item.to,
    url: item.url,
    replace: item.replace,
    dot: item.dot,
    badge: item.badge,
    badgeProps: item.badgeProps,
  })
}

const handleItemClick = (item: TabItem) => {
  emit('item-click', item)
}
</script>

<style lang="less" scoped>
:deep(.van-tabbar-item__icon) {
  margin-bottom: 2px;
}
</style>
