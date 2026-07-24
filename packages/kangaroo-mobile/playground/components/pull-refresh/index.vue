<template>
  <div class="demo-pull-refresh">
    <yhm-tabs>
      <yhm-tab :title="t('basicUsage')">
        <yhm-pull-refresh
          v-model="loading"
          pulling-text="下拉即可刷新..."
          loosing-text="释放即可刷新..."
          loading-text="加载中..."
          @refresh="onRefresh(true)">
          <p>{{ tips }}</p>
        </yhm-pull-refresh>
      </yhm-tab>

      <yhm-tab :title="t('successTip')">
        <yhm-pull-refresh
          v-model="loading"
          :success-text="t('success')"
          pulling-text="下拉即可刷新..."
          loosing-text="释放即可刷新..."
          loading-text="加载中..."
          @refresh="onRefresh(false)">
          <p>{{ tips }}</p>
        </yhm-pull-refresh>
      </yhm-tab>

      <yhm-tab :title="t('customTips')">
        <yhm-pull-refresh v-model="loading" head-height="80" @refresh="onRefresh(true)">
          <template #pulling="{ distance }">
            <img class="doge" :src="cdnURL('doge.png')" :style="{ transform: `scale(${distance / 80})` }" />
          </template>
          <template #loosing>
            <img :src="cdnURL('doge.png')" class="doge" />
          </template>
          <template #loading>
            <img :src="cdnURL('doge-fire.jpeg')" class="doge" />
          </template>
          <p>{{ tips }}</p>
        </yhm-pull-refresh>
      </yhm-tab>
    </yhm-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { showToast } from 'vant';
import { cdnURL } from '../../site';

const t = (key: string): string => {
  const map: Record<string, string> = {
    basicUsage: '基础用法',
    successTip: '成功提示',
    customTips: '自定义提示',
    try: '下拉试试',
    text: '刷新次数',
    success: '刷新成功',
  };
  return map[key] || key;
};

const count = ref(0);
const loading = ref(false);

const tips = computed(() => (count.value ? `${t('text')}: ${count.value}` : t('try')));

const onRefresh = (isShowToast: boolean) => {
  setTimeout(() => {
    if (isShowToast) showToast(t('success'));
    loading.value = false;
    count.value++;
  }, 1000);
};

const preloadImage = () => {
  const doge = new Image();
  const dogeFire = new Image();
  doge.src = cdnURL('doge.png');
  dogeFire.src = cdnURL('doge-fire.jpeg');
};
onMounted(preloadImage);
</script>

<style>
.demo-pull-refresh {
  background-color: #f7f8fa;
}
.demo-pull-refresh .yhm-pull-refresh {
  height: calc(100vh - 50px);
}
.demo-pull-refresh .doge {
  width: 140px;
  height: 72px;
  margin-top: 8px;
  border-radius: 4px;
}
.demo-pull-refresh p {
  margin: 0;
  padding: 16px 0 0 16px;
}
</style>
