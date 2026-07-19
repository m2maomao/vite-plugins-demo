<script setup lang="ts">
import { ref } from 'vue';
import VanButton from 'vant/es/button';
import { useTranslate } from '@/locale/useTranslate';

const t = useTranslate({
  'zh-CN': {
    nextStep: '下一步',
    step1: '买家下单',
    step2: '商家接单',
    step3: '买家提货',
    step4: '交易完成',
    title2: '描述信息',
    title3: '竖向步骤条',
    status1: '【城市】物流状态1',
    status2: '【城市】物流状态',
    status3: '快件已发货',
    customStyle: '自定义样式',
  },
  'en-US': {
    nextStep: 'Next Step',
    step1: 'Step1',
    step2: 'Step2',
    step3: 'Step3',
    step4: 'Step4',
    title2: 'Description',
    title3: 'Vertical Steps',
    status1: '【City】Status1',
    status2: '【City】Status2',
    status3: '【City】Status3',
    customStyle: 'Custom Style',
  },
});

const active = ref(1);

const nextStep = () => {
  active.value = ++active.value % 4;
};
</script>

<template>
  <div class="demo-steps">
    <demo-block :title="t('basicUsage')">
      <yhm-steps :active="active">
        <yhm-step>{{ t('step1') }}</yhm-step>
        <yhm-step>{{ t('step2') }}</yhm-step>
        <yhm-step>{{ t('step3') }}</yhm-step>
        <yhm-step>{{ t('step4') }}</yhm-step>
      </yhm-steps>

      <VanButton @click="nextStep">{{ t('nextStep') }}</VanButton>
    </demo-block>

    <demo-block :title="t('customStyle')">
      <yhm-steps :active="active" active-icon="success" inactive-icon="arrow" active-color="#07c160">
        <yhm-step>{{ t('step1') }}</yhm-step>
        <yhm-step>{{ t('step2') }}</yhm-step>
        <yhm-step>{{ t('step3') }}</yhm-step>
        <yhm-step>{{ t('step4') }}</yhm-step>
      </yhm-steps>
    </demo-block>

    <demo-block :title="t('title3')">
      <yhm-steps :active="0" direction="vertical">
        <yhm-step>
          <h3>{{ t('status1') }}</h3>
          <p>2016-07-12 12:40</p>
        </yhm-step>
        <yhm-step>
          <h3>{{ t('status2') }}</h3>
          <p>2016-07-11 10:00</p>
        </yhm-step>
        <yhm-step>
          <h3>{{ t('status3') }}</h3>
          <p>2016-07-10 09:30</p>
        </yhm-step>
      </yhm-steps>
    </demo-block>
  </div>
</template>

<style lang="less">
.demo-steps {
  .van-button {
    margin: var(--van-padding-md) 0 0 var(--van-padding-md);
  }

  p,
  h3 {
    font-weight: normal;
    font-size: inherit;
    margin: 0;
  }

  .yhm-step {
    p {
      margin: 4px 0 0;
      font-size: 12px;
      color: var(--van-text-color-2, #666);
    }
    h3 {
      margin: 0;
      font-size: 14px;
    }
  }
}
</style>
