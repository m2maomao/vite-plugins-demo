<script setup lang="ts">
import { ref } from 'vue'
import VanCell from 'vant/es/cell'
import { closeToast, showLoadingToast } from 'vant'
import { useTranslate } from '@/locale/useTranslate'

const t = useTranslate({
  'zh-CN': {
    basicUsage: '基础用法',
    step: '步长设置',
    range: '限制输入范围',
    integer: '限制输入整数',
    disabled: '禁用状态',
    disableInput: '禁用输入框',
    decimalLength: '固定小数位数',
    customSize: '自定义大小',
    beforeChange: '异步变更',
    roundTheme: '圆角风格',
  },
  'en-US': {
    basicUsage: 'Basic Usage',
    step: 'Step',
    range: 'Range',
    integer: 'Integer',
    disabled: 'Disabled',
    disableInput: 'Disable Input',
    decimalLength: 'Decimal Length',
    customSize: 'Custom Size',
    beforeChange: 'Before Change',
    roundTheme: 'Round Theme',
  },
})

const stepper1 = ref(1)
const stepper2 = ref(1)
const stepper3 = ref(1)
const stepper4 = ref(1)
const stepper5 = ref(1)
const stepper6 = ref(1)
const stepper7 = ref(1)
const stepper8 = ref(1)
const stepperRound = ref(1)
const disabledInput = ref(1)

const beforeChange = () => {
  showLoadingToast({ forbidClick: true })
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      closeToast()
      resolve(true)
    }, 500)
  })
}
</script>

<template>
  <demo-block card>
    <van-cell center :title="t('basicUsage')">
      <template #value>
        <yhm-stepper v-model="stepper1" />
      </template>
    </van-cell>

    <van-cell center :title="t('step')">
      <template #value>
        <yhm-stepper v-model="stepper2" step="2" />
      </template>
    </van-cell>

    <van-cell center :title="t('range')">
      <template #value>
        <yhm-stepper v-model="stepper3" :min="5" :max="8" />
      </template>
    </van-cell>

    <van-cell center :title="t('integer')">
      <template #value>
        <yhm-stepper v-model="stepper4" integer />
      </template>
    </van-cell>

    <van-cell center :title="t('disabled')">
      <template #value>
        <yhm-stepper v-model="stepper5" disabled />
      </template>
    </van-cell>

    <van-cell center :title="t('disableInput')">
      <template #value>
        <yhm-stepper v-model="disabledInput" disable-input />
      </template>
    </van-cell>

    <van-cell center :title="t('decimalLength')">
      <template #value>
        <yhm-stepper v-model="stepper8" :decimal-length="1" step="0.2" />
      </template>
    </van-cell>

    <van-cell center :title="t('customSize')">
      <template #value>
        <yhm-stepper v-model="stepper7" button-size="32px" input-width="40px" />
      </template>
    </van-cell>

    <van-cell center :title="t('beforeChange')">
      <template #value>
        <yhm-stepper v-model="stepper6" :before-change="beforeChange" />
      </template>
    </van-cell>

    <van-cell center :title="t('roundTheme')">
      <template #value>
        <yhm-stepper
          v-model="stepperRound"
          theme="round"
          button-size="22"
          disable-input
        />
      </template>
    </van-cell>
  </demo-block>
</template>
