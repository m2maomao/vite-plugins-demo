// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Empty from '../Empty.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Empty', () => {
  const global = { stubs: { VanEmpty: vanStubs.VanEmpty } };

  it('customClass 应应用', () => {
    const wrapper = mount(Empty, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('description 属性应传递', () => {
    const wrapper = mount(Empty, { global, props: { description: '暂无数据' } });
    const van = wrapper.findComponent({ name: 'VanEmpty' });
    expect(van.props('description')).toBe('暂无数据');
  });

  it('应渲染默认插槽内容', () => {
    const wrapper = mount(Empty, { global, slots: { default: '插槽内容' } });
    expect(wrapper.text()).toContain('插槽内容');
  });
});
