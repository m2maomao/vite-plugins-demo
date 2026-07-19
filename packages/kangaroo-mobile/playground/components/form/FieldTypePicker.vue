<script setup lang="ts">
import { ref, computed } from 'vue';
import VanPopup from 'vant/es/popup';
import { useTranslate } from '@/locale/useTranslate';
import { getLocale } from '@/locale';
import { basicColumns } from '../picker/data';

const t = useTranslate({
  'zh-CN': {
    picker: '选择器',
    placeholder: '点击选择城市',
  },
  'en-US': {
    picker: 'Picker',
    placeholder: 'Select city',
  },
});

const result = ref('');
const pickerValue = ref<string[]>([]);
const showPicker = ref(false);
const columns = computed(() => (basicColumns as any)[getLocale()] || []);

const onConfirm = ({ selectedValues, selectedOptions }: any) => {
  result.value = selectedOptions[0]?.text || '';
  pickerValue.value = selectedValues;
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
    name="picker"
    :label="t('picker')"
    :placeholder="t('placeholder')"
    @click="showPicker = true" />
  <van-popup v-model:show="showPicker" destroy-on-close round position="bottom" teleport="body">
    <yhm-picker :model-value="pickerValue" :columns="columns" @confirm="onConfirm" @cancel="onCancel" />
  </van-popup>
</template>
