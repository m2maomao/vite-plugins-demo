// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PullRefresh from '../PullRefresh.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('PullRefresh', () => {
  const global = { stubs: { VanPullRefresh: vanStubs.VanPullRefresh } };

  it('customClass 应应用', () => {
    const wrapper = mount(PullRefresh, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('loading 属性应传递', () => {
    const wrapper = mount(PullRefresh, { global, props: { loading: false } });
    const van = wrapper.findComponent({ name: 'VanPullRefresh' });
    expect(van.props('loading')).toBe(false);
  });

  it('应渲染默认插槽内容', () => {
    const wrapper = mount(PullRefresh, { global, slots: { default: '插槽内容' } });
    expect(wrapper.text()).toContain('插槽内容');
  });
});
