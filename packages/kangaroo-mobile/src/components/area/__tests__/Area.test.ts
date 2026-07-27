// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Area from '../Area.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Area', () => {
  const global = { stubs: { VanArea: vanStubs.VanArea } };

  it('customClass 应应用', () => {
    const wrapper = mount(Area, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });
});
