// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Search from '../Search.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Search', () => {
  const global = { stubs: { VanSearch: vanStubs.VanSearch } };

  it('customClass 应应用', () => {
    const wrapper = mount(Search, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('placeholder 属性应传递', () => {
    const wrapper = mount(Search, { global, props: { placeholder: '搜索' } });
    const van = wrapper.findComponent({ name: 'VanSearch' });
    expect(van.props('placeholder')).toBe('搜索');
  });
});
