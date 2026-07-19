<script setup lang="ts">
import { ref } from 'vue';
import VanPopup from 'vant/es/popup';
import VanDatePicker from 'vant/es/date-picker';
import { useTranslate } from '@/locale/useTranslate';

const t = useTranslate({
  'zh-CN': {
    label: '时间选择',
    placeholder: '点击选择时间',
  },
  'en-US': {
    label: 'Date Picker',
    placeholder: 'Select time',
  },
});

const result = ref('');
const pickerValue = ref<string[]>([]);
const showPicker = ref(false);

const onConfirm = ({ selectedValues }: any) => {
  result.value = selectedValues.join('/');
  pickerValue.value = selectedValues as string[];
  showPicker.value = false;
};

const onCancel = () => {
  showPicker.value = false;
};
</script>

<template>
  <yhm-field
    v-model="result"
    is-link
    readonly
    name="datePicker"
    :label="t('label')"
    :placeholder="t('placeholder')"
    @click="showPicker = true" />
  <van-popup v-model:show="showPicker" destroy-on-close round position="bottom" teleport="body">
    <van-date-picker :model-value="pickerValue" @confirm="onConfirm" @cancel="onCancel" />
  </van-popup>
</template>
