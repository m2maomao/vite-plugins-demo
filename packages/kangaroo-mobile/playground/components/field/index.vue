<template>
  <div class="demo-field">
    <demo-block :title="t('basicUsage')">
      <yhm-cell-group inset>
        <van-form>
          <yhm-field v-model="text1" :label="t('label')" :placeholder="t('textPlaceholder')" />
        </van-form>
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('customType')">
      <yhm-cell-group inset>
        <van-form>
          <yhm-field v-model="text2" :label="t('text')" :placeholder="t('textPlaceholder')" autocomplete="off" />
          <yhm-field v-model="phone" type="tel" :label="t('phone')" :placeholder="t('phonePlaceholder')" />
          <yhm-field v-model="digit" type="digit" :label="t('digit')" :placeholder="t('digitPlaceholder')" />
          <yhm-field v-model="number" type="number" :label="t('number')" :placeholder="t('numberPlaceholder')" />
          <yhm-field v-model="password" type="password" :label="t('password')" :placeholder="t('passwordPlaceholder')" autocomplete="off" />
        </van-form>
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('disabled')">
      <yhm-cell-group inset>
        <yhm-field :model-value="t('inputReadonly')" :label="t('text')" readonly />
        <yhm-field :model-value="t('inputDisabled')" :label="t('text')" disabled />
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('showIcon')">
      <yhm-cell-group inset>
        <yhm-field v-model="icon1" :label="t('text')" left-icon="smile-o" right-icon="warning-o" :placeholder="t('showIcon')" />
        <yhm-field v-model="icon2" clearable :label="t('text')" left-icon="music-o" :placeholder="t('showClearIcon')" />
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('required')">
      <yhm-cell-group inset>
        <yhm-field v-model="reqName" required :label="t('username')" :placeholder="t('usernamePlaceholder')" />
        <yhm-field v-model="reqPhone" required :label="t('phone')" :placeholder="t('phonePlaceholder')" />
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('autoRequired')">
      <yhm-cell-group inset>
        <van-form required="auto">
          <van-field v-model="autoName" :rules="[{ required: true }]" :label="t('username')" :placeholder="t('usernamePlaceholder')" />
          <van-field v-model="autoPhone" :rules="[{ required: false }]" :label="t('phone')" :placeholder="t('phonePlaceholder')" />
        </van-form>
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('errorInfo')">
      <yhm-cell-group inset>
        <yhm-field v-model="errName" error :label="t('username')" :placeholder="t('usernamePlaceholder')" />
        <yhm-field v-model="errPhone" :label="t('phone')" :placeholder="t('phonePlaceholder')" :error-message="t('phoneError')" />
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('insertButton')">
      <yhm-cell-group inset>
        <yhm-field v-model="sms" center clearable :label="t('sms')" :placeholder="t('smsPlaceholder')">
          <template #button>
            <yhm-button size="small" type="primary">{{ t('sendSms') }}</yhm-button>
          </template>
        </yhm-field>
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('formatValue')">
      <yhm-cell-group inset>
        <yhm-field v-model="format1" :label="t('text')" :formatter="formatter" :placeholder="t('formatOnChange')" />
        <yhm-field v-model="format2" :label="t('text')" :formatter="formatter" format-trigger="onBlur" :placeholder="t('formatOnBlur')" />
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('autosize')">
      <yhm-cell-group inset>
        <yhm-field v-model="autoSizeVal" autosize rows="1" type="textarea" :label="t('message')" :placeholder="t('messagePlaceholder')" />
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('showWordLimit')">
      <yhm-cell-group inset>
        <yhm-field v-model="wordLimitVal" autosize show-word-limit rows="2" type="textarea" maxlength="50" :label="t('message')" :placeholder="t('messagePlaceholder')" />
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('inputAlign')">
      <yhm-cell-group inset>
        <yhm-field v-model="alignText" :label="t('text')" :placeholder="t('alignPlaceHolder')" input-align="right" />
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('labelAlign')">
      <yhm-cell-group inset>
        <yhm-field v-model="labelAlignVal" :label="t('label')" :placeholder="t('top')" label-align="top" />
        <yhm-field v-model="labelAlignVal" :label="t('label')" :placeholder="t('left')" label-align="left" />
        <yhm-field v-model="labelAlignVal" :label="t('label')" :placeholder="t('center')" label-align="center" />
        <yhm-field v-model="labelAlignVal" :label="t('label')" :placeholder="t('right')" label-align="right" />
      </yhm-cell-group>
    </demo-block>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Form as VanForm, Field as VanField } from 'vant'
import { useTranslate } from '@/locale/useTranslate'

