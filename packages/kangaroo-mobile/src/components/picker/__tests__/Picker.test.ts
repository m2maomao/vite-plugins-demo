// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Picker from '../Picker.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Picker', () => {
  const global = { stubs: { VanPicker: vanStubs.VanPicker } };

  it('title 属性应传递', () => {
    const wrapper = mount(Picker, { global, props: { title: '请选择' } });
    const van = wrapper.findComponent({ name: 'VanPicker' });
    expect(van.props('title')).toBe('请选择');
  });

  it('应渲染 title 插槽内容', () => {
    const wrapper = mount(Picker, { global, slots: { title: '<span class="slot-title">内容</span>' } });
    expect(wrapper.find('.slot-title').exists()).toBe(true);
  });

  it('应渲染 toolbar 插槽内容', () => {
    const wrapper = mount(Picker, { global, slots: { toolbar: '<span class="slot-toolbar">内容</span>' } });
    expect(wrapper.find('.slot-toolbar').exists()).toBe(true);
  });

  it('应渲染 columns-top 插槽内容', () => {
    const wrapper = mount(Picker, { global, slots: { 'columns-top': '<span class="slot-columns-top">内容</span>' } });
    expect(wrapper.find('.slot-columns-top').exists()).toBe(true);
  });

  it('应渲染 columns-bottom 插槽内容', () => {
    const wrapper = mount(Picker, {
      global,
      slots: { 'columns-bottom': '<span class="slot-columns-bottom">内容</span>' },
    });
    expect(wrapper.find('.slot-columns-bottom').exists()).toBe(true);
  });
});
