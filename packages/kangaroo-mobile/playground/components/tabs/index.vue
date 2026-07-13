<script setup lang="ts">
import { ref } from 'vue'
import VanIcon from 'vant/es/icon'
import { showToast } from 'vant'
import { useTranslate } from '@/locale/useTranslate'
import Shrink from './Shrink.vue'

const t = useTranslate({
  'zh-CN': {
    tab: '标签 ',
    content: '内容',
    title2: '标签栏滚动',
    title3: '禁用标签',
    title4: '样式风格',
    title5: '点击事件',
    title6: '粘性布局',
    title7: '自定义标签',
    title8: '切换动画',
    title9: '滑动切换',
    title10: '滚动导航',
    matchByName: '通过名称匹配',
    beforeChange: '异步切换',
  },
  'en-US': {
    tab: 'Tab ',
    content: 'content of tab',
    title2: 'Swipe Tabs',
    title3: 'Disabled Tab',
    title4: 'Card Style',
    title5: 'Click Event',
    title6: 'Sticky',
    title7: 'Custom Tab',
    title8: 'Switch Animation',
    title9: 'Swipeable',
    title10: 'Scrollspy',
    matchByName: 'Match By Name',
    beforeChange: 'Before Change',
  },
})

const active1 = ref(0)
const active2 = ref(0)
const active3 = ref(0)
const active4 = ref(0)
const active5 = ref(0)
const active6 = ref(0)
const active7 = ref(0)
const active8 = ref(0)
const active9 = ref(0)
const active10 = ref(0)
const active11 = ref(0)
const activeName = ref('b')

const tabs = [1, 2, 3, 4]

const onClickTab = ({ title }: any) => { showToast(title) }

const beforeChange = (name: number) => {
  if (name === 1) return false
  return new Promise<boolean>((resolve) => {
    setTimeout(() => resolve(name !== 3), 1000)
  })
}
</script>

<template>
  <div class="demo-tab">
    <demo-block :title="t('basicUsage')">
      <yhm-tabs v-model:active="active1">
        <yhm-tab :title="t('tab') + index" v-for="index in tabs" :key="index">
          {{ t('content') }} {{ index }}
        </yhm-tab>
      </yhm-tabs>
    </demo-block>

    <demo-block :title="t('matchByName')">
      <yhm-tabs v-model:active="activeName">
        <yhm-tab name="a" :title="t('tab') + 1">{{ t('content') }} 1</yhm-tab>
        <yhm-tab name="b" :title="t('tab') + 2">{{ t('content') }} 2</yhm-tab>
        <yhm-tab name="c" :title="t('tab') + 3">{{ t('content') }} 3</yhm-tab>
      </yhm-tabs>
    </demo-block>

    <demo-block :title="t('title2')">
      <yhm-tabs v-model:active="active2">
        <yhm-tab v-for="index in 8" :title="t('tab') + index" :key="index">
          {{ t('content') }} {{ index }}
        </yhm-tab>
      </yhm-tabs>
    </demo-block>

    <demo-block :title="t('title3')">
      <yhm-tabs v-model:active="active3">
        <yhm-tab v-for="index in 3" :title="t('tab') + index" :disabled="index === 2" :key="index">
          {{ t('content') }} {{ index }}
        </yhm-tab>
      </yhm-tabs>
    </demo-block>

    <demo-block :title="t('title4')">
      <yhm-tabs v-model:active="active4" type="card">
        <yhm-tab v-for="index in 3" :title="t('tab') + index" :key="index">
          {{ t('content') }} {{ index }}
        </yhm-tab>
      </yhm-tabs>
    </demo-block>

    <demo-block :title="t('title5')">
      <yhm-tabs v-model:active="active5" @click-tab="onClickTab">
        <yhm-tab v-for="index in 2" :title="t('tab') + index" :key="index">
          {{ t('content') }} {{ index }}
        </yhm-tab>
      </yhm-tabs>
    </demo-block>

    <demo-block :title="t('title6')">
      <yhm-tabs v-model:active="active6" sticky>
        <yhm-tab :title="t('tab') + index" v-for="index in tabs" :key="index">
          {{ t('content') }} {{ index }}
        </yhm-tab>
      </yhm-tabs>
    </demo-block>

    <Shrink />

    <demo-block :title="t('title7')">
      <yhm-tabs v-model:active="active7">
        <yhm-tab v-for="index in 2" :key="index">
          <template #title><VanIcon name="more-o" />{{ t('tab') }}</template>
          {{ t('content') }} {{ index }}
        </yhm-tab>
      </yhm-tabs>
    </demo-block>

    <demo-block :title="t('title8')">
      <yhm-tabs v-model:active="active8" animated>
        <yhm-tab :title="t('tab') + index" v-for="index in tabs" :key="index">
          {{ t('content') }} {{ index }}
        </yhm-tab>
      </yhm-tabs>
    </demo-block>

    <demo-block :title="t('title9')">
      <yhm-tabs v-model:active="active9" swipeable>
        <yhm-tab :title="t('tab') + index" v-for="index in tabs" :key="index">
          {{ t('content') }} {{ index }}
        </yhm-tab>
      </yhm-tabs>
    </demo-block>

    <demo-block :title="t('title10')">
      <yhm-tabs v-model:active="active10" scrollspy sticky>
        <yhm-tab :title="t('tab') + index" v-for="index in 8" :key="index">
          {{ t('content') }} {{ index }}
        </yhm-tab>
      </yhm-tabs>
    </demo-block>

    <demo-block :title="t('beforeChange')">
      <yhm-tabs v-model:active="active11" :before-change="beforeChange">
        <yhm-tab :title="t('tab') + index" v-for="index in 4" :key="index">
          {{ t('content') }} {{ index }}
        </yhm-tab>
      </yhm-tabs>
    </demo-block>
  </div>
</template>

<style lang="less">
.demo-tab {
  margin-bottom: 80vh;

  .van-tab .van-icon {
    margin-right: 5px;
    vertical-align: -2px;
  }

  .van-tab__panel {
    padding: 24px 20px;
    background: var(--van-background-2);
  }

  .van-tabs--card .van-tab__panel {
    background: transparent;
  }
}
</style>
