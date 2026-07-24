<template>
  <div class="demo-list">
    <yhm-tabs>
      <yhm-tab title="基础用法">
        <yhm-list
          v-model:loading="list[0].loading"
          :finished="list[0].finished"
          finished-text="没有更多了"
          @load="onLoad(0)">
          <yhm-cell v-for="item in list[0].items" :key="item" :title="item" />
        </yhm-list>
      </yhm-tab>

      <yhm-tab title="错误提示">
        <yhm-list
          v-model:loading="list[1].loading"
          v-model:error="list[1].error"
          :finished="list[1].finished"
          error-text="请求失败，点击重新加载"
          @load="onLoad(1)">
          <yhm-cell v-for="item in list[1].items" :key="item" :title="item" />
        </yhm-list>
      </yhm-tab>

      <yhm-tab title="下拉刷新">
        <yhm-pull-refresh v-model="list[2].refreshing" @refresh="onRefresh(2)">
          <yhm-list
            v-model:loading="list[2].loading"
            :finished="list[2].finished"
            finished-text="没有更多了"
            @load="onLoad(2)">
            <yhm-cell v-for="item in list[2].items" :key="item" :title="item" />
          </yhm-list>
        </yhm-pull-refresh>
      </yhm-tab>
    </yhm-tabs>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const list = reactive([
  { items: [] as string[], refreshing: false, loading: false, error: false, finished: false },
  { items: [] as string[], refreshing: false, loading: false, error: false, finished: false },
  { items: [] as string[], refreshing: false, loading: false, error: false, finished: false },
]);

const onLoad = (index: number) => {
  const currentList = list[index];
  currentList.loading = true;

  setTimeout(() => {
    if (currentList.refreshing) {
      currentList.items = [];
      currentList.refreshing = false;
    }
    for (let i = 0; i < 10; i++) {
      const text = currentList.items.length + 1;
      currentList.items.push(text < 10 ? '0' + text : String(text));
    }
    currentList.loading = false;
    currentList.refreshing = false;

    if (index === 1 && currentList.items.length === 10 && !currentList.error) {
      currentList.error = true;
    } else {
      currentList.error = false;
    }
    if (currentList.items.length >= 40) currentList.finished = true;
  }, 1000);
};

const onRefresh = (index: number) => {
  list[index].finished = false;
  onLoad(index);
};
</script>

<style>
.demo-list .yhm-cell {
  text-align: center;
}
</style>
