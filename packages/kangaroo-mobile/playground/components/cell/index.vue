<template>
  <div class="demo-cell">
    <demo-block :title="t('basicUsage')">
      <yhm-cell-group>
        <yhm-cell :title="t('cell')" :value="t('content')" />
        <yhm-cell :title="t('cell')" :value="t('content')" :label="t('desc')" />
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('insetGrouped')">
      <yhm-cell-group inset>
        <yhm-cell :title="t('cell')" :value="t('content')" />
        <yhm-cell :title="t('cell')" :value="t('content')" :label="t('desc')" />
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('largeSize')">
      <yhm-cell :title="t('cell')" :value="t('content')" size="large" />
      <yhm-cell :title="t('cell')" :value="t('content')" size="large" :label="t('desc')" />
    </demo-block>

    <demo-block :title="t('showIcon')">
      <yhm-cell :title="t('cell')" :value="t('content')" icon="location-o" />
    </demo-block>

    <demo-block :title="t('showArrow')">
      <yhm-cell :title="t('cell')" is-link />
      <yhm-cell :title="t('cell')" is-link :value="t('content')" />
      <yhm-cell :title="t('cell')" is-link arrow-direction="down" :value="t('content')" />
    </demo-block>

    <demo-block :title="t('router')">
      <yhm-cell :title="t('urlRoute')" is-link url="https://github.com/vant-ui/vant" />
      <yhm-cell :title="t('vueRoute')" is-link to="index" />
    </demo-block>

    <demo-block :title="t('groupTitle')">
      <yhm-cell-group :title="`${t('group')} 1`">
        <yhm-cell :title="t('cell')" :value="t('content')" />
      </yhm-cell-group>
      <yhm-cell-group :title="`${t('group')} 2`">
        <yhm-cell :title="t('cell')" :value="t('content')" />
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('useSlots')">
      <!-- 自定义标题需要直接使用 van-cell（slot 不会被 YhmCell 透传） -->
      <van-cell :value="t('content')" is-link>
        <template #title>
          <span class="custom-title">{{ t('cell') }}</span>
          <yhm-tag type="primary">{{ t('tag') }}</yhm-tag>
        </template>
      </van-cell>

      <yhm-cell :title="t('cell')" icon="shop-o">
        <template #right-icon>
          <yhm-icon name="search" size="16" />
        </template>
      </yhm-cell>
    </demo-block>

    <demo-block :title="t('verticalCenter')">
      <yhm-cell center :title="t('cell')" :value="t('content')" :label="t('desc')" />
    </demo-block>
  </div>
</template>

<script setup lang="ts">
import { Cell as VanCell } from 'vant';
import { useTranslate } from '@/locale/useTranslate';

const t = useTranslate({
  'zh-CN': {
    basicUsage: '基础用法',
    insetGrouped: '卡片风格',
    largeSize: '单元格大小',
    showIcon: '展示图标',
    showArrow: '展示箭头',
    router: '页面导航',
    urlRoute: 'URL 跳转',
    vueRoute: '路由跳转',
    groupTitle: '分组标题',
    useSlots: '使用插槽',
    verticalCenter: '垂直居中',
    cell: '单元格',
    content: '内容',
    desc: '描述信息',
    group: '分组',
    tag: '标签',
  },
  'en-US': {
    basicUsage: 'Basic Usage',
    insetGrouped: 'Inset Grouped',
    largeSize: 'Size',
    showIcon: 'Left Icon',
    showArrow: 'Link',
    router: 'Router',
    urlRoute: 'URL',
    vueRoute: 'Vue Router',
    groupTitle: 'Group Title',
    useSlots: 'Use Slots',
    verticalCenter: 'Vertical center',
    cell: 'Cell title',
    content: 'Content',
    desc: 'Description',
    group: 'Group',
    tag: 'Tag',
  },
  'ja-JP': {
    basicUsage: '基本使用',
    insetGrouped: 'インセットグループ',
    largeSize: 'サイズ',
    showIcon: 'アイコン表示',
    showArrow: '矢印表示',
    router: 'ページナビ',
    urlRoute: 'URL 遷移',
    vueRoute: 'ルート遷移',
    groupTitle: 'グループタイトル',
    useSlots: 'スロット使用',
    verticalCenter: '垂直中央揃え',
    cell: 'セル',
    content: '内容',
    desc: '説明',
    group: 'グループ',
    tag: 'タグ',
  },
});
</script>

<style lang="less">
.demo-cell {
  .custom-title {
    margin-right: 4px;
    vertical-align: middle;
  }

  .search-icon {
    font-size: 16px;
    line-height: inherit;
  }
}
</style>
