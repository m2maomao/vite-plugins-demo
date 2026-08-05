import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  shouldEnableVConsole,
  hasUrlFlag,
  initVConsole,
  destroyVConsole,
  default as createVConsolePlugin,
} from '../vconsole-plugin';
import type { VConsoleConfig } from '../../../src/build/types';

// ============================================
// Mock vconsole 模块（动态 import('vconsole')）
// ============================================

const mocks = vi.hoisted(() => ({
  VConsole: vi.fn(function (this: Record<string, unknown>, _options?: unknown) {
    // 必须使用 function 构造器，vitest 才能支持 new Mock()
    this.show = vi.fn();
    this.hide = vi.fn();
    this.destroy = vi.fn();
  }),
}));

vi.mock('vconsole', () => ({
  default: mocks.VConsole,
}));

// ============================================
// 工具：控制 window.location.search
// ============================================

function stubSearch(search: string) {
  vi.stubGlobal('window', { location: { search } });
}

function unstubWindow() {
  vi.unstubAllGlobals();
}

// ============================================
// shouldEnableVConsole — 启用判断
// ============================================

describe('shouldEnableVConsole', () => {
  it('默认 auto + dev 环境 → 启用', () => {
    expect(shouldEnableVConsole(undefined, true)).toBe(true);
    expect(shouldEnableVConsole({}, true)).toBe(true);
  });

  it('默认 auto + 生产环境（无 URL 参数）→ 不启用', () => {
    expect(shouldEnableVConsole(undefined, false)).toBe(false);
  });

  it('enabled: always + 生产环境 → 启用', () => {
    expect(shouldEnableVConsole({ enabled: 'always' }, false)).toBe(true);
  });

  it('enabled: true 等价于 always → 启用', () => {
    expect(shouldEnableVConsole({ enabled: true }, false)).toBe(true);
  });

  it('enabled: off + dev 环境 → 不启用', () => {
    expect(shouldEnableVConsole({ enabled: 'off' }, true)).toBe(false);
  });

  it('enabled: false 等价于 off → 不启用', () => {
    expect(shouldEnableVConsole({ enabled: false }, true)).toBe(false);
  });

  it('auto + 生产环境 + URL 参数 vconsole=1 → 启用', () => {
    stubSearch('?vconsole=1');
    expect(shouldEnableVConsole({ enabled: 'auto' }, false)).toBe(true);
  });

  it('urlToggle: false 时 URL 参数不生效', () => {
    stubSearch('?vconsole=1');
    expect(shouldEnableVConsole({ enabled: 'auto', urlToggle: false }, false)).toBe(false);
  });
});

// ============================================
// hasUrlFlag — URL 参数判断
// ============================================

describe('hasUrlFlag', () => {
  afterEach(() => {
    unstubWindow();
  });

  it('?vconsole=1 → true', () => {
    stubSearch('?vconsole=1');
    expect(hasUrlFlag()).toBe(true);
  });

  it('?vconsole=true → true', () => {
    stubSearch('?vconsole=true');
    expect(hasUrlFlag()).toBe(true);
  });

  it('无值 ?vconsole → true', () => {
    stubSearch('?vconsole');
    expect(hasUrlFlag()).toBe(true);
  });

  it('?foo=bar（无 vconsole 参数）→ false', () => {
    stubSearch('?foo=bar');
    expect(hasUrlFlag()).toBe(false);
  });

  it('无 URL → false', () => {
    stubSearch('');
    expect(hasUrlFlag()).toBe(false);
  });

  it('支持自定义 urlParam', () => {
    stubSearch('?debug=1');
    expect(hasUrlFlag({ urlParam: 'debug' })).toBe(true);
  });

  it('urlToggle: false 时不生效', () => {
    stubSearch('?vconsole=1');
    expect(hasUrlFlag({ urlToggle: false })).toBe(false);
  });
});

// ============================================
// initVConsole / destroyVConsole — 初始化管理
// ============================================

describe('initVConsole', () => {
  beforeEach(() => {
    destroyVConsole();
    delete (window as any).__DEER_VCONSOLE__;
    mocks.VConsole.mockClear();
  });

  it('应动态加载 vconsole 并暴露全局手动开关 API', async () => {
    await initVConsole({ enabled: 'always' });

    expect(mocks.VConsole).toHaveBeenCalledTimes(1);
    const api = (window as any).__DEER_VCONSOLE__;
    expect(api).toBeDefined();
    expect(typeof api.show).toBe('function');
    expect(typeof api.hide).toBe('function');
    expect(typeof api.destroy).toBe('function');
  });

  it('应将 options 透传给 VConsole 构造器', async () => {
    const options = { theme: 'dark', maxLogNumber: 1000 };
    await initVConsole({ enabled: 'always', options });

    expect(mocks.VConsole).toHaveBeenCalledWith(options);
  });

  it('重复初始化应幂等（只创建一次实例）', async () => {
    await initVConsole();
    await initVConsole();
    await initVConsole();

    expect(mocks.VConsole).toHaveBeenCalledTimes(1);
  });

  it('destroy 应销毁实例并清理全局 API', async () => {
    await initVConsole();
    const instance = mocks.VConsole.mock.results[0].value;
    expect((window as any).__DEER_VCONSOLE__).toBeDefined();

    (window as any).__DEER_VCONSOLE__.destroy();

    expect(instance.destroy).toHaveBeenCalledTimes(1);
    expect((window as any).__DEER_VCONSOLE__).toBeUndefined();
  });
});

// ============================================
// createVConsolePlugin — 插件集成
// ============================================

describe('createVConsolePlugin', () => {
  beforeEach(() => {
    destroyVConsole();
    delete (window as any).__DEER_VCONSOLE__;
    mocks.VConsole.mockClear();
  });

  function makeCtx(config: VConsoleConfig | undefined) {
    return { config: { ...(config ? { vconsole: config } : {}) } } as any;
  }

  it('返回 deer:vconsole 插件', () => {
    const plugin = createVConsolePlugin();
    expect(plugin.name).toBe('deer:vconsole');
    expect(typeof plugin.onMounted).toBe('function');
  });

  it('enabled: always 时 onMounted 应初始化 vConsole', async () => {
    const plugin = createVConsolePlugin();
    await (plugin.onMounted as any)(makeCtx({ enabled: 'always' }));

    // 等待异步动态 import
    await vi.waitFor(() => {
      expect(mocks.VConsole).toHaveBeenCalledTimes(1);
    });
    expect((window as any).__DEER_VCONSOLE__).toBeDefined();
  });

  it('enabled: off 时 onMounted 不应初始化 vConsole', async () => {
    const plugin = createVConsolePlugin();
    await (plugin.onMounted as any)(makeCtx({ enabled: 'off' }));

    await Promise.resolve();
    expect(mocks.VConsole).not.toHaveBeenCalled();
    expect((window as any).__DEER_VCONSOLE__).toBeUndefined();
  });

  it('生产环境（非 dev）未配置且无 URL 参数时不初始化', async () => {
    const plugin = createVConsolePlugin();
    await (plugin.onMounted as any)(makeCtx(undefined));

    await Promise.resolve();
    expect(mocks.VConsole).not.toHaveBeenCalled();
  });
});
