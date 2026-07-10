<template>
  <div>
    <!-- 顶部 NavBar：标题 + 返回按钮 -->
    <yhm-nav-bar
      :title="t('navBar')"
      :left-text="t('back')"
      show-back
      @click-left="$emit('back')"
    />

    <div class="demo-content">
      <!-- ===== 1. 基础用法 ===== -->
      <div class="demo-block">
        <div class="demo-block__title">{{ t('basicUsage') }}</div>
        <yhm-nav-bar :title="t('title')" />
      </div>

      <!-- ===== 2. 返回上级 ===== -->
      <div class="demo-block">
        <div class="demo-block__title">{{ t('showBack') }}</div>
        <yhm-nav-bar
          :title="t('title')"
          :left-text="t('back')"
          show-back
        />
      </div>

      <!-- ===== 3. 右侧按钮 ===== -->
      <div class="demo-block">
        <div class="demo-block__title">{{ t('rightButton') }}</div>
        <yhm-nav-bar
          :title="t('title')"
          :left-text="t('back')"
          :right-text="t('button')"
          show-back
        />
      </div>

      <!-- ===== 4. 使用插槽 ===== -->
      <div class="demo-block">
        <div class="demo-block__title">{{ t('useSlot') }}</div>
        <yhm-nav-bar
          :title="t('title')"
          :left-text="t('back')"
          show-back
        >
          <template #right>
            <yhm-icon name="search" size="18" />
          </template>
        </yhm-nav-bar>
      </div>

      <!-- ===== 5. 禁用按钮 ===== -->
      <div class="demo-block">
        <div class="demo-block__title">{{ t('disableButton') }}</div>
        <yhm-nav-bar
          :title="t('title')"
          :left-text="t('back')"
          :right-text="t('button')"
          show-back
          left-disabled
          right-disabled
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createTranslate } from '@/locale'

defineEmits<{ (e: 'back'): void }>()

const t = createTranslate('navBarDemo')
</script>

<style scoped>
.demo-content {
  padding: 16px 0;
}

.demo-block {
  margin-bottom: 24px;
}

.demo-block__title {
  margin: 0;
  padding: 0 16px 8px;
  color: var(--yh-text-color-secondary, #969799);
  font-size: var(--yh-font-size-md, 14px);
  line-height: 1.5;
}
</style>
