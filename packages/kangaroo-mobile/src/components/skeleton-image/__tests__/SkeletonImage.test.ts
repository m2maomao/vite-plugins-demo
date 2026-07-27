// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SkeletonImage from '../SkeletonImage.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('SkeletonImage', () => {
  const global = { stubs: { VanSkeletonImage: vanStubs.VanSkeletonImage } };

  it('customClass 应应用', () => {
    const wrapper = mount(SkeletonImage, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });
});