const t = useTranslate({
  'zh-CN': {
    basicUsage: '基础用法',
    customType: '自定义类型',
    disabled: '禁用输入框',
    showIcon: '显示图标',
    required: '必填星号',
    autoRequired: '自动展示星号',
    errorInfo: '错误提示',
    insertButton: '插入按钮',
    formatValue: '格式化输入内容',
    formatOnBlur: '在失焦时执行格式化',
    formatOnChange: '在输入时执行格式化',
    autosize: '高度自适应',
    showWordLimit: '显示字数统计',
    inputAlign: '输入框内容对齐',
    labelAlign: '输入框文本位置',
    label: '文本',
    text: '文本',
    digit: '整数',
    number: '数字',
    phone: '手机号',
    password: '密码',
    username: '用户名',
    sms: '短信验证码',
    message: '留言',
    top: '顶部对齐',
    left: '左对齐',
    center: '居中对齐',
    right: '右对齐',
    textPlaceholder: '请输入文本',
    digitPlaceholder: '请输入整数',
    numberPlaceholder: '请输入数字（支持小数）',
    phonePlaceholder: '请输入手机号',
    passwordPlaceholder: '请输入密码',
    usernamePlaceholder: '请输入用户名',
    smsPlaceholder: '请输入短信验证码',
    messagePlaceholder: '请输入留言',
    inputReadonly: '输入框只读',
    inputDisabled: '输入框已禁用',
    showClearIcon: '显示清除图标',
    alignPlaceHolder: '输入框内容右对齐',
    phoneError: '手机号格式错误',
    sendSms: '发送验证码',
  },
  'en-US': {
    basicUsage: 'Basic Usage',
    customType: 'Custom Type',
    disabled: 'Disabled',
    showIcon: 'Show Icon',
    required: 'Required',
    autoRequired: 'Auto Required',
    errorInfo: 'Error Info',
    insertButton: 'Insert Button',
    formatValue: 'Format Value',
    formatOnBlur: 'Format On Blur',
    formatOnChange: 'Format On Change',
    autosize: 'Auto Resize',
    showWordLimit: 'Word Limit',
    inputAlign: 'Input Align',
    labelAlign: 'Label Align',
    label: 'Label',
    text: 'Text',
    digit: 'Digit',
    number: 'Number',
    phone: 'Phone',
    password: 'Password',
    username: 'Username',
    sms: 'SMS',
    message: 'Message',
    top: 'Top',
    left: 'Left',
    center: 'Center',
    right: 'Right',
    textPlaceholder: 'Please enter text',
    digitPlaceholder: 'Please enter digit',
    numberPlaceholder: 'Please enter number',
    phonePlaceholder: 'Please enter phone',
    passwordPlaceholder: 'Please enter password',
    usernamePlaceholder: 'Please enter username',
    smsPlaceholder: 'Please enter SMS',
    messagePlaceholder: 'Please enter message',
    inputReadonly: 'Readonly',
    inputDisabled: 'Disabled',
    showClearIcon: 'Show clear icon',
    alignPlaceHolder: 'Right align',
    phoneError: 'Invalid phone',
    sendSms: 'Send SMS',
  },
  'ja-JP': {
    basicUsage: '基本使用',
    customType: 'カスタムタイプ',
    disabled: '無効入力',
    showIcon: 'アイコン表示',
    required: '必須項目',
    autoRequired: '自動必須',
    errorInfo: 'エラー情報',
    insertButton: 'ボタン挿入',
    formatValue: '入力内容のフォーマット',
    formatOnBlur: 'フォーカス喪失時にフォーマット',
    formatOnChange: '入力時にフォーマット',
    autosize: '高さ自動調整',
    showWordLimit: '文字数制限表示',
    inputAlign: '入力位置',
    labelAlign: 'ラベル配置',
    label: 'テキスト',
    text: 'テキスト',
    digit: '整数',
    number: '数字',
    phone: '電話番号',
    password: 'パスワード',
    username: 'ユーザー名',
    sms: 'SMSコード',
    message: 'メッセージ',
    top: '上揃え',
    left: '左揃え',
    center: '中央揃え',
    right: '右揃え',
    textPlaceholder: 'テキストを入力',
    digitPlaceholder: '整数を入力',
    numberPlaceholder: '数字を入力',
    phonePlaceholder: '電話番号を入力',
    passwordPlaceholder: 'パスワードを入力',
    usernamePlaceholder: 'ユーザー名を入力',
    smsPlaceholder: 'SMSコードを入力',
    messagePlaceholder: 'メッセージを入力',
    inputReadonly: '読み取り専用',
    inputDisabled: '無効',
    showClearIcon: 'クリアアイコン表示',
    alignPlaceHolder: '右揃え',
    phoneError: '電話番号エラー',
    sendSms: '送信',
  },
})

const text1 = ref('')
const text2 = ref('')
const phone = ref('')
const digit = ref('')
const number = ref('')
const password = ref('')
const icon1 = ref('')
const icon2 = ref('123')
const reqName = ref('')
const reqPhone = ref('123')
const autoName = ref('')
const autoPhone = ref('123')
const errName = ref('')
const errPhone = ref('123')
const sms = ref('')
const format1 = ref('')
const format2 = ref('')
const autoSizeVal = ref('')
const wordLimitVal = ref('')
const alignText = ref('')
const labelAlignVal = ref('')

const formatter = (value: string) => value.replace(/\d/g, '')
</script>

<style lang="less">
.demo-field {
  // 由 yhm-cell-group inset 控制间距
}
</style>
