<script setup lang="ts">
import { useTranslate } from '@/locale/useTranslate';

const t = useTranslate({
  'zh-CN': {
    text: '文本',
    dashed: '虚线',
    withText: '展示文本',
    contentPosition: '内容位置',
    customStyle: '自定义样式',
    vertical: '垂直',
  },
  'en-US': {
    text: 'Text',
    dashed: 'Dashed',
    withText: 'With Text',
    contentPosition: 'Content Position',
    customStyle: 'Custom Style',
    vertical: 'Vertical',
  },
});
</script>

<template>
  <demo-block :title="t('basicUsage')">
    <yhm-divider />
  </demo-block>

  <demo-block :title="t('withText')">
    <yhm-divider>{{ t('text') }}</yhm-divider>
  </demo-block>

  <demo-block :title="t('contentPosition')">
    <yhm-divider content-position="left">{{ t('text') }}</yhm-divider>
    <yhm-divider content-position="right">{{ t('text') }}</yhm-divider>
  </demo-block>

  <demo-block :title="t('dashed')">
    <yhm-divider dashed :hairline="false">{{ t('text') }}</yhm-divider>
  </demo-block>

  <demo-block :title="t('customStyle')">
    <yhm-divider :style="{ borderColor: '#1989fa', color: '#1989fa', padding: '0 16px' }">
      {{ t('text') }}
    </yhm-divider>
  </demo-block>

  <demo-block :title="t('vertical')">
    <div class="content">
      <yhm-divider vertical />
      {{ t('text') }}
      <yhm-divider vertical dashed />
      {{ t('text') }}
      <yhm-divider vertical :hairline="false" />
      {{ t('text') }}
      <yhm-divider vertical :style="{ borderColor: '#1989fa' }" />
    </div>
  </demo-block>
</template>

<style lang="less">
.van-doc-demo-section {
  background-color: var(--van-background-2);
}

.van-doc-demo-block__title {
  padding-top: var(--van-padding-md);
}

.content {
  padding: 0 var(--van-padding-md);
  color: var(--van-text-color-2);
  font-size: var(--van-font-size-md);
}
</style>
