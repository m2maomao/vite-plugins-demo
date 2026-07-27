// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Image from '../Image.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Image', () => {
  const global = { stubs: { VanImage: vanStubs.VanImage } };

  it('customClass 应应用', () => {
    const wrapper = mount(Image, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('src 属性应传递', () => {
    const wrapper = mount(Image, { global, props: { src: 'https://example.com/img.png' } });
    const van = wrapper.findComponent({ name: 'VanImage' });
    expect(van.props('src')).toBe('https://example.com/img.png');
  });
});
