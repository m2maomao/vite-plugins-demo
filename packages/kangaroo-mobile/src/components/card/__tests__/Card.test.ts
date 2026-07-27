// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Card from '../Card.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Card', () => {
  const global = { stubs: { VanCard: vanStubs.VanCard } };

  it('customClass 应应用', () => {
    const wrapper = mount(Card, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('title 属性应传递', () => {
    const wrapper = mount(Card, { global, props: { title: '标题' } });
    const van = wrapper.findComponent({ name: 'VanCard' });
    expect(van.props('title')).toBe('标题');
  });

  it('应渲染 thumb 插槽内容', () => {
    const wrapper = mount(Card, { global, slots: { thumb: '<span class="slot-thumb">内容</span>' } });
    expect(wrapper.find('.slot-thumb').exists()).toBe(true);
  });

  it('应渲染 title 插槽内容', () => {
    const wrapper = mount(Card, { global, slots: { title: '<span class="slot-title">内容</span>' } });
    expect(wrapper.find('.slot-title').exists()).toBe(true);
  });

  it('应渲染 price 插槽内容', () => {
    const wrapper = mount(Card, { global, slots: { price: '<span class="slot-price">内容</span>' } });
    expect(wrapper.find('.slot-price').exists()).toBe(true);
  });

  it('应渲染 num 插槽内容', () => {
    const wrapper = mount(Card, { global, slots: { num: '<span class="slot-num">内容</span>' } });
    expect(wrapper.find('.slot-num').exists()).toBe(true);
  });

  it('应渲染 bottom 插槽内容', () => {
    const wrapper = mount(Card, { global, slots: { bottom: '<span class="slot-bottom">内容</span>' } });
    expect(wrapper.find('.slot-bottom').exists()).toBe(true);
  });
});
