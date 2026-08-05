/**
 * Deer Mobile — VConsole Plugin
 *
 * 移动端调试面板 vConsole 运行时插件。
 *
 * 启用策略（通过 appConfig.vconsole 配置）：
 *   - 'auto'（默认）：dev 环境自动启用；生产环境可通过 URL 参数强制打开
 *   - 'always'：任何环境都启用（适合测试包 / 预发体验包）
 *   - 'off'：完全禁用（URL 参数也不生效）
 *   - true  ：等价于 'always'
 *   - false ：等价于 'off'
 *
 * URL 参数开关（默认 'vconsole'）：
 *   /index.html?vconsole=1  或  /index.html?vconsole=true  强制打开
 *   可用 appConfig.vconsole.urlParam 自定义参数名。
 *
 * 全局手动 API：
 *   window.__DEER_VCONSOLE__ = { show, hide, destroy }
 *
 * 实现说明：
 *   使用动态 import('vconsole') 按需加载。
 *   dev 环境通过 import.meta.env.DEV 静态替换实现 tree-shaking，
 *   生产环境默认不打包 vconsole，仅在 URL 参数触发时按需加载，对线上零影响。
 *
 * 配置方式：
 *   deer({
 *     config: {
 *       vconsole: {
 *         enabled: 'auto',          // 'auto' | 'always' | 'off' | boolean
 *         urlParam: 'vconsole',     // URL 参数名
 *         options: {                // 透传给 VConsole 构造器
 *           theme: 'dark',
 *           maxLogNumber: 1000,
 *         },
 *       },
 *     },
 *   })
 */

import type { RuntimePlugin, RuntimeContext } from '../../src/runtime/types';
import type { VConsoleConfig } from '../../src/build/types';

// ============================================
// 工具：环境 / URL 判断
// ============================================

/** 是否为 dev 环境（vite 构建期静态替换，生产为 false 可被 tree-shake） */
function isDev(): boolean {
  return typeof import.meta !== 'undefined' && (import.meta as any)?.env?.DEV === true;
}

/** 归一化启用模式 */
function resolveMode(config?: VConsoleConfig): 'auto' | 'always' | 'off' {
  const enabled = config?.enabled;
  if (enabled === true) return 'always';
  if (enabled === false) return 'off';
  if (enabled === 'always' || enabled === 'off' || enabled === 'auto') return enabled;
  return 'auto';
}

/** 是否命中 URL 参数（如 ?vconsole=1） */
export function hasUrlFlag(config?: VConsoleConfig): boolean {
  if (typeof window === 'undefined' || typeof window.location === 'undefined') return false;
  if (config?.urlToggle === false) return false;

  const param = config?.urlParam ?? 'vconsole';
  const value = new URLSearchParams(window.location.search).get(param);
  if (value === null) return false;
  // 无值（?vconsole）或 1/true/yes 均视为打开
  return value === '' || value === '1' || value === 'true' || value === 'yes';
}

/** 综合判断是否应启用 vConsole */
export function shouldEnableVConsole(config?: VConsoleConfig, dev: boolean = isDev()): boolean {
  const mode = resolveMode(config);
  if (mode === 'off') return false;
  if (mode === 'always') return true;
  // auto：dev 自动；生产按 URL 参数按需打开
  if (dev) return true;
  return hasUrlFlag(config);
}

// ============================================
// 单例管理
// ============================================

let instance: { show(): void; hide(): void; destroy(): void } | null = null;

/** 初始化 vConsole（幂等） */
export async function initVConsole(config?: VConsoleConfig): Promise<void> {
  if (typeof window === 'undefined') return;
  if (instance) return;

  try {
    const mod: any = await import('vconsole');
    const VConsoleCtor = (mod?.default ?? mod) as new (options?: unknown) => {
      show(): void;
      hide(): void;
      destroy(): void;
    };
    instance = new VConsoleCtor(config?.options ?? {});

    // 暴露全局手动开关 API
    (window as any).__DEER_VCONSOLE__ = {
      show: () => instance?.show(),
      hide: () => instance?.hide(),
      destroy: () => {
        instance?.destroy();
        instance = null;
        delete (window as any).__DEER_VCONSOLE__;
      },
    };
  } catch (err) {
    console.warn('[Deer:vConsole] 初始化失败:', err);
  }
}

/** 销毁 vConsole 实例（测试/手动管理用） */
export function destroyVConsole(): void {
  instance?.destroy();
  instance = null;
  if (typeof window !== 'undefined') {
    delete (window as any).__DEER_VCONSOLE__;
  }
}

// ============================================
// 插件
// ============================================

/**
 * 创建 vConsole RuntimePlugin。
 *
 * 自动注册为内置插件（由 code-gen.ts 注入），用户无需手动注册。
 * 通过 appConfig.vconsole 配置启用策略与透传选项。
 */
export default function createVConsolePlugin(): RuntimePlugin {
  return {
    name: 'deer:vconsole',
    priority: 20,

    onMounted(ctx: RuntimeContext) {
      const config = ctx.config?.vconsole;
      if (!shouldEnableVConsole(config)) return;
      void initVConsole(config);
    },
  };
}

/** 预构建的插件实例（便于用户手动 use 或关闭内置默认后自行注册） */
export const vconsoleRuntimePlugin: RuntimePlugin = createVConsolePlugin();
