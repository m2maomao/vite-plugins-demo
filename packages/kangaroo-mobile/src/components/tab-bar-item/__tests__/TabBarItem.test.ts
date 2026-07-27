// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TabBarItem from '../TabBarItem.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('TabBarItem', () => {
  const global = { stubs: { VanTabbarItem: vanStubs.VanTabbarItem } };

  it('name 属性应传递', () => {
    const wrapper = mount(TabBarItem, { global, props: { name: 'home' } });
    const van = wrapper.findComponent({ name: 'VanTabbarItem' });
    expect(van.props('name')).toBe('home');
  });
});
