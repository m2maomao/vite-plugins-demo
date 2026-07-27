<template>
  <div class="demo-sidebar">
    <Grid :column-num="2" :border="false">
      <GridItem>
        <h3 class="demo-sidebar-title">基础用法</h3>
        <yhm-sidebar v-model="active1">
          <SidebarItem title="标签名" />
          <SidebarItem title="标签名" />
          <SidebarItem title="标签名" />
        </yhm-sidebar>
      </GridItem>

      <GridItem>
        <h3 class="demo-sidebar-title">徽标提示</h3>
        <yhm-sidebar v-model="active2">
          <SidebarItem title="标签名" dot />
          <SidebarItem title="标签名" badge="5" />
          <SidebarItem title="标签名" />
        </yhm-sidebar>
      </GridItem>

      <GridItem>
        <h3 class="demo-sidebar-title">禁用选项</h3>
        <yhm-sidebar v-model="active3">
          <SidebarItem title="标签名" />
          <SidebarItem title="标签名" disabled />
          <SidebarItem title="标签名" />
        </yhm-sidebar>
      </GridItem>

      <GridItem>
        <h3 class="demo-sidebar-title">监听切换事件</h3>
        <yhm-sidebar v-model="active4" @change="onChange">
          <SidebarItem title="标签名 1" />
          <SidebarItem title="标签名 2" />
          <SidebarItem title="标签名 3" />
        </yhm-sidebar>
      </GridItem>
    </Grid>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Grid, GridItem, SidebarItem, showToast } from 'vant';

const active1 = ref(0);
const active2 = ref(0);
const active3 = ref(0);
const active4 = ref(0);

const onChange = (index: number) => showToast(`标签名 ${index + 1}`);
</script>

<style lang="less">
.demo-sidebar {
  background-color: var(--van-background-2);

  .yhm-sidebar,
  .van-sidebar {
    margin-left: var(--van-padding-md);
  }

  &-title {
    margin-bottom: 16px;
    padding: 0 16px;
    color: var(--van-text-color-2);
    font-weight: normal;
    font-size: 14px;
  }
}
</style>
