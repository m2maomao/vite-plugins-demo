<template>
  <div>
    <demo-block title="文字水印">
      <div class="demo-watermark-wrapper">
        <yhm-watermark content="Vant" :full-page="false" />
      </div>
    </demo-block>
    <demo-block title="图片水印">
      <div class="demo-watermark-wrapper">
        <yhm-watermark
          image="https://fastly.jsdelivr.net/npm/@vant/assets/vant-watermark.png"
          opacity="0.2"
          :full-page="false" />
      </div>
    </demo-block>
    <demo-block title="自定义间隔">
      <div class="demo-watermark-wrapper">
        <yhm-watermark
          image="https://fastly.jsdelivr.net/npm/@vant/assets/vant-watermark.png"
          :gap-x="30"
          :gap-y="10"
          opacity="0.2"
          :full-page="false" />
      </div>
    </demo-block>
    <demo-block title="自定义倾斜角度">
      <div class="demo-watermark-wrapper">
        <yhm-watermark
          image="https://fastly.jsdelivr.net/npm/@vant/assets/vant-watermark.png"
          rotate="22"
          opacity="0.2"
          :full-page="false" />
      </div>
    </demo-block>
    <demo-block title="显示范围">
      <div class="demo-watermark-wrapper">
        <yhm-button type="primary" @click="fullPage = !fullPage">切换</yhm-button>
        <yhm-watermark
          :full-page="fullPage"
          opacity="0.2"
          image="https://fastly.jsdelivr.net/npm/@vant/assets/vant-watermark.png" />
      </div>
    </demo-block>
    <demo-block title="HTML 水印">
      <div class="demo-watermark-wrapper">
        <yhm-watermark :width="150" :full-page="false">
          <template #content>
            <div style="background: linear-gradient(45deg, #000 0, #000 50%, #fff 50%)">
              <p style="mix-blend-mode: difference; color: #fff">Vant watermark</p>
            </div>
          </template>
        </yhm-watermark>
      </div>
    </demo-block>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const fullPage = ref(false);
</script>

<style>
.demo-watermark-wrapper {
  position: relative;
  height: 150px;
  background-color: #f7f8fa;
  padding: 16px;
}
</style>
