// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import CountDown from '../CountDown.vue';

const global = {
  stubs: {
    VanCountDown: {
      name: 'VanCountDown',
      template: '<div class="van-count-down">{{ time }}</div>',
      props: ['time', 'format', 'autoStart', 'millisecond'],
      methods: {
        start: vi.fn(),
        pause: vi.fn(),
        reset: vi.fn(),
      },
    },
  },
};

describe('CountDown', () => {
  it('应渲染倒计时内容', () => {
    const wrapper = mount(CountDown, {
      global,
      props: { time: 60000 },
    });
    expect(wrapper.find('.van-count-down').exists()).toBe(true);
  });

  it('time 属性应传递到 VanCountDown', () => {
    const wrapper = mount(CountDown, {
      global,
      props: { time: 60000 },
    });
    const van = wrapper.findComponent({ name: 'VanCountDown' });
    expect(van.props('time')).toBe(60000);
  });

  it('format 属性应传递到 VanCountDown', () => {
    const wrapper = mount(CountDown, {
      global,
      props: { time: 60000, format: 'mm:ss' },
    });
    const van = wrapper.findComponent({ name: 'VanCountDown' });
    expect(van.props('format')).toBe('mm:ss');
  });

  it('autoStart 默认为 true', () => {
    const wrapper = mount(CountDown, {
      global,
      props: { time: 60000 },
    });
    const van = wrapper.findComponent({ name: 'VanCountDown' });
    expect(van.props('autoStart')).toBe(true);
  });

  it('customClass 应应用到组件 class', () => {
    const wrapper = mount(CountDown, {
      global,
      props: { time: 60000, customClass: 'my-class' },
    });
    expect(wrapper.find('.yhm-count-down.my-class').exists()).toBe(true);
  });

  it('应传递 change 事件', async () => {
    const wrapper = mount(CountDown, {
      global,
      props: { time: 60000 },
    });
    const van = wrapper.findComponent({ name: 'VanCountDown' });
    const payload = { total: 59000, days: 0, hours: 0, minutes: 0, seconds: 59, milliseconds: 0 };
    van.vm.$emit('change', payload);
    expect(wrapper.emitted('change')?.[0]).toEqual([payload]);
  });

  it('应传递 finish 事件', async () => {
    const wrapper = mount(CountDown, {
      global,
      props: { time: 100 },
    });
    const van = wrapper.findComponent({ name: 'VanCountDown' });
    van.vm.$emit('finish');
    expect(wrapper.emitted('finish')).toBeTruthy();
  });
});
