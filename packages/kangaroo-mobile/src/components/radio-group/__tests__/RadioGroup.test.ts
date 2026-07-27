// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import RadioGroup from '../RadioGroup.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('RadioGroup', () => {
  const global = { stubs: { VanRadioGroup: vanStubs.VanRadioGroup } };

  it('应渲染默认插槽内容', () => {
    const wrapper = mount(RadioGroup, { global, slots: { default: '插槽内容' } });
    expect(wrapper.text()).toContain('插槽内容');
  });
});
