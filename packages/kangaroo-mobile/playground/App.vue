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

    <div class="home-body">
      <div
        v-for="group in componentGroups"
        :key="group.title"
        class="home-group"
      >
        <div class="home-group__title">{{ group.title }}</div>
        <div class="home-group__list">
          <div
            v-for="item in group.items"
            :key="item.key"
            class="home-item"
            @click="currentDemo = item.key"
          >
            <span class="home-item__name">{{ item.name }}</span>
            <span class="home-item__desc">{{ item.desc }}</span>
            <yhm-icon name="chevron-right" size="14" class="home-item__arrow" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <template v-else>
    <demo-nav
      :title="toComponentName(currentDemo)"
      @back="currentDemo = null"
    />
    <demo-section>
      <IconDemo
        v-if="currentDemo === 'icon'"
        @back="currentDemo = null"
      />
      <CellDemo
        v-else-if="currentDemo === 'cell'"
        @back="currentDemo = null"
      />
      <FieldDemo
        v-else-if="currentDemo === 'field'"
        @back="currentDemo = null"
      />
      <ImageDemo
        v-else-if="currentDemo === 'image'"
        @back="currentDemo = null"
      />
      <RadioDemo
        v-else-if="currentDemo === 'radio'"
        @back="currentDemo = null"
      />
      <CheckboxDemo
        v-else-if="currentDemo === 'checkbox'"
        @back="currentDemo = null"
      />
      <StepperDemo
        v-else-if="currentDemo === 'stepper'"
        @back="currentDemo = null"
      />
      <SwitchDemo
        v-else-if="currentDemo === 'switch'"
        @back="currentDemo = null"
      />
      <NavBarDemo
        v-else-if="currentDemo === 'nav-bar'"
        @back="currentDemo = null"
      />
      <ButtonDemo
        v-else-if="currentDemo === 'button'"
        @back="currentDemo = null"
      />
      <TabBarDemo
        v-else-if="currentDemo === 'tab-bar'"
        @back="currentDemo = null"
      />
    </demo-section>
  </template>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { setLocale, getLocale, addGlobalMessages } from '@/locale'
import IconDemo from './components/icon/index.vue'
import CellDemo from './components/cell/index.vue'
import FieldDemo from './components/field/index.vue'
import RadioDemo from './components/radio/index.vue'
import CheckboxDemo from './components/checkbox/index.vue'
import StepperDemo from './components/stepper/index.vue'
import SwitchDemo from './components/switch/index.vue'
import NavBarDemo from './components/nav-bar/index.vue'
import ButtonDemo from './components/button/index.vue'
import TabBarDemo from './components/tab-bar/index.vue'
import ImageDemo from './components/image/index.vue'

/** 转换 key 为组件名，如 nav-bar → Yhm-Nav-Bar */
function toComponentName(key: string | null): string {
  if (!key) return ''
  return 'Yhm-' + key
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-')
}
const currentDemo = ref<string | null>(null)
const currentLang = ref(getLocale())

const languages = [
  { label: '中文', value: 'zh-CN' as const },
  { label: 'English', value: 'en-US' as const },
  { label: '日本語', value: 'ja-JP' as const },
]

interface GroupItem {
  key: string
  name: string
  desc: string
}

interface ComponentGroup {
  title: string
  items: GroupItem[]
}

