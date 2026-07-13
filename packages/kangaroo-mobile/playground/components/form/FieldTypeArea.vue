<script setup lang="ts">
import { ref, computed } from 'vue'
import VanPopup from 'vant/es/popup'
import { useTranslate } from '@/locale/useTranslate'
import { getLocale } from '@/locale'
import { areaList } from '@vant/area-data'
import { areaListEn } from '../area/area-en'

const t = useTranslate({
  'zh-CN': {
    label: '地区选择',
    placeholder: '点击选择省市区',
  },
  'en-US': {
    label: 'Area Picker',
    placeholder: 'Select area',
  },
})

const result = ref('')
const pickerValue = ref('')
const showArea = ref(false)
const currentAreaList = computed(() => getLocale() === 'zh-CN' ? areaList : areaListEn)

const onConfirm = ({ selectedValues, selectedOptions }: any) => {
  result.value = selectedOptions.map((item: any) => item!.text).join('/')
  pickerValue.value = selectedValues.length ? selectedValues[selectedValues.length - 1] : ''
  showArea.value = false
}

const onCancel = () => { showArea.value = false }
</script>

<template>
  <yhm-field
    v-model="result"
    is-link
    readonly
    name="area"
    :label="t('label')"
    :placeholder="t('placeholder')"
    @click="showArea = true"
  />
  <van-popup
    v-model:show="showArea"
    destroy-on-close
    round
    position="bottom"
    teleport="body"
  >
    <yhm-area
      :area-list="currentAreaList"
      :model-value="pickerValue"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </van-popup>
</template>
