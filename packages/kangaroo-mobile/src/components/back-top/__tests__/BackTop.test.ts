// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BackTop from '../BackTop.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('BackTop', () => {
  const global = { stubs: { VanBackTop: vanStubs.VanBackTop } };

  it('customClass 应应用', () => {
    const wrapper = mount(BackTop, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('应渲染默认插槽内容', () => {
    const wrapper = mount(BackTop, { global, slots: { default: '插槽内容' } });
    expect(wrapper.text()).toContain('插槽内容');
  });
});
