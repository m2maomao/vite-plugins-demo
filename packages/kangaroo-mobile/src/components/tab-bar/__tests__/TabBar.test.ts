// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TabBar from '../TabBar.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('TabBar', () => {
  const global = { stubs: { VanTabbar: vanStubs.VanTabbar } };

  it('modelValue 属性应传递', () => {
    const wrapper = mount(TabBar, { global, props: { modelValue: 0 } });
    const van = wrapper.findComponent({ name: 'VanTabbar' });
    expect(van.props('modelValue')).toBe(0);
  });
});
