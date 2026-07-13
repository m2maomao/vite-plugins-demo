<script setup lang="ts">
import { ref } from 'vue'
import { useTranslate } from '@/locale/useTranslate'

const t = useTranslate({
  'zh-CN': { shrink: '收缩布局', tab: '标签 ', content: '内容' },
  'en-US': { shrink: 'Shrink', tab: 'Tab ', content: 'content of tab' },
})

const tabs = [1, 2, 3, 4]
const active1 = ref(0)
const active2 = ref(0)
</script>

<template>
  <demo-block :title="t('shrink')">
    <yhm-tabs v-model:active="active1" shrink>
      <yhm-tab :title="t('tab') + index" v-for="index in tabs" :key="index">
        {{ t('content') }} {{ index }}
      </yhm-tab>
    </yhm-tabs>
    <yhm-tabs
      v-model:active="active2"
      type="card"
      shrink
      style="margin-top: var(--van-padding-lg)"
    >
      <yhm-tab :title="t('tab') + index" v-for="index in tabs" :key="index">
        {{ t('content') }} {{ index }}
      </yhm-tab>
    </yhm-tabs>
  </demo-block>
</template>
