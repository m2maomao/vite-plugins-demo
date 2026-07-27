// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Tab from '../Tab.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Tab', () => {
  const global = { stubs: { VanTab: vanStubs.VanTab } };

  it('customClass 应应用', () => {
    const wrapper = mount(Tab, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('title 属性应传递', () => {
    const wrapper = mount(Tab, { global, props: { title: '标签' } });
    const van = wrapper.findComponent({ name: 'VanTab' });
    expect(van.props('title')).toBe('标签');
  });

  it('应渲染默认插槽内容', () => {
    const wrapper = mount(Tab, { global, slots: { default: '插槽内容' } });
    expect(wrapper.text()).toContain('插槽内容');
  });
});
