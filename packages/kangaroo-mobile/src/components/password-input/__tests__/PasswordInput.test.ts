// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PasswordInput from '../PasswordInput.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('PasswordInput', () => {
  const global = { stubs: { VanPasswordInput: vanStubs.VanPasswordInput } };

  it('customClass 应应用', () => {
    const wrapper = mount(PasswordInput, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('value 属性应传递', () => {
    const wrapper = mount(PasswordInput, { global, props: { value: '123' } });
    const van = wrapper.findComponent({ name: 'VanPasswordInput' });
    expect(van.props('value')).toBe('123');
  });
});
