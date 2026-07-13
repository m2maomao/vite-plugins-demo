<script setup lang="ts">
import { ref } from 'vue'
import VanCell from 'vant/es/cell'
import VanImage from 'vant/es/image'
import { showToast, showLoadingToast, showSuccessToast, showFailToast, closeToast } from 'vant'
import { useTranslate } from '@/locale/useTranslate'

const t = useTranslate({
  'zh-CN': {
    text: '提示内容',
    text2: '成功文案',
    text3: '失败文案',
    title1: '文字提示',
    title2: '加载提示',
    title3: '成功/失败提示',
    success: '成功提示',
    fail: '失败提示',
    customIcon: '自定义图标',
    customImage: '自定义图片',
    loadingType: '自定义加载图标',
    positionTop: '顶部展示',
    useComponent: '使用 Toast 组件',
    updateMessage: '动态更新提示',
    positionBottom: '底部展示',
    customPosition: '自定义位置',
    wordBreak: '文字换行方式',
    breakAll: '换行时截断单词',
    breakWord: '换行时不截断单词',
  },
  'en-US': {
    text: 'Some messages',
    text2: 'Success',
    text3: 'Fail',
    title1: 'Text',
    title2: 'Loading',
    title3: 'Success/Fail',
    success: 'Success',
    fail: 'Fail',
    customIcon: 'Custom Icon',
    customImage: 'Custom Image',
    loadingType: 'Loading Type',
    positionTop: 'Top',
    useComponent: 'Use Toast Component',
    updateMessage: 'Update Message',
    positionBottom: 'Bottom',
    customPosition: 'Custom Position',
    wordBreak: 'Word Break',
    breakAll: 'Break All',
    breakWord: 'Break Word',
  },
})

const showLoadingToastWithType = (loadingType?: string) => {
  showLoadingToast({ forbidClick: true, message: t('loading'), loadingType })
}

const showTopToast = () => { showToast({ message: t('positionTop'), position: 'top' }) }
const showBottomToast = () => { showToast({ message: t('positionBottom'), position: 'bottom' }) }
const showIconToast = () => { showToast({ message: t('customIcon'), icon: 'like-o' }) }
const showImageToast = () => {
  showToast({ message: t('customImage'), icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/logo.png' })
}

const showCustomToast = () => {
  const toast = showLoadingToast({ duration: 0, forbidClick: true, message: `${3}s` })
  let second = 3
  const timer = setInterval(() => {
    second--
    if (second) {
      toast.message = `${second}s`
    } else {
      clearInterval(timer)
      closeToast()
    }
  }, 1000)
}

const showWordBreakToast = (wordBreak: string) => {
  showToast({ message: 'This message will contain a incomprehensibilities long word.', wordBreak })
}

const show = ref(false)
const image = 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
</script>

<template>
  <div class="demo-toast">
    <demo-block card :title="t('basicUsage')">
      <van-cell is-link :title="t('title1')" @click="showToast(t('text'))" />
      <van-cell is-link :title="t('title2')" @click="showLoadingToastWithType()" />
      <van-cell is-link :title="t('success')" @click="showSuccessToast(t('text2'))" />
      <van-cell is-link :title="t('fail')" @click="showFailToast(t('text3'))" />
    </demo-block>

    <demo-block card :title="t('customIcon')">
      <van-cell is-link :title="t('customIcon')" @click="showIconToast" />
      <van-cell is-link :title="t('customImage')" @click="showImageToast" />
      <van-cell is-link :title="t('loadingType')" @click="showLoadingToastWithType('spinner')" />
    </demo-block>

    <demo-block card :title="t('customPosition')">
      <van-cell is-link :title="t('positionTop')" @click="showTopToast" />
      <van-cell is-link :title="t('positionBottom')" @click="showBottomToast" />
    </demo-block>

    <demo-block card :title="t('wordBreak')">
      <van-cell is-link :title="t('breakAll')" @click="showWordBreakToast('break-all')" />
      <van-cell is-link :title="t('breakWord')" @click="showWordBreakToast('break-word')" />
    </demo-block>

    <demo-block card :title="t('updateMessage')">
      <van-cell is-link :title="t('updateMessage')" @click="showCustomToast" />
    </demo-block>

    <demo-block card :title="t('useComponent')">
      <van-cell is-link :title="t('useComponent')" @click="show = true" />
      <yhm-toast v-model:show="show" style="padding: 0">
        <template #message>
          <van-image :src="image" width="200" height="140" style="display: block" />
        </template>
      </yhm-toast>
    </demo-block>
  </div>
</template>
