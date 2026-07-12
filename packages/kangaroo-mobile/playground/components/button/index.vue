<template>
  <div class="demo-button">
    <demo-block :title="t('type')">
      <div class="demo-button-row">
        <yhm-button type="primary">{{ t('primary') }}</yhm-button>
        <yhm-button type="success">{{ t('success') }}</yhm-button>
        <yhm-button type="default">{{ t('default') }}</yhm-button>
      </div>
      <yhm-button type="danger">{{ t('danger') }}</yhm-button>
      <yhm-button type="warning">{{ t('warning') }}</yhm-button>
    </demo-block>

    <demo-block :title="t('plain')">
      <yhm-button plain type="primary" :text="t('plain')" />
      <yhm-button plain type="success" :text="t('plain')" />
    </demo-block>

    <demo-block :title="t('hairline')">
      <yhm-button plain hairline type="primary" :text="t('hairlineButton')" />
      <yhm-button plain hairline type="success" :text="t('hairlineButton')" />
    </demo-block>

    <demo-block :title="t('disabled')">
      <yhm-button disabled type="primary" :text="t('disabled')" />
      <yhm-button disabled type="success" :text="t('disabled')" />
    </demo-block>

    <demo-block :title="t('loading')">
      <yhm-button loading type="primary">{{ t('loading') }}</yhm-button>
      <yhm-button loading type="primary" loading-type="spinner">{{ t('loading') }}</yhm-button>
      <yhm-button loading :loading-text="t('loadingText')" type="success" />
    </demo-block>

    <demo-block :title="t('shape')">
      <yhm-button type="primary" square :text="t('square')" />
      <yhm-button type="success" round :text="t('round')" />
    </demo-block>

    <demo-block :title="t('icon')">
      <yhm-button type="primary" icon="plus" />
      <yhm-button type="primary" icon="plus" :text="t('button')" />
    </demo-block>

    <demo-block :title="t('size')">
      <yhm-button type="primary" size="large">{{ t('large') }}</yhm-button>
      <yhm-button type="primary" size="normal">{{ t('normal') }}</yhm-button>
      <yhm-button type="primary" size="small">{{ t('small') }}</yhm-button>
      <yhm-button type="primary" size="mini">{{ t('mini') }}</yhm-button>
    </demo-block>

    <demo-block :title="t('blockElement')">
      <yhm-button type="primary" block>{{ t('blockElement') }}</yhm-button>
    </demo-block>

    <demo-block :title="t('customColor')">
      <yhm-button color="#7232dd" :text="t('pure')" />
      <yhm-button plain color="#7232dd" :text="t('pure')" />
      <yhm-button
        color="linear-gradient(to right, #ff6034, #ee0a24)"
        :text="t('gradient')"
      />
    </demo-block>

    <demo-block :title="t('animatedButton')">
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
    </demo-block>
  </div>
</template>

<script setup lang="ts">
import { Swipe as VanSwipe, SwipeItem as VanSwipeItem } from 'vant'
import { useTranslate } from '@/locale/useTranslate'

const t = useTranslate({
  'zh-CN': {
    type: '按钮类型',
    default: '默认按钮',
    primary: '主要按钮',
    success: '成功按钮',
    danger: '危险按钮',
    warning: '警告按钮',
    plain: '朴素按钮',
    disabled: '禁用状态',
    loading: '加载状态',
    loadingText: '加载中...',
    shape: '按钮形状',
    square: '方形按钮',
    round: '圆形按钮',
    size: '按钮尺寸',
    large: '大号按钮',
    normal: '普通按钮',
    small: '小型按钮',
    mini: '迷你按钮',
    blockElement: '块级元素',
    hairline: '细边框',
    hairlineButton: '细边框按钮',
    icon: '图标按钮',
    button: '按钮',
    gradient: '渐变色按钮',
    animatedButton: '动画按钮',
    doTask: '做任务',
    lottery: '抽大奖',
    customColor: '自定义颜色',
    pure: '单色按钮',
  },
  'en-US': {
    type: 'Type',
    default: 'Default',
    primary: 'Primary',
    success: 'Success',
    danger: 'Danger',
    warning: 'Warning',
    plain: 'Plain',
    disabled: 'Disabled',
    loading: 'Loading',
    loadingText: 'Loading...',
    shape: 'Shape',
    square: 'Square',
    round: 'Round',
    size: 'Size',
    large: 'Large',
    normal: 'Normal',
    small: 'Small',
    mini: 'Mini',
    blockElement: 'Block Element',
    hairline: 'Hairline',
    hairlineButton: 'Hairline',
    icon: 'Icon',
    button: 'Button',
    gradient: 'Gradient',
    animatedButton: 'Animated Button',
    doTask: 'Do Task',
    lottery: 'Lottery',
    customColor: 'Custom Color',
    pure: 'Pure',
  },
  'ja-JP': {
    type: 'ボタンタイプ',
    default: 'デフォルト',
    primary: 'プライマリ',
    success: 'サクセス',
    danger: 'デンジャー',
    warning: 'ワーニング',
    plain: 'プレーン',
    disabled: '無効',
    loading: 'ローディング',
    loadingText: '読み込み中...',
    shape: 'シェイプ',
    square: 'スクエア',
    round: 'ラウンド',
    size: 'サイズ',
    large: 'ラージ',
    normal: 'ノーマル',
    small: 'スモール',
    mini: 'ミニ',
    blockElement: 'ブロック要素',
    hairline: 'ヘアライン',
    hairlineButton: 'ヘアライン',
    icon: 'アイコン',
    button: 'ボタン',
    gradient: 'グラデーション',
    animatedButton: 'アニメーションボタン',
    doTask: 'タスク',
    lottery: '抽選',
    customColor: 'カスタム色',
    pure: '単色',
  },
})
</script>

<style lang="less">
.demo-button {
  .van-button {
    &--large {
      margin-bottom: var(--van-padding-md);
    }

    &--small,
    &--normal:not(:last-child) {
      margin-right: var(--van-padding-md);
    }
  }

  .van-doc-demo-block {
    padding: 0 var(--van-padding-md);
  }

  .van-doc-demo-block__title {
    padding-left: 0;
  }

  .notice-swipe {
    height: 40px;
    line-height: 40px;
  }

  .demo-button-row {
    margin-bottom: var(--van-padding-sm);
  }
}
</style>
