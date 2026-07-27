// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Popup from '../Popup.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Popup', () => {
  const global = { stubs: { VanPopup: vanStubs.VanPopup } };

  it('customClass 应应用', () => {
    const wrapper = mount(Popup, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('show 属性应传递', () => {
    const wrapper = mount(Popup, { global, props: { show: true } });
    const van = wrapper.findComponent({ name: 'VanPopup' });
    expect(van.props('show')).toBe(true);
  });

  it('应渲染默认插槽内容', () => {
    const wrapper = mount(Popup, { global, slots: { default: '插槽内容' } });
    expect(wrapper.text()).toContain('插槽内容');
  });
});
