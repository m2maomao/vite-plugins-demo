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
import { ref } from 'vue';
import { showToast } from 'vant';
import { useTranslate } from '@/locale/useTranslate';
import { cdnURL } from '../../site';

const t = useTranslate({
  'zh-CN': {
    basicUsage: '基础用法',
    matchByName: '通过名称匹配',
    badge: '徽标提示',
    customIcon: '自定义图标',
    customColor: '自定义颜色',
    switchEvent: '监听切换事件',
    tab: '标签',
    home: '首页',
    search: '搜索',
    mine: '我的',
    messages: '消息',
    custom: '自定义',
    new: '新',
  },
  'en-US': {
    basicUsage: 'Basic Usage',
    matchByName: 'Match by Name',
    badge: 'Show Badge',
    customIcon: 'Custom Icon',
    customColor: 'Custom Color',
    switchEvent: 'Change Event',
    tab: 'Tab',
    home: 'Home',
    search: 'Search',
    mine: 'Profile',
    messages: 'Messages',
    custom: 'Custom',
    new: 'New',
  },
  'ja-JP': {
    basicUsage: '基本使用',
    matchByName: '名前で選択',
    badge: 'バッジ',
    customIcon: 'カスタムアイコン',
    customColor: 'カスタム色',
    switchEvent: '切り替えイベント',
    tab: 'タブ',
    home: 'ホーム',
    search: '検索',
    mine: 'マイ',
    messages: 'メッセージ',
    custom: 'カスタム',
    new: '新着',
  },
});

const active = ref(0);
const active2 = ref(0);
const active3 = ref(0);
const active4 = ref(0);
const active5 = ref(0);
const activeName = ref('home');

const icon = {
  active: cdnURL('user-active.png'),
  inactive: cdnURL('user-inactive.png'),
};

const onChange = (index: number | string) => {
  showToast(`${t('tab')} ${index}`);
};
</script>

<style lang="less">
.demo-tabbar {
  .van-tabbar {
    position: relative;
    padding-bottom: 0;
  }
}
</style>
