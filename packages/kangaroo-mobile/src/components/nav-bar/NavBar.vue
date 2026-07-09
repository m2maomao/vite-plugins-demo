<template>
  <VanNavBar
    v-bind="navBarProps"
    @click-left="handleClickLeft"
  >
    <!-- 左侧 -->
    <template #left>
      <slot name="left">
        <YhmIcon
          v-if="leftIcon"
          :name="leftIcon"
          :size="iconSize"
        />
        <span v-if="leftText" class="yhm-nav-bar__text">{{ leftText }}</span>
      </slot>
    </template>

    <!-- 标题 -->
    <template #title>
      <slot name="title">
        {{ title }}
      </slot>
    </template>

    <!-- 右侧 -->
    <template #right>
      <slot name="right" />
    </template>
  </VanNavBar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NavBar as VanNavBar } from 'vant'
import YhmIcon from '../icon/icon.vue'

defineOptions({
  name: 'YhmNavBar',
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    /** 标题 */
    title?: string
    /** 左侧图标（业务名） */
    leftIcon?: string
    /** 左侧文字 */
    leftText?: string
    /** 是否显示返回箭头（等价于 leftIcon="back"） */
    showBack?: boolean
    /** 右侧文字 */
    rightText?: string
    /** 右侧图标 */
    rightIcon?: string
    /** 是否固定 */
    fixed?: boolean
    /** 安全区 */
    safeAreaInsetTop?: boolean
    /** 图标尺寸 */
    iconSize?: number | string
  }>(),
  {
    showBack: false,
    fixed: false,
    safeAreaInsetTop: true,
  }
)

const emit = defineEmits<{
  (e: 'click-left'): void
  (e: 'click-right'): void
}>()

/** 左侧图标：showBack 优先级最高 */
const finalLeftIcon = computed(() => {
  if (props.showBack) return 'back'
  return props.leftIcon
})

/** 透传给 Vant 的 props（精确、可预测） */
const navBarProps = computed(() => {
  const {
    title,
    leftIcon,
    leftText,
    showBack,
    rightText,
    rightIcon,
    ...rest
  } = props

  return {
    ...rest,
    // Vant 的 leftArrow 由我们控制
    leftArrow: !!finalLeftIcon.value,
  }
})

const handleClickLeft = () => {
  emit('click-left')
}
</script>

<style lang="less" scoped>
.yhm-nav-bar__text {
  margin-left: 4px;
  color: var(--van-nav-bar-icon-color);
}
</style>