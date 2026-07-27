// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import IndexBar from '../IndexBar.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('IndexBar', () => {
  const global = { stubs: { VanIndexBar: vanStubs.VanIndexBar } };

  it('customClass 应应用', () => {
    const wrapper = mount(IndexBar, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('应渲染默认插槽内容', () => {
    const wrapper = mount(IndexBar, { global, slots: { default: '插槽内容' } });
    expect(wrapper.text()).toContain('插槽内容');
  });
});
