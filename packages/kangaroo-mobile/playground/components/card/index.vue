<script setup lang="ts">
import VanTag from 'vant/es/tag';
import VanButton from 'vant/es/button';
import { useTranslate } from '@/locale/useTranslate';
import { cdnURL } from '../../site';

const t = useTranslate({
  'zh-CN': {
    desc: '描述信息',
    tag: '标签',
    button: '按钮',
    title: '商品名称',
    discountInfo: '营销信息',
    customContent: '自定义内容',
  },
  'en-US': {
    desc: 'Description',
    tag: 'Tag',
    button: 'Button',
    title: 'Title',
    discountInfo: 'Discount Info',
    customContent: 'Custom Content',
  },
});

const imageURL = cdnURL('ipad.jpeg');
</script>

<template>
  <demo-block :title="t('basicUsage')">
    <yhm-card num="2" price="2.00" :desc="t('desc')" :title="t('title')" :thumb="imageURL" />
  </demo-block>

  <demo-block :title="t('discountInfo')">
    <yhm-card
      num="2"
      price="2.00"
      origin-price="10.00"
      :tag="t('tag')"
      :desc="t('desc')"
      :title="t('title')"
      :thumb="imageURL" />
  </demo-block>

  <demo-block :title="t('customContent')">
    <yhm-card num="2" price="2.00" :desc="t('desc')" :title="t('title')" :thumb="imageURL">
      <template #tags>
        <VanTag plain type="primary" style="margin-right: 5px">
          {{ t('tag') }}
        </VanTag>
        <VanTag plain type="primary">{{ t('tag') }}</VanTag>
      </template>

      <template #footer>
        <VanButton round size="mini">{{ t('button') }}</VanButton>
        <VanButton round size="mini">{{ t('button') }}</VanButton>
      </template>
    </yhm-card>
  </demo-block>
</template>

<style lang="less">
.van-doc-demo-section {
  background-color: var(--van-background-2);
}
</style>
