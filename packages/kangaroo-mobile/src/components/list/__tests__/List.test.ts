// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import List from '../List.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('List', () => {
  const global = { stubs: { VanList: vanStubs.VanList } };

  it('customClass 应应用', () => {
    const wrapper = mount(List, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('loading 属性应传递', () => {
    const wrapper = mount(List, { global, props: { loading: false } });
    const van = wrapper.findComponent({ name: 'VanList' });
    expect(van.props('loading')).toBe(false);
  });

  it('应渲染默认插槽内容', () => {
    const wrapper = mount(List, { global, slots: { default: '插槽内容' } });
    expect(wrapper.text()).toContain('插槽内容');
  });
});
