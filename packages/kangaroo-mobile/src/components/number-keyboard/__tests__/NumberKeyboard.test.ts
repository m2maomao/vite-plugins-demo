// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import NumberKeyboard from '../NumberKeyboard.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('NumberKeyboard', () => {
  const global = { stubs: { VanNumberKeyboard: vanStubs.VanNumberKeyboard } };

  it('customClass 应应用', () => {
    const wrapper = mount(NumberKeyboard, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('show 属性应传递', () => {
    const wrapper = mount(NumberKeyboard, { global, props: { show: true } });
    const van = wrapper.findComponent({ name: 'VanNumberKeyboard' });
    expect(van.props('show')).toBe(true);
  });
});
