/**
 * Deer Mobile — IM Feature State
 * IM 全局单例状态管理：模块级响应式状态 + 初始化/销毁/重连
 */

import { ref, shallowRef } from 'vue';
import { IM, defineConfig, type IMCtx } from '@im/sdk';
import webRequest from '@im/plugin-web-request';
import webSocket from '@im/plugin-web-socket';
import type { DeerIMConfig } from './types';

/** IM 全局事件处理器（由 createIMPlugin 注册，业务可覆盖） */
interface IMHandlers {
  onKickedOut?: (data: any) => void;
  onLoginConflict?: () => 'login' | 'cancel';
}

/** IM 实例（全局单例） */
export const im = shallowRef<IMCtx | null>(null);
/** IM 是否就绪（WS 已连接） */
export const imReady = ref(false);
/** 全局未读消息数 */
export const unreadCount = ref(0);

const handlers: IMHandlers = {};
let initOptions: DeerIMConfig | null = null;

/** 注册 IM 全局事件处理器 */
export function setIMHandlers(h: IMHandlers) {
  Object.assign(handlers, h);
}

const resolveStr = (v?: string | (() => string)) => (typeof v === 'function' ? (v as () => string)() : v);

const resolveToken = (v?: string | (() => string | undefined)) =>
  typeof v === 'function' ? (v as () => string | undefined)() : v;

/**
 * 启动流程：登录校验 → userLogin → 建立 WebSocket
 * @im/sdk 的 checkIsLogin 返回 { isLogin, next, close }
 */
async function boot(ctx: IMCtx) {
  const { isLogin, next, close } = (await ctx.checkIsLogin()) as {
    isLogin: boolean;
    next: () => void;
    close: () => void;
  };
  if (isLogin) {
    // 该账号已在其他地方登录（异地登录）
    const action = handlers.onLoginConflict ? handlers.onLoginConflict() : 'login';
    if (action === 'login') next();
    else close();
  } else {
    next();
  }
}

/**
 * 初始化 IM（全局单例；重复调用返回已存在实例）
 * @param config 完整 IM 配置（含 userId/userName）
 */
export async function initIM(config: DeerIMConfig): Promise<IMCtx> {
  if (im.value) return im.value;
  initOptions = config;

  const baseUrl = resolveStr(config.baseUrl) || '';
  const socketUrl = resolveStr(config.socketUrl) || baseUrl.replace('https', 'wss').replace('http', 'ws');
  const fileUrl = resolveStr(config.fileUrl) || baseUrl;
  const token = resolveToken(config.token);

  const imConfig = defineConfig({
    userId: config.userId,
    userName: config.userName,
    systemId: config.systemId,
    systemName: config.systemName || '',
    userType: config.userType || '',
    baseUrl,
    socketUrl,
    fileUrl,
    terminal: IM.TERMINAL.WEB,
    env: IM.ENV.WEB,
    plugins: [
      webRequest(undefined),
      webSocket({
        reconnectTotal: config.reconnectTotal ?? 5,
        reconnectTime: config.reconnectTime ?? 5000,
      }),
    ],
    // deer-mobile 包 tsconfig 未引入 vite/client，用安全方式读取开发环境标记
    log: (import.meta as any).env?.DEV === true,
    ...(token ? { token } : {}),
  });

  const ctx = new IM(imConfig);
  im.value = ctx;

  // 全局事件
  ctx.on(ctx.$event.READY, () => {
    imReady.value = true;
  });
  ctx.on(ctx.$event.DESTROY, () => {
    im.value = null;
    imReady.value = false;
    unreadCount.value = 0;
  });
  ctx.on(ctx.$event.UNREAD_COUNT_CHANGE, (value) => {
    unreadCount.value = Number(value) || 0;
  });
  ctx.on(ctx.$event.KICKED_OUT, (data) => {
    handlers.onKickedOut?.(data);
  });

  await boot(ctx);
  return ctx;
}

/** 销毁 IM（登出时调用） */
export function destroyIM() {
  const ctx = im.value;
  if (ctx) {
    try {
      ctx.destroy();
    } catch {
      // ignore
    }
  }
  im.value = null;
  imReady.value = false;
  unreadCount.value = 0;
  initOptions = null;
}

/** 重连 WebSocket */
export function reconnectIM() {
  return im.value?.reconnectSocket();
}

/** 获取最近一次初始化配置 */
export function getIMOptions() {
  return initOptions;
}
