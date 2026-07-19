<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTranslate } from '@/locale/useTranslate';
import { getLocale } from '@/locale';
import { areaList } from '@vant/area-data';
import { areaListEn } from './area-en';

const t = useTranslate({
  'zh-CN': {
    title2: '控制选中项',
    title3: '配置显示列',
    title4: '配置列占位提示文字',
  },
  'en-US': {
    title2: 'Model Value',
    title3: 'Columns Number',
    title4: 'Columns Placeholder',
  },
});

const value = ref('330302');
const currentAreaList = computed(() => (getLocale() === 'zh-CN' ? areaList : areaListEn));
const cnPlaceholders = ['省份', '城市', '区县'];
const enPlaceholders = ['Province', 'City', 'County'];
const currentPlaceholders = computed(() => (getLocale() === 'zh-CN' ? cnPlaceholders : enPlaceholders));
</script>

<template>
  <div class="demo-area">
    <demo-block card :title="t('basicUsage')">
      <yhm-area :title="t('title')" :area-list="currentAreaList" />
    </demo-block>

    <demo-block card :title="t('title2')">
      <yhm-area v-model="value" :title="t('title')" :area-list="currentAreaList" />
    </demo-block>

    <demo-block card :title="t('title3')">
      <yhm-area :title="t('title')" :area-list="currentAreaList" :columns-num="2" />
    </demo-block>

    <demo-block card :title="t('title4')">
      <yhm-area :title="t('title')" :area-list="currentAreaList" :columns-placeholder="currentPlaceholders" />
    </demo-block>
  </div>
</template>
