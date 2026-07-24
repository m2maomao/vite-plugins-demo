<template>
  <div>
    <yhm-tabs swipe-threshold="3">
      <yhm-tab title="基础用法">
        <yhm-floating-panel>
          <yhm-cell v-for="i in 26" :key="i" :title="String.fromCharCode(i + 64)" />
        </yhm-floating-panel>
      </yhm-tab>
      <yhm-tab title="自定义锚点">
        <yhm-floating-panel v-model:height="height" :anchors="anchors">
          <div style="text-align: center; padding: 15px">
            <p>面板显示高度 {{ height.toFixed(0) }} px</p>
          </div>
        </yhm-floating-panel>
      </yhm-tab>
      <yhm-tab title="仅头部拖拽">
        <yhm-floating-panel :content-draggable="false">
          <div style="text-align: center; padding: 15px"><p>内容不可拖拽</p></div>
        </yhm-floating-panel>
      </yhm-tab>
      <yhm-tab title="禁用吸附">
        <yhm-floating-panel :magnetic="false">
          <div style="text-align: center; padding: 15px"><p>已禁用磁力吸附，可在边界内任意停留</p></div>
        </yhm-floating-panel>
      </yhm-tab>
      <yhm-tab title="禁用拖拽">
        <yhm-floating-panel :draggable="false">
          <div style="text-align: center; padding: 15px"><p>该面板不可拖拽</p></div>
        </yhm-floating-panel>
      </yhm-tab>
    </yhm-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const windowHeight = window.innerHeight;
const anchors = [100, Math.round(0.4 * windowHeight), Math.round(0.7 * windowHeight)];
const height = ref(anchors[0]);
</script>
