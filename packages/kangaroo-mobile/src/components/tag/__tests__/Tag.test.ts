// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Tag from '../Tag.vue';

const global = {
  stubs: {
    VanTag: {
      name: 'VanTag',
      template: '<span class="van-tag"><slot /></span>',
    },
  },
};

describe('Tag', () => {
  it('应渲染默认插槽内容', () => {
    const wrapper = mount(Tag, {
      global,
      slots: { default: '标签' },
    });
    expect(wrapper.text()).toBe('标签');
  });

  it('应传递 $attrs 到 VanTag', () => {
    const wrapper = mount(Tag, {
      global,
      attrs: { type: 'primary', size: 'large' },
      slots: { default: '标签' },
    });
    const vanTag = wrapper.findComponent({ name: 'VanTag' });
    expect(vanTag.attributes('type')).toBe('primary');
    expect(vanTag.attributes('size')).toBe('large');
  });

  it('组件名称应为 YhmTag', () => {
    const wrapper = mount(Tag, { global });
    expect(wrapper.findComponent({ name: 'YhmTag' }).exists()).toBe(true);
  });
});
