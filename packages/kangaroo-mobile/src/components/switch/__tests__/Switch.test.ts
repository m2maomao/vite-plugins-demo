// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Switch from '../Switch.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Switch', () => {
  const global = { stubs: { VanSwitch: vanStubs.VanSwitch } };

  it('modelValue 属性应传递', () => {
    const wrapper = mount(Switch, { global, props: { modelValue: true } });
    const van = wrapper.findComponent({ name: 'VanSwitch' });
    expect(van.props('modelValue')).toBe(true);
  });
});
