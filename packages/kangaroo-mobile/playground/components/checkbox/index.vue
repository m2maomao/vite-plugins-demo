<script setup lang="ts">
import { ref, reactive } from 'vue';
import VanCell from 'vant/es/cell';
import VanCellGroup from 'vant/es/cell-group';
import VanButton from 'vant/es/button';
import { useTranslate } from '@/locale/useTranslate';
import { cdnURL } from '../../site';

const t = useTranslate({
  'zh-CN': {
    checkbox: '复选框',
    customIcon: '自定义图标',
    customIconSize: '自定义大小',
    customColor: '自定义颜色',
    customShape: '自定义形状',
    leftLabel: '左侧文本',
    title3: '复选框组',
    title4: '限制最大可选数',
    title5: '搭配单元格组件使用',
    toggleAll: '全选与反选',
    checkAll: '全选',
    inverse: '反选',
    horizontal: '水平排列',
    disableLabel: '禁用文本点击',
    indeterminate: '不确定状态',
  },
  'en-US': {
    checkbox: 'Checkbox',
    customIcon: 'Custom Icon',
    customIconSize: 'Custom Icon Size',
    customColor: 'Custom Color',
    customShape: 'Custom Shape',
    leftLabel: 'Left Label',
    title3: 'Checkbox Group',
    title4: 'Maximum amount of checked options',
    title5: 'Inside a Cell',
    toggleAll: 'Toggle All',
    checkAll: 'Check All',
    inverse: 'Inverse',
    horizontal: 'Horizontal',
    disableLabel: 'Disable label click',
    indeterminate: 'indeterminate',
  },
});

const state = reactive({
  checkbox1: true,
  checkbox2: true,
  checkbox3: true,
  isCheckAll: false,
  isIndeterminate: true,
  checkboxLabel: true,
  checkboxIcon: true,
  leftLabel: false,
  list: ['a', 'b'],
  result: ['a', 'b'],
  checkboxShape: ['a', 'b'],
  result2: [],
  result3: [],
  result4: ['a', 'b', 'd'],
  checkAllResult: [],
  horizontalResult: [],
});

const list = ['a', 'b', 'c', 'd'];
const activeIcon = cdnURL('user-active.png');
const inactiveIcon = cdnURL('user-inactive.png');

const checkboxRefs: Record<number, any> = {};
const setCheckboxRef = (index: number) => (el: any) => {
  if (el) checkboxRefs[index] = el;
};
const toggle = (index: number) => {
  checkboxRefs[index]?.toggle();
};

const group = ref<any>(null);

const checkAll = () => {
  group.value?.toggleAll(true);
};

const toggleAll = () => {
  group.value?.toggleAll();
};

const checkAllChange = (val: boolean) => {
  state.result4 = val ? list : [];
  state.isIndeterminate = false;
};

const checkedResultChange = (value: string[]) => {
  const checkedCount = value.length;
  state.isCheckAll = checkedCount === list.length;
  state.isIndeterminate = checkedCount > 0 && checkedCount < list.length;
};
</script>

