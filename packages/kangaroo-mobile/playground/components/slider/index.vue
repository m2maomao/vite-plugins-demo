<script setup lang="ts">
import { ref } from 'vue';
import { showToast } from 'vant';
import { useTranslate } from '@/locale/useTranslate';

const t = useTranslate({
  'zh-CN': {
    text: '当前值：',
    title2: '双滑块',
    title3: '指定选择范围',
    title4: '禁用',
    title5: '指定步长',
    vertical: '垂直方向',
    customStyle: '自定义样式',
    customButton: '自定义按钮',
  },
  'en-US': {
    text: 'Current value: ',
    title2: 'Dual thumb mode',
    title3: 'Range',
    title4: 'Disabled',
    title5: 'Step size',
    vertical: 'Vertical',
    customStyle: 'Custom Style',
    customButton: 'Custom Button',
  },
});

const value1 = ref(50);
const value2 = ref<[number, number]>([20, 60]);
const value3 = ref(0);
const value4 = ref(50);
const value5 = ref(50);
const value6 = ref(50);
const value7 = ref(50);
const value8 = ref(50);
const value9 = ref<[number, number]>([20, 60]);

const onChange = (value: string) => showToast(t('text') + value);
</script>

<template>
  <div class="demo-slider">
    <demo-block :title="t('basicUsage')">
      <yhm-slider v-model="value1" @change="onChange" />
    </demo-block>

    <demo-block :title="t('title2')">
      <yhm-slider range v-model="value2" @change="onChange" />
    </demo-block>

    <demo-block :title="t('title3')">
      <yhm-slider v-model="value3" :min="-50" :max="50" @change="onChange" />
    </demo-block>

    <demo-block :title="t('title4')">
      <yhm-slider v-model="value4" disabled />
    </demo-block>

    <demo-block :title="t('title5')">
      <yhm-slider v-model="value5" :step="10" @change="onChange" />
    </demo-block>

    <demo-block :title="t('customStyle')">
      <yhm-slider v-model="value6" bar-height="4px" active-color="#ee0a24" @change="onChange" />
    </demo-block>

    <demo-block :title="t('customButton')">
      <yhm-slider v-model="value7">
        <template #button>
          <div class="custom-button">{{ value7 }}</div>
        </template>
      </yhm-slider>
    </demo-block>

    <demo-block :title="t('vertical')">
      <div :style="{ height: '150px', paddingLeft: '30px' }">
        <yhm-slider v-model="value8" vertical @change="onChange" />
        <yhm-slider v-model="value9" range vertical style="margin-left: 100px" @change="onChange" />
      </div>
    </demo-block>
  </div>
</template>

<style lang="less">
.demo-slider {
  user-select: none;

  .van-doc-demo-block {
    padding: 0 var(--van-padding-md) 20px;
  }

  .van-doc-demo-block__title {
    padding-left: 0;
  }

  .custom-button {
    width: 26px;
    color: #fff;
    font-size: 10px;
    line-height: 18px;
    text-align: center;
    background-color: var(--van-primary-color);
    border-radius: 100px;
  }
}
</style>
