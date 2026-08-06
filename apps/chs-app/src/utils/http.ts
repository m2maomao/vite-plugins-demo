/**
 * CHS HTTP 客户端（基于 deer-mobile HttpClient）
 * 对齐后端网关协议：
 * - Authorization 不带 Bearer 前缀（后端为 YH 网关，token 直接放 header）
 * - token 从 CHS 的 TOKEN_KEY（chs-auth-token）读取
 * - 成功状态码 /^[1]/，登录超时 712/205/209（deer-mobile 默认已配置）
 */
import { HttpClient } from 'deer-mobile/utils';
import { TOKEN_KEY } from './enumerate';

export const http = new HttpClient({
  baseURL: '/api',
  tokenPrefix: '',
  tokenKey: TOKEN_KEY,
  timeout: 60000,
});

export default http;
