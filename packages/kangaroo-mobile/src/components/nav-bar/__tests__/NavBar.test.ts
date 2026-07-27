// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import NavBar from '../NavBar.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('NavBar', () => {
  const global = { stubs: { VanNavBar: vanStubs.VanNavBar, YhmIcon: { template: '<i class="yhm-icon" />' } } };

  it('leftText 属性应传递', () => {
    const wrapper = mount(NavBar, { global, props: { leftText: '返回' } });
    const van = wrapper.findComponent({ name: 'VanNavBar' });
    expect(van.props('leftText')).toBe('返回');
  });

  it('fixed 属性应传递', () => {
    const wrapper = mount(NavBar, { global, props: { fixed: true } });
    const van = wrapper.findComponent({ name: 'VanNavBar' });
    expect(van.props('fixed')).toBe(true);
  });

  it('应触发 click-left 事件', async () => {
    const wrapper = mount(NavBar, { global });
    const van = wrapper.findComponent({ name: 'VanNavBar' });
    van.vm.$emit('click-left');
    expect(wrapper.emitted('click-left')).toBeTruthy();
  });
});
