// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ImagePreview from '../ImagePreview.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('ImagePreview', () => {
  const global = { stubs: { VanImagePreview: vanStubs.VanImagePreview } };

  it('show 属性应传递', () => {
    const wrapper = mount(ImagePreview, { global, props: { show: true } });
    const van = wrapper.findComponent({ name: 'VanImagePreview' });
    expect(van.props('show')).toBe(true);
  });
});
