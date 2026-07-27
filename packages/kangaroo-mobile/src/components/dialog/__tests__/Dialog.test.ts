// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Dialog from '../Dialog.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Dialog', () => {
  const global = { stubs: { VanDialog: vanStubs.VanDialog } };

  it('customClass 应应用', () => {
    const wrapper = mount(Dialog, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('show 属性应传递', () => {
    const wrapper = mount(Dialog, { global, props: { show: true } });
    const van = wrapper.findComponent({ name: 'VanDialog' });
    expect(van.props('show')).toBe(true);
  });

  it('title 属性应传递', () => {
    const wrapper = mount(Dialog, { global, props: { title: '提示' } });
    const van = wrapper.findComponent({ name: 'VanDialog' });
    expect(van.props('title')).toBe('提示');
  });

  it('应渲染默认插槽内容', () => {
    const wrapper = mount(Dialog, { global, slots: { default: '插槽内容' } });
    expect(wrapper.text()).toContain('插槽内容');
  });
});
