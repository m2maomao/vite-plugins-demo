<template>
  <!--
    =========================
    YhmNavBar 实现说明
    =========================

    1. 本组件是 Vant NavBar 的**薄封装（Wrapper）**
       - 不重写内部 DOM
       - 只做：API 收敛 + 图标统一 + 主题注入

    2. 为什么用 v-bind="navBarProps"？
       - 显式过滤掉 yhm 私有 props（leftIcon / rightIcon 等）
       - 避免 $attrs 黑盒透传
       - 保证 Vant 收到的 props 类型安全

    3. 为什么 #right / #left 用 slot + 默认内容？
       - slot：给业务完全自定义能力
       - 默认内容：保证 rightText / rightIcon 开箱即用
       - 这是 AntD / Vant 官方推荐模式

    4. 所有图标强制走 YhmIcon
       - 统一 Iconify / 私有图标 / Vant 兜底
       - 禁止直接使用 van-icon
  -->

  <VanNavBar
    v-bind="navBarProps"
    @click-left="handleClickLeft"
  >
    <!-- ===== 左侧区域 ===== -->
    <template #left>
      <!--
        优先级：
        1. 业务传入 #left slot（完全覆盖）
        2. 默认 UI：图标 + 文字
      -->
      <slot name="left">
        <YhmIcon
          v-if="finalLeftIcon"
          :name="finalLeftIcon"
          :size="iconSize"
        />
        <span v-if="leftText" class="yhm-nav-bar__text">
          {{ leftText }}
        </span>
      </slot>
    </template>

    <!-- ===== 标题区域 ===== -->
    <template #title>
      <!--
        标题支持：
        1. 默认：title prop
        2. 自定义：#title slot（如插入 Tabs / Input）
      -->
      <slot name="title">
        {{ title }}
      </slot>
    </template>

    <!-- ===== 右侧区域 ===== -->
    <template #right>
      <!--
        右侧区域设计原则：
        - rightText / rightIcon 提供“快捷用法”
        - #right slot 提供“完全控制权”

        为什么 rightText / rightIcon 要有默认渲染？
        👉 因为它们是组件声明的 Props
        👉 声明了却不渲染 = API 欺骗（Bad Smell）
      -->
      <slot name="right">
        <span
          v-if="rightText"
          class="yhm-nav-bar__right-text"
        >
          {{ rightText }}
        </span>
        <YhmIcon
          v-if="rightIcon"
          :name="rightIcon"
          :size="iconSize"
        />
      </slot>
    </template>
  </VanNavBar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NavBar as VanNavBar } from 'vant'
import YhmIcon from '../icon/icon.vue'

/*
  =========================
  YhmNavBar 组件元信息
  =========================
  name: 必须与组件文件名、注册名保持一致（PascalCase）
  inheritAttrs: false 防止 Vue 自动把 attrs 挂在根节点
*/
defineOptions({
  name: 'YhmNavBar',
  inheritAttrs: false,
})

/*
  =========================
  Props 设计说明
  =========================

  1. 显式声明所有 Props
     - 不使用 useAttrs()
     - 保证 TS 类型 100% 可追溯

  2. showBack 是“语义化快捷”
     - 等价于 leftIcon="back"
     - 只控制 UI，不处理路由逻辑

  3. iconSize 统一控制左右图标
     - 默认 18px，符合 Vant 规范
*/
const props = withDefaults(
  defineProps<{
    /** 标题文本 */
    title?: string

    /** 左侧图标（业务名，如 "back" / "home"） */
    leftIcon?: string

    /** 左侧文字（与图标共存） */
    leftText?: string

    /**
     * 是否显示返回箭头
     * @default false
     * @description 快捷写法，等价于 leftIcon="back"
     */
    showBack?: boolean

    /** 右侧文字 */
    rightText?: string

    /** 右侧图标（业务名） */
    rightIcon?: string

    /** 图标统一尺寸 */
    iconSize?: string | number

    /** 是否固定在顶部 */
    fixed?: boolean

    /** 是否适配顶部安全区（刘海屏） */
    safeAreaInsetTop?: boolean
  }>(),
  {
    showBack: false,
    fixed: false,
    safeAreaInsetTop: true,
    iconSize: 18,
  }
)

/*
  =========================
  Emits 设计说明
  =========================

  1. 只负责通知“点击事件发生”
  2. 不处理路由跳转 / 业务逻辑
  3. 业务通过 @click-left 自行决定行为
*/
const emit = defineEmits<{
  (e: 'click-left'): void
  (e: 'click-right'): void
}>()

/*
  =========================
  计算属性说明
  =========================
*/

/**
 * 最终左侧图标
 * showBack 优先级最高
 * 保证 API 简洁
 */
const finalLeftIcon = computed(() => {
  if (props.showBack) return 'back'
  return props.leftIcon
})

/**
 * 透传给 Vant NavBar 的 Props
 *
 * 为什么要手动过滤？
 * - leftIcon / rightIcon 是 yhm 的私有概念
 * - Vant 只认识 leftArrow
 * - 避免 unknown prop warning
 */
const navBarProps = computed(() => {
  const {
    leftIcon,
    rightIcon,
    showBack,
    title,
    ...rest
  } = props

  return {
    ...rest,
    // Vant 的 leftArrow 由我们精确控制
    leftArrow: !!finalLeftIcon.value,
  }
})

/*
  =========================
  事件处理
  =========================
*/

const handleClickLeft = () => {
  emit('click-left')
}
</script>

<style lang="less" scoped>
/*
  =========================
  样式设计说明
  =========================

  1. 所有尺寸 / 颜色优先使用 CSS Variables
  2. 不写死颜色值，方便主题切换
  3. 只写“布局 & 微调”，不覆盖 Vant 内部结构
*/

.yhm-nav-bar__text {
  margin-left: 4px;
  color: var(--van-nav-bar-icon-color);
}

.yhm-nav-bar__right-text {
  font-size: var(--yh-font-size-md);
  color: var(--van-nav-bar-text-color);
}
</style>