<script setup lang="ts">
import VanIcon from 'vant/es/icon';
import { useTranslate } from '@/locale/useTranslate';

const t = useTranslate({
  'zh-CN': {
    type: '加载类型',
    text: '加载文案',
    size: '自定义大小',
    color: '自定义颜色',
    vertical: '垂直排列',
    textColor: '自定义文本颜色',
    customIcon: '自定义图标',
    loading: '加载中...',
  },
  'en-US': {
    type: 'Type',
    text: 'Text',
    size: 'Size',
    color: 'Color',
    vertical: 'Vertical',
    textColor: 'Text Color',
    customIcon: 'Custom Icon',
    loading: 'Loading...',
  },
});
</script>

<template>
  <demo-block :title="t('type')">
    <yhm-loading />
    <yhm-loading type="spinner" />
  </demo-block>

  <demo-block :title="t('color')">
    <yhm-loading color="#1989fa" />
    <yhm-loading type="spinner" color="#1989fa" />
  </demo-block>

  <demo-block :title="t('size')">
    <yhm-loading size="24" />
    <yhm-loading type="spinner" size="24" />
  </demo-block>

  <demo-block :title="t('text')">
    <yhm-loading size="24px" :text="t('loading')" />
  </demo-block>

  <demo-block :title="t('vertical')">
    <yhm-loading size="24px" vertical :text="t('loading')" />
  </demo-block>

  <demo-block :title="t('textColor')">
    <yhm-loading size="24px" vertical color="#0094ff" :text="t('loading')" />
    <yhm-loading size="24px" vertical text-color="#0094ff" :text="t('loading')" />
  </demo-block>

  <demo-block :title="t('customIcon')">
    <yhm-loading vertical :text="t('loading')">
      <template #icon>
        <VanIcon name="star-o" size="30" />
      </template>
    </yhm-loading>
  </demo-block>
</template>

<style lang="less">
.van-doc-demo-section .van-loading {
  display: inline-block;
  margin: 5px 0 5px 20px;

  &--vertical {
    display: inline-flex;
  }
}
</style>
