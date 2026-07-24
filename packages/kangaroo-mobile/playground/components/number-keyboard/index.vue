<template>
  <div class="demo-number-keyboard">
    <demo-block card>
      <yhm-cell is-link title="弹出默认键盘" @touchstart.stop="keyboard = 'default'" />
      <yhm-cell is-link title="弹出带右侧栏的键盘" @touchstart.stop="keyboard = 'custom'" />
      <yhm-cell is-link title="弹出身份证号键盘" @touchstart.stop="keyboard = 'extraKey'" />
      <yhm-cell is-link title="弹出带标题的键盘" @touchstart.stop="keyboard = 'title'" />
      <yhm-cell is-link title="弹出配置多个按键的键盘" @touchstart.stop="keyboard = 'multiExtraKey'" />
      <yhm-cell is-link title="弹出配置随机数字的键盘" @touchstart.stop="keyboard = 'randomKeyOrder'" />
      <yhm-field
        v-model="value"
        readonly
        clickable
        label="双向绑定"
        placeholder="点此输入"
        @touchstart.stop="keyboard = 'bindValue'" />
    </demo-block>

    <yhm-number-keyboard :show="keyboard === 'default'" @blur="keyboard = ''" @input="onInput" @delete="onDelete" />
    <yhm-number-keyboard
      :show="keyboard === 'custom'"
      close-button-text="完成"
      theme="custom"
      extra-key="."
      @blur="keyboard = ''"
      @input="onInput"
      @delete="onDelete" />
    <yhm-number-keyboard
      :show="keyboard === 'extraKey'"
      close-button-text="完成"
      extra-key="X"
      @blur="keyboard = ''"
      @input="onInput"
      @delete="onDelete" />
    <yhm-number-keyboard
      :show="keyboard === 'title'"
      close-button-text="完成"
      title="键盘标题"
      extra-key="."
      @blur="keyboard = ''"
      @input="onInput"
      @delete="onDelete" />
    <yhm-number-keyboard
      :show="keyboard === 'multiExtraKey'"
      close-button-text="完成"
      theme="custom"
      :extra-key="['00', '.']"
      @blur="keyboard = ''"
      @input="onInput"
      @delete="onDelete" />
    <yhm-number-keyboard
      v-if="!isTest"
      :show="keyboard === 'randomKeyOrder'"
      random-key-order
      @blur="keyboard = ''"
      @input="onInput"
      @delete="onDelete" />
    <yhm-number-keyboard v-model="value" :show="keyboard === 'bindValue'" maxlength="6" @blur="keyboard = ''" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { showToast } from 'vant';

const value = ref('');
const keyboard = ref('default');
const isTest = false;

const onInput = (value: string) => showToast(`输入: ${value}`);
const onDelete = () => showToast('删除');
</script>

<style>
.demo-number-keyboard {
  padding-bottom: 300px;
}
</style>
