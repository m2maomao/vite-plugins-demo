<template>
  <!-- 组件列表页 -->
  <div v-if="!currentDemo" class="home">
    <header class="home-header">
      <yhm-icon name="mdi:lightning-bolt" size="48" class="home-logo" />
      <h1 class="home-title">Kangaroo Mobile</h1>
      <p class="home-desc">Vue 3 移动端组件库</p>

      <!-- 语言切换 -->
      <div class="locale-switcher">
        <button
          v-for="lang in languages"
          :key="lang.value"
          :class="['locale-btn', { active: currentLang === lang.value }]"
          @click="switchLang(lang.value)"
        >
          {{ lang.label }}
        </button>
      </div>
    </header>

    <div class="home-list">
      <div
        class="home-item"
        @click="currentDemo = 'nav-bar'"
      >
        <span class="home-item__name">NavBar</span>
        <span class="home-item__desc">导航栏</span>
        <yhm-icon name="chevron-right" size="14" class="home-item__arrow" />
      </div>

      <!-- 后续更多组件加在这里 -->
    </div>
  </div>

  <!-- Demo 页 -->
  <NavBarDemo
    v-else-if="currentDemo === 'nav-bar'"
    @back="currentDemo = null"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { setLocale, getLocale } from '@/locale'
import NavBarDemo from './components/nav-bar/index.vue'

const currentDemo = ref<string | null>(null)
const currentLang = ref(getLocale())

const languages = [
  { label: '中文', value: 'zh-CN' as const },
  { label: 'English', value: 'en-US' as const },
  { label: '日本語', value: 'ja-JP' as const },
]

const allMessages: Record<string, Record<string, Record<string, string>>> = {
  'zh-CN': {
    navBarDemo: {
      'locale': '🌐 语言',
      'navBar': 'NavBar',
      'back': '返回',
      'basicUsage': '基础用法',
      'title': '标题',
      'showBack': '返回上级',
      'rightButton': '右侧按钮',
      'button': '按钮',
      'useSlot': '使用插槽',
      'disableButton': '禁用按钮',
    },
  },
  'en-US': {
    navBarDemo: {
      'locale': '🌐 Language',
      'navBar': 'NavBar',
      'back': 'Back',
      'basicUsage': 'Basic Usage',
      'title': 'Title',
      'showBack': 'Show Back',
      'rightButton': 'Right Button',
      'button': 'Button',
      'useSlot': 'Use Slot',
      'disableButton': 'Disable Button',
    },
  },
  'ja-JP': {
    navBarDemo: {
      'locale': '🌐 言語',
      'navBar': 'NavBar',
      'back': '戻る',
      'basicUsage': '基本使用',
      'title': 'タイトル',
      'showBack': '戻る',
      'rightButton': '右ボタン',
      'button': 'ボタン',
      'useSlot': 'スロット使用',
      'disableButton': '無効化ボタン',
    },
  },
}

function switchLang(lang: 'zh-CN' | 'en-US' | 'ja-JP') {
  setLocale(lang, allMessages[lang])
  currentLang.value = getLocale()
}

// 初始化中文文案
setLocale('zh-CN', allMessages['zh-CN'])
</script>

<style lang="less">
body {
  margin: 0;
  padding: 0;
  background: var(--yh-bg-color, #f5f6fa);
}

.home {
  min-height: 100vh;
}

.home-header {
  text-align: center;
  padding: 48px 16px 32px;
  background: linear-gradient(135deg, var(--yh-primary-color, #1677ff), #5598ff);
  color: #fff;
}

.home-title {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 600;
}

.home-desc {
  margin: 0 0 20px;
  font-size: 14px;
  opacity: 0.85;
}

/* 语言切换 */
.locale-switcher {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.locale-btn {
  padding: 4px 16px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  background: transparent;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s;
}

.locale-btn.active {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.8);
  color: #fff;
}

.locale-btn:hover:not(.active) {
  border-color: rgba(255, 255, 255, 0.7);
  color: #fff;
}

.home-list {
  padding: 12px 16px;
}

.home-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: var(--yh-bg-color-white, #fff);
  border-radius: var(--yh-radius-md, 8px);
  cursor: pointer;
  box-shadow: var(--yh-shadow-sm);
  gap: 8px;

  &:active {
    box-shadow: var(--yh-shadow-md);
  }
}

.home-item__name {
  font-size: 14px;
  color: var(--yh-text-color, #333);
}

.home-item__desc {
  font-size: 14px;
  color: var(--yh-text-color, #333);
}

.home-item__arrow {
  margin-left: auto;
  color: #c8c9cc;
  flex-shrink: 0;
}
</style>
