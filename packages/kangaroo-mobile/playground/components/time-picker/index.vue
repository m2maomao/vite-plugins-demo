<script setup lang="ts">
import { ref } from 'vue'
import { useTranslate } from '@/locale/useTranslate'
import { showToast } from 'vant'
import type { TimePickerColumnType } from 'vant'

const t = useTranslate({
  'zh-CN': {
    chooseTime: '选择时间',
    columnsType: '选项类型',
    timeRange: '时间范围',
    overallTimeRange: '整体时间范围',
    optionsFilter: '过滤选项',
    optionsFormatter: '格式化选项',
    advancedUsage: '高级用法',
  },
  'en-US': {
    chooseTime: 'Choose Time',
    columnsType: 'Columns Type',
    timeRange: 'Time Range',
    overallTimeRange: 'Overall Time Range',
    optionsFilter: 'Options Filter',
    optionsFormatter: 'Options Formatter',
    advancedUsage: 'Advanced Usage',
  },
})

const baseTime = ref(['12', '00'])
const secondTime = ref(['12', '00', '00'])
const rangeTime = ref(['12', '35'])
const filterTime = ref(['12', '00'])
const formatterTime = ref(['12', '00'])
const hourMinuteTime = ref(['12', '00', '00'])

const columnsType: TimePickerColumnType[] = ['hour', 'minute', 'second']

const filter = (type: string, options: any[]) => {
  if (type === 'minute') {
    return options.filter((option: any) => Number(option.value) % 10 === 0)
  }
  return options
}

const timeFilter = (type: string, options: any[], values: string[]) => {
  const hour = +values[0]
  if (type === 'hour') {
    return options.filter(
      (option: any) => Number(option.value) >= 8 && Number(option.value) <= 18,
    )
  }
  if (type === 'minute') {
    options = options.filter((option: any) => Number(option.value) % 10 === 0)
    if (hour === 8) {
      return options.filter((option: any) => Number(option.value) >= 40)
    }
    if (hour === 18) {
      return options.filter((option: any) => Number(option.value) <= 20)
    }
  }
  return options
}

const formatter = (type: string, option: any) => {
  if (type === 'hour') {
    option.text += '时'
  }
  if (type === 'minute') {
    option.text += '分'
  }
  return option
}
</script>

<template>
  <div class="demo-time-picker">
    <demo-block card :title="t('basicUsage')">
      <yhm-time-picker v-model="baseTime" :title="t('chooseTime')" />
    </demo-block>

    <demo-block card :title="t('columnsType')">
      <yhm-time-picker
        v-model="secondTime"
        :title="t('chooseTime')"
        :columns-type="columnsType"
      />
    </demo-block>

    <demo-block card :title="t('timeRange')">
      <yhm-time-picker
        v-model="rangeTime"
        :title="t('chooseTime')"
        :min-hour="10"
        :max-hour="20"
        :min-minute="30"
        :max-minute="40"
      />
    </demo-block>

    <demo-block card :title="t('overallTimeRange')">
      <yhm-time-picker
        v-model="hourMinuteTime"
        :title="t('chooseTime')"
        :columns-type="['hour', 'minute', 'second']"
        min-time="09:40:10"
        max-time="20:20:50"
      />
    </demo-block>

    <demo-block card :title="t('optionsFormatter')">
      <yhm-time-picker
        v-model="formatterTime"
        :title="t('chooseTime')"
        :formatter="formatter"
      />
    </demo-block>

    <demo-block card :title="t('optionsFilter')">
      <yhm-time-picker
        v-model="filterTime"
        :title="t('chooseTime')"
        :filter="filter"
      />
    </demo-block>

    <demo-block card :title="t('advancedUsage')">
      <yhm-time-picker :title="t('chooseTime')" :filter="timeFilter" />
    </demo-block>
  </div>
</template>
