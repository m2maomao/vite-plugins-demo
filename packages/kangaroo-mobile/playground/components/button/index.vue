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
import { createTranslate } from '@/locale'

const t = createTranslate('buttonDemo')
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
