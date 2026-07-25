// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from '../Button.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Button', () => {
  const global = { stubs: { VanButton: vanStubs.VanButton } };

  it('应渲染默认插槽内容', () => {
    const wrapper = mount(Button, { global, slots: { default: '按钮' } });
    expect(wrapper.text()).toBe('按钮');
  });

  it('type 属性应传递', () => {
    const wrapper = mount(Button, { global, props: { type: 'primary' } });
    expect(wrapper.findComponent({ name: 'VanButton' }).props('type')).toBe('primary');
  });

  it('size 属性应传递', () => {
    const wrapper = mount(Button, { global, props: { size: 'large' } });
    expect(wrapper.findComponent({ name: 'VanButton' }).props('size')).toBe('large');
  });

  it('disabled 属性应传递', () => {
    const wrapper = mount(Button, { global, props: { disabled: true } });
    expect(wrapper.findComponent({ name: 'VanButton' }).props('disabled')).toBe(true);
  });

  it('loading 属性应传递', () => {
    const wrapper = mount(Button, { global, props: { loading: true } });
    expect(wrapper.findComponent({ name: 'VanButton' }).props('loading')).toBe(true);
  });
});
