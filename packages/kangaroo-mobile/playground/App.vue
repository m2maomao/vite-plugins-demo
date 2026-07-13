<template>
  <router-view />
</template>

<script setup lang="ts">
import { setLocale, addGlobalMessages } from '@/locale'

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

setLocale('zh-CN')
</script>
