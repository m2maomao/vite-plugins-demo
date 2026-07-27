// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Calendar from '../Calendar.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Calendar', () => {
  const global = { stubs: { VanCalendar: vanStubs.VanCalendar } };

  it('customClass 应应用', () => {
    const wrapper = mount(Calendar, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('show 属性应传递', () => {
    const wrapper = mount(Calendar, { global, props: { show: true } });
    const van = wrapper.findComponent({ name: 'VanCalendar' });
    expect(van.props('show')).toBe(true);
  });
});
