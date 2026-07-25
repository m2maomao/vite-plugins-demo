// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Cell from '../Cell.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Cell', () => {
  const global = {
    stubs: {
      VanCell: vanStubs.VanCell,
      YhmIcon: { template: '<i class="yhm-icon" />' },
    },
  };

  it('title 属性应传递', () => {
    const wrapper = mount(Cell, { global, props: { title: '标题' } });
    expect(wrapper.findComponent({ name: 'VanCell' }).props('title')).toBe('标题');
  });

  it('value 属性应传递', () => {
    const wrapper = mount(Cell, { global, props: { value: '值' } });
    expect(wrapper.findComponent({ name: 'VanCell' }).props('value')).toBe('值');
  });

  it('is-link 属性应传递', () => {
    const wrapper = mount(Cell, { global, props: { isLink: true } });
    expect(wrapper.findComponent({ name: 'VanCell' }).props('isLink')).toBe(true);
  });

  it('label 属性应传递', () => {
    const wrapper = mount(Cell, { global, props: { label: '说明' } });
    expect(wrapper.findComponent({ name: 'VanCell' }).props('label')).toBe('说明');
  });
});
