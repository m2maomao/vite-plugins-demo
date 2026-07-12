<template>
  <div class="demo-icon">
    <!-- 基础用法 -->
    <demo-block :title="t('basicUsage')">
      <div class="demo-icon-row">
        <yhm-icon name="mdi:home" size="24" />
        <yhm-icon name="mdi:bell" size="24" />
        <yhm-icon name="mdi:chat" size="24" />
        <yhm-icon name="mdi:cart" size="24" />
        <yhm-icon name="mdi:heart" size="24" />
        <yhm-icon name="mdi:star" size="24" />
        <yhm-icon name="mdi:account" size="24" />
        <yhm-icon name="mdi:cog" size="24" />
        <yhm-icon name="mdi:phone" size="24" />
      </div>
    </demo-block>

    <!-- 图标尺寸 -->
    <demo-block :title="t('iconSize')">
      <div class="demo-icon-row">
        <yhm-icon name="mdi:home" size="16" />
        <yhm-icon name="mdi:home" size="20" />
        <yhm-icon name="mdi:home" size="24" />
        <yhm-icon name="mdi:home" size="32" />
        <yhm-icon name="mdi:home" size="40" />
        <yhm-icon name="mdi:home" size="48" />
      </div>
    </demo-block>

    <!-- 图标颜色 -->
    <demo-block :title="t('iconColor')">
      <div class="demo-icon-row">
        <yhm-icon name="mdi:heart" size="28" color="#ee0a24" />
        <yhm-icon name="mdi:star" size="28" color="#ff976a" />
        <yhm-icon name="mdi:bell" size="28" color="#1989fa" />
        <yhm-icon name="mdi:check-circle" size="28" color="#07c160" />
        <yhm-icon name="mdi:close-circle" size="28" color="#999" />
        <yhm-icon name="mdi:lightning-bolt" size="28" color="#ffc107" />
      </div>
    </demo-block>

    <!-- 业务名称映射 -->
    <demo-block :title="t('businessMapping')">
      <div class="demo-icon-row">
        <yhm-icon name="back" size="24" />
        <yhm-icon name="search" size="24" />
        <yhm-icon name="chevron-right" size="24" />
        <yhm-icon name="home" size="24" />
        <yhm-icon name="close" size="24" />
        <yhm-icon name="chat" size="24" />
        <yhm-icon name="bell" size="24" />
        <yhm-icon name="cart" size="24" />
      </div>
      <div class="demo-icon-desc">
        <code>back</code> → <code>vant:arrow-left</code> &nbsp;
        <code>search</code> → <code>vant:search</code> &nbsp;
        <code>chevron-right</code> → <code>vant:arrow</code>
      </div>
    </demo-block>

    <!-- Vant 兜底图标 -->
    <demo-block :title="t('vantFallback')">
      <div class="demo-icon-grid">
        <div
          v-for="icon in vantIcons"
          :key="icon"
          class="demo-icon-item"
        >
          <yhm-icon :name="icon" size="28" />
          <span class="demo-icon-label">{{ icon }}</span>
        </div>
      </div>
    </demo-block>

    <!-- Iconify 图标展示 -->
    <demo-block :title="t('iconifyIcons')">
      <div class="demo-icon-grid">
        <div
          v-for="icon in iconifyIcons"
          :key="icon"
          class="demo-icon-item"
        >
          <yhm-icon :name="icon" size="28" />
          <span class="demo-icon-label">{{ icon.replace('mdi:', '') }}</span>
        </div>
      </div>
    </demo-block>

    <!-- 自定义 deer 图标 -->
    <demo-block :title="t('customIcon')">
      <div class="demo-icon-row">
        <yhm-icon name="deer" size="48" color="#1677ff" />
      </div>
      <div class="demo-icon-desc">
        通过 <code>icon-map.ts</code> 映射业务名 <code>deer</code>，<br>
        SVG 源文件位于 <code>src/assets/icons/mingcute--deer-line.svg</code>，<br>
        <code>icon.vue</code> 组件通过 <code>unplugin-icons</code> 虚拟模块直接导入为 Vue 组件渲染。
      </div>
    </demo-block>
  </div>
</template>

<script setup lang="ts">
import { createTranslate } from '@/locale'

const t = createTranslate('iconDemo')

const vantIcons = [
  'home-o',
  'friends-o',
  'setting-o',
  'coupon-o',
  'balance-o',
  'records',
  'todo-list-o',
  'smile-comment-o',
  'photo-fail',
  'arrow',
  'cross',
  'success',
  'fail',
  'plus',
]

const iconifyIcons = [
  'mdi:home',
  'mdi:bell',
  'mdi:chat',
  'mdi:cart',
  'mdi:heart',
  'mdi:star',
  'mdi:account',
  'mdi:cog',
  'mdi:phone',
  'mdi:email',
  'mdi:close',
  'mdi:check-circle',
  'mdi:close-circle',
  'mdi:information',
  'mdi:alert',
  'mdi:lightning-bolt',
  'mdi:calendar',
  'mdi:camera',
  'mdi:download',
  'mdi:upload',
  'mdi:delete',
  'mdi:plus',
  'mdi:minus',
  'mdi:arrow-left',
  'mdi:arrow-right',
  'mdi:menu',
  'mdi:map-marker',
  'mdi:clock-outline',
  'mdi:cloud-upload',
  'mdi:refresh',
]
</script>

<style lang="less">
.demo-icon {
  .demo-icon-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
  }

  .demo-icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
    padding: 12px 16px;
  }

  .demo-icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px 4px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;

    &:active {
      background: #f5f5f5;
    }
  }

  .demo-icon-label {
    font-size: 11px;
    color: #999;
    text-align: center;
    word-break: break-all;
    line-height: 1.3;
    max-width: 100%;
  }

  .demo-icon-desc {
    margin: 8px 16px 0;
    padding: 8px 12px;
    background: #f7f8fa;
    border-radius: 6px;
    font-size: 12px;
    color: #666;
    line-height: 1.6;

    code {
      display: inline-block;
      padding: 1px 6px;
      background: #e8e8e8;
      border-radius: 3px;
      font-size: 11px;
      color: #333;
    }
  }
}
</style>
