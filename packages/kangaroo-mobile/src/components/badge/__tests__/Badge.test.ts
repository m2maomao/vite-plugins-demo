// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Badge from '../Badge.vue';

// 使用 stub 替换 Vant 组件，避免依赖 Vant 的 DOM 渲染
const global = {
  stubs: {
    VanBadge: {
      name: 'VanBadge',
      template: '<div class="van-badge"><slot /><slot name="content" /></div>',
      props: ['dot', 'content', 'max', 'color', 'position', 'tag', 'offset', 'showZero'],
    },
  },
};

describe('Badge', () => {
  it('应渲染默认插槽内容', () => {
    const wrapper = mount(Badge, {
      global,
      slots: { default: '通知' },
    });
    expect(wrapper.text()).toContain('通知');
  });

  it('应渲染 content 插槽内容', () => {
    const wrapper = mount(Badge, {
      global,
      slots: { content: '<span>自定义</span>' },
    });
    expect(wrapper.html()).toContain('自定义');
  });

  it('content 属性应传递到 VanBadge', () => {
    const wrapper = mount(Badge, {
      global,
      props: { content: 5 },
    });
    const vanBadge = wrapper.findComponent({ name: 'VanBadge' });
    expect(vanBadge.props('content')).toBe(5);
  });

  it('max 属性应传递到 VanBadge', () => {
    const wrapper = mount(Badge, {
      global,
      props: { content: 100, max: 99 },
    });
    const vanBadge = wrapper.findComponent({ name: 'VanBadge' });
    expect(vanBadge.props('max')).toBe(99);
  });

  it('color 属性应传递到 VanBadge', () => {
    const wrapper = mount(Badge, {
      global,
      props: { color: 'red' },
    });
    const vanBadge = wrapper.findComponent({ name: 'VanBadge' });
    expect(vanBadge.props('color')).toBe('red');
  });

  it('dot 属性应传递到 VanBadge', () => {
    const wrapper = mount(Badge, {
      global,
      props: { dot: true },
    });
    const vanBadge = wrapper.findComponent({ name: 'VanBadge' });
    expect(vanBadge.props('dot')).toBe(true);
  });

  it('showZero 默认为 true', () => {
    const wrapper = mount(Badge, {
      global,
      props: { content: 0 },
    });
    const vanBadge = wrapper.findComponent({ name: 'VanBadge' });
    expect(vanBadge.props('showZero')).toBe(true);
  });

  it('position 默认为 top-right', () => {
    const wrapper = mount(Badge, {
      global,
    });
    const vanBadge = wrapper.findComponent({ name: 'VanBadge' });
    expect(vanBadge.props('position')).toBe('top-right');
  });

  it('tag 默认为 div', () => {
    const wrapper = mount(Badge, {
      global,
    });
    const vanBadge = wrapper.findComponent({ name: 'VanBadge' });
    expect(vanBadge.props('tag')).toBe('div');
  });
});
