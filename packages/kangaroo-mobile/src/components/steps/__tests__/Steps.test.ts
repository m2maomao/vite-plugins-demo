// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Steps from '../Steps.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Steps', () => {
  const global = { stubs: { VanSteps: vanStubs.VanSteps } };

  it('customClass 应应用', () => {
    const wrapper = mount(Steps, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('active 属性应传递', () => {
    const wrapper = mount(Steps, { global, props: { active: 1 } });
    const van = wrapper.findComponent({ name: 'VanSteps' });
    expect(van.props('active')).toBe(1);
  });
});
