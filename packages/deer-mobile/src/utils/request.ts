/**
 * HttpClient — 企业级 HTTP 请求封装
 *
 * 功能特性：
 * - 请求拦截器：自动注入 Token、Loading 队列控制、动态 BaseURL
 * - 响应拦截器：统一解包、状态码映射、自动错误提示、Token 续约
 * - 可配置的成功状态码、超时时间、Token Key 等
 */

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { appConfig } from 'virtual:app-config';
import { getStatusMsg } from './status';

// ============================================
// 类型定义
// ============================================

export interface HttpClientOptions {
  /** 基础请求地址 */
  baseURL?: string;
  /** 超时时间（毫秒），默认 10000 */
  timeout?: number;
  /** localStorage Token Key，默认 'token' */
  tokenKey?: string;
  /** 请求头 Token 前缀，默认 'Bearer ' */
  tokenPrefix?: string;
  /** 成功状态码正则，默认 /^[1]/ （以 1 开头的状态码） */
  successCodePattern?: RegExp;
  /** 登录超时状态码列表，默认 [712, 205, 209]（触发跳转登录页） */
  loginTimeoutCodes?: number[];
  /** 是否启用 Loading 队列控制，默认 true */
  enableLoadingQueue?: boolean;
  /** 请求间隔防抖时间（毫秒），默认 500 */
  loadingDebounce?: number;
  /** 自定义错误提示函数 */
  onError?: (message: string, status?: number) => void;
  /** 登录超时回调 */
  onLoginTimeout?: (status: number) => void;
  /** Token 续约回调（响应头带回新 token 时触发） */
  onTokenRefresh?: (newToken: string) => void;
  /** Token 续约响应头字段名，默认 'x-yh-gateway-token' */
  tokenRefreshHeader?: string;
  /** 自定义获取 Token 的函数，默认从 localStorage 读取 */
  getToken?: () => string | null;
  /** 自定义设置 Token 的函数，默认写入 localStorage */
  setToken?: (token: string) => void;
  /** 是否启用 SM4 请求/响应加解密，默认 false */
  enableSM4?: boolean;
  /** SM4 密钥，启用加解密时必须提供 */
  sm4Key?: string;
}

// ============================================
// 默认状态码映射
// ============================================

const DEFAULT_SUCCESS_CODE_PATTERN = /^[1]/;
const DEFAULT_LOGIN_TIMEOUT_CODES = [712, 205, 209];
const DEFAULT_TOKEN_KEY = 'token';
const DEFAULT_LOADING_DEBOUNCE = 500;

// 自定义 Axios 配置扩展
interface CustomAxiosConfig extends InternalAxiosRequestConfig {
  hasToken?: boolean;
  loading?: boolean;
  silent?: boolean;
}

// ============================================
// HttpClient 类
// ============================================

class HttpClient {
  private instance: AxiosInstance;
  private options: Required<HttpClientOptions>;

  // Loading 队列状态
  private loadingCount = 0;
  private prevRequestTime = 0;

  constructor(options: HttpClientOptions = {}) {
    this.options = {
      baseURL: options.baseURL ?? appConfig.request.baseURL ?? '/api',
      timeout: options.timeout ?? 10000,
      tokenKey: options.tokenKey ?? DEFAULT_TOKEN_KEY,
      tokenPrefix: options.tokenPrefix ?? 'Bearer ',
      successCodePattern: options.successCodePattern ?? DEFAULT_SUCCESS_CODE_PATTERN,
      loginTimeoutCodes: options.loginTimeoutCodes ?? DEFAULT_LOGIN_TIMEOUT_CODES,
      enableLoadingQueue: options.enableLoadingQueue ?? true,
      loadingDebounce: options.loadingDebounce ?? DEFAULT_LOADING_DEBOUNCE,
      onError: options.onError ?? this.defaultErrorHandler.bind(this),
      onLoginTimeout: options.onLoginTimeout ?? this.defaultLoginTimeoutHandler.bind(this),
      onTokenRefresh: options.onTokenRefresh ?? this.defaultTokenRefreshHandler.bind(this),
      tokenRefreshHeader: options.tokenRefreshHeader ?? 'x-yh-gateway-token',
      getToken: options.getToken ?? (() => localStorage.getItem(this.options?.tokenKey ?? DEFAULT_TOKEN_KEY)),
      setToken:
        options.setToken ??
        ((token: string) => localStorage.setItem(this.options?.tokenKey ?? DEFAULT_TOKEN_KEY, token)),
      enableSM4: options.enableSM4 ?? false,
      sm4Key: options.sm4Key ?? '',
    };

    this.instance = axios.create({
      baseURL: this.options.baseURL,
      timeout: this.options.timeout,
      headers: { 'Content-Type': 'application/json' },
    });

    this.setupInterceptors();
  }

