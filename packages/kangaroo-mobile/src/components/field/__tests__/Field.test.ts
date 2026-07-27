// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Field from '../Field.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Field', () => {
  const global = { stubs: { VanField: vanStubs.VanField, YhmIcon: { template: "<i class='yhm-icon' />" } } };

  it('customClass 应应用', () => {
    const wrapper = mount(Field, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('label 属性应传递', () => {
    const wrapper = mount(Field, { global, props: { label: '字段' } });
    const van = wrapper.findComponent({ name: 'VanField' });
    expect(van.props('label')).toBe('字段');
  });

  it('placeholder 属性应传递', () => {
    const wrapper = mount(Field, { global, props: { placeholder: '请输入' } });
    const van = wrapper.findComponent({ name: 'VanField' });
    expect(van.props('placeholder')).toBe('请输入');
  });
});
