// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import IndexAnchor from '../IndexAnchor.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('IndexAnchor', () => {
  const global = { stubs: { VanIndexAnchor: vanStubs.VanIndexAnchor } };

  it('customClass 应应用', () => {
    const wrapper = mount(IndexAnchor, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('index 属性应传递', () => {
    const wrapper = mount(IndexAnchor, { global, props: { index: 'A' } });
    const van = wrapper.findComponent({ name: 'VanIndexAnchor' });
    expect(van.props('index')).toBe('A');
  });

  it('应渲染默认插槽内容', () => {
    const wrapper = mount(IndexAnchor, { global, slots: { default: '插槽内容' } });
    expect(wrapper.text()).toContain('插槽内容');
  });
});
