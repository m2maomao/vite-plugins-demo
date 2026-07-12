<template>
  <div class="demo-field">
    <demo-block :title="t('basicUsage')">
      <yhm-cell-group inset>
        <van-form>
          <yhm-field v-model="text1" :label="t('label')" :placeholder="t('textPlaceholder')" />
        </van-form>
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('customType')">
      <yhm-cell-group inset>
        <van-form>
          <yhm-field v-model="text2" :label="t('text')" :placeholder="t('textPlaceholder')" autocomplete="off" />
          <yhm-field v-model="phone" type="tel" :label="t('phone')" :placeholder="t('phonePlaceholder')" />
          <yhm-field v-model="digit" type="digit" :label="t('digit')" :placeholder="t('digitPlaceholder')" />
          <yhm-field v-model="number" type="number" :label="t('number')" :placeholder="t('numberPlaceholder')" />
          <yhm-field v-model="password" type="password" :label="t('password')" :placeholder="t('passwordPlaceholder')" autocomplete="off" />
        </van-form>
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('disabled')">
      <yhm-cell-group inset>
        <yhm-field :model-value="t('inputReadonly')" :label="t('text')" readonly />
        <yhm-field :model-value="t('inputDisabled')" :label="t('text')" disabled />
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('showIcon')">
      <yhm-cell-group inset>
        <yhm-field v-model="icon1" :label="t('text')" left-icon="smile-o" right-icon="warning-o" :placeholder="t('showIcon')" />
        <yhm-field v-model="icon2" clearable :label="t('text')" left-icon="music-o" :placeholder="t('showClearIcon')" />
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('required')">
      <yhm-cell-group inset>
        <yhm-field v-model="reqName" required :label="t('username')" :placeholder="t('usernamePlaceholder')" />
        <yhm-field v-model="reqPhone" required :label="t('phone')" :placeholder="t('phonePlaceholder')" />
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('autoRequired')">
      <yhm-cell-group inset>
        <van-form required="auto">
          <van-field v-model="autoName" :rules="[{ required: true }]" :label="t('username')" :placeholder="t('usernamePlaceholder')" />
          <van-field v-model="autoPhone" :rules="[{ required: false }]" :label="t('phone')" :placeholder="t('phonePlaceholder')" />
        </van-form>
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('errorInfo')">
      <yhm-cell-group inset>
        <yhm-field v-model="errName" error :label="t('username')" :placeholder="t('usernamePlaceholder')" />
        <yhm-field v-model="errPhone" :label="t('phone')" :placeholder="t('phonePlaceholder')" :error-message="t('phoneError')" />
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('insertButton')">
      <yhm-cell-group inset>
        <yhm-field v-model="sms" center clearable :label="t('sms')" :placeholder="t('smsPlaceholder')">
          <template #button>
            <yhm-button size="small" type="primary">{{ t('sendSms') }}</yhm-button>
          </template>
        </yhm-field>
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('formatValue')">
      <yhm-cell-group inset>
        <yhm-field v-model="format1" :label="t('text')" :formatter="formatter" :placeholder="t('formatOnChange')" />
        <yhm-field v-model="format2" :label="t('text')" :formatter="formatter" format-trigger="onBlur" :placeholder="t('formatOnBlur')" />
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('autosize')">
      <yhm-cell-group inset>
        <yhm-field v-model="autoSizeVal" autosize rows="1" type="textarea" :label="t('message')" :placeholder="t('messagePlaceholder')" />
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('showWordLimit')">
      <yhm-cell-group inset>
        <yhm-field v-model="wordLimitVal" autosize show-word-limit rows="2" type="textarea" maxlength="50" :label="t('message')" :placeholder="t('messagePlaceholder')" />
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('inputAlign')">
      <yhm-cell-group inset>
        <yhm-field v-model="alignText" :label="t('text')" :placeholder="t('alignPlaceHolder')" input-align="right" />
      </yhm-cell-group>
    </demo-block>

    <demo-block :title="t('labelAlign')">
      <yhm-cell-group inset>
        <yhm-field v-model="labelAlignVal" :label="t('label')" :placeholder="t('top')" label-align="top" />
        <yhm-field v-model="labelAlignVal" :label="t('label')" :placeholder="t('left')" label-align="left" />
        <yhm-field v-model="labelAlignVal" :label="t('label')" :placeholder="t('center')" label-align="center" />
        <yhm-field v-model="labelAlignVal" :label="t('label')" :placeholder="t('right')" label-align="right" />
      </yhm-cell-group>
    </demo-block>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Form as VanForm, Field as VanField } from 'vant'
import { createTranslate } from '@/locale'

const t = createTranslate('fieldDemo')

const text1 = ref('')
const text2 = ref('')
const phone = ref('')
const digit = ref('')
const number = ref('')
const password = ref('')
const icon1 = ref('')
const icon2 = ref('123')
const reqName = ref('')
const reqPhone = ref('123')
const autoName = ref('')
const autoPhone = ref('123')
const errName = ref('')
const errPhone = ref('123')
const sms = ref('')
const format1 = ref('')
const format2 = ref('')
const autoSizeVal = ref('')
const wordLimitVal = ref('')
const alignText = ref('')
const labelAlignVal = ref('')

const formatter = (value: string) => value.replace(/\d/g, '')
</script>

<style lang="less">
.demo-field {
  // 由 yhm-cell-group inset 控制间距
}
</style>
