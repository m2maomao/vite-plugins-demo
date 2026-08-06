/**
 * Deer Mobile — IM Feature Composables
 * useIM：页面/组件中获取 IM 单例、就绪状态、未读数与常用操作
 */

import { im, imReady, unreadCount, initIM, destroyIM, reconnectIM } from './state';
import type { SendChatInfo } from './types';

/** 使用 IM（全局单例） */
export function useIM() {
  return {
    /** IM 实例（IMCtx | null，需就绪后使用） */
    im,
    /** 是否就绪（WS 已连接） */
    imReady,
    /** 全局未读消息数 */
    unreadCount,
    /** 初始化 IM */
    initIM,
    /** 销毁 IM */
    destroyIM,
    /** 重连 WebSocket */
    reconnect: reconnectIM,
    /** 获取 IM 上下文（composable 之外使用） */
    getIM: () => im.value,
    /** 发送文本消息 */
    sendText(content: string, chat?: SendChatInfo) {
      const ctx = im.value;
      if (!ctx) return Promise.reject(new Error('IM 未初始化'));
      const msg = ctx.createTextMessage({ content });
      return ctx.sendMessage(msg, chat);
    },
  };
}
