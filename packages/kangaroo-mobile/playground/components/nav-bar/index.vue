<template>
  <div>
    <demo-block :title="t('basicUsage')">
      <yhm-nav-bar :title="t('title')" />
    </demo-block>

    <demo-block :title="t('showBack')">
      <yhm-nav-bar :title="t('title')" :left-text="t('back')" show-back />
    </demo-block>

    <demo-block :title="t('rightButton')">
      <yhm-nav-bar :title="t('title')" :left-text="t('back')" :right-text="t('button')" show-back />
    </demo-block>

    <demo-block :title="t('useSlot')">
      <yhm-nav-bar :title="t('title')" :left-text="t('back')" show-back>
        <template #right>
          <yhm-icon name="search" size="18" />
        </template>
      </yhm-nav-bar>
    </demo-block>

    <demo-block :title="t('disableButton')">
      <yhm-nav-bar
        :title="t('title')"
        :left-text="t('back')"
        :right-text="t('button')"
        show-back
        left-disabled
        right-disabled />
    </demo-block>
  </div>
</template>

<script setup lang="ts">
import { useTranslate } from '@/locale/useTranslate';

const t = useTranslate({
  'zh-CN': {
    basicUsage: '基础用法',
    title: '标题',
    showBack: '返回上级',
    rightButton: '右侧按钮',
    button: '按钮',
    useSlot: '使用插槽',
    disableButton: '禁用按钮',
  },
  'en-US': {
    basicUsage: 'Basic Usage',
    title: 'Title',
    showBack: 'Show Back',
    rightButton: 'Right Button',
    button: 'Button',
    useSlot: 'Use Slot',
    disableButton: 'Disable Button',
  },
  'ja-JP': {
    basicUsage: '基本使用',
    title: 'タイトル',
    showBack: '戻る',
    rightButton: '右ボタン',
    button: 'ボタン',
    useSlot: 'スロット使用',
    disableButton: '無効化ボタン',
  },
});
</script>
