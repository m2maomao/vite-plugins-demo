// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Rate from '../Rate.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Rate', () => {
  const global = { stubs: { VanRate: vanStubs.VanRate } };

  it('customClass 应应用', () => {
    const wrapper = mount(Rate, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('modelValue 属性应传递', () => {
    const wrapper = mount(Rate, { global, props: { modelValue: 3 } });
    const van = wrapper.findComponent({ name: 'VanRate' });
    expect(van.props('modelValue')).toBe(3);
  });
});
