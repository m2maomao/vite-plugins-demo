/**
 * Deer Mobile — Global Loading Plugin
 *
 * 全局路由切换加载动画 RuntimePlugin。
 * 在路由切换时自动显示/隐藏顶部加载进度条（类 NProgress）。
 *
 * 配置方式：
 *   deer({
 *     config: {
 *       loading: {
 *         enabled: true,
 *         color: '#1890ff',
 *         height: '3px',
 *         mode: 'top',    // 'top' | 'fullscreen'
 *       },
 *     },
 *   })
 *
 * 默认启用，零配置开箱即用。
 * 可通过 appConfig.loading.enabled = false 关闭。
 */

import { ref, defineComponent, h, type App, type VNode } from 'vue';
import type { Router } from 'vue-router';
import type { RuntimePlugin, RuntimeContext } from '../../src/runtime/types';
import type { AppConfig } from '../../src/build/types';

// ============================================
// Loading State
// ============================================

const isLoading = ref(false);
let requestCount = 0;
const MIN_DISPLAY_TIME = 200;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

function showLoading(): void {
  requestCount++;
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
  isLoading.value = true;
}

function hideLoading(): void {
  if (requestCount > 0) requestCount--;
  if (requestCount <= 0 && !hideTimer) {
    hideTimer = setTimeout(() => {
      isLoading.value = false;
      hideTimer = null;
    }, MIN_DISPLAY_TIME);
  }
}

function resetLoading(): void {
  requestCount = 0;
  isLoading.value = false;
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

// ============================================
// CSS 样式注入
// ============================================

const STYLE_ID = 'deer-loading-style';

function injectStyle(config: AppConfig['loading']): void {
  if (document.getElementById(STYLE_ID)) return;

  const color = config?.color || 'var(--yh-primary-color, #1890ff)';
  const height = config?.height || '3px';

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
.deer-loading-bar{
  position:fixed;top:0;left:0;width:100%;height:${height};z-index:99999;pointer-events:none;
  transition:opacity .15s ease;
}
.deer-loading-bar-inner{
  height:100%;background:${color};border-radius:0 2px 2px 0;
  box-shadow:0 0 6px ${color}66;
  animation:deer-loading-progress 1.5s ease-in-out forwards;
}
.deer-loading-bar.exit{opacity:0;transition:opacity .2s ease;}
.deer-loading-bar.exit .deer-loading-bar-inner{width:100%!important;transition:width .2s ease;}
@keyframes deer-loading-progress{
  0%{width:0%}30%{width:30%}60%{width:60%}80%{width:80%}100%{width:95%}
}
.deer-loading-fullscreen{
  position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
  background:rgba(255,255,255,.85);z-index:99999;
}
.deer-loading-spinner{
  width:36px;height:36px;border:3px solid #e8e8e8;border-top-color:${color};
  border-radius:50%;animation:deer-loading-spin .8s linear infinite;
}
@keyframes deer-loading-spin{to{transform:rotate(360deg)}}
`.trim();

  document.head.appendChild(style);
}

// ============================================
// 加载组件
// ============================================

function useLoadingConfig(ctx: RuntimeContext): {
  enabled: boolean;
  mode: 'top' | 'fullscreen';
  color: string;
  height: string;
} {
  const cfg = ctx.config.loading || {};
  return {
    enabled: cfg.enabled !== false,
    mode: cfg.mode || 'top',
    color: cfg.color || 'var(--yh-primary-color, #1890ff)',
    height: cfg.height || '3px',
  };
}

/**
 * 创建全局加载动画 RuntimePlugin。
 *
 * 自动注册为内置插件（由 code-gen.ts 注入），用户无需手动注册。
 * 支持通过 appConfig.loading 自定义样式和行为。
 */
export default function createLoadingPlugin(): RuntimePlugin {
  return {
    name: 'deer:loading',
    priority: 5,

    onAppCreated(_app: App, ctx: RuntimeContext) {
      const cfg = useLoadingConfig(ctx);
      if (!cfg.enabled) return;

      // 注入 CSS
      if (typeof document !== 'undefined') {
        injectStyle(ctx.config.loading);
      }
    },

    onRouterCreated(router: Router, ctx: RuntimeContext) {
      const cfg = useLoadingConfig(ctx);
      if (!cfg.enabled) return;

      router.beforeEach((_to, _from, next) => {
        showLoading();
        next();
      });

      router.afterEach(() => {
        hideLoading();
      });

      router.onError(() => {
        resetLoading();
      });
    },

    outerProvider(container: () => VNode): VNode {
      const LoadingComponent = defineComponent({
        setup() {
          return () => {
            if (!isLoading.value) return null;

            // 默认为顶部进度条模式
            return h(
              'div',
              {
                class: ['deer-loading-bar'],
                key: 'deer-loading',
              },
              h('div', { class: 'deer-loading-bar-inner' }),
            );
          };
        },
      });

      return h('div', { style: { position: 'relative', minHeight: '100vh' } }, [h(LoadingComponent), container()]);
    },
  };
}
