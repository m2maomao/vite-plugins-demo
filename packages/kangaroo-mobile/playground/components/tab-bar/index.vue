<template>
  <div class="demo-tabbar">
    <demo-block :title="t('basicUsage')">
      <yhm-tab-bar v-model="active" :items="basicItems" />
    </demo-block>

    <demo-block :title="t('matchByName')">
      <yhm-tab-bar v-model="activeName" :items="nameItems" />
    </demo-block>

    <demo-block :title="t('badge')">
      <yhm-tab-bar v-model="active2" :items="badgeItems" />
    </demo-block>

    <demo-block :title="t('customIcon')">
      <yhm-tab-bar v-model="active3" :items="customIconItems" />
    </demo-block>

    <demo-block :title="t('customColor')">
      <yhm-tab-bar v-model="active4" :items="colorItems" active-color="#ee0a24" />
    </demo-block>

    <demo-block :title="t('switchEvent')">
      <yhm-tab-bar v-model="active5" :items="eventItems" @change="onChange" />
    </demo-block>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from 'vant'
import { createTranslate } from '@/locale'

const t = createTranslate('tabBarDemo')

const active = ref(0)
const active2 = ref(0)
const active3 = ref(0)
const active4 = ref(0)
const active5 = ref(0)
const activeName = ref('home')

const basicItems = [
  { name: 0, icon: 'home-o', label: t('tab') },
  { name: 1, icon: 'search', label: t('tab') },
  { name: 2, icon: 'friends-o', label: t('tab') },
  { name: 3, icon: 'setting-o', label: t('tab') },
]

const nameItems = [
  { name: 'home', icon: 'home-o', label: t('tab') },
  { name: 'search', icon: 'search', label: t('tab') },
  { name: 'friends', icon: 'friends-o', label: t('tab') },
  { name: 'setting', icon: 'setting-o', label: t('tab') },
]

const badgeItems = [
  { name: 0, icon: 'home-o', label: t('tab') },
  { name: 1, icon: 'search', label: t('tab'), dot: true },
  { name: 2, icon: 'friends-o', label: t('tab'), badge: '5' },
  { name: 3, icon: 'setting-o', label: t('tab'), badge: '20' },
]

const customIconItems = [
  { name: 0, icon: 'home-o', activeIcon: 'setting-o', label: t('custom') },
  { name: 1, icon: 'search', label: t('tab') },
  { name: 2, icon: 'friends-o', label: t('tab') },
]

const colorItems = [
  { name: 0, icon: 'home-o', label: t('tab') },
  { name: 1, icon: 'search', label: t('tab') },
  { name: 2, icon: 'friends-o', label: t('tab') },
  { name: 3, icon: 'setting-o', label: t('tab') },
]

const eventItems = [
  { name: 0, icon: 'home-o', label: `${t('tab')} 1` },
  { name: 1, icon: 'search', label: `${t('tab')} 2` },
  { name: 2, icon: 'friends-o', label: `${t('tab')} 3` },
  { name: 3, icon: 'setting-o', label: `${t('tab')} 4` },
]

const onChange = (index: number | string) => {
  showToast(`${t('tab')} ${index}`)
}
</script>

<style lang="less">
.demo-tabbar {
  .van-tabbar {
    position: relative;
    padding-bottom: 0;
  }
}
</style>
