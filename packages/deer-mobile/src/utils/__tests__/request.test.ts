// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';

// Mock 虚拟模块（workspace 模式下 resolve.alias 可能不生效）
vi.mock('virtual:app-config', () => ({
  appConfig: {
    request: { baseURL: '/api' },
    sm4Key: '',
  },
}));

import { HttpClient } from '../request';

// ============================================
// HttpClient 单元测试
// ============================================

describe('HttpClient', () => {
  let client: HttpClient;
  let mock: MockAdapter;

  beforeEach(() => {
    client = new HttpClient({ baseURL: 'http://test' });
    mock = new MockAdapter(client.getInstance());
  });

  afterEach(() => {
    mock.reset();
  });

  // ==========================================
  // 构造函数
  // ==========================================
  describe('constructor', () => {
    it('应使用默认配置创建实例', () => {
      const defaultClient = new HttpClient();
      expect(defaultClient).toBeInstanceOf(HttpClient);
    });

    it('应使用自定义配置覆盖默认值', () => {
      const customClient = new HttpClient({
        baseURL: 'http://custom',
        timeout: 5000,
        tokenKey: 'custom-token',
      });
      expect(customClient).toBeInstanceOf(HttpClient);
    });
  });

  // ==========================================
  // HTTP 方法
  // ==========================================
  describe('HTTP 请求方法', () => {
    it('get() 应发起 GET 请求', async () => {
      mock.onGet('/users').reply(200, { status: 100, data: [{ id: 1 }] });

      const result = await client.get('/users');
      expect(result).toEqual({ status: 100, data: [{ id: 1 }] });
    });

    it('post() 应发起 POST 请求', async () => {
      mock.onPost('/users', { name: 'Alice' }).reply(200, { status: 100, data: { id: 1 } });

      const result = await client.post('/users', { name: 'Alice' });
      expect(result).toEqual({ status: 100, data: { id: 1 } });
    });

    it('put() 应发起 PUT 请求', async () => {
      mock.onPut('/users/1', { name: 'Bob' }).reply(200, { status: 100, data: { id: 1 } });

      const result = await client.put('/users/1', { name: 'Bob' });
      expect(result).toEqual({ status: 100, data: { id: 1 } });
    });

    it('delete() 应发起 DELETE 请求', async () => {
      mock.onDelete('/users/1').reply(200, { status: 100, data: null });

      const result = await client.delete('/users/1');
      expect(result).toEqual({ status: 100, data: null });
    });
  });

  // ==========================================
  // formData
  // ==========================================
  describe('formData()', () => {
    it('应发起 multipart/form-data 请求', async () => {
      mock.onPost('/upload').reply(200, { status: 100, data: { url: 'http://example.com/file' } });

      const result = await client.formData('/upload', { file: 'test' });
      expect(result).toEqual({ status: 100, data: { url: 'http://example.com/file' } });
    });

    it('未传 data 时仍应正常请求', async () => {
      mock.onPost('/upload').reply(200, { status: 100, data: null });

      const result = await client.formData('/upload');
      expect(result).toEqual({ status: 100, data: null });
    });
  });

  // ==========================================
  // 响应拦截 — 业务状态码处理
  // ==========================================
  describe('响应拦截 - 业务状态码', () => {
    it('1xx 状态码应返回 response.data', async () => {
      mock.onGet('/ok').reply(200, { status: 100, data: 'success' });

      const result = await client.get('/ok');
      expect(result).toEqual({ status: 100, data: 'success' });
    });

    it('非 1xx 状态码且非登录超时应触发 onError', async () => {
      const onError = vi.fn();
      const errorClient = new HttpClient({
        baseURL: 'http://test',
        onError,
      });
      const errorMock = new MockAdapter(errorClient.getInstance());

      errorMock.onGet('/fail').reply(200, { status: 201, msg: '业务告警' });

      await expect(errorClient.get('/fail')).rejects.toBeDefined();
      expect(onError).toHaveBeenCalledWith('业务告警', 201);
    });

    it('登录超时状态码应触发 onLoginTimeout', async () => {
      const onLoginTimeout = vi.fn();
      const loginClient = new HttpClient({
        baseURL: 'http://test',
        onLoginTimeout,
      });
      const loginMock = new MockAdapter(loginClient.getInstance());

      loginMock.onGet('/timeout').reply(200, { status: 712, msg: '登录超时' });

      await expect(loginClient.get('/timeout')).rejects.toBeDefined();
      expect(onLoginTimeout).toHaveBeenCalledWith(712);
    });
  });

  // ==========================================
  // 响应拦截 — HTTP 错误
  // ==========================================
  describe('响应拦截 - HTTP 错误', () => {
    it('HTTP 401 应触发 onLoginTimeout', async () => {
      const onLoginTimeout = vi.fn();
      const authClient = new HttpClient({
        baseURL: 'http://test',
        onLoginTimeout,
        loginTimeoutCodes: [401],
      });
      const authMock = new MockAdapter(authClient.getInstance());

      authMock.onGet('/unauthorized').reply(401, { msg: '未授权' });

      await expect(authClient.get('/unauthorized')).rejects.toBeDefined();
      expect(onLoginTimeout).toHaveBeenCalledWith(401);
    });

    it('HTTP 500 应触发 onError', async () => {
      const onError = vi.fn();
      const errClient = new HttpClient({
        baseURL: 'http://test',
        onError,
      });
      const errMock = new MockAdapter(errClient.getInstance());

      errMock.onGet('/server-error').reply(500);

      await expect(errClient.get('/server-error')).rejects.toBeDefined();
      expect(onError).toHaveBeenCalled();
    });
  });

  // ==========================================
  // Token 续约
  // ==========================================
  describe('Token 续约', () => {
    it('响应头带 token 时应触发 onTokenRefresh', async () => {
      const onTokenRefresh = vi.fn();
      const tokenClient = new HttpClient({
        baseURL: 'http://test',
        onTokenRefresh,
        tokenRefreshHeader: 'x-new-token',
      });
      const tokenMock = new MockAdapter(tokenClient.getInstance());

      tokenMock.onGet('/refresh').reply(200, { status: 100 }, { 'x-new-token': 'new-token-value' });

      await tokenClient.get('/refresh');
      expect(onTokenRefresh).toHaveBeenCalledWith('new-token-value');
    });
  });

  // ==========================================
  // 网络错误
  // ==========================================
  describe('网络错误处理', () => {
    it('网络连接失败应触发 onError', async () => {
      const onError = vi.fn();
      const netClient = new HttpClient({
        baseURL: 'http://test',
        onError,
      });
      const netMock = new MockAdapter(netClient.getInstance());

      // axios-mock-adapter 的 networkError() 不产生 AxiosError 的 ERR_NETWORK code
      // 这里用 reply 函数手动模拟 AxiosError 网络错误
      netMock.onGet('/network-error').reply(async () => {
        const error = new Error('Network Error') as any;
        error.code = 'ERR_NETWORK';
        error.isAxiosError = true;
        error.config = { url: '/network-error' };
        throw error;
      });

      await expect(netClient.get('/network-error')).rejects.toBeDefined();
      expect(onError).toHaveBeenCalledWith('网络连接失败，请检查网络');
    });

    it('请求超时应触发 onError', async () => {
      const onError = vi.fn();
      const timeoutClient = new HttpClient({
        baseURL: 'http://test',
        onError,
        timeout: 100,
      });
      const timeoutMock = new MockAdapter(timeoutClient.getInstance());

      timeoutMock.onGet('/timeout').timeout();

      await expect(timeoutClient.get('/timeout')).rejects.toBeDefined();
      expect(onError).toHaveBeenCalledWith('请求超时，请稍后重试');
    });
  });
});
