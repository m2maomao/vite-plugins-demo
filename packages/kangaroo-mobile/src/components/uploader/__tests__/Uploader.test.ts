// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Uploader from '../Uploader.vue';
import { vanStubs } from '../../__tests__/shared-stubs';

describe('Uploader', () => {
  const global = { stubs: { VanUploader: vanStubs.VanUploader } };

  it('customClass 应应用', () => {
    const wrapper = mount(Uploader, { global, props: { customClass: 'my-class' } });
    expect(wrapper.html()).toContain('my-class');
  });

  it('应渲染默认插槽内容', () => {
    const wrapper = mount(Uploader, { global, slots: { default: '插槽内容' } });
    expect(wrapper.text()).toContain('插槽内容');
  });
});
