// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CollapseItem from '../CollapseItem.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('CollapseItem', () => {
  const global = { stubs: { VanCollapseItem: vanStubs.VanCollapseItem } };

  it('customClass 应应用', () => {
    const wrapper = mount(CollapseItem, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('title 属性应传递', () => {
    const wrapper = mount(CollapseItem, { global, props: { title: '标题' } });
    const van = wrapper.findComponent({ name: 'VanCollapseItem' });
    expect(van.props('title')).toBe('标题');
  });

  it('应渲染默认插槽内容', () => {
    const wrapper = mount(CollapseItem, { global, slots: { default: '插槽内容' } });
    expect(wrapper.text()).toContain('插槽内容');
  });
});
