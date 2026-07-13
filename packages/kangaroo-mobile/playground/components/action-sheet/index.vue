<script setup lang="ts">
import { ref, computed } from 'vue'
import VanCell from 'vant/es/cell'
import { showToast } from 'vant'
import { useTranslate } from '@/locale/useTranslate'

const t = useTranslate({
  'zh-CN': {
    cancel: '取消',
    option1: '选项一',
    option2: '选项二',
    option3: '选项三',
    subname: '描述信息',
    showIcon: '展示图标',
    showCancel: '展示取消按钮',
    buttonText: '弹出菜单',
    customPanel: '自定义面板',
    description: '这是一段描述信息',
    optionStatus: '选项状态',
    coloredOption: '着色选项',
    disabledOption: '禁用选项',
    showDescription: '展示描述信息',
  },
  'en-US': {
    cancel: 'Cancel',
    option1: 'Option 1',
    option2: 'Option 2',
    option3: 'Option 3',
    subname: 'Description',
    showIcon: 'Show Icon',
    showCancel: 'Show Cancel Button',
    buttonText: 'Show ActionSheet',
    customPanel: 'Custom Panel',
    description: 'Description',
    optionStatus: 'Option Status',
    coloredOption: 'Colored Option',
    disabledOption: 'Disabled Option',
    showDescription: 'Show Description',
  },
  'ja-JP': {
    cancel: 'キャンセル',
    option1: 'オプション1',
    option2: 'オプション2',
    option3: 'オプション3',
    subname: '説明',
    showIcon: 'アイコン表示',
    showCancel: 'キャンセルボタン表示',
    buttonText: 'アクションシート表示',
    customPanel: 'カスタムパネル',
    description: 'これは説明文です',
    optionStatus: 'オプション状態',
    coloredOption: '色付きオプション',
    disabledOption: '無効オプション',
    showDescription: '説明を表示',
  },
})

const showBasic = ref(false)
const showIcon = ref(false)
const showCancel = ref(false)
const showTitle = ref(false)
const showStatus = ref(false)
const showDescription = ref(false)

const simpleActions = computed(() => [
  { name: t('option1') },
  { name: t('option2') },
  { name: t('option3') },
])

const iconActions = computed(() => [
  { name: t('option1'), icon: 'cart-o' },
  { name: t('option2'), icon: 'shop-o' },
  { name: t('option3'), icon: 'star-o' },
])

const statusActions = computed(() => [
  { name: t('coloredOption'), color: '#ee0a24' },
  { name: t('disabledOption'), disabled: true },
  { loading: true },
])

const actionsWithDescription = computed(() => [
  { name: t('option1') },
  { name: t('option2') },
  { name: t('option3'), subname: t('subname') },
])

const onSelect = (item: any) => {
  showBasic.value = false
  showToast(item.name)
}

const onSelectIcon = (item: any) => {
  showIcon.value = false
  showToast(item.name)
}

const onCancel = () => showToast(t('cancel'))
</script>

<template>
  <div class="demo-action-sheet">
    <demo-block card :title="t('basicUsage')">
      <van-cell is-link :title="t('basicUsage')" @click="showBasic = true" />
      <van-cell is-link :title="t('showIcon')" @click="showIcon = true" />
      <van-cell is-link :title="t('showCancel')" @click="showCancel = true" />
      <van-cell is-link :title="t('showDescription')" @click="showDescription = true" />
    </demo-block>

    <demo-block card :title="t('optionStatus')">
      <van-cell is-link :title="t('optionStatus')" @click="showStatus = true" />
    </demo-block>

    <demo-block card :title="t('customPanel')">
      <van-cell is-link :title="t('customPanel')" @click="showTitle = true" />
    </demo-block>

    <yhm-action-sheet
      v-model:show="showBasic"
      :actions="simpleActions"
      @select="onSelect"
    />

    <yhm-action-sheet
      v-model:show="showIcon"
      :actions="iconActions"
      @select="onSelectIcon"
    />

    <yhm-action-sheet
      v-model:show="showCancel"
      :actions="simpleActions"
      close-on-click-action
      :cancel-text="t('cancel')"
      @cancel="onCancel"
    />

    <yhm-action-sheet
      v-model:show="showDescription"
      :actions="actionsWithDescription"
      close-on-click-action
      :cancel-text="t('cancel')"
      :description="t('description')"
    />

    <yhm-action-sheet
      v-model:show="showStatus"
      close-on-click-action
      :actions="statusActions"
      :cancel-text="t('cancel')"
    />

    <yhm-action-sheet v-model:show="showTitle" :title="t('title')">
      <div class="demo-action-sheet-content">{{ t('content') }}</div>
    </yhm-action-sheet>
  </div>
</template>

<style lang="less">
.demo-action-sheet {
  &-content {
    padding: 16px 16px calc(16px * 10);
  }
}
</style>
