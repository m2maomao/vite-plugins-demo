<template>
  <div class="demo-button">
    <yhm-nav-bar
      title="Button"
      :left-text="t('back')"
      show-back
      @click-left="$emit('back')"
    />

    <div class="demo-content">
      <!-- 按钮类型 -->
      <div class="demo-block">
        <div class="demo-block__title">{{ t('type') }}</div>
        <div class="demo-button-row">
          <yhm-button type="primary">{{ t('primary') }}</yhm-button>
          <yhm-button type="success">{{ t('success') }}</yhm-button>
          <yhm-button type="default">{{ t('default') }}</yhm-button>
        </div>
        <yhm-button type="danger">{{ t('danger') }}</yhm-button>
        <yhm-button type="warning">{{ t('warning') }}</yhm-button>
      </div>

      <!-- 朴素按钮 -->
      <div class="demo-block">
        <div class="demo-block__title">{{ t('plain') }}</div>
        <yhm-button plain type="primary" :text="t('plain')" />
        <yhm-button plain type="success" :text="t('plain')" />
      </div>

      <!-- 细边框 -->
      <div class="demo-block">
        <div class="demo-block__title">{{ t('hairline') }}</div>
        <yhm-button plain hairline type="primary" :text="t('hairlineButton')" />
        <yhm-button plain hairline type="success" :text="t('hairlineButton')" />
      </div>

      <!-- 禁用状态 -->
      <div class="demo-block">
        <div class="demo-block__title">{{ t('disabled') }}</div>
        <yhm-button disabled type="primary" :text="t('disabled')" />
        <yhm-button disabled type="success" :text="t('disabled')" />
      </div>

      <!-- 加载状态 -->
      <div class="demo-block">
        <div class="demo-block__title">{{ t('loading') }}</div>
        <yhm-button loading type="primary">{{ t('loading') }}</yhm-button>
        <yhm-button loading type="primary" loading-type="spinner">{{ t('loading') }}</yhm-button>
        <yhm-button loading :loading-text="t('loadingText')" type="success" />
      </div>

      <!-- 按钮形状 -->
      <div class="demo-block">
        <div class="demo-block__title">{{ t('shape') }}</div>
        <yhm-button type="primary" square :text="t('square')" />
        <yhm-button type="success" round :text="t('round')" />
      </div>

      <!-- 图标按钮 -->
      <div class="demo-block">
        <div class="demo-block__title">{{ t('icon') }}</div>
        <yhm-button type="primary" icon="plus" />
        <yhm-button type="primary" icon="plus" :text="t('button')" />
      </div>

      <!-- 按钮尺寸 -->
      <div class="demo-block">
        <div class="demo-block__title">{{ t('size') }}</div>
        <yhm-button type="primary" size="large">{{ t('large') }}</yhm-button>
        <yhm-button type="primary" size="normal">{{ t('normal') }}</yhm-button>
        <yhm-button type="primary" size="small">{{ t('small') }}</yhm-button>
        <yhm-button type="primary" size="mini">{{ t('mini') }}</yhm-button>
      </div>

      <!-- 块级元素 -->
      <div class="demo-block">
        <div class="demo-block__title">{{ t('blockElement') }}</div>
        <yhm-button type="primary" block>{{ t('blockElement') }}</yhm-button>
      </div>

      <!-- 自定义颜色 -->
      <div class="demo-block">
        <div class="demo-block__title">{{ t('customColor') }}</div>
        <yhm-button color="#7232dd" :text="t('pure')" />
        <yhm-button plain color="#7232dd" :text="t('pure')" />
        <yhm-button
          color="linear-gradient(to right, #ff6034, #ee0a24)"
          :text="t('gradient')"
        />
      </div>

      <!-- 动画按钮 -->
      <div class="demo-block">
        <div class="demo-block__title">{{ t('animatedButton') }}</div>
        <yhm-button type="danger" round>
          <van-swipe
            vertical
            class="notice-swipe"
            :autoplay="2000"
            :touchable="false"
            :show-indicators="false"
          >
            <van-swipe-item>{{ t('doTask') }}</van-swipe-item>
            <van-swipe-item>{{ t('lottery') }}</van-swipe-item>
          </van-swipe>
        </yhm-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swipe as VanSwipe, SwipeItem as VanSwipeItem } from 'vant'
import { createTranslate } from '@/locale'

defineEmits<{ (e: 'back'): void }>()

const t = createTranslate('buttonDemo')
</script>

<style>
.demo-content {
  padding: 16px 0;
}

.demo-block {
  margin-bottom: 24px;
  padding: 0 16px;
}

.demo-block__title {
  margin: 0;
  padding: 0 0 8px;
  color: var(--yh-text-color-secondary, #969799);
  font-size: var(--yh-font-size-md, 14px);
  line-height: 1.5;
}

/* 按钮间距 — 与 Vant 官方 demo 完全一致 */
.demo-button-row {
  margin-bottom: var(--van-padding-sm);
}

.demo-button .van-button--large {
  margin-bottom: var(--van-padding-md);
}

.demo-button .van-button--small,
.demo-button .van-button--normal:not(:last-child) {
  margin-right: var(--van-padding-md);
}

/* 动画按钮轮播 */
.demo-button .notice-swipe {
  height: 40px;
  line-height: 40px;
}
</style>
