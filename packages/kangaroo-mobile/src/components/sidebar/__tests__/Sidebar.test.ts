// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Sidebar from '../Sidebar.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Sidebar', () => {
  const global = { stubs: { VanSidebar: vanStubs.VanSidebar } };

  it('customClass 应应用', () => {
    const wrapper = mount(Sidebar, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('modelValue 属性应传递', () => {
    const wrapper = mount(Sidebar, { global, props: { modelValue: 0 } });
    const van = wrapper.findComponent({ name: 'VanSidebar' });
    expect(van.props('modelValue')).toBe(0);
  });

  it('应渲染默认插槽内容', () => {
    const wrapper = mount(Sidebar, { global, slots: { default: '插槽内容' } });
    expect(wrapper.text()).toContain('插槽内容');
  });
});