<template>
  <div class="demo-checkbox">
    <demo-block :title="t('basicUsage')">
      <yhm-checkbox v-model="state.checkbox1">{{ t('checkbox') }}</yhm-checkbox>
    </demo-block>

    <demo-block :title="t('disabled')">
      <yhm-checkbox :model-value="false" disabled>
        {{ t('checkbox') }}
      </yhm-checkbox>
      <yhm-checkbox :model-value="true" disabled>
        {{ t('checkbox') }}
      </yhm-checkbox>
    </demo-block>

    <demo-block :title="t('customShape')">
      <yhm-checkbox-group v-model="state.checkboxShape" shape="square">
        <yhm-checkbox name="a">{{ t('customShape') }} a</yhm-checkbox>
        <yhm-checkbox name="b">{{ t('customShape') }} b</yhm-checkbox>
      </yhm-checkbox-group>
    </demo-block>

    <demo-block :title="t('customColor')">
      <yhm-checkbox v-model="state.checkbox2" checked-color="#ee0a24">
        {{ t('customColor') }}
      </yhm-checkbox>
    </demo-block>

    <demo-block :title="t('customIconSize')">
      <yhm-checkbox v-model="state.checkboxIcon" icon-size="24px">
        {{ t('customIconSize') }}
      </yhm-checkbox>
    </demo-block>

    <demo-block :title="t('customIcon')">
      <yhm-checkbox v-model="state.checkbox3">
        {{ t('customIcon') }}
        <template #icon="{ checked }">
          <img :src="checked ? activeIcon : inactiveIcon" />
        </template>
      </yhm-checkbox>
    </demo-block>

    <demo-block :title="t('leftLabel')">
      <yhm-checkbox v-model="state.leftLabel" label-position="left">
        {{ t('leftLabel') }}
      </yhm-checkbox>
    </demo-block>

    <demo-block :title="t('disableLabel')">
      <yhm-checkbox v-model="state.checkboxLabel" label-disabled>
        {{ t('checkbox') }}
      </yhm-checkbox>
    </demo-block>

    <demo-block :title="t('title3')">
      <yhm-checkbox-group v-model="state.result">
        <yhm-checkbox name="a">{{ t('checkbox') }} a</yhm-checkbox>
        <yhm-checkbox name="b">{{ t('checkbox') }} b</yhm-checkbox>
      </yhm-checkbox-group>
    </demo-block>

    <demo-block :title="t('horizontal')">
      <yhm-checkbox-group v-model="state.horizontalResult" direction="horizontal">
        <yhm-checkbox name="a">{{ t('checkbox') }} a</yhm-checkbox>
        <yhm-checkbox name="b">{{ t('checkbox') }} b</yhm-checkbox>
      </yhm-checkbox-group>
    </demo-block>

    <demo-block :title="t('title4')">
      <yhm-checkbox-group v-model="state.result2" :max="2">
        <yhm-checkbox name="a">{{ t('checkbox') }} a</yhm-checkbox>
        <yhm-checkbox name="b">{{ t('checkbox') }} b</yhm-checkbox>
        <yhm-checkbox name="c">{{ t('checkbox') }} c</yhm-checkbox>
      </yhm-checkbox-group>
    </demo-block>

    <demo-block :title="t('toggleAll')">
      <yhm-checkbox-group v-model="state.checkAllResult" ref="group">
        <yhm-checkbox name="a">{{ t('checkbox') }} a</yhm-checkbox>
        <yhm-checkbox name="b">{{ t('checkbox') }} b</yhm-checkbox>
        <yhm-checkbox name="c">{{ t('checkbox') }} c</yhm-checkbox>
      </yhm-checkbox-group>

      <div class="demo-checkbox-buttons">
        <VanButton type="primary" @click="checkAll">
          {{ t('checkAll') }}
        </VanButton>
        <VanButton type="primary" @click="toggleAll">
          {{ t('inverse') }}
        </VanButton>
      </div>
    </demo-block>

    <demo-block :title="t('title5')">
      <yhm-checkbox-group v-model="state.result3">
        <van-cell-group inset>
          <van-cell
            v-for="(item, index) in state.list"
            clickable
            :key="index"
            :title="`${t('checkbox')} ${item}`"
            @click="toggle(index)">
            <template #right-icon>
              <yhm-checkbox :ref="setCheckboxRef(index)" :name="item" @click.stop />
            </template>
          </van-cell>
        </van-cell-group>
      </yhm-checkbox-group>
    </demo-block>

    <demo-block :title="t('indeterminate')">
      <yhm-checkbox v-model="state.isCheckAll" :indeterminate="state.isIndeterminate" @change="checkAllChange">
        {{ t('checkAll') }}
      </yhm-checkbox>
      <div class="divider" />
      <yhm-checkbox-group v-model="state.result4" @change="checkedResultChange">
        <yhm-checkbox v-for="item in list" :key="item" :name="item">{{ t('checkbox') }} {{ item }}</yhm-checkbox>
      </yhm-checkbox-group>
    </demo-block>
  </div>
</template>

<style lang="less">
.demo-checkbox {
  .van-checkbox {
    margin: 0 0 8px 20px;
  }

  .van-cell {
    .van-checkbox {
      margin: 0;
    }
  }

  img {
    height: 20px;
  }

  &-buttons {
    margin-top: var(--van-padding-md);

    .van-button {
      margin-left: var(--van-padding-md);
    }
  }

  .van-doc-demo-block__title {
    margin-top: -8px;
  }
}

.divider {
  margin: 20px;
  height: 1px;
  background: #ccc;
}
</style>
