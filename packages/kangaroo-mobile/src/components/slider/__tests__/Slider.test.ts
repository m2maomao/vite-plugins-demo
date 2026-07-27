// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Slider from '../Slider.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Slider', () => {
  const global = { stubs: { VanSlider: vanStubs.VanSlider } };

  it('customClass 应应用', () => {
    const wrapper = mount(Slider, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('modelValue 属性应传递', () => {
    const wrapper = mount(Slider, { global, props: { modelValue: 50 } });
    const van = wrapper.findComponent({ name: 'VanSlider' });
    expect(van.props('modelValue')).toBe(50);
  });
});
