// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Watermark from '../Watermark.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Watermark', () => {
  const global = { stubs: { VanWatermark: vanStubs.VanWatermark } };

  it('customClass 应应用', () => {
    const wrapper = mount(Watermark, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('content 属性应传递', () => {
    const wrapper = mount(Watermark, { global, props: { content: '水印' } });
    const van = wrapper.findComponent({ name: 'VanWatermark' });
    expect(van.props('content')).toBe('水印');
  });
});
