<script setup lang="ts">
import { useTranslate } from '@/locale/useTranslate'

defineProps<{ switchMode: string }>()

const t = useTranslate({
  'zh-CN': { calendar: '日历', tiledDisplay: '平铺展示' },
  'en-US': { calendar: 'Calendar', tiledDisplay: 'Tiled display' },
})

const minDate = new Date(2012, 0, 10)
const maxDate = new Date(2013, 2, 20)
</script>

<template>
  <demo-block card :title="t('tiledDisplay')">
    <yhm-calendar
      :title="t('calendar')"
      :poppable="false"
      :show-confirm="false"
      :min-date="minDate"
      :max-date="maxDate"
      :default-date="minDate"
      :switch-mode="switchMode"
      :style="{ height: '500px' }"
    />
  </demo-block>
</template>
