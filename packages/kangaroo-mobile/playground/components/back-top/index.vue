<script setup lang="ts">
import { ref } from 'vue'
import VanTabs from 'vant/es/tabs'
import VanTab from 'vant/es/tab'
import VanCell from 'vant/es/cell'
import { useTranslate } from '@/locale/useTranslate'

const t = useTranslate({
  'zh-CN': {
    backTop: '返回顶部',
    customContent: '自定义内容',
    customPosition: '自定义位置',
    immediateScroll: '瞬间滚动',
    setScrollTarget: '设置滚动目标',
  },
  'en-US': {
    backTop: 'Back Top',
    customContent: 'Custom Content',
    customPosition: 'Custom Position',
    immediateScroll: 'Immediate Scroll',
    setScrollTarget: 'Set Scroll Target',
  },
})

const activeTab = ref(0)
const list = [...Array(50).keys()]
const targetEl = ref<HTMLElement>()
</script>

<template>
  <VanTabs v-model:active="activeTab" :ellipsis="false">
    <VanTab :title="t('basicUsage')">
      <VanCell v-for="item in list" :key="item" :title="item" />
      <yhm-back-top v-if="activeTab === 0">
        <yhm-icon name="back-top" />
      </yhm-back-top>
    </VanTab>

    <VanTab :title="t('customPosition')">
      <VanCell v-for="item in list" :key="item" :title="item" />
      <yhm-back-top v-if="activeTab === 1" right="15vw" bottom="10vh">
        <yhm-icon name="back-top" />
      </yhm-back-top>
    </VanTab>

    <VanTab :title="t('customContent')">
      <VanCell v-for="item in list" :key="item" :title="item" />
      <yhm-back-top v-if="activeTab === 2" class="custom-back-top">
        {{ t('backTop') }}
      </yhm-back-top>
    </VanTab>

    <VanTab :title="t('setScrollTarget')">
      <div class="back-top-wrapper" ref="targetEl">
        <VanCell v-for="item in list" :key="item" :title="item" />
        <yhm-back-top v-if="activeTab === 3" :target="targetEl" bottom="30vh">
          <yhm-icon name="back-top" />
        </yhm-back-top>
      </div>
    </VanTab>

    <VanTab :title="t('immediateScroll')">
      <VanCell v-for="item in list" :key="item" :title="item" />
      <yhm-back-top v-if="activeTab === 4" immediate>
        <yhm-icon name="back-top" />
      </yhm-back-top>
    </VanTab>
  </VanTabs>
</template>

<style lang="less">
.back-top-wrapper {
  height: 60vh;
  overflow: auto;
}

.custom-back-top {
  width: 80px;
  font-size: 14px;
  text-align: center;
}
</style>
