<script setup lang="ts">
import { ref } from 'vue';
import VanIcon from 'vant/es/icon';
import VanButton from 'vant/es/button';
import { useTranslate } from '@/locale/useTranslate';
import type { CollapseInstance } from 'vant';

const t = useTranslate({
  'zh-CN': {
    text1: '代码是写出来给人看的，附带能在机器上运行。',
    text2: '技术无非就是那些开发它的人的共同灵魂。',
    text3: '在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。',
    accordion: '手风琴',
    disabled: '禁用状态',
    titleSlot: '自定义标题内容',
    toggleAll: '全部展开与全部切换',
    openAll: '全部展开',
    inverse: '全部切换',
  },
  'en-US': {
    text1: 'The code is written for people to see and can be run on a machine.',
    text2: 'Technology is nothing more than the common soul of those who develop it.',
    text3: 'The frequency of people swearing during code reading is the only measure of code quality.',
    accordion: 'Accordion',
    disabled: 'Disabled',
    titleSlot: 'Custom title',
    toggleAll: 'Toggle All',
    openAll: 'Open All',
    inverse: 'Toggle All',
  },
});

const active1 = ref([0]);
const active2 = ref(0);
const active3 = ref([]);
const active4 = ref([]);
const active5 = ref(['1']);

const collapse = ref<CollapseInstance>();

const openAll = () => {
  collapse.value?.toggleAll?.(true);
};
const toggleAll = () => {
  collapse.value?.toggleAll?.();
};
</script>

<template>
  <div class="demo-collapse">
    <demo-block :title="t('basicUsage')">
      <yhm-collapse v-model="active1">
        <yhm-collapse-item :title="t('title') + 1">{{ t('text1') }}</yhm-collapse-item>
        <yhm-collapse-item :title="t('title') + 2">{{ t('text2') }}</yhm-collapse-item>
        <yhm-collapse-item :title="t('title') + 3">{{ t('text3') }}</yhm-collapse-item>
      </yhm-collapse>
    </demo-block>

    <demo-block :title="t('accordion')">
      <yhm-collapse v-model="active2" accordion>
        <yhm-collapse-item :title="t('title') + 1">{{ t('text1') }}</yhm-collapse-item>
        <yhm-collapse-item :title="t('title') + 2">{{ t('text2') }}</yhm-collapse-item>
        <yhm-collapse-item :title="t('title') + 3">{{ t('text3') }}</yhm-collapse-item>
      </yhm-collapse>
    </demo-block>

    <demo-block :title="t('disabled')">
      <yhm-collapse v-model="active3">
        <yhm-collapse-item :title="t('title') + 1">{{ t('text1') }}</yhm-collapse-item>
        <yhm-collapse-item :title="t('title') + 2" disabled>{{ t('text2') }}</yhm-collapse-item>
        <yhm-collapse-item :title="t('title') + 3" disabled>{{ t('text3') }}</yhm-collapse-item>
      </yhm-collapse>
    </demo-block>

    <demo-block :title="t('titleSlot')">
      <yhm-collapse v-model="active4">
        <yhm-collapse-item>
          <template #title>
            {{ t('title') + 1 }}
            <VanIcon name="question-o" />
          </template>
          {{ t('text1') }}
        </yhm-collapse-item>
        <yhm-collapse-item :title="t('title') + 2" :value="t('content')" icon="shop-o">
          {{ t('text2') }}
        </yhm-collapse-item>
      </yhm-collapse>
    </demo-block>

    <demo-block :title="t('toggleAll')">
      <yhm-collapse v-model="active5" ref="collapse">
        <yhm-collapse-item :title="t('title') + 1" name="1">{{ t('text1') }}</yhm-collapse-item>
        <yhm-collapse-item :title="t('title') + 2" name="2">{{ t('text2') }}</yhm-collapse-item>
        <yhm-collapse-item :title="t('title') + 3" name="3">{{ t('text3') }}</yhm-collapse-item>
      </yhm-collapse>

      <div class="demo-collapse-buttons">
        <VanButton type="primary" @click="openAll">{{ t('openAll') }}</VanButton>
        <VanButton type="primary" @click="toggleAll">{{ t('inverse') }}</VanButton>
      </div>
    </demo-block>
  </div>
</template>

<style lang="less">
.demo-collapse {
  .van-icon-question-o {
    margin-left: 5px;
    color: var(--van-blue);
    font-size: 15px;
    vertical-align: -3px;
  }

  &-buttons {
    margin-top: var(--van-padding-md);

    .van-button {
      margin-left: var(--van-padding-md);
    }
  }
}
</style>
