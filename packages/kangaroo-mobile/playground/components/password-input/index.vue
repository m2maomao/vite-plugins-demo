<template>
  <div class="demo-password-input">
    <demo-block title="基础用法">
      <yhm-password-input
        :value="values.basicUsage"
        :focused="current === 'basicUsage'"
        @focus="current = 'basicUsage'" />
    </demo-block>
    <demo-block title="自定义长度">
      <yhm-password-input
        :value="values.customLength"
        :length="4"
        :focused="current === 'customLength'"
        @focus="current = 'customLength'" />
    </demo-block>
    <demo-block title="格子间距">
      <yhm-password-input
        :value="values.addGutter"
        :gutter="10"
        :focused="current === 'addGutter'"
        @focus="current = 'addGutter'" />
    </demo-block>
    <demo-block title="明文展示">
      <yhm-password-input
        :mask="false"
        :value="values.removeMask"
        :focused="current === 'removeMask'"
        @focus="current = 'removeMask'" />
    </demo-block>
    <demo-block title="提示信息">
      <yhm-password-input
        :info="'密码为 6 位数字'"
        :value="values.showInfo"
        :error-info="errorInfo"
        :focused="current === 'showInfo'"
        @focus="current = 'showInfo'" />
    </demo-block>

    <yhm-number-keyboard :show="!!current" @blur="current = null" @input="onInput" @delete="onDelete" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const initialValue = { showInfo: '123', addGutter: '123', basicUsage: '123', removeMask: '123', customLength: '123' };
type ValueKeys = keyof typeof initialValue;

const values = ref({ ...initialValue });
const current = ref<ValueKeys | null>(null);
const errorInfo = ref('');

const onInput = (key: string) => {
  if (!current.value) return;
  const maxlength = current.value === 'customLength' ? 4 : 6;
  const newValue = (values.value[current.value] + key).slice(0, maxlength);
  values.value[current.value] = newValue;
  if (current.value === 'showInfo' && newValue.length === 6 && newValue !== '123456') {
    errorInfo.value = '密码错误';
  }
};

const onDelete = () => {
  if (!current.value) return;
  values.value[current.value] = values.value[current.value].slice(0, -1);
  if (current.value === 'showInfo') errorInfo.value = '';
};
</script>
