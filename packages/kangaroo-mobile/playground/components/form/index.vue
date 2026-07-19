<script setup lang="ts">
import { ref } from 'vue';
import VanButton from 'vant/es/button';
import VanCellGroup from 'vant/es/cell-group';
import { closeToast, showLoadingToast } from 'vant';
import FieldTypePicker from './FieldTypePicker.vue';
import FieldTypeTimePicker from './FieldTypeTimePicker.vue';
import FieldTypeArea from './FieldTypeArea.vue';
import FieldTypeCalendar from './FieldTypeCalendar.vue';
import { useTranslate } from '@/locale/useTranslate';
import { cdnURL } from '../../site';

// ========== BasicUsage ==========
const t1 = useTranslate({
  'zh-CN': {
    submit: '提交',
    username: '用户名',
    password: '密码',
    requireUsername: '请填写用户名',
    requirePassword: '请填写密码',
  },
  'en-US': {
    submit: 'Submit',
    username: 'Username',
    password: 'Password',
    requireUsername: 'Username is required',
    requirePassword: 'Password is required',
  },
});

const username = ref('');
const password = ref('');

// ========== ValidateRules ==========
const t2 = useTranslate({
  'zh-CN': {
    title: '校验规则',
    label: '文本',
    submit: '提交',
    message: '请输入正确内容',
    pattern: '正则校验',
    validator: '函数校验',
    validating: '验证中...',
    asyncValidator: '异步函数校验',
    validatorMessage: '校验函数返回错误提示',
  },
  'en-US': {
    title: 'Validate Rules',
    label: 'Label',
    submit: 'Submit',
    message: 'Error message',
    pattern: 'Use pattern',
    validator: 'Use validator',
    validating: 'Validating...',
    asyncValidator: 'Use async validator',
    validatorMessage: 'Use validator to return message',
  },
});

const value1 = ref('');
const value2 = ref('');
const value3 = ref('abc');
const value4 = ref('');
const pattern = /\d{6}/;

const validator = (val: string) => /1\d{10}/.test(val);

const asyncValidator = (val: string) =>
  new Promise<boolean>((resolve) => {
    showLoadingToast(t2('validating'));
    setTimeout(() => {
      closeToast();
      resolve(val === '1234');
    }, 1000);
  });

const onSubmit = (values: Record<string, string>) => {
  console.log('submit', values);
};

const onFailed = (errorInfo: any) => {
  console.log('failed', errorInfo);
};

// ========== FieldType ==========
const t3 = useTranslate({
  'zh-CN': {
    fieldType: '表单项类型',
    submit: '提交',
    switch: '开关',
    checkbox: '复选框',
    checkboxGroup: '复选框组',
    radio: '单选框',
    stepper: '步进器',
    rate: '评分',
    slider: '滑块',
    uploader: '文件上传',
  },
  'en-US': {
    fieldType: 'Field Type',
    submit: 'Submit',
    switch: 'Switch',
    checkbox: 'Checkbox',
    checkboxGroup: 'Checkbox Group',
    radio: 'Radio',
    stepper: 'Stepper',
    rate: 'Rate',
    slider: 'Slider',
    uploader: 'Uploader',
  },
});

const rate = ref(3);
const radio = ref('1');
const slider = ref(50);
const stepper = ref(1);
const uploader = ref([{ url: cdnURL('leaf.jpeg') }]);
const checkbox = ref(false);
const checkboxGroup = ref([]);
const switchChecked = ref(false);
</script>

