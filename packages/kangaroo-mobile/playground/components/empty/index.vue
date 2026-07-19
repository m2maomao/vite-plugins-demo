<script setup lang="ts">
import VanTabs from 'vant/es/tabs';
import VanTab from 'vant/es/tab';
import VanButton from 'vant/es/button';
import { ref } from 'vue';
import { useTranslate } from '@/locale/useTranslate';
import { cdnURL } from '../../site';

const t = useTranslate({
  'zh-CN': {
    error: '通用错误',
    search: '搜索提示',
    network: '网络错误',
    imageType: '图片类型',
    customSize: '自定义大小',
    description: '描述文字',
    customImage: '自定义图片',
    bottomContent: '底部内容',
  },
  'en-US': {
    error: 'Error',
    search: 'Search',
    network: 'Network',
    imageType: 'Image Type',
    customSize: 'Custom Size',
    description: 'Description',
    customImage: 'Custom Image',
    bottomContent: 'Bottom Content',
  },
});

const active = ref('error');
</script>

<template>
  <demo-block :title="t('basicUsage')">
    <yhm-empty :description="t('description')" />
  </demo-block>

  <demo-block :title="t('imageType')">
    <VanTabs v-model:active="active">
      <VanTab name="error" :title="t('error')">
        <yhm-empty image="error" :description="t('description')" />
      </VanTab>
      <VanTab name="network" :title="t('network')">
        <yhm-empty image="network" :description="t('description')" />
      </VanTab>
      <VanTab name="search" :title="t('search')">
        <yhm-empty image="search" :description="t('description')" />
      </VanTab>
    </VanTabs>
  </demo-block>

  <demo-block :title="t('customSize')">
    <yhm-empty image-size="100" :description="t('description')" />
  </demo-block>

  <demo-block :title="t('customImage')">
    <yhm-empty :image="cdnURL('custom-empty-image.png')" :image-size="80" :description="t('description')" />
  </demo-block>

  <demo-block :title="t('bottomContent')">
    <yhm-empty :description="t('description')">
      <VanButton round type="primary" class="bottom-button">
        {{ t('button') }}
      </VanButton>
    </yhm-empty>
  </demo-block>
</template>

<style lang="less">
.van-doc-demo-section {
  background: var(--van-background-2);
}

.bottom-button {
  width: 160px;
  height: 40px;
}
</style>
