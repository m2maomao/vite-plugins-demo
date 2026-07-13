<script setup lang="ts">
import { ref, computed } from 'vue'
import VanEmpty from 'vant/es/empty'
import VanField from 'vant/es/field'
import { showToast } from 'vant'
import { useTranslate } from '@/locale/useTranslate'
import { getLocale } from '@/locale'
import { basicColumns, dateColumns, cascadeColumns, disabledColumns, customKeyColumns } from './data'

const t = useTranslate({
  'zh-CN': {
    title: '标题', cancel: '取消', confirm: '确认',
    cascade: '级联选择', city: '城市', withPopup: '搭配弹出层使用',
    chooseCity: '选择城市', modelValue: '双向绑定', disableOption: '禁用选项',
    multipleColumns: '多列选择', customChildrenKey: '自定义 Columns 结构',
    emptyDescription: '暂无数据', loadingStatus: '加载状态', emptyStatus: '空数据',
    toastContent: '当前值：',
  },
  'en-US': {
    title: 'Title', cancel: 'Cancel', confirm: 'Confirm',
    cascade: 'Cascade', city: 'City', withPopup: 'With Popup',
    chooseCity: 'Choose City', modelValue: 'v-model', disableOption: 'Disable Option',
    multipleColumns: 'Multiple Columns', customChildrenKey: 'Custom Columns Fields',
    emptyDescription: 'No data', loadingStatus: 'Loading', emptyStatus: 'Empty',
    toastContent: 'Value: ',
  },
})

const lang = computed(() => getLocale())
const curBasic = computed(() => (basicColumns as any)[lang.value] || [])
const curDate = computed(() => (dateColumns as any)[lang.value] || [])
const curCascade = computed(() => (cascadeColumns as any)[lang.value] || [])
const curDisabled = computed(() => (disabledColumns as any)[lang.value] || [])
const curCustomKey = computed(() => (customKeyColumns as any)[lang.value] || [])

const customFieldName = { text: 'cityName', value: 'cityName', children: 'cities' }
const selectedValues = ref(['Wenzhou'])

const onChange = ({ selectedValues }: any) => showToast(`${t('toastContent')}${selectedValues.join(',')}`)
const onConfirm = ({ selectedValues }: any) => showToast(`${t('toastContent')}${selectedValues.join(',')}`)
const onCancel = () => showToast(t('cancel'))

// With Popup
const showPicker = ref(false)
const fieldValue = ref('')
const pickerValue = ref([])

const onClickField = () => { showPicker.value = true }
const onPickerCancel = () => { showPicker.value = false }
const onPickerConfirm = ({ selectedValues, selectedOptions }: any) => {
  showPicker.value = false
  pickerValue.value = selectedValues
  fieldValue.value = selectedOptions[0]?.text as string || ''
}
</script>

<template>
  <div class="demo-picker">
    <demo-block card :title="t('basicUsage')">
      <yhm-picker
        :title="t('title')"
        :columns="curBasic"
        show-toolbar
        @change="onChange"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </demo-block>

    <demo-block card :title="t('withPopup')">
      <yhm-field
        v-model="fieldValue"
        is-link
        readonly
        :label="t('city')"
        :placeholder="t('chooseCity')"
        @click="onClickField"
      />
      <yhm-popup v-model:show="showPicker" destroy-on-close round position="bottom">
        <yhm-picker
          :model-value="pickerValue"
          :title="t('title')"
          :columns="curBasic"
          show-toolbar
          @cancel="onPickerCancel"
          @confirm="onPickerConfirm"
        />
      </yhm-popup>
    </demo-block>

    <demo-block card :title="t('modelValue')">
      <yhm-picker
        v-model="selectedValues"
        :title="t('title')"
        :columns="curBasic"
        show-toolbar
      />
    </demo-block>

    <demo-block card :title="t('multipleColumns')">
      <yhm-picker
        :title="t('title')"
        :columns="curDate"
        show-toolbar
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </demo-block>

    <demo-block card :title="t('cascade')">
      <yhm-picker :title="t('title')" :columns="curCascade" show-toolbar />
    </demo-block>

    <demo-block card :title="t('disableOption')">
      <yhm-picker :title="t('title')" :columns="curDisabled" show-toolbar />
    </demo-block>

    <demo-block card :title="t('loadingStatus')">
      <yhm-picker loading :title="t('title')" />
    </demo-block>

    <demo-block card :title="t('emptyStatus')">
      <yhm-picker :title="t('title')">
        <template #empty>
          <VanEmpty
            image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
            image-size="80"
            :description="t('emptyDescription')"
          />
        </template>
      </yhm-picker>
    </demo-block>

    <demo-block card :title="t('customChildrenKey')">
      <yhm-picker
        :title="t('title')"
        :columns="curCustomKey"
        :columns-field-names="customFieldName"
        show-toolbar
      />
    </demo-block>
  </div>
</template>
