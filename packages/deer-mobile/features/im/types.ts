/**
 * Deer Mobile — IM Feature Types
 * 基于自研 @im/sdk 的 deer-mobile IM 模块类型定义
 */

/** deer-mobile IM 初始化配置（对齐 @im/sdk 的 IMConfig，支持动态获取） */
export interface DeerIMConfig {
  /** 用户 ID（如身份证号） */
  userId: string;
  /** 用户名称 */
  userName: string;
  /** 系统编码 */
  systemId: string;
  /** 系统名称 */
  systemName?: string;
  /** 用户类别 */
  userType?: string;
  /** 接口请求地址（可函数动态获取，如读取 projectConfig.ip） */
  baseUrl: string | (() => string);
  /** WebSocket 地址（可函数动态获取；默认由 baseUrl http→ws / https→wss 转换） */
  socketUrl?: string | (() => string);
  /** 文件服务器地址（可函数动态获取；默认等于 baseUrl） */
  fileUrl?: string | (() => string);
  /** 网关 token（可函数动态获取） */
  token?: string | (() => string | undefined);
  /** ws 重连最大次数 */
  reconnectTotal?: number;
  /** ws 重连间隔（ms） */
  reconnectTime?: number;
}

/** createIMPlugin 插件配置 */
export interface DeerIMPluginOptions {
  /** IM 静态配置（userId/userName 由 getUser 或运行时提供） */
  config?: Omit<DeerIMConfig, 'userId' | 'userName'>;
  /** 获取用户信息（userId/userName），登录后自动初始化时使用；默认从 userStore.user 读取 */
  getUser?: () => { userId?: string; userName?: string } | null | undefined;
  /** 登录后自动初始化（默认 true） */
  autoInit?: boolean;
  /** 被强制下线回调（默认空，业务自行处理） */
  onKickedOut?: (data: any) => void;
  /** 异地登录处理：返回 'login' 继续登录，'cancel' 取消（默认 'login'） */
  onLoginConflict?: () => 'login' | 'cancel';
}

/** 发送消息所需的会话对象信息 */
export interface SendChatInfo {
  chatId: string;
  chatType: number;
  targetUserId: string;
  targetUserName: string;
}

/** 消息对象（@im/sdk 消息结构，按需取字段） */
export interface IMComMessage {
  msgId?: string;
  requestId?: string;
  contentType?: number;
  content?: string;
  sendUserId?: string;
  sendUserName?: string;
  targetUserId?: string;
  targetUserName?: string;
  createTime?: string;
  /** 本地消息状态：error / loading */
  errorOrLoading?: 'error' | 'loading';
  fileName?: string;
  filePath?: string;
  fileSize?: number;
  thumbnailPath?: string;
  [key: string]: any;
}

/** 会话列表项 */
export interface IMComChat {
  chatId?: string;
  groupId?: string;
  chatType?: number;
  targetUserId?: string;
  targetUserName?: string;
  groupName?: string;
  lastMessage?: string;
  lastMessageContent?: string;
  lastMessageTime?: string;
  unreadNum?: number;
  memberList?: any[];
  [key: string]: any;
}
