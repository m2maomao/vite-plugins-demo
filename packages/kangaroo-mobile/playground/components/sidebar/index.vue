<template>
  <div class="demo-sidebar">
    <div class="demo-sidebar-grid">
      <div class="demo-sidebar-grid-item">
        <h3 class="demo-sidebar-title">基础用法</h3>
        <yhm-sidebar v-model="active1">
          <yhm-sidebar-item title="标签名" />
          <yhm-sidebar-item title="标签名" />
          <yhm-sidebar-item title="标签名" />
        </yhm-sidebar>
      </div>
      <div class="demo-sidebar-grid-item">
        <h3 class="demo-sidebar-title">徽标提示</h3>
        <yhm-sidebar v-model="active2">
          <yhm-sidebar-item title="标签名" dot />
          <yhm-sidebar-item title="标签名" badge="5" />
          <yhm-sidebar-item title="标签名" />
        </yhm-sidebar>
      </div>
      <div class="demo-sidebar-grid-item">
        <h3 class="demo-sidebar-title">禁用选项</h3>
        <yhm-sidebar v-model="active3">
          <yhm-sidebar-item title="标签名" />
          <yhm-sidebar-item title="标签名" disabled />
          <yhm-sidebar-item title="标签名" />
        </yhm-sidebar>
      </div>
      <div class="demo-sidebar-grid-item">
        <h3 class="demo-sidebar-title">监听切换事件</h3>
        <yhm-sidebar v-model="active4" @change="onChange">
          <yhm-sidebar-item title="标签名 1" />
          <yhm-sidebar-item title="标签名 2" />
          <yhm-sidebar-item title="标签名 3" />
        </yhm-sidebar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { showToast } from 'vant';

const active1 = ref(0);
const active2 = ref(0);
const active3 = ref(0);
const active4 = ref(0);

const onChange = (index: number) => showToast(`标签名 ${index + 1}`);
</script>

<style scoped>
.demo-sidebar-grid {
  display: flex;
  flex-wrap: wrap;
}
.demo-sidebar-grid-item {
  width: 50%;
  margin-bottom: 16px;
}
.demo-sidebar-title {
  font-size: 14px;
  font-weight: 500;
  padding: 0 16px 8px;
  color: #333;
  margin: 0;
}
</style>
