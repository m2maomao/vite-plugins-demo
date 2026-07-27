// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Tabs from '../Tabs.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Tabs', () => {
  const global = { stubs: { VanTabs: vanStubs.VanTabs } };

  it('customClass 应应用', () => {
    const wrapper = mount(Tabs, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('active 属性应传递', () => {
    const wrapper = mount(Tabs, { global, props: { active: 0 } });
    const van = wrapper.findComponent({ name: 'VanTabs' });
    expect(van.props('active')).toBe(0);
  });
});
