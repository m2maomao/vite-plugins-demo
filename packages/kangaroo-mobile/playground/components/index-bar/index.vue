<template>
  <div class="demo-index-bar">
    <yhm-tabs v-model:active="activeTab">
      <yhm-tab title="基础用法">
        <yhm-index-bar>
          <div v-for="index in indexList" :key="index">
            <yhm-index-anchor :index="index" />
            <yhm-cell title="文本" />
            <yhm-cell title="文本" />
            <yhm-cell title="文本" />
          </div>
        </yhm-index-bar>
      </yhm-tab>
      <yhm-tab title="自定义索引列表">
        <yhm-index-bar :index-list="customIndexList">
          <div v-for="index in customIndexList" :key="index">
            <yhm-index-anchor :index="index">标题{{ index }}</yhm-index-anchor>
            <yhm-cell title="文本" />
          </div>
        </yhm-index-bar>
      </yhm-tab>
    </yhm-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref(0);
const indexList: string[] = [];
const customIndexList = [1, 2, 3, 4, 5, 6, 8, 9, 10];
const charCodeOfA = 'A'.charCodeAt(0);
for (let i = 0; i < 26; i++) indexList.push(String.fromCharCode(charCodeOfA + i));
</script>
