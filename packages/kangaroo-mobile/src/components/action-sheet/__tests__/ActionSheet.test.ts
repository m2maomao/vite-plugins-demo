// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ActionSheet from '../ActionSheet.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('ActionSheet', () => {
  const global = { stubs: { VanActionSheet: vanStubs.VanActionSheet } };

  it('customClass 应应用', () => {
    const wrapper = mount(ActionSheet, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('show 属性应传递', () => {
    const wrapper = mount(ActionSheet, { global, props: { show: true } });
    const van = wrapper.findComponent({ name: 'VanActionSheet' });
    expect(van.props('show')).toBe(true);
  });

  it('应渲染默认插槽内容', () => {
    const wrapper = mount(ActionSheet, { global, slots: { default: '插槽内容' } });
    expect(wrapper.text()).toContain('插槽内容');
  });
});
