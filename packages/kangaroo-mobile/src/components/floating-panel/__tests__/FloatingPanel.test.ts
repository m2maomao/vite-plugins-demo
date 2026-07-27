// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FloatingPanel from '../FloatingPanel.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('FloatingPanel', () => {
  const global = { stubs: { VanFloatingPanel: vanStubs.VanFloatingPanel } };

  it('customClass 应应用', () => {
    const wrapper = mount(FloatingPanel, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('height 属性应传递', () => {
    const wrapper = mount(FloatingPanel, { global, props: { height: 100 } });
    const van = wrapper.findComponent({ name: 'VanFloatingPanel' });
    expect(van.props('height')).toBe(100);
  });

  it('应渲染默认插槽内容', () => {
    const wrapper = mount(FloatingPanel, { global, slots: { default: '插槽内容' } });
    expect(wrapper.text()).toContain('插槽内容');
  });
});
