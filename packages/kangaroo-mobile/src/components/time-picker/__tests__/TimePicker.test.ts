// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TimePicker from '../TimePicker.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('TimePicker', () => {
  const global = { stubs: { VanTimePicker: vanStubs.VanTimePicker } };

  it('customClass 应应用', () => {
    const wrapper = mount(TimePicker, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });
});