  // ============================================
  // 拦截器配置
  // ============================================

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config: CustomAxiosConfig) => {
        // 1. 动态 BaseURL（支持从外部存储读取）
        const customBaseURL = this.getCustomBaseURL();
        if (customBaseURL) {
          config.baseURL = customBaseURL;
        }

        // 2. Token 注入
        const token = this.options.getToken();
        if (token) {
          config.headers.Authorization = `${this.options.tokenPrefix}${token}`;
          config.hasToken = true;
        } else {
          config.hasToken = false;
        }

        // 3. Loading 队列控制
        if (this.options.enableLoadingQueue) {
          const now = Date.now();
          if (!this.prevRequestTime || now - this.prevRequestTime > this.options.loadingDebounce) {
            this.loadingCount = 0;
            this.hideLoading();
          }
          this.prevRequestTime = now;
          this.loadingCount += 1;
          config.loading = true;
          this.showLoading();
        }

        // 4. SM4 加密请求体（异步懒加载）
        // 注意：启用 SM4 时请确保已安装 @business/plugin-sm4
        if (config.data && this.sm4EncryptAsync) {
          // 异步执行，不影响请求流程
          this.sm4EncryptAsync(config.data).then((encrypted) => {
            config.data = encrypted;
          });
        }

        return config;
      },
      (error) => {
        this.hideLoading();
        return Promise.reject(error);
      },
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        this.handleLoadingComplete(response);

        // 1. Token 续约：响应头带回新 token 时替换本地 token
        const newToken = response.headers[this.options.tokenRefreshHeader];
        if (newToken) {
          this.options.onTokenRefresh!(newToken);
        }

        // 2. 检查业务状态码
        const status = response.data?.status ?? response.data?.code;
        if (status !== undefined) {
          if (this.options.successCodePattern.test(String(status))) {
            return response.data;
          }

          // 登录超时处理
          if (this.options.loginTimeoutCodes.includes(Number(status))) {
            this.options.onLoginTimeout!(Number(status));
            return Promise.reject(response);
          }

          // 其他错误状态码
          const message = response.data?.msg || response.data?.message || '请求失败';
          this.options.onError!(message, Number(status));
          return Promise.reject(response);
        }

        // 3. 没有业务状态码，直接返回 data
        return response.data;
      },
      (error) => {
        this.hideLoading();

        // HTTP 错误处理
        if (error.response) {
          const { status, data } = error.response;
          const message = data?.msg || data?.message || this.getHttpErrorMessage(status);

          // 登录超时（基于 HTTP 状态码 + 业务码）
          if (this.options.loginTimeoutCodes.includes(status)) {
            this.options.onLoginTimeout!(status);
          } else {
            this.options.onError!(message, status);
          }
        } else if (error.errMsg === 'request:fail' || error.code === 'ERR_NETWORK') {
          this.options.onError!('网络连接失败，请检查网络');
        } else if (error.code === 'ECONNABORTED') {
          this.options.onError!('请求超时，请稍后重试');
        }

        return Promise.reject(error);
      },
    );
  }

  // ============================================
  // Loading 管理
  // ============================================

  private showLoading() {
    // 由使用者覆盖（默认不做任何 UI 操作）
  }

  private hideLoading() {
    // 由使用者覆盖
  }

  private handleLoadingComplete(response: AxiosResponse) {
    if (!this.options.enableLoadingQueue) return;

    this.loadingCount -= 1;
    if ((response.config as CustomAxiosConfig)?.loading && this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.hideLoading();
    }
  }

  // ============================================
  // 默认处理器
  // ============================================

  private defaultErrorHandler(message: string, _status?: number) {
    console.error(`[HttpClient] ${message}`);
  }

  private defaultLoginTimeoutHandler(_status: number) {
    this.options.setToken('');
    console.warn('[HttpClient] 登录超时，请重新登录');
  }

  private defaultTokenRefreshHandler(newToken: string) {
    this.options.setToken(newToken);
  }

  private getCustomBaseURL(): string | null {
    try {
      const stored = localStorage.getItem('baseURL');
      return stored || null;
    } catch {
      return null;
    }
  }

  private getHttpErrorMessage(status: number): string {
    return getStatusMsg(status);
  }

  // ============================================
  // SM4 加解密
  // ============================================

  private async sm4EncryptAsync(data: unknown): Promise<unknown> {
    if (!this.options.enableSM4 || !this.options.sm4Key || !data) return data;
    try {
      const { default: SM4Util } = await import('@business/plugin-sm4');
      const sm4 = new SM4Util();
      sm4.secretKey = this.options.sm4Key;
      const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);
      return { data: sm4.encryptData_ECB(jsonStr) };
    } catch {
      return data;
    }
  }

  private async sm4DecryptAsync(data: unknown): Promise<unknown> {
    if (!this.options.enableSM4 || !this.options.sm4Key || !data) return data;
    try {
      const { default: SM4Util } = await import('@business/plugin-sm4');
      const sm4 = new SM4Util();
      sm4.secretKey = this.options.sm4Key;
      const encrypted = (data as Record<string, unknown>)?.data as string;
      if (!encrypted) return data;
      const decrypted = sm4.decryptData_ECB(encrypted);
      return JSON.parse(decrypted);
    } catch {
      return data;
    }
  }

  // ============================================
  // 公开方法
  // ============================================

  /** 获取原始 Axios 实例，用于底层扩展 */
  getInstance(): AxiosInstance {
    return this.instance;
  }

  /** 更新配置（运行时可用） */
  setOptions(options: Partial<HttpClientOptions>) {
    Object.assign(this.options, options);
  }

  // ---- HTTP 方法 ----

  get<T>(url: string, params?: Record<string, unknown>, config?: AxiosRequestConfig) {
    return this.instance.get<T>(url, { params, ...config });
  }

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.instance.post<T>(url, data, config);
  }

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.instance.put<T>(url, data, config);
  }

  delete<T>(url: string, params?: unknown, config?: AxiosRequestConfig) {
    return this.instance.delete<T>(url, { params, ...config });
  }

  /** 表单提交（Content-Type: application/x-www-form-urlencoded） */
  formData<T>(url: string, data?: Record<string, unknown>) {
    return this.instance.post<T>(url, data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }
}

// ============================================
// 导出
// ============================================

/** 默认实例（使用 appConfig 配置） */
export const http = new HttpClient();

export default HttpClient;
