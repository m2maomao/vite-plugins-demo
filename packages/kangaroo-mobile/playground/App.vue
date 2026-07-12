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
import { setLocale, getLocale } from '@/locale'
import NavBarDemo from './components/nav-bar/index.vue'
import ButtonDemo from './components/button/index.vue'
import TabBarDemo from './components/tab-bar/index.vue'

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
      { key: 'form', name: 'YhmForm', desc: '表单' },
      { key: 'picker', name: 'YhmPicker', desc: '选择器' },
      { key: 'date-time-picker', name: 'YhmDateTimePicker', desc: '日期时间选择' },
      { key: 'switch', name: 'YhmSwitch', desc: '开关' },
      { key: 'search', name: 'YhmSearch', desc: '搜索' },
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

const allMessages: Record<string, Record<string, Record<string, string>>> = {
  'zh-CN': {
    iconDemo: {
      'back': '返回',
      'basicUsage': '基础用法',
      'iconSize': '图标尺寸',
      'iconColor': '图标颜色',
      'businessMapping': '业务名称映射',
      'vantFallback': 'Vant 兜底图标',
      'iconifyIcons': 'Iconify 图标',
      'customIcon': '自定义图标',
    },
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
    buttonDemo: {
      'back': '返回',
      'type': '按钮类型',
      'default': '默认按钮',
      'primary': '主要按钮',
      'success': '成功按钮',
      'danger': '危险按钮',
      'warning': '警告按钮',
      'plain': '朴素按钮',
      'disabled': '禁用状态',
      'loading': '加载状态',
      'loadingText': '加载中...',
      'shape': '按钮形状',
      'square': '方形按钮',
      'round': '圆形按钮',
      'size': '按钮尺寸',
      'large': '大号按钮',
      'normal': '普通按钮',
      'small': '小型按钮',
      'mini': '迷你按钮',
      'blockElement': '块级元素',
      'hairline': '细边框',
      'hairlineButton': '细边框按钮',
      'icon': '图标按钮',
      'button': '按钮',
      'gradient': '渐变色按钮',
      'animatedButton': '动画按钮',
      'doTask': '做任务',
      'lottery': '抽大奖',
      'customColor': '自定义颜色',
      'pure': '单色按钮',
    },
    tabBarDemo: {
      'back': '返回',
      'basicUsage': '基础用法',
      'matchByName': '通过名称匹配',
      'badge': '徽标提示',
      'customIcon': '自定义图标',
      'customColor': '自定义颜色',
      'switchEvent': '监听切换事件',
      'tabBar': 'TabBar',
      'tab': '标签',
      'home': '首页',
      'search': '搜索',
      'mine': '我的',
      'messages': '消息',
      'custom': '自定义',
      'new': '新',
    },
  },
  'en-US': {
    iconDemo: {
      'back': 'Back',
      'basicUsage': 'Basic Usage',
      'iconSize': 'Icon Size',
      'iconColor': 'Icon Color',
      'businessMapping': 'Business Name Mapping',
      'vantFallback': 'Vant Fallback Icons',
      'iconifyIcons': 'Iconify Icons',
      'customIcon': 'Custom Icon',
    },
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
    buttonDemo: {
      'back': 'Back',
      'type': 'Type',
      'default': 'Default',
      'primary': 'Primary',
      'success': 'Success',
      'danger': 'Danger',
      'warning': 'Warning',
      'plain': 'Plain',
      'hairline': 'Hairline',
      'hairlineButton': 'Hairline',
      'disabled': 'Disabled',
      'loading': 'Loading',
      'loadingText': 'Loading...',
      'shape': 'Shape',
      'square': 'Square',
      'round': 'Round',
      'icon': 'Icon',
      'button': 'Button',
      'size': 'Size',
      'large': 'Large',
      'normal': 'Normal',
      'small': 'Small',
      'mini': 'Mini',
      'blockElement': 'Block Element',
      'customColor': 'Custom Color',
      'pure': 'Pure',
      'gradient': 'Gradient',
      'animatedButton': 'Animated Button',
      'doTask': 'Do Task',
      'lottery': 'Lottery',
    },
    tabBarDemo: {
      'back': 'Back',
      'basicUsage': 'Basic Usage',
      'matchByName': 'Match by Name',
      'badge': 'Show Badge',
      'customIcon': 'Custom Icon',
      'customColor': 'Custom Color',
      'switchEvent': 'Change Event',
      'tabBar': 'TabBar',
      'tab': 'Tab',
      'home': 'Home',
      'search': 'Search',
      'mine': 'Profile',
      'messages': 'Messages',
      'custom': 'Custom',
      'new': 'New',
    },
  },
  'ja-JP': {
    iconDemo: {
      'back': '戻る',
      'basicUsage': '基本使用',
      'iconSize': 'アイコンサイズ',
      'iconColor': 'アイコン色',
      'businessMapping': '業務名マッピング',
      'vantFallback': 'Vant 代替アイコン',
      'iconifyIcons': 'Iconify アイコン',
      'customIcon': 'カスタムアイコン',
    },
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
    tabBarDemo: {
      'back': '戻る',
      'basicUsage': '基本使用',
      'matchByName': '名前で選択',
      'badge': 'バッジ',
      'customIcon': 'カスタムアイコン',
      'customColor': 'カスタム色',
      'switchEvent': '切り替えイベント',
      'tabBar': 'TabBar',
      'tab': 'タブ',
      'home': 'ホーム',
      'search': '検索',
      'mine': 'マイ',
      'messages': 'メッセージ',
      'custom': 'カスタム',
      'new': '新着',
    },
    buttonDemo: {
      'back': '戻る',
      'type': 'ボタンタイプ',
      'default': 'デフォルト',
      'primary': 'プライマリ',
      'success': 'サクセス',
      'danger': 'デンジャー',
      'warning': 'ワーニング',
      'plain': 'プレーン',
      'hairline': 'ヘアライン',
      'hairlineButton': 'ヘアライン',
      'disabled': '無効',
      'loading': 'ローディング',
      'loadingText': '読み込み中...',
      'shape': 'シェイプ',
      'square': 'スクエア',
      'round': 'ラウンド',
      'icon': 'アイコン',
      'button': 'ボタン',
      'size': 'サイズ',
      'large': 'ラージ',
      'normal': 'ノーマル',
      'small': 'スモール',
      'mini': 'ミニ',
      'blockElement': 'ブロック要素',
      'customColor': 'カスタム色',
      'pure': '単色',
      'gradient': 'グラデーション',
      'animatedButton': 'アニメーションボタン',
      'doTask': 'タスク',
      'lottery': '抽選',
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
