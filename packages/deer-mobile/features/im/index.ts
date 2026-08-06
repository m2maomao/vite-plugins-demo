/**
 * Deer Mobile — IM Feature 统一出口
 * 通过子路径 `deer-mobile/im` 或主入口 `deer-mobile` 导入
 */

export { default as createIMPlugin } from './plugin';
export { useIM } from './composables';
export { initIM, destroyIM, reconnectIM, setIMHandlers } from './state';
export { default as ImChat } from './components/ImChat';
export { default as ImChatList } from './components/ImChatList';
export { default as MessageBubble } from './components/MessageBubble';

export type { DeerIMConfig, DeerIMPluginOptions, SendChatInfo, IMComMessage, IMComChat } from './types';
