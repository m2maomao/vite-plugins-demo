<template>
  <div class="demo-switch">
    <demo-block :title="t('basicUsage')">
      <yhm-switch v-model="checked" />
    </demo-block>

    <demo-block :title="t('disabled')">
      <yhm-switch v-model="checked" disabled />
    </demo-block>

    <demo-block :title="t('loadingStatus')">
      <yhm-switch v-model="checked" loading />
    </demo-block>

    <demo-block :title="t('customSize')">
      <yhm-switch v-model="checked2" size="22" />
    </demo-block>

    <demo-block :title="t('customColor')">
      <yhm-switch v-model="checked3" active-color="#ee0a24" inactive-color="#dcdee0" />
    </demo-block>

    <demo-block :title="t('customNode')">
      <yhm-switch v-model="checked3">
        <template #node>
          <div class="icon-wrapper">
            <van-icon :name="checked3 ? 'success' : 'cross'" />
          </div>
        </template>
      </yhm-switch>
    </demo-block>

    <demo-block :title="t('asyncControl')">
      <yhm-switch :model-value="checked4" @update:model-value="onUpdateValue" />
    </demo-block>

    <demo-block :title="t('withCell')">
      <yhm-cell center :title="t('title')">
        <template #right-icon>
          <yhm-switch v-model="checked5" />
        </template>
      </yhm-cell>
    </demo-block>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon as VanIcon, showConfirmDialog } from 'vant';
import { useTranslate } from '@/locale/useTranslate';

const t = useTranslate({
  'zh-CN': {
    basicUsage: '基础用法',
    disabled: '禁用状态',
    loadingStatus: '加载状态',
    customSize: '自定义大小',
    customColor: '自定义颜色',
    customNode: '自定义按钮',
    asyncControl: '异步控制',
    withCell: '搭配单元格使用',
    title: '标题',
    confirm: '提醒',
    message: '是否切换开关？',
  },
  'en-US': {
    basicUsage: 'Basic Usage',
    disabled: 'Disabled',
    loadingStatus: 'Loading Status',
    customSize: 'Custom Size',
    customColor: 'Custom Color',
    customNode: 'Custom Node',
    asyncControl: 'Async Control',
    withCell: 'With Cell',
    title: 'Title',
    confirm: 'Confirm',
    message: 'Are you sure to switch?',
  },
});

const checked = ref(true);
const checked2 = ref(true);
const checked3 = ref(true);
const checked4 = ref(true);
const checked5 = ref(true);

const onUpdateValue = (val: boolean) => {
  showConfirmDialog({
    title: t('title'),
    message: t('message'),
  }).then(() => {
    checked4.value = val;
  });
};
</script>

<style lang="less">
.demo-switch {
  .van-switch {
    margin-left: var(--van-padding-md);
  }

  .icon-wrapper {
    display: flex;
    width: 100%;
    justify-content: center;
    font-size: 18px;

    .van-icon {
      line-height: 32px;
    }

    .van-icon-success {
      color: var(--van-blue);
    }

    .van-icon-cross {
      color: var(--van-gray-5);
    }
  }
}
</style>
