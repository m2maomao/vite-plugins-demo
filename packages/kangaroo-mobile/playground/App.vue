<template>
  <div class="p-4">
    <h3>NavBar 基础</h3>
    <yhm-nav-bar
      title="个人中心"
      showBack
      @click-left="onClick"
    />

    <h3 class="mt-4">NavBar 自定义左侧</h3>
    <yhm-nav-bar title="详情">
      <template #left>
        <yhm-icon name="arrow-left" />
        <span class="ml-1">返回</span>
      </template>
    </yhm-nav-bar>

    <h3 class="mt-4">NavBar 右侧</h3>
    <yhm-nav-bar
      title="商品"
      right-icon="cart"
      @click-right="onClickRight"
    />

    <h3 class="mt-4">图标验证</h3>
    <yhm-icon name="back" size="24" />
    <yhm-icon name="home" size="24" class="ml-2" />
    <yhm-icon name="deer:logo" size="32" class="ml-2" />
  </div>
</template>

<script setup lang="ts">
import { YhmIcon } from '../src/components'

const onClick = () => {
  console.log('click-left')
}

const onClickRight = () => {
  console.log('click-right')
}
</script>

<style lang="less">
body {
  background: var(--yh-bg-color);
}
.mt-4 {
  margin-top: 16px;
}
.ml-1 {
  margin-left: 4px;
}
.ml-2 {
  margin-left: 8px;
}
.p-4 {
  padding: 16px;
}
</style>