<template>
  <div class="demo-count-down">
    <demo-block :title="t('basicUsage')">
      <yhm-count-down :time="time" />
    </demo-block>

    <demo-block :title="t('customFormat')">
      <yhm-count-down :time="time" format="DD 天 HH 时 mm 分 ss 秒" />
    </demo-block>

    <demo-block :title="t('millisecond')">
      <yhm-count-down millisecond :time="time" format="HH:mm:ss:SS" />
    </demo-block>

    <demo-block :title="t('customStyle')">
      <yhm-count-down :time="time">
        <template #default="currentTime">
          <span class="block">{{ currentTime.hours }}</span>
          <span class="colon">:</span>
          <span class="block">{{ currentTime.minutes }}</span>
          <span class="colon">:</span>
          <span class="block">{{ currentTime.seconds }}</span>
        </template>
      </yhm-count-down>
    </demo-block>

    <demo-block :title="t('manualControl')">
      <yhm-count-down ref="countDown" millisecond :time="3000" :auto-start="false" format="ss:SSS" @finish="onFinish" />
      <Grid clickable :column-num="3">
        <GridItem icon="play-circle-o" :text="t('start')" @click="start" />
        <GridItem icon="pause-circle-o" :text="t('pause')" @click="pause" />
        <GridItem icon="replay" :text="t('reset')" @click="reset" />
      </Grid>
    </demo-block>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Grid, GridItem, showToast } from 'vant';
import type { CountDownInstance } from 'vant';

const t = (key: string): string => {
  const map: Record<string, string> = {
    basicUsage: '基础用法',
    customFormat: '自定义格式',
    millisecond: '毫秒级渲染',
    customStyle: '自定义样式',
    manualControl: '手动控制',
    reset: '重置',
    pause: '暂停',
    start: '开始',
    finished: '倒计时结束',
  };
  return map[key] || key;
};

const time = ref(30 * 60 * 60 * 1000);
const countDown = ref<CountDownInstance>();

const start = () => countDown.value?.start();
const pause = () => countDown.value?.pause();
const reset = () => countDown.value?.reset();
const onFinish = () => showToast(t('finished'));
</script>

<style lang="less">
.demo-count-down {
  background-color: var(--van-background-2);

  .yhm-count-down,
  .van-count-down {
    margin-left: var(--van-padding-md);
  }

  .colon {
    display: inline-block;
    margin: 0 4px;
    color: var(--van-primary-color);
  }

  .block {
    display: inline-block;
    width: 22px;
    color: #fff;
    font-size: 12px;
    text-align: center;
    background-color: var(--van-primary-color);
    border-radius: 4px;
  }

  .van-grid {
    margin-top: 10px;
  }
}
</style>
