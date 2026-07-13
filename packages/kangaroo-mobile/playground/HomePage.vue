<template>
  <div v-if="!$route.name || $route.name === 'home'" class="home">
    <header class="home-header">
      <yhm-icon name="mdi:lightning-bolt" size="48" class="home-logo" />
      <h1 class="home-title">Kangaroo Mobile</h1>
      <p class="home-desc">Vue 3 移动端组件库</p>

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
          <router-link
            v-for="item in group.items"
            :key="item.key"
            :to="`/${item.key}`"
            class="home-item"
          >
            <span class="home-item__name">{{ item.name }}</span>
            <span class="home-item__desc">{{ item.desc }}</span>
            <yhm-icon name="chevron-right" size="14" class="home-item__arrow" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { setLocale, getLocale } from '@/locale'

const router = useRouter()
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
      { key: 'form', name: 'YhmForm', desc: '表单' },
      { key: 'field', name: 'YhmField', desc: '输入框' },
      { key: 'picker', name: 'YhmPicker', desc: '选择器' },
      { key: 'time-picker', name: 'YhmTimePicker', desc: '时间选择' },
      { key: 'area', name: 'YhmArea', desc: '地区选择' },
      { key: 'search', name: 'YhmSearch', desc: '搜索' },
      { key: 'calendar', name: 'YhmCalendar', desc: '日历' },
      { key: 'switch', name: 'YhmSwitch', desc: '开关' },
      { key: 'search', name: 'YhmSearch', desc: '搜索' },
      { key: 'checkbox', name: 'YhmCheckbox', desc: '复选框' },
      { key: 'radio', name: 'YhmRadio', desc: '单选框' },
      { key: 'rate', name: 'YhmRate', desc: '评分' },
      { key: 'slider', name: 'YhmSlider', desc: '滑块' },
      { key: 'uploader', name: 'YhmUploader', desc: '文件上传' },
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

function toComponentName(key: string | null): string {
  if (!key) return ''
  return 'Yhm-' + key
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-')
}

function switchLang(lang: 'zh-CN' | 'en-US' | 'ja-JP') {
  setLocale(lang)
  currentLang.value = getLocale()
}
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
  text-decoration: none;
  color: inherit;

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
