/**
 * 状态码定义与工具函数
 *
 * 设计原则（与业务 PC 端一致）：
 * - 1xx: 业务成功
 * - 2xx: 业务告警/提示
 * - 712/205/209: 登录超时，需重新登录
 * - 110/112: Token 失效，需重新获取
 */

// ============================================
// HTTP 状态码中文映射
// ============================================

export const HTTP_STATUS: Record<number, string> = {
  400: '请求参数错误',
  401: '未授权，请重新登录',
  403: '拒绝访问',
  404: '请求地址不存在',
  405: '请求方法不允许',
  406: '请求的内容格式不被接受',
  407: '需要代理身份验证',
  408: '请求超时',
  409: '请求与服务器状态冲突',
  410: '请求资源已永久删除',
  414: '请求 URL 超长',
  415: '不支持的媒体格式',
  429: '请求过于频繁，请稍后重试',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务暂不可用',
  504: '网关超时',
};

// ============================================
// 业务状态码
// ============================================

/** 授权异常状态码（需重新登录） */
export const AUTH_ERROR_STATUS: Record<number, string> = {
  110: '授权异常',
  112: '授权异常',
  205: '身份验证失败，请重新登录',
  209: '身份验证失败，请重新登录',
  712: '身份验证失败，请重新登录',
};

/** 兜底错误提示 */
export const DEFAULT_ERROR_MSG = '系统服务异常，请联系维护人员';

// ============================================
// 状态码分类规则
// ============================================

export const STATUS_PATTERN = {
  /** 1xx: 业务成功 */
  SUCCESS: /^1/,
  /** 2xx: 业务告警/提示 */
  WARNING: /^2/,
} as const;

// ============================================
// 工具函数
// ============================================

/** 根据状态码获取中文提示 */
export function getStatusMsg(code: number | string): string {
  return HTTP_STATUS[code as number] || AUTH_ERROR_STATUS[code as number] || DEFAULT_ERROR_MSG;
}

/** 是否为业务成功状态（1xx） */
export function isSuccessStatus(code: number | string): boolean {
  return STATUS_PATTERN.SUCCESS.test(String(code));
}

/** 是否为业务告警状态（2xx） */
export function isWarningStatus(code: number | string): boolean {
  return STATUS_PATTERN.WARNING.test(String(code));
}

/** 是否为授权异常（需重新登录） */
export function isAuthError(code: number | string): boolean {
  return code in AUTH_ERROR_STATUS;
}

/** 是否为 Token 失效 */
export function isTokenExpired(code: number | string): boolean {
  return code === 110 || code === 112;
}