<template>
  <div class="demo-form">
    <!-- BasicUsage -->
    <demo-block :title="t1('basicUsage')">
      <yhm-form @submit="onSubmit" @failed="onFailed">
        <van-cell-group inset>
          <yhm-field
            v-model="username"
            name="username"
            :label="t1('username')"
            :rules="[{ required: true, message: t1('requireUsername') }]"
            :placeholder="t1('username')" />
          <yhm-field
            v-model="password"
            type="password"
            name="password"
            :label="t1('password')"
            :rules="[{ required: true, message: t1('requirePassword') }]"
            :placeholder="t1('password')" />
        </van-cell-group>
        <div style="margin: 16px 16px 0">
          <VanButton round block type="primary" native-type="submit">
            {{ t1('submit') }}
          </VanButton>
        </div>
      </yhm-form>
    </demo-block>

    <!-- ValidateRules -->
    <demo-block :title="t2('title')">
      <yhm-form @submit="onSubmit" @failed="onFailed">
        <van-cell-group inset>
          <yhm-field
            v-model="value1"
            name="pattern"
            :label="t2('label')"
            :rules="[{ pattern, message: t2('message') }]"
            :placeholder="t2('pattern')" />
          <yhm-field
            v-model="value2"
            name="validator"
            :label="t2('label')"
            :rules="[{ validator, message: t2('message') }]"
            :placeholder="t2('validator')" />
          <yhm-field
            v-model="value3"
            name="validatorMessage"
            :label="t2('label')"
            :rules="[{ validator: (val: string) => `${val} 不合法，请重新输入` }]"
            :placeholder="t2('validatorMessage')" />
          <yhm-field
            v-model="value4"
            name="asyncValidator"
            :label="t2('label')"
            :rules="[{ validator: asyncValidator, message: t2('message') }]"
            :placeholder="t2('asyncValidator')" />
        </van-cell-group>
        <div style="margin: 16px 16px 0">
          <VanButton round block type="primary" native-type="submit">
            {{ t2('submit') }}
          </VanButton>
        </div>
      </yhm-form>
    </demo-block>

    <!-- FieldType -->
    <demo-block :title="t3('fieldType')">
      <yhm-form @submit="onSubmit">
        <van-cell-group inset>
          <yhm-field name="switch" :label="t3('switch')">
            <template #input>
              <yhm-switch v-model="switchChecked" />
            </template>
          </yhm-field>

          <yhm-field name="checkbox" :label="t3('checkbox')">
            <template #input>
              <yhm-checkbox v-model="checkbox" shape="square" />
            </template>
          </yhm-field>

          <yhm-field name="checkboxGroup" :label="t3('checkboxGroup')">
            <template #input>
              <yhm-checkbox-group v-model="checkboxGroup" direction="horizontal">
                <yhm-checkbox name="1" shape="square">{{ t3('checkbox') }} 1</yhm-checkbox>
                <yhm-checkbox name="2" shape="square">{{ t3('checkbox') }} 2</yhm-checkbox>
              </yhm-checkbox-group>
            </template>
          </yhm-field>

          <yhm-field name="radio" :label="t3('radio')">
            <template #input>
              <yhm-radio-group v-model="radio" direction="horizontal">
                <yhm-radio name="1">{{ t3('radio') }} 1</yhm-radio>
                <yhm-radio name="2">{{ t3('radio') }} 2</yhm-radio>
              </yhm-radio-group>
            </template>
          </yhm-field>

          <yhm-field name="stepper" :label="t3('stepper')">
            <template #input>
              <yhm-stepper v-model="stepper" />
            </template>
          </yhm-field>

          <yhm-field name="rate" :label="t3('rate')">
            <template #input>
              <yhm-rate v-model="rate" />
            </template>
          </yhm-field>

          <yhm-field name="slider" :label="t3('slider')">
            <template #input>
              <yhm-slider v-model="slider" />
            </template>
          </yhm-field>

          <yhm-field name="uploader" :label="t3('uploader')">
            <template #input>
              <yhm-uploader v-model="uploader" max-count="2" />
            </template>
          </yhm-field>

          <field-type-picker />
          <field-type-time-picker />
          <field-type-area />
          <field-type-calendar />
        </van-cell-group>

        <div style="margin: 16px 16px 0">
          <VanButton round block type="primary" native-type="submit">
            {{ t3('submit') }}
          </VanButton>
        </div>
      </yhm-form>
    </demo-block>
  </div>
</template>

<style lang="less"></style>
