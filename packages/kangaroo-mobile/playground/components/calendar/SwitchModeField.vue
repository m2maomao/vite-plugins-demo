<script setup lang="ts">
import VanCell from 'vant/es/cell'
import VanPicker from 'vant/es/picker'
import VanPopup from 'vant/es/popup'
import { ref } from 'vue'
import { useTranslate } from '@/locale/useTranslate'

const t = useTranslate({
  'zh-CN': { switchMode: '选择切换模式' },
  'en-US': { switchMode: 'Select Switch Mode' },
})

const switchMode = defineModel<string>({ default: 'none' })
const showPicker = ref(false)
const switchModeColumns = [
  { text: 'none', value: 'none' },
  { text: 'month', value: 'month' },
  { text: 'year-month', value: 'year-month' },
]

const onClickField = () => { showPicker.value = true }
const onPickerCancel = () => { showPicker.value = false }
const onPickerConfirm = ({ selectedOptions }: any) => {
  showPicker.value = false
  switchMode.value = selectedOptions[0]!.value
}
</script>

<template>
  <demo-block card :title="t('switchMode')">
    <van-cell
      is-link
      :title="t('switchMode')"
      :value="switchMode"
      @click="onClickField"
    />
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker
        :columns="switchModeColumns"
        @cancel="onPickerCancel"
        @confirm="onPickerConfirm"
      />
    </van-popup>
  </demo-block>
</template>
