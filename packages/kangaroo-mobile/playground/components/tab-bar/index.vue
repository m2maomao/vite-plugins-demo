<template>
  <div class="demo-tabbar">
    <demo-block :title="t('basicUsage')">
      <yhm-tab-bar v-model="active">
        <yhm-tabbar-item name="0" icon="home-o">{{ t('tab') }}</yhm-tabbar-item>
        <yhm-tabbar-item name="1" icon="search">{{ t('tab') }}</yhm-tabbar-item>
        <yhm-tabbar-item name="2" icon="friends-o">{{ t('tab') }}</yhm-tabbar-item>
        <yhm-tabbar-item name="3" icon="setting-o">{{ t('tab') }}</yhm-tabbar-item>
      </yhm-tab-bar>
    </demo-block>

    <demo-block :title="t('matchByName')">
      <yhm-tab-bar v-model="activeName">
        <yhm-tabbar-item name="home" icon="home-o">
          {{ t('tab') }}
        </yhm-tabbar-item>
        <yhm-tabbar-item name="search" icon="search">
          {{ t('tab') }}
        </yhm-tabbar-item>
        <yhm-tabbar-item name="friends" icon="friends-o">
          {{ t('tab') }}
        </yhm-tabbar-item>
        <yhm-tabbar-item name="setting" icon="setting-o">
          {{ t('tab') }}
        </yhm-tabbar-item>
      </yhm-tab-bar>
    </demo-block>

    <demo-block :title="t('badge')">
      <yhm-tab-bar v-model="active2">
        <yhm-tabbar-item name="0" icon="home-o">{{ t('tab') }}</yhm-tabbar-item>
        <yhm-tabbar-item name="1" icon="search" dot>{{ t('tab') }}</yhm-tabbar-item>
        <yhm-tabbar-item name="2" icon="friends-o" badge="5">
          {{ t('tab') }}
        </yhm-tabbar-item>
        <yhm-tabbar-item name="3" icon="setting-o" badge="20">
          {{ t('tab') }}
        </yhm-tabbar-item>
      </yhm-tab-bar>
    </demo-block>

    <demo-block :title="t('customIcon')">
      <yhm-tab-bar v-model="active3">
        <yhm-tabbar-item name="0" badge="3">
          <span>{{ t('custom') }}</span>
          <template #icon="props">
            <img :src="props.active ? icon.active : icon.inactive" />
          </template>
        </yhm-tabbar-item>
        <yhm-tabbar-item name="1" icon="search">{{ t('tab') }}</yhm-tabbar-item>
        <yhm-tabbar-item name="2" icon="setting-o">{{ t('tab') }}</yhm-tabbar-item>
      </yhm-tab-bar>
    </demo-block>

    <demo-block :title="t('customColor')">
      <yhm-tab-bar v-model="active4" active-color="#ee0a24">
        <yhm-tabbar-item name="0" icon="home-o">{{ t('tab') }}</yhm-tabbar-item>
        <yhm-tabbar-item name="1" icon="search">{{ t('tab') }}</yhm-tabbar-item>
        <yhm-tabbar-item name="2" icon="friends-o">{{ t('tab') }}</yhm-tabbar-item>
        <yhm-tabbar-item name="3" icon="setting-o">{{ t('tab') }}</yhm-tabbar-item>
      </yhm-tab-bar>
    </demo-block>

    <demo-block :title="t('switchEvent')">
      <yhm-tab-bar v-model="active5" @change="onChange">
        <yhm-tabbar-item name="0" icon="home-o">{{ `${t('tab')} 1` }}</yhm-tabbar-item>
        <yhm-tabbar-item name="1" icon="search">{{ `${t('tab')} 2` }}</yhm-tabbar-item>
        <yhm-tabbar-item name="2" icon="friends-o">{{ `${t('tab')} 3` }}</yhm-tabbar-item>
        <yhm-tabbar-item name="3" icon="setting-o">{{ `${t('tab')} 4` }}</yhm-tabbar-item>
      </yhm-tab-bar>
    </demo-block>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from 'vant'
import { createTranslate } from '@/locale'
import { cdnURL } from '../../site'

const t = createTranslate('tabBarDemo')

const active = ref(0)
const active2 = ref(0)
const active3 = ref(0)
const active4 = ref(0)
const active5 = ref(0)
const activeName = ref('home')

const icon = {
  active: cdnURL('user-active.png'),
  inactive: cdnURL('user-inactive.png'),
}

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
