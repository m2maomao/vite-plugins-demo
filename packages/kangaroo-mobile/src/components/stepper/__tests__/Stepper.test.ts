// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Stepper from '../Stepper.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Stepper', () => {
  const global = { stubs: { VanStepper: vanStubs.VanStepper } };

  it('modelValue 属性应传递', () => {
    const wrapper = mount(Stepper, { global, props: { modelValue: 1 } });
    const van = wrapper.findComponent({ name: 'VanStepper' });
    expect(van.props('modelValue')).toBe(1);
  });
});
