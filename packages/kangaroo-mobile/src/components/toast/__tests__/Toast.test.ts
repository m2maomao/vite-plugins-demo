// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Toast from '../Toast.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Toast', () => {
  const global = { stubs: { VanToast: vanStubs.VanToast } };

  it('customClass 应应用', () => {
    const wrapper = mount(Toast, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('show 属性应传递', () => {
    const wrapper = mount(Toast, { global, props: { show: true } });
    const van = wrapper.findComponent({ name: 'VanToast' });
    expect(van.props('show')).toBe(true);
  });
});
