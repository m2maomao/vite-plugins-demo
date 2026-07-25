// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Loading from '../Loading.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Loading', () => {
  const global = { stubs: { VanLoading: vanStubs.VanLoading } };

  it('type 属性应传递', () => {
    const wrapper = mount(Loading, { global, props: { type: 'spinner' } });
    expect(wrapper.findComponent({ name: 'VanLoading' }).props('type')).toBe('spinner');
  });

  it('color 属性应传递', () => {
    const wrapper = mount(Loading, { global, props: { color: 'red' } });
    expect(wrapper.findComponent({ name: 'VanLoading' }).props('color')).toBe('red');
  });

  it('size 属性应传递', () => {
    const wrapper = mount(Loading, { global, props: { size: '24px' } });
    expect(wrapper.findComponent({ name: 'VanLoading' }).props('size')).toBe('24px');
  });

  it('vertical 属性应传递', () => {
    const wrapper = mount(Loading, { global, props: { vertical: true } });
    expect(wrapper.findComponent({ name: 'VanLoading' }).props('vertical')).toBe(true);
  });

  it('text 属性应显示文字', () => {
    const wrapper = mount(Loading, { global, props: { text: '加载中' } });
    expect(wrapper.text()).toContain('加载中');
  });
});
