// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SkeletonParagraph from '../SkeletonParagraph.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('SkeletonParagraph', () => {
  const global = { stubs: { VanSkeletonParagraph: vanStubs.VanSkeletonParagraph } };

  it('customClass 应应用', () => {
    const wrapper = mount(SkeletonParagraph, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });
});