const componentGroups: ComponentGroup[] = [
  {
    title: '基础组件',
    items: [
      { key: 'button', name: 'YhmButton', desc: '按钮' },
      { key: 'cell', name: 'YhmCell', desc: '单元格' },
      { key: 'icon', name: 'YhmIcon', desc: '图标' },
      { key: 'image', name: 'YhmImage', desc: '图片' },
      { key: 'popup', name: 'YhmPopup', desc: '弹出层' },
      { key: 'toast', name: 'YhmToast', desc: '轻提示' },
    ],
  },
  {
    title: '表单组件',
    items: [
      { key: 'field', name: 'YhmField', desc: '输入框' },
      { key: 'form', name: 'YhmForm', desc: '表单' },
      { key: 'picker', name: 'YhmPicker', desc: '选择器' },
      { key: 'date-time-picker', name: 'YhmDateTimePicker', desc: '日期时间选择' },
      { key: 'switch', name: 'YhmSwitch', desc: '开关' },
      { key: 'search', name: 'YhmSearch', desc: '搜索' },
      { key: 'checkbox', name: 'YhmCheckbox', desc: '复选框' },
      { key: 'radio', name: 'YhmRadio', desc: '单选框' },
      { key: 'stepper', name: 'YhmStepper', desc: '步进器' },
    ],
  },
  {
    title: '反馈组件',
    items: [
      { key: 'dialog', name: 'YhmDialog', desc: '弹窗' },
      { key: 'action-sheet', name: 'YhmActionSheet', desc: '动作面板' },
    ],
  },
  {
    title: '展示组件',
    items: [
      { key: 'badge', name: 'YhmBadge', desc: '徽标' },
      { key: 'card', name: 'YhmCard', desc: '卡片' },
      { key: 'collapse', name: 'YhmCollapse', desc: '折叠面板' },
      { key: 'divider', name: 'YhmDivider', desc: '分割线' },
      { key: 'empty', name: 'YhmEmpty', desc: '空状态' },
      { key: 'image-preview', name: 'YhmImagePreview', desc: '图片预览' },
      { key: 'skeleton', name: 'YhmSkeleton', desc: '骨架屏' },
      { key: 'steps', name: 'YhmSteps', desc: '步骤条' },
      { key: 'tag', name: 'YhmTag', desc: '标签' },
    ],
  },
  {
    title: '导航组件',
    items: [
      { key: 'nav-bar', name: 'YhmNavBar', desc: '导航栏' },
      { key: 'tab-bar', name: 'YhmTabBar', desc: '标签栏' },
      { key: 'tabs', name: 'YhmTabs', desc: '选项卡' },
      { key: 'back-top', name: 'YhmBackTop', desc: '回到顶部' },
    ],
  },
  {
    title: '业务组件',
    items: [
      { key: 'result', name: 'YhmResult', desc: '结果页' },
      { key: 'exception', name: 'YhmException', desc: '异常页' },
    ],
  },
]

function switchLang(lang: 'zh-CN' | 'en-US' | 'ja-JP') {
  setLocale(lang)
  currentLang.value = getLocale()
}

// 注册全局通用文案（供所有 demo 共享，如 basicUsage、disabled 等）
addGlobalMessages({
  'zh-CN': {
    basicUsage: '基础用法',
    disabled: '禁用状态',
    loading: '加载状态',
    title: '标题',
    back: '返回',
    button: '按钮',
    label: '文本',
    text: '文本',
    phone: '手机号',
    password: '密码',
    username: '用户名',
    sms: '短信验证码',
    message: '留言',
    top: '顶部对齐',
    left: '左对齐',
    center: '居中对齐',
    right: '右对齐',
  },
  'en-US': {
    basicUsage: 'Basic Usage',
    disabled: 'Disabled',
    loading: 'Loading',
    title: 'Title',
    back: 'Back',
    button: 'Button',
    label: 'Label',
    text: 'Text',
    phone: 'Phone',
    password: 'Password',
    username: 'Username',
    sms: 'SMS',
    message: 'Message',
    top: 'Top',
    left: 'Left',
    center: 'Center',
    right: 'Right',
  },
  'ja-JP': {
    basicUsage: '基本使用',
    disabled: '無効',
    loading: 'ローディング',
    title: 'タイトル',
    back: '戻る',
    button: 'ボタン',
    label: 'ラベル',
    text: 'テキスト',
    phone: '電話',
    password: 'パスワード',
    username: 'ユーザー名',
    sms: 'SMS',
    message: 'メッセージ',
    top: '上',
    left: '左',
    center: '中央',
    right: '右',
  },
})

// 初始化中文
setLocale('zh-CN')
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

/* 分类分组 */
.home-body {
  padding: 12px 16px;
}

.home-group {
  margin-bottom: 16px;
}

.home-group__title {
  padding: 8px 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--yh-text-color, #333);
}

.home-group__list {
  background: #fff;
  border-radius: var(--yh-radius-md, 8px);
  overflow: hidden;
}

.home-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  gap: 8px;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: #fafafa;
  }
}

.home-item__name {
  font-size: 14px;
  font-weight: 500;
  color: var(--yh-text-color, #333);
}

.home-item__desc {
  font-size: 12px;
  color: #999;
}

.home-item__arrow {
  margin-left: auto;
  color: #c8c9cc;
  flex-shrink: 0;
}
</style>
