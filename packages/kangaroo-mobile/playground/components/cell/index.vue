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
      <yhm-cell
        :title="t('cell')"
        :value="t('content')"
        size="large"
        :label="t('desc')"
      />
    </demo-block>

    <demo-block :title="t('showIcon')">
      <yhm-cell :title="t('cell')" :value="t('content')" icon="location-o" />
    </demo-block>

    <demo-block :title="t('showArrow')">
      <yhm-cell :title="t('cell')" is-link />
      <yhm-cell :title="t('cell')" is-link :value="t('content')" />
      <yhm-cell
        :title="t('cell')"
        is-link
        arrow-direction="down"
        :value="t('content')"
      />
    </demo-block>

    <demo-block :title="t('router')">
      <yhm-cell
        :title="t('urlRoute')"
        is-link
        url="https://github.com/vant-ui/vant"
      />
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
      <yhm-cell
        center
        :title="t('cell')"
        :value="t('content')"
        :label="t('desc')"
      />
    </demo-block>
  </div>
</template>

<script setup lang="ts">
import { Cell as VanCell } from 'vant'
import { createTranslate } from '@/locale'

const t = createTranslate('cellDemo')
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
