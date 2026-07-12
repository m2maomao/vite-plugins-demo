<script setup lang="ts">
import VanRow from 'vant/es/row'
import VanCol from 'vant/es/col'
import VanLoading from 'vant/es/loading'
import { createTranslate } from '@/locale'
import { cdnURL } from '../../site'

const t = createTranslate('imageDemo')

const image = cdnURL('cat.jpeg')
const fits = ['contain', 'cover', 'fill', 'none', 'scale-down'] as const
const positions1 = ['left', 'center', 'right'] as const
const positions2 = ['top', 'center', 'bottom'] as const
</script>

<template>
  <div class="demo-image">
  <demo-block :title="t('basicUsage')">
    <van-row>
      <yhm-image width="100" height="100" :src="image" />
    </van-row>
  </demo-block>

  <demo-block :title="t('fitMode')">
    <van-row gutter="20">
      <van-col v-for="fit in fits" span="8" :key="fit">
        <yhm-image :fit="fit" width="100%" height="27vw" :src="image" />
        <div class="text">{{ fit }}</div>
      </van-col>
    </van-row>
  </demo-block>

  <demo-block :title="t('position')">
    <van-row gutter="20">
      <van-col v-for="pos in positions1" span="8" :key="pos">
        <yhm-image
          :position="pos"
          width="100%"
          height="27vw"
          fit="cover"
          :src="image"
        />
        <div class="text">cover</div>
        <div class="text">{{ pos }}</div>
      </van-col>
      <van-col v-for="pos in positions2" span="8" :key="pos">
        <yhm-image
          :position="pos"
          width="100%"
          height="27vw"
          fit="contain"
          :src="image"
        />
        <div class="text">contain</div>
        <div class="text">{{ pos }}</div>
      </van-col>
    </van-row>
  </demo-block>

  <demo-block :title="t('round')">
    <van-row gutter="20">
      <van-col v-for="fit in fits" span="8" :key="fit">
        <yhm-image round :fit="fit" width="100%" height="27vw" :src="image" />
        <div class="text">{{ fit }}</div>
      </van-col>
    </van-row>
  </demo-block>

  <demo-block :title="t('loading')">
    <van-row gutter="20">
      <van-col span="8">
        <yhm-image width="100%" height="27vw" />
        <div class="text">{{ t('defaultTip') }}</div>
      </van-col>
      <van-col span="8">
        <yhm-image width="100%" height="27vw">
          <template #loading>
            <van-loading type="spinner" size="20" />
          </template>
        </yhm-image>
        <div class="text">{{ t('customTip') }}</div>
      </van-col>
    </van-row>
  </demo-block>

  <demo-block :title="t('error')">
    <van-row gutter="20">
      <van-col span="8">
        <yhm-image width="100%" height="27vw" src="http://x" />
        <div class="text">{{ t('defaultTip') }}</div>
      </van-col>
      <van-col span="8">
        <yhm-image width="100%" height="27vw" src="http://x">
          <template #error>{{ t('loadFail') }}</template>
        </yhm-image>
        <div class="text">{{ t('customTip') }}</div>
      </van-col>
    </van-row>
  </demo-block>
  </div>
</template>

<style lang="less">
.demo-image {
  overflow-x: hidden;
  background-color: var(--van-background-2);

  .van-row {
    padding: 0 var(--van-padding-md);
  }

  .van-col {
    margin-bottom: 20px;
  }

  .text {
    margin-top: 5px;
    color: var(--van-gray-7);
    font-size: 14px;
    text-align: center;
  }
}
</style>
