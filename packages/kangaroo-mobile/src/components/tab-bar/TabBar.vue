<template>
  <!--
    =========================
    YhmTabBar 实现说明
    =========================

    1. 本组件是 Vant Tabbar 的**薄封装（Wrapper）**
       - 不重写内部 DOM
       - 只做：API 收敛 + 图标统一 + 主题注入

    2. 两种使用模式：
       a) **声明式模式** — 通过 `items` 数组配置
          <YhmTabBar :items="tabItems" v-model="active" />
       b) **插槽模式** — 手动插入 VanTabbarItem
          <YhmTabBar v-model="active">
            <VanTabbarItem name="home">首页</VanTabbarItem>
          </YhmTabBar>

    3. 为什么用 v-bind="tabbarProps"？
       - 显式过滤掉 yhm 私有 props（items 等）
       - 避免 $attrs 黑盒透传
       - 保证 Vant 收到的 props 类型安全

    4. 所有图标强制走 YhmIcon
       - 统一 Iconify / 私有图标 / Vant 兜底
       - 禁止直接使用 van-icon
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
import { computed } from 'vue'
import { Tabbar as VanTabbar, TabbarItem as VanTabbarItem } from 'vant'
import YhmIcon from '../icon/icon.vue'

/*
  =========================
  工具函数
  =========================
  剥除 undefined 值，避免 exactOptionalPropertyTypes 严格模式报错
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
  与 Vant TabbarItem Props 保持对齐
*/
export interface TabItem {
  /** 唯一标识（v-model 绑定值） */
  name: string | number
  /** 显示文本 */
  label?: string
  /** YhmIcon 名称（未选中态） */
  icon?: string
  /** YhmIcon 名称（激活态，可选） */
  activeIcon?: string
  /** 图标尺寸 */
  iconSize?: string | number
  /** 路由路径（route 模式下使用） */
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
}

/*
  =========================
  YhmTabBar 组件元信息
  =========================
  name: 必须与组件文件名、注册名保持一致（PascalCase）
  inheritAttrs: false 防止 Vue 自动把 attrs 挂在根节点
*/
defineOptions({
  name: 'YhmTabBar',
  inheritAttrs: false,
})

/*
  =========================
  Props 设计说明
  =========================

  1. 显式声明所有 Props
     - 不使用 useAttrs()
     - 保证 TS 类型 100% 可追溯

  2. items 声明式数组
     - 提供最便捷的配置模式
     - 与 Vant TabbarItem 的 slot 模式互补

  3. 图标尺寸统一管理
     - iconSize 控制所有 TabItem 图标大小
     - 单个 item 可通过 iconSize 覆盖
*/
const props = withDefaults(
  defineProps<{
    /** 当前选中的标签标识（v-model） */
    modelValue?: string | number

    /** 标签页配置数组（声明式模式） */
    items?: TabItem[]

    /** 是否启用路由模式 */
    route?: boolean

    /** 是否固定在底部 */
    fixed?: boolean

    /** 是否显示上边框 */
    border?: boolean

    /** 层级 z-index */
    zIndex?: string | number

    /** 是否在标签栏下方生成占位元素（fixed 时生效） */
    placeholder?: boolean

    /** 选中标签的颜色 */
    activeColor?: string

    /** 未选中标签的颜色 */
    inactiveColor?: string

    /** 切换前的拦截函数 */
    beforeChange?: (active: string | number) => boolean | Promise<boolean>

    /** 是否开启底部安全区适配 */
    safeAreaInsetBottom?: boolean | null

    /** 图标统一尺寸 */
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

/*
  =========================
  Emits 设计说明
  =========================

  1. update:modelValue — v-model 双向绑定
  2. change — 标签切换事件
  3. item-click — 某个标签被点击（声明式模式）
*/
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'item-click', item: TabItem): void
}>()

/*
  =========================
  计算属性说明
  =========================
*/

/**
 * 透传给 Vant Tabbar 的 Props
 *
 * 为什么要手动过滤？
 * - items / iconSize 是 yhm 的私有概念
 * - Vant 不认识这些 prop
 * - 避免 unknown prop warning
 */
const tabbarProps = computed(() => {
  const {
    items,
    iconSize,
    ...rest
  } = props

  return pickDefined(rest as Record<string, unknown>)
})

/**
 * 构建 VanTabbarItem 的 props
 * 过滤掉 undefined 值，满足 Vant exactOptionalPropertyTypes 要求
 */
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

/*
  =========================
  事件处理
  =========================
*/

const handleItemClick = (item: TabItem) => {
  emit('item-click', item)
}
</script>

<style lang="less" scoped>
/*
  =========================
  样式设计说明
  =========================

  1. 所有尺寸 / 颜色优先使用 CSS Variables
  2. 不写死颜色值，方便主题切换
  3. YhmTabBar 主要依赖 Vant Tabbar 内部样式
  4. 此样式文件仅做最小化微调
*/

/* 图标统一间距微调 */
:deep(.van-tabbar-item__icon) {
  margin-bottom: 2px;
}
</style>
