/**
 * 共享的 Vant 组件 Stubs
 * 在组件测试中使用，避免依赖 Vant 的 DOM 渲染。
 */
export const vanStubs = {
  VanBadge: {
    name: 'VanBadge',
    template: '<div class="van-badge"><slot /><slot name="content" /></div>',
    props: ['dot', 'content', 'max', 'color', 'position', 'tag', 'offset', 'showZero'],
  },
  VanButton: {
    name: 'VanButton',
    template: '<button class="van-button"><slot /></button>',
    props: ['type', 'size', 'color', 'plain', 'block', 'round', 'disabled', 'loading', 'native-type'],
  },
  VanCell: {
    name: 'VanCell',
    template:
      '<div class="van-cell"><slot /><slot name="title" /><slot name="label" /><slot name="value" /><slot name="icon" /></div>',
    props: ['title', 'value', 'label', 'icon', 'size', 'is-link', 'required', 'border', 'center'],
  },
  VanCellGroup: {
    name: 'VanCellGroup',
    template: '<div class="van-cell-group"><slot /></div>',
    props: ['title', 'border'],
  },
  VanCountDown: {
    name: 'VanCountDown',
    template: '<div class="van-count-down" />',
    props: ['time', 'format', 'autoStart', 'millisecond'],
  },
  VanIcon: {
    name: 'VanIcon',
    template: '<i class="van-icon"><slot /></i>',
    props: ['name', 'dot', 'badge', 'size', 'color', 'class-prefix'],
  },
  VanLoading: {
    name: 'VanLoading',
    template: '<div class="van-loading"><slot /></div>',
    props: ['type', 'color', 'size', 'text-size', 'vertical', 'text-color'],
  },
  VanRate: {
    name: 'VanRate',
    template: '<div class="van-rate" />',
    props: [
      'modelValue',
      'count',
      'size',
      'color',
      'void-color',
      'icon',
      'void-icon',
      'allow-half',
      'readonly',
      'disabled',
    ],
  },
  VanSwitch: {
    name: 'VanSwitch',
    template: '<div class="van-switch" @click="$emit(\'update:modelValue\', !$attrs.modelValue)" />',
    props: ['modelValue', 'loading', 'disabled', 'size', 'active-color', 'inactive-color'],
  },
  VanTag: { name: 'VanTag', template: '<span class="van-tag"><slot /></span>' },
};
